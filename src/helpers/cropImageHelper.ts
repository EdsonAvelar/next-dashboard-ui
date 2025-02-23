// cropImageHelper.ts
/**
 * Função para criar uma imagem a partir de uma URL
 */
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Para evitar problemas de CORS
    image.src = url;
  });

/**
 * Converte graus em radianos.
 */
function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Retorna uma imagem cortada com base na área informada.
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível obter o contexto do canvas");
  }

  // Calcula uma área segura para evitar que a imagem seja cortada durante a rotação
  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // Define as dimensões do canvas para a safe area
  canvas.width = safeArea;
  canvas.height = safeArea;

  // Centraliza e rotaciona a imagem
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // Desenha a imagem rotacionada
  ctx.drawImage(
    image,
    (safeArea - image.width) / 2,
    (safeArea - image.height) / 2
  );

  // Obtém os dados da imagem
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // Redimensiona o canvas para o tamanho final do crop
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Coloca a imagem cortada no canvas
  ctx.putImageData(
    data,
    Math.round(0 - (safeArea / 2 - image.width / 2) - pixelCrop.x),
    Math.round(0 - (safeArea / 2 - image.height / 2) - pixelCrop.y)
  );

  // Retorna a imagem final como Data URL (pode ser convertida para blob se necessário)
  return canvas.toDataURL("image/jpeg");
}
