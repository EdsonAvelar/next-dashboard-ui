import { useState, useRef } from "react";

interface ImagePreviewProps {
  src: string;
  alt: string;
  thumbnailClassName?: string;
  previewClassName?: string;
}

const ImagePreview = ({
  src,
  alt,
  thumbnailClassName = "w-12 h-12 object-cover rounded",
  previewClassName = "max-w-[300px] rounded shadow-lg",
}: ImagePreviewProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const offset = 10; // distância em pixels entre a miniatura e o preview
      let left: number;

      // Verifica se a miniatura está na metade esquerda da janela
      if (rect.left + rect.width / 2 < window.innerWidth / 2) {
        // Se estiver na esquerda, posiciona o preview à direita
        left = rect.right + offset;
      } else {
        // Se estiver na direita, posiciona o preview à esquerda (considerando largura fixa de 300px)
        left = rect.left - 300 - offset;
      }

      // Centraliza verticalmente o preview em relação à miniatura
      const top = (rect.top + rect.height) / 2 + 50;

      // Define o estilo para o preview usando position fixed para que fique relativo à viewport
      setPreviewStyle({
        position: "fixed",
        left: left,
        top: top,
        transform: "translateY(-50%)",
      });
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Miniatura */}
      <img
        src={src}
        alt={alt}
        className={thumbnailClassName}
      />

      {/* Pré-visualização */}
      {isHovered && (
        <div
          style={previewStyle}
          className={previewClassName}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
