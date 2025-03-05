import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/containers/BigCalendarContainer";
import { getCurrentUser } from "@/lib/utils";

import "react-big-calendar/lib/css/react-big-calendar.css";

const TeacherPage = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* Left */}
      <div className="w-full xl:w-2/3 ">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule</h1>
          <BigCalendarContainer
            type="teacherId"
            id={user.id!}
          />
        </div>
      </div>

      {/* Right */}
      <div className="w-full xl:w-1/3 ">
        {/* <EventCalendar /> */}
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
