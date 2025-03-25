import React from "react";

interface CardProps {
  children: React.ReactNode;
}

const CardComponent: React.FC<CardProps> = ({ children }: CardProps) => {
  return (
    <div className="w-full h-[500px] bg-white rounded-xl p-1 shadow-md border border-gray-200">
      <div className="w-full h-[450px]">{children}</div>
    </div>
  );
};

export default CardComponent;
