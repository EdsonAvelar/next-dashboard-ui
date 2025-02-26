import Link from "next/link";
import {
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  UserIcon,
  BookOpenIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  MegaphoneIcon,
  UserCircleIcon,
  CogIcon,
  ArrowLeftEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import { role } from "@/lib/data";


const iconMapping = {
  Home: HomeIcon,
  Teachers: AcademicCapIcon,
  Students: UserGroupIcon,
  Parents: UserIcon,
  Subjects: BookOpenIcon,
  Classes: BuildingOffice2Icon,
  Lessons: DocumentTextIcon,
  Exams: ClipboardDocumentCheckIcon,
  Assignments: ClipboardDocumentListIcon,
  Results: ChartBarIcon,
  Attendance: CheckBadgeIcon,
  Events: CalendarDaysIcon,
  Messages: ChatBubbleBottomCenterTextIcon,
  Announcements: MegaphoneIcon,
  Profile: UserCircleIcon,
  Settings: CogIcon,
  Logout: ArrowLeftEndOnRectangleIcon,
};

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "Home",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Teachers",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "Students",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "Parents",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "Subjects",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "Classes",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "Lessons",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "Exams",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Assignments",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Results",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Attendance",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Events",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Messages",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Announcements",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "Profile",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Settings",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "Logout",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((menu, index) => (
        <div key={index} className="flex flex-col gap-2 p-2">
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {menu.title}
          </span>
          <ul>
            {menu.items.map((item, itemIndex) => {
              // Fazendo cast para informar que item.icon é uma chave válida em iconMapping
              const IconComponent = iconMapping[item.icon as keyof typeof iconMapping];

              if (item.visible.includes(role)) {
                return (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="flex items-center md:py-2 justify-center lg:justify-start gap-4 py-2 p-2 text-gray-500 hover:bg-lamaSkyLight rounded-lg"
                    >
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                      <span className="hidden lg:block">{item.label}</span>
                    </Link>
                  </li>
                );

              }

            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Menu;
