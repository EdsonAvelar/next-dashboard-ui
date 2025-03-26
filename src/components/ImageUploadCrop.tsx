// ImageUploadCrop.tsx
"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";
import getCroppedImg from "../helpers/cropImageHelper";
import { toast } from "react-toastify";

type ImageUploadCropProps = {
  aspect: number; // Ratio permitido para o crop (ex: 1 para quadrado, 16/9 para widescreen)
  id: number; // ID do registro a ser atualizado (ex: "3")
  database: string; // Nome da entidade (ex: "user")
  field: string; // Campo que será atualizado (ex: "avatar")
  defaultImage?: string; // Imagem padrão a ser exibida (ex: "/noAvatar.png")
  filename?: string; // nome do arquivo final
  folder?: string; //pasta onde será salvo o arquivo final
  onCropComplete?: (croppedImageUrl: string) => void; // Callback com a imagem final cortada
};

const ImageUploadCrop: React.FC<ImageUploadCropProps> = ({
  aspect,
  id,
  database,
  field,
  defaultImage,
  filename,
  folder,
  onCropComplete,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(
    defaultImage || null
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  // Lê a imagem selecionada e converte para dataURL
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      };
    }
  };

  const onCropCompleteHandler = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // Processa o crop e define a imagem final
  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImg);
      setShowCropper(false);

      // Chama a Server Action usando fetch (POST para /api/saveCroppedImage)
      const response = await fetch("/api/saveCroppedImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          croppedImage: croppedImg,
          id, // Ex: "3"
          database, // Ex: "user"
          field, // Ex: "avatar"
          filename,
          folder,
        }),
      });

      if (response.ok) {
        const { fileUrl } = await response.json();
        if (onCropComplete) {
          onCropComplete(fileUrl);
        }
        toast.success("Imagem atualizada com sucesso");
      } else {
        toast.error(response.statusText || "Falha ao salvar a imagem");
        console.error("Erro ao salvar a imagem:", response);
      }
    } catch (e) {
      console.error(e);
      toast.error(e + " Falha ao salvar a imagem");
    }
  }, [imageSrc, croppedAreaPixels, id, database, field, onCropComplete]);

  return (
    <div>
      {/* Botão de upload: label exibindo a imagem padrão, a imagem cortada ou o "Upload Image" */}
      <label
        htmlFor="upload-input"
        className="cursor-pointer"
      >
        {croppedImage ? (
          <img
            src={croppedImage}
            alt="Cropped"
            // className="w-32 h-32 object-cover rounded-full border"
            className=""
          />
        ) : (
          // <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-full border">
          <div className="">
            <span className="text-sm text-gray-600">Upload Image</span>
          </div>
        )}
      </label>
      <input
        id="upload-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {/* Modal de crop */}
      {showCropper && imageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-11/12 md:w-1/2 bg-white p-4 rounded-md">
            <div className="relative h-[400px] bg-gray-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropCompleteHandler}
              />
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setShowCropper(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={showCroppedImage}
              >
                Confirmar Corte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadCrop;
