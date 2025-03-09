import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceCharts";
import AttendanceChartContainer from "@/components/containers/AttendanceChartContainer";
import CountChartContainer from "@/components/containers/CountChartContainer";
import EventCalendarContainer from "@/components/containers/EventCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

const AdminPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* Left */}

      <div className="w-full lg:w-2/3 flex flex-col gap-8 ">
        {/* User Cards */}

        <div className="grid grid-cols-2 gap-4 lg:flex lg:gap-4 lg:justify-between">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="admin" />
        </div>

        {/* MIddle charts */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Count chart */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>

          {/* Attendance chart */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>
        {/* Bottom charts */}
        <div className="w-full h-[500px] bg-white rounded-xl p-4">
          <FinanceChart />
        </div>
      </div>
      {/* Right */}

      <div className="w-full lg:w-1/3 flex flex-col gap-8 ">
        <EventCalendarContainer searchParams={searchParams} />
        {/* <Announcements /> */}
      </div>
    </div>
  );
};

export default AdminPage;
