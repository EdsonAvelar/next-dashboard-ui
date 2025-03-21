"use client";
import { useRouter, useSearchParams } from "next/navigation";

type User = {
  id: number;
  name: string;
};

export default function ProprietarioFilterSelect({ users }: { users: User[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentValue = searchParams.get("proprietario_id") || "";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("proprietario_id", value);
    } else {
      params.delete("proprietario_id");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      className="border rounded-md p-2 hover:bg-lamaPurpleLight"
      value={currentValue}
      onChange={handleChange}
    >
      <option value="">Filtrar por Proprietário</option>
      {users.map((user) => (
        <option
          key={user.id}
          value={user.id}
        >
          {user.name}
        </option>
      ))}
    </select>
  );
}
