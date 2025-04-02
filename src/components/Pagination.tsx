"use client";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  page?: number; // opcional
  count: number;
  itemsPerPage?: number; // opcional
};

const Pagination = ({ page, count, itemsPerPage }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Se não receber page via props, tenta puxar da URL, senão assume 1
  const currentPage =
    page ??
    (searchParams.get("page")
      ? parseInt(searchParams.get("page") as string, 10)
      : 1);

  // Usa itemsPerPage se fornecido; senão, usa o ITEM_PER_PAGE legado
  const ipp = itemsPerPage || ITEM_PER_PAGE;

  const totalPages = Math.ceil(count / ipp);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={!hasPrev}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(currentPage - 1)}
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageIndex = index + 1;
          return (
            <button
              key={pageIndex}
              className={`px-2 rounded-sm ${
                currentPage === pageIndex ? "bg-lamaSky" : ""
              }`}
              onClick={() => changePage(pageIndex)}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>
      <button
        disabled={!hasNext}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
