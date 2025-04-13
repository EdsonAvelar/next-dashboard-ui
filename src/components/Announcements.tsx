import { prisma } from "@/lib/prisma";
// import { getCurrentUser } from "@/lib/utils";

const Announcements = async () => {
  const user = await getCurrentUser();

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: user.id! } } },
    student: { students: { some: { id: user.id! } } },
    parent: { students: { some: { parentId: user.id! } } },
  };

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(user.cargo !== "Gerente" && {
        OR: [
          { classId: null },
          {
            class:
              roleConditions[user.cargo as keyof typeof roleConditions] || {},
          },
        ],
      }),
    },
  });

  return (
    <div className="bg-white rounded-lg h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.map((announcement, index) => (
          <div className={`${index%2==0? index%3==0?'bg-xconYellow':'bg-xconSkyLight':'bg-xconPurple'} rounded-md p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{announcement.title} </h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Date(announcement.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {announcement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
