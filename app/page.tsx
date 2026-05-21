import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Plus,
} from "lucide-react";
import NextLink from "next/link";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const stats = [
  {
    label: "Booked today",
    value: 24,
    delta: "+3 from yesterday",
    positive: true,
    icon: Calendar,
    color: "bg-primary-50 text-primary",
  },
  {
    label: "Completed",
    value: 11,
    delta: "46% completion rate",
    positive: true,
    icon: CheckCircle2,
    color: "bg-success-50 text-success",
  },
  {
    label: "Cancelled",
    value: 2,
    delta: "+1 more than usual",
    positive: false,
    icon: XCircle,
    color: "bg-danger-50 text-danger",
  },
  {
    label: "Doctors on duty",
    value: 8,
    delta: "3 departments active",
    positive: true,
    icon: Users,
    color: "bg-secondary-50 text-secondary",
  },
];

const appointments = [
  {
    time: "09:00",
    patient: "Somchai P.",
    doctor: "Dr. Wanchai",
    type: "New patient",
    department: "Internal Med",
    status: "completed",
  },
  {
    time: "09:30",
    patient: "Nida K.",
    doctor: "Dr. Priya",
    type: "Follow-up",
    department: "Cardiology",
    status: "booked",
  },
  {
    time: "10:00",
    patient: "Arun T.",
    doctor: "Dr. Wanchai",
    type: "Consultation",
    department: "Internal Med",
    status: "booked",
  },
  {
    time: "10:30",
    patient: "Malee S.",
    doctor: "Dr. Somsak",
    type: "Procedure",
    department: "Surgery",
    status: "cancelled",
  },
  {
    time: "11:00",
    patient: "Pailin R.",
    doctor: "Dr. Priya",
    type: "New patient",
    department: "Cardiology",
    status: "booked",
  },
  {
    time: "11:30",
    patient: "Korn W.",
    doctor: "Dr. Somsak",
    type: "Follow-up",
    department: "Surgery",
    status: "booked",
  },
];

const doctors = [
  { name: "Dr. Wanchai", dept: "Internal Med", slots: 3, booked: 6 },
  { name: "Dr. Priya", dept: "Cardiology", slots: 2, booked: 5 },
  { name: "Dr. Somsak", dept: "Surgery", slots: 5, booked: 3 },
  { name: "Dr. Lalita", dept: "Pediatrics", slots: 4, booked: 4 },
];

const alerts = [
  { message: "Dr. Wanchai's 14:00 slot has 0 available spaces", level: "warn" },
  { message: "Malee S. cancelled — slot reopened at 10:30", level: "info" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; className: string }> = {
  booked: {
    label: "Booked",
    className: "bg-primary-100 text-primary-700",
  },
  completed: {
    label: "Completed",
    className: "bg-success-100 text-success-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-danger-100 text-danger-700",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Today's Overview
          </h1>
          <p className="text-sm text-default-400 mt-0.5">{today}</p>
        </div>
        <NextLink href="/appointments/new">
          <button className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
            <Plus size={15} />
            Book appointment
          </button>
        </NextLink>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm ${a.level === "warn"
                ? "bg-warning-50 text-warning-700 border border-warning-200"
                : "bg-primary-50 text-primary-700 border border-primary-100"
                }`}
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              {a.message}
            </div>
          ))}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-background border border-divider rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-default-400 font-medium">
                  {s.label}
                </p>
                <div className={`p-1.5 rounded-lg ${s.color}`}>
                  <Icon size={14} />
                </div>
              </div>
              <p className="text-2xl font-semibold text-foreground">
                {s.value}
              </p>
              <p
                className={`text-xs flex items-center gap-1 ${s.positive ? "text-success-600" : "text-danger-600"
                  }`}
              >
                <TrendingUp size={11} />
                {s.delta}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments table */}
        <div className="lg:col-span-2 bg-background border border-divider rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-divider">
            <p className="text-sm font-medium text-foreground">
              Upcoming appointments
            </p>
            <NextLink
              href="/appointments"
              className="text-xs text-primary flex items-center gap-0.5 hover:underline"
            >
              View all <ChevronRight size={13} />
            </NextLink>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-divider">
                {["Time", "Patient", "Doctor", "Type", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-2.5 text-left text-xs font-medium text-default-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, i) => {
                const s = statusConfig[appt.status];
                return (
                  <tr
                    key={i}
                    className="border-b border-divider last:border-0 hover:bg-default-50 transition-colors"
                  >
                    <td className="px-5 py-3 text-xs font-mono text-default-500">
                      {appt.time}
                    </td>
                    <td className="px-5 py-3 font-medium text-foreground text-xs">
                      {appt.patient}
                    </td>
                    <td className="px-5 py-3 text-xs text-default-600">
                      {appt.doctor}
                    </td>
                    <td className="px-5 py-3 text-xs text-default-500">
                      {appt.type}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${s.className}`}
                      >
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Doctor load */}
        <div className="bg-background border border-divider rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-divider">
            <p className="text-sm font-medium text-foreground">Doctor load</p>
            <Clock size={14} className="text-default-400" />
          </div>
          <div className="divide-y divide-divider">
            {doctors.map((doc) => {
              const pct = Math.round(
                (doc.booked / (doc.booked + doc.slots)) * 100,
              );
              return (
                <div key={doc.name} className="px-5 py-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-foreground">
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-default-400">{doc.dept}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-foreground">
                        {doc.booked}/{doc.booked + doc.slots}
                      </p>
                      <p className="text-[11px] text-default-400">
                        {doc.slots} left
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-default-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 80
                        ? "bg-danger-400"
                        : pct >= 60
                          ? "bg-warning-400"
                          : "bg-primary"
                        }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 border-t border-divider">
            <NextLink
              href="/slots"
              className="text-xs text-primary flex items-center gap-0.5 hover:underline"
            >
              View available slots <ChevronRight size={13} />
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
