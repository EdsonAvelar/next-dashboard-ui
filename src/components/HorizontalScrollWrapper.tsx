"use client";

import { useRef, useEffect, PropsWithChildren } from "react";

export default function HorizontalScrollWrapper({
  children,
}: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Quando o componente for montado, posiciona o scroll à direita
      //containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto"
    >
      {children}
    </div>
  );
}
