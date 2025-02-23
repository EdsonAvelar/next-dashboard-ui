import Image from "next/image";

const TableSearch = () => {
    return (
        <div className="w-full md:w-auto flex items-center gap-2  text-xs rounded-full ring-[1.5px] ring-gray-200 px-2">
            <Image src="/search.png" alt="Description" width={14} height={14} />
            <input type="text" className="w-[200px] p-1 bg-transparent outline-none" placeholder='Search...' />
        </div>
    );
}

export default TableSearch;