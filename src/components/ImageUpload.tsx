// ImageUpload.tsx
"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

type ImageUploadProps = {
  userId: string | number;
  defaultImage?: string;
};

const ImageUpload: React.FC<ImageUploadProps> = ({ userId, defaultImage }) => {
  const [avatar, setImageUrl] = useState(defaultImage || "");

  const handleUploadSuccess = async (result: any) => {
    // Obtém a URL segura da imagem enviada
    const uploadedUrl = result.info.secure_url;
    try {
      // Chama a API para atualizar a imagem do usuário
      const response = await fetch("/api/user/update-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, avatar: uploadedUrl }),
      });
      if (response.ok) {
        setImageUrl(uploadedUrl);
      } else {
        console.error("Erro ao atualizar a imagem do usuário");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <CldUploadWidget
      uploadPreset="adriconcrm"
      onSuccess={handleUploadSuccess}
    >
      {({ open }) => (
        <div
          className="cursor-pointer"
          onClick={() => open?.()}
        >
          {/* <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20 flex items-center justify-center text-white text-sm">
            Clique para alterar
          </span> */}

          <img
            src={avatar || "/noAvatar.png"}
            alt="User Profile"
            className="w-36 h-36 object-cover rounded-full border "
          />
        </div>
      )}
    </CldUploadWidget>
  );
};

export default ImageUpload;
