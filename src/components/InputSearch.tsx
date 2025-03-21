"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const InputSearch = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Pegando o valor do input corretamente
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string; // Obtém o valor do campo 'search'

    if (!searchValue.trim()) return; // Evita buscar por valores vazios

    const params = new URLSearchParams(window.location.search);
    params.set("search", searchValue); // Define o valor no query params

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto flex items-center gap-2  text-xs rounded-full ring-[1.5px] ring-gray-200 px-2"
    >
      <Image
        src="/search.png"
        alt="Search"
        width={14}
        height={14}
      />
      <input
        type="text"
        name="search" // Adicionado name para facilitar a captura do valor
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default InputSearch;
