import { useState, useEffect } from "react";

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    // Define o tamanho inicial
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
