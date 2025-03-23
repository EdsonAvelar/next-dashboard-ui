"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type User = {
  id: number;
  name: string;
};

export default function ProprietarioFilterSelect({ users }: { users: User[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentValue = searchParams.get("proprietario_id") || "";

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Atualiza o usuário selecionado caso já exista no searchParams
  useEffect(() => {
    if (currentValue) {
      const found = users.find((u) => String(u.id) === currentValue);
      setSelectedUser(found || null);
    }
  }, [currentValue, users]);

  // Filtra os usuários com base na busca
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setIsOpen(false);
    setQuery(""); // reseta a busca
    const params = new URLSearchParams(searchParams.toString());
    params.set("proprietario_id", String(user.id));
    router.push(`?${params.toString()}`);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Fecha o dropdown se clicar fora
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="relative w-64"
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        type="button"
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 flex justify-between items-center bg-white hover:bg-gray-50 transition"
      >
        <span>
          {selectedUser ? selectedUser.name : "Filtrar por Proprietário"}
        </span>
        <svg
          className="w-5 h-5 text-gray-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <input
            type="text"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2 border-b border-gray-200 focus:outline-none"
          />
          <div className="max-h-40 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="cursor-pointer p-2 hover:bg-purple-100 transition"
                >
                  {user.name}
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-500">
                Nenhum usuário encontrado.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
