import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  FileText,
  BarChart3,
  Settings,
  Building2,
  User,
} from "lucide-react";

export const adminLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/students", icon: Users, label: "Students" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export const teacherLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/courses", icon: BookOpen, label: "My Courses" },
  { to: "/students", icon: Users, label: "Students" },
  { to: "/attendance", icon: ClipboardCheck, label: "Attendance" },
  { to: "/marks", icon: FileText, label: "Marks" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export const studentLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/students", icon: Users, label: "Students" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export const getMenuItems = (role) => {
  switch (role) {
    case "admin":
      return adminLinks;
    case "teacher":
      return teacherLinks;
    case "student":
      return studentLinks;
    default:
      return adminLinks;
  }
};
