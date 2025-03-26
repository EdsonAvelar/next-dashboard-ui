"use client";

import { useInView } from "react-intersection-observer";

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
}

export default function LazyLoadWrapper({
  children,
  placeholder = null,
}: LazyLoadWrapperProps) {
  const { ref, inView } = useInView({
    triggerOnce: true, // só dispara uma vez
    threshold: 0.1, // 10% visível
  });

  return <div ref={ref}>{inView ? children : placeholder}</div>;
}
