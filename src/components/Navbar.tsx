import { getCurrentUser } from "@/lib/actions";
import Image from "next/image";

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex items-center justify-between p-4 ">
      {/* Search Bar */}

      <div className="hidden md:flex items-center gap-2  text-xs rounded-full ring-[1.5px] ring-gray-200 px-2">
        <Image
          src="/search.png"
          alt="Description"
          width={14}
          height={14}
        />
        <input
          type="text"
          className="w-[200px] p-1 bg-transparent outline-none"
          placeholder="Search..."
        />
      </div>

      {/* Icon and User */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer ">
          <Image
            src="/message.png"
            width={20}
            height={20}
            alt="Notification"
          />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image
            src="/announcement.png"
            width={20}
            height={20}
            alt="Notification"
          />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">{user.name}</span>
          <span className="text-[10px] text-gray-500 text-right">
            {user.cargo?.name}
          </span>
        </div>
        <Image
          src={user.avatar}
          width={30}
          height={30}
          alt="Profile"
          className="rounded-full cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Navbar;
