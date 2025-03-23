"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRef } from "react";

const InputSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (searchValue: string) => {
    if (!searchValue.trim()) return; // não realiza busca se estiver vazia
    const params = new URLSearchParams(window.location.search);
    params.set("search", searchValue);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") as string;
    handleSearch(searchValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    handleSearch(searchValue);
  };

  const handleFocus = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    router.push(`${window.location.pathname}?${params.toString()}`);
    if (inputRef.current) inputRef.current.value = "";
  };

  const clearSearch = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    router.push(`${window.location.pathname}?${params.toString()}`);
    if (inputRef.current) inputRef.current.value = "";
  };

  const activeSearch = searchParams.get("search");

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full md:w-auto flex items-center ${activeSearch ? "bg-red-200" : ""} gap-2 text-xs rounded-full ring-[1.5px] ring-gray-200 px-2`}
    >
      <Image
        src="/search.png"
        alt="Search"
        width={14}
        height={14}
      />
      <input
        ref={inputRef}
        type="text"
        name="search"
        placeholder="Pesquisar..."
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-[200px] p-2 bg-transparent outline-none `}
      />
      {activeSearch && (
        <button
          type="button"
          onClick={clearSearch}
          className="p-1 focus:outline-none"
        >
          <XMarkIcon className="w-4 h-4 text-gray-600" />
        </button>
      )}
    </form>
  );
};

export default InputSearch;
