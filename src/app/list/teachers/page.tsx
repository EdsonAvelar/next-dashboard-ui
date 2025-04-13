import ColumnFilter from "@/components/ColumnFilter";
import FormModal from "@/components/FormModal";
import InputSearch from "@/components/InputSearch";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { role } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Info</span>
        {/* Botão de filtro */}
        <ColumnFilter
          paramKey="info"
          filterType="text"
          label="Filtrar por info ID"
        />
      </div>
    ),
    accessor: "info",
    className: "",
  },
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Teacher ID</span>
        {/* Botão de filtro */}
        <ColumnFilter
          paramKey="teacherId"
          filterType="text"
          label="Filtrar por Teacher ID"
        />
      </div>
    ),
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: (
      <div className="flex items-center gap-2">
        <span>Subjects</span>
        {/* Botão de filtro */}
        <ColumnFilter
          paramKey="subjects"
          filterType="text"
          label="Filtrar por Subjects ID"
        />
      </div>
    ),
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "actions", className: "" },
];

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string } | undefined;
}) => {
  const { page, ...params } = searchParams || {};
  const p = page ? parseInt(page) : 1;

  const where: Prisma.TeacherWhereInput = {};

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            where.username = {
              contains: params.teacherId,
            };
            break;
          case "info":
            where.name = {
              contains: params.info,
            };
            break;
          case "search":
            where.name = {
              contains: params.search,
            };
            break;
          case "subjects":
            where.subjects = {
              some: {
                name: {
                  contains: params.subjects,
                },
              },
            };
            break;
        }
      }
    }
  }

  //   // createdAt => dateRange no formato "YYYY-MM-DD_to_YYYY-MM-DD"
  //   if (params.createdAt) {
  //     const [start, end] = params.createdAt.split("_to_");
  //     if (start) {
  //       where.createdAt = { ...where.createdAt, gte: new Date(start) };
  //     }
  //     if (end) {
  //       where.createdAt = { ...where.createdAt, lte: new Date(end) };
  //     }
  //   }

  const [data, pagecount] = await prisma.$transaction([
    prisma.teacher.findMany({
      where,
      include: {
        subjects: true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.teacher.count({ where }),
  ]);

  // Pré-renderiza as linhas no servidor
  const rows = data.map((item) => (
    <tr
      key={item.id}
      data-rowid={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sn hover:bg-xconPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img || "/noAvatar.png"}
          alt={item.name}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.username}</td>
      <td className="hidden md:table-cell">
        {item.subjects.map((subj) => subj.name).join(",")}
      </td>
      <td className="hidden md:table-cell">
        {item.classes.map((cls) => cls.name).join(",")}
      </td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-xconSky">
            <Image
              src="/view.png"
              alt=""
              width={16}
              height={16}
            />
          </button>
        </Link>
        {role === "admin" && (
          <FormModal
            table="teacher"
            type="delete"
            id={parseInt(item.id)}
          />
        )}
      </td>
    </tr>
  ));

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <InputSearch />
          <div className="flex items-center gap-4 self-ebd">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-xconYellow">
              <Image
                src="/filter.png"
                alt="filter"
                width={14}
                height={14}
              />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-xconYellow">
              <Image
                src="/sort.png"
                alt="filter"
                width={14}
                height={14}
              />
            </button>
            {role === "admin" && (
              <FormModal
                table="teacher"
                type="create"
              />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table
        columns={columns}
        rows={rows}
        selectable={true}
      />
      {/* PAGINATION */}
      <Pagination
        page={p}
        count={pagecount}
      />
    </div>
  );
};

export default TeacherListPage;
