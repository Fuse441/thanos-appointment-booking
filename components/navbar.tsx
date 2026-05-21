// components/navbar.tsx
"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { TextField, InputGroup, Tooltip } from "@heroui/react";
import { SearchIcon } from "@/components/icons";
import {
  LayoutDashboard,
  CalendarPlus,
  Calendar,
  Clock,
  User,
  Users,
  Building2,
  CalendarDays,
  BarChart2,
  Settings,
  LucideIcon,
  Wrench,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  "calendar-plus": CalendarPlus,
  calendar: Calendar,
  clock: Clock,
  user: User,
  users: Users,
  building: Building2,
  "calendar-event": CalendarDays,
  report: BarChart2,
  settings: Settings,
};

const navItems = [
  {
    section: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: "layout-dashboard",
        isDevelopment: true,
      },
      {
        label: "Book Appointment",
        href: "/appointments/new",
        icon: "calendar-plus",
        badge: "New",
        badgeVariant: "warn" as const,
      },
      {
        label: "Available Slots",
        href: "/appointments/slot",
        icon: "clock",
      },
    ],
  },
  {
    section: "Management",
    items: [
      { label: "Doctors", href: "/doctors", icon: "user" },
      {
        label: "Patients",
        href: "/patients",
        icon: "users",
        isDevelopment: true,
      },
      {
        label: "Departments",
        href: "/departments",
        icon: "building",
        isDevelopment: true,
      },
      {
        label: "Schedules",
        href: "/schedules",
        icon: "calendar-event",
      },
    ],
  },
  {
    section: "System",
    items: [
      {
        label: "Reports",
        href: "/reports",
        icon: "report",
        isDevelopment: true,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: "settings",
        isDevelopment: true,
      },
    ],
  },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-60 fixed h-screen flex flex-col bg-background border-r border-divider">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-divider">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-semibold">+H</span>
        </div>

        <div>
          <p className="text-sm font-medium leading-none">MediBook</p>
          <p className="text-xs text-default-400 mt-0.5">Hospital HIS</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-divider">
        <TextField aria-label="Search" type="search">
          <InputGroup>
            <InputGroup.Prefix>
              <SearchIcon className="text-default-400 text-base pointer-events-none flex-shrink-0" />
            </InputGroup.Prefix>

            <InputGroup.Input className="text-sm" placeholder="Search..." />

            <InputGroup.Suffix />
          </InputGroup>
        </TextField>
      </div>

      {/* Development banner */}
      <div className="mx-3 mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
        <div className="flex items-start gap-2">
          <Wrench size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />

          <div>
            <p className="text-xs font-semibold text-amber-700">
              Development Preview
            </p>

            <p className="text-[11px] text-amber-600 mt-0.5 leading-relaxed">
              บางเมนูยังอยู่ระหว่างพัฒนาและอาจยังไม่พร้อมใช้งาน
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navItems.map((group) => (
          <div key={group.section} className="mb-2">
            <p className="px-4 py-2 text-[11px] font-medium text-default-400 uppercase tracking-widest">
              {group.section}
            </p>

            {group.items.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                isActive={pathname === item.href}
              />
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-divider p-3">
        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-default-100 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary text-xs font-medium flex items-center justify-center flex-shrink-0">
            NJ
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Nurse Janya</p>
            <p className="text-xs text-default-400 truncate">Reception Staff</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const NavLink = ({
  label,
  href,
  icon,
  badge,
  badgeVariant,
  isDevelopment,
  isActive,
}: {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  badgeVariant?: "default" | "warn";
  isDevelopment?: boolean;
  isActive: boolean;
}) => {
  const Icon = iconMap[icon];

  const content = (
    <div
      className={clsx(
        "flex items-center gap-2.5 px-3 py-2 mx-2 rounded-lg text-sm transition-all",
        isDevelopment
          ? "opacity-60 cursor-not-allowed hover:bg-amber-50"
          : isActive
            ? "bg-primary-50 text-primary font-medium"
            : "text-default-600 hover:bg-default-100 hover:text-default-900",
      )}
    >
      {Icon && <Icon size={16} className="flex-shrink-0" />}

      <span className="flex-1">{label}</span>

      {isDevelopment && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
          DEV
        </span>
      )}

      {!isDevelopment && badge && (
        <span
          className={clsx(
            "text-[11px] px-1.5 py-0.5 rounded-full font-medium",
            badgeVariant === "warn"
              ? "bg-warning-100 text-warning-700"
              : "bg-primary-100 text-primary",
          )}
        >
          {badge}
        </span>
      )}
    </div>
  );

  if (isDevelopment) {
    return (
      <Tooltip>
        {" "}
        <div>{content}</div>
      </Tooltip>
    );
  }

  return <NextLink href={href}>{content}</NextLink>;
};
