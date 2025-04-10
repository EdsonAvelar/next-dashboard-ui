import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

interface S3UploadParams {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
}

export async function uploadFileToS3(
  file: Buffer,
  filename: string
): Promise<void> {
  const fileBuffer = Buffer.from(await (file as Blob).arrayBuffer());
  //const fileBuffer: Buffer = file;

  const params: S3UploadParams = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
    // Key: `myfolder/${filename}-${Date.now()}`,
    Key: `myfolder/${filename}`,
    Body: fileBuffer,
    ContentType: "image/png",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  console.log("File uploaded successfully", command);
}

import { v2 as cloudinary } from "cloudinary";

// Configuração do Cloudinary (certifique-se de que as variáveis de ambiente estão definidas)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET_KEY!,
});

/**
 * Realiza o upload de um arquivo (do tipo Blob) para o Cloudinary e
 * retorna a URL segura do arquivo salvo.
 *
 * @param file - O arquivo a ser enviado (formato Blob)
 * @param folder - Pasta onde o arquivo será armazenado (padrão: "myfolder")
 * @returns A URL segura do arquivo enviado
 */
export async function uploadFileToCloudinary(
  file: Blob,
  folder: string = "myfolder"
): Promise<string> {
  // Converte o arquivo para Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });

  const secureUrl = (uploadResult as any).secure_url;
  return secureUrl;
}

export async function uploadNegocioFile(
  formData: FormData
): Promise<{ success: boolean; msg: string }> {
  try {
    const negocioId = Number(formData.get("negocioId"));
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, msg: "Nenhum arquivo enviado" };
    }
    // Obter o buffer do arquivo
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalName = file.name;
    const extension = originalName.split(".").pop() || "";
    const fileSize = file.size;
    // Gerar um nome único para o arquivo
    const filename = `${Date.now()}_${originalName}`;
    const folder = "uploads";
    const filePath = path.join(process.cwd(), "public", folder, filename);
    // Garantir que a pasta exista
    await fs.mkdir(path.join(process.cwd(), "public", folder), {
      recursive: true,
    });
    // Salvar o arquivo
    await fs.writeFile(filePath, buffer);
    // Cria o registro no banco de dados
    await prisma.upload.create({
      data: {
        fileName: originalName,
        filePath: `/${folder}/${filename}`,
        extension,
        fileSize,
        description,
        negocioId,
      },
    });
    return { success: true, msg: "Arquivo enviado com sucesso" };
  } catch (error: any) {
    console.error(error);
    return { success: false, msg: "Erro ao enviar arquivo: " + error.message };
  }
}
