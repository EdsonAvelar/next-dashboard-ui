import Badge from "@/components/Badge";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

const PermissionPage = async () => {
  const roles = await prisma.role.findMany({
    include: {
      users: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        {/* <PermissionSearch /> */}
        {/* <Link
          href="/permissions/create"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm mt-2 sm:mt-0"
        > */}
        <h1>Permissões</h1>
        {/* </Link> */}
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase">
                Assigned To
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="hover:bg-gray-50"
              >
                <td>
                  <Badge type="purple">{role.name}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {role.users.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {role.users.map((user) => (
                        <Badge
                          key={user.id}
                          type="green"
                        >
                          {user.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No Users</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {role.descricao || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionPage;
