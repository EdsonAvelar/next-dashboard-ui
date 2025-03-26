import React from "react";
import LazyLoadWrapper from "./LazyLoadWrapper";

interface CardProps {
  children: React.ReactNode;
}

const CardComponent: React.FC<CardProps> = ({ children }: CardProps) => {
  return (
    <LazyLoadWrapper placeholder={<div className="h-80 bg-gray-100" />}>
      <div className="w-full h-[500px] bg-white rounded-xl p-1 shadow-md border border-gray-200">
        <div className="w-full h-[450px]">{children}</div>
      </div>
    </LazyLoadWrapper>
  );
};

export default CardComponent;
