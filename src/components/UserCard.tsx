import Image from "next/image";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { prisma } from "@/lib/prisma";

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {
  const modelMap: Record<typeof type, any> = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
    parent: prisma.parent,
  };

  const data = await modelMap[type].count();

  return (
    <div className="relative rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/05
        </span>
        <Image
          src="/more.png"
          alt="More"
          width={20}
          height={20}
        />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h4 className="capitalize text-sm font-medium text-gray-500">{type}</h4>

      <CurrencyDollarIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-white h-10 w-10" />
    </div>
  );
};

export default UserCard;
