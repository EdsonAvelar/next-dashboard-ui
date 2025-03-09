import Image from "next/image";
import AttendanceChart from "../AttendanceCharts";
import { prisma } from "@/lib/prisma";

const data1 = [
  {
    name: "Mon",
    present: 60,
    absent: 40,
  },
  {
    name: "Tue",
    present: 30,
    absent: 13,
  },
  {
    name: "Wed",
    present: 20,
    absent: 98,
  },
  {
    name: "Thu",
    present: 27,
    absent: 39,
  },
  {
    name: "Fri",
    present: 18,
    absent: 48,
  },
  {
    name: "Sat",
    present: 23,
    absent: 38,
  },
  {
    name: "Sun",
    present: 34,
    absent: 43,
  },
];

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);

  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      Mon: { present: 0, absent: 0 },
      Tue: { present: 0, absent: 0 },
      Wed: { present: 0, absent: 0 },
      Thu: { present: 0, absent: 0 },
      Fri: { present: 0, absent: 0 },
    };

  resData.forEach((item) => {
    const itemData = new Date(item.date);

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dayName = daysOfWeek[dayOfWeek - 1];
      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));



  return (
    <div className="bg-white rounded-lg h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Attendance</h1>
        <Image
          src="/moreDark.png"
          alt="More"
          width={20}
          height={20}
        />
      </div>

      <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
