"use client";

import { useState, ChangeEvent } from "react";

interface LogoUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function LogoUpload({ value = "", onChange }: LogoUploadProps) {
  const [preview, setPreview] = useState(value);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Logo
      </label>
      <div className="w-32 h-32 mb-2">
        {preview ? (
          <img
            src={preview}
            alt="Logo Preview"
            className="w-full h-full object-cover rounded-full border"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full border">
            <span className="text-gray-500">Sem Logo</span>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
