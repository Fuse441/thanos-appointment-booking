"use client";

import { APPOINTMENT_TYPES_DETAIL } from "@/config/appointmentType";
import { api } from "@/helper/api.helper";
import {
  getDayOfWeek,
  minutesToTime,
  timeToMinutes,
  todayString,
} from "@/helper/date.helper";
import {
  IAppointmentTypeDef,
  IAppointment,
  IBookedAppointment,
} from "@/schemas/appointment";
import { IDepartment } from "@/schemas/departments";
import { IDoctor } from "@/schemas/doctor";
import { useState, useMemo, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
const INIT_TYPE: IAppointmentTypeDef = {
  id: "new-patient",
  label: "new patient",
  duration: 60,
  icon: "👤",
  color: "bg-blue-100 text-blue-700",
};
interface Appointment {
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // "HH:mm"
  duration: number; // minutes
}

interface SlotResult {
  time: string;
  endTime: string;
  available: boolean;
  reason?: "booked" | "break" | "outside-hours";
}

// ─── Static Data ──────────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlots(
  doctor: IDoctor,
  dateStr: string,
  duration: number,
  booked: IBookedAppointment[],
): SlotResult[] {
  const dow = getDayOfWeek(dateStr);

  console.log("generateSlot", {
    doctor,
    dateStr,
    duration,
    booked,
    dow,
  });

  if (!doctor.schedule.workingDay.includes(dow)) {
    return [];
  }

  const [breakStartStr, breakEndStr] = doctor.schedule.breakTime.split(" - ");

  const breakStart = timeToMinutes(breakStartStr);
  const breakEnd = timeToMinutes(breakEndStr);

  const bookedRanges = booked
    .filter((a) => a.doctorId === doctor.id && a.date === dateStr)
    .map((a) => ({
      start: timeToMinutes(a.time),
      end: timeToMinutes(a.time) + a.duration,
    }));

  const slots: SlotResult[] = [];

  for (const slotTime of doctor.schedule.slotTimeworking) {
    const start = timeToMinutes(slotTime);

    const end = start + duration;

    if (end > timeToMinutes(doctor.schedule.endTime)) {
      slots.push({
        time: slotTime,
        endTime: minutesToTime(end),
        available: false,
        reason: "outside-hours",
      });

      continue;
    }

    const overlapsBreak = start < breakEnd && end > breakStart;

    if (overlapsBreak) {
      slots.push({
        time: slotTime,
        endTime: minutesToTime(end),
        available: false,
        reason: "break",
      });

      continue;
    }

    const overlapsBooked = bookedRanges.some(
      (b) => start < b.end && end > b.start,
    );

    if (overlapsBooked) {
      slots.push({
        time: slotTime,
        endTime: minutesToTime(end),
        available: false,
        reason: "booked",
      });

      continue;
    }

    slots.push({
      time: slotTime,
      endTime: minutesToTime(end),
      available: true,
    });
  }

  return slots;
}
// ─── Sub-components ───────────────────────────────────────────────────────────

function DoctorCard({
  doctor,
  department,
  selected,
  onClick,
  dateStr,
}: {
  doctor: IDoctor;
  department?: IDepartment;
  selected: boolean;
  onClick: () => void;
  dateStr: string;
}) {
  const dow = dateStr ? getDayOfWeek(dateStr) : -1;
  const worksToday = dateStr ? doctor.schedule.workingDay.includes(dow) : true;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-3 transition-all ${selected
        ? "border-[#1a4f8a] ring-2 ring-[#1a4f8a]/20 bg-blue-50/60"
        : worksToday
          ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
          : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
        }`}
      disabled={!worksToday && !!dateStr}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${selected ? "bg-[#1a4f8a] text-white" : "bg-gray-100 text-gray-600"
            }`}
        >
          {"SC"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {doctor.first_name} {doctor.last_name}
          </p>
          <p className="text-xs text-gray-400">{department?.name}</p>
        </div>
        {dateStr && !worksToday && (
          <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
            Day off
          </span>
        )}
      </div>
      <div className="mt-2 flex gap-3 text-xs text-gray-400">
        <span>
          🕐 {doctor.schedule.startTime}–{doctor.schedule.endTime}
        </span>
        <span>☕ {doctor.schedule.breakTime}</span>
      </div>
    </button>
  );
}

function SlotGrid({
  slots,
  onSelect,
}: {
  slots: SlotResult[];
  onSelect: (slot: SlotResult) => void;
}) {
  const available = slots.filter((s) => s.available);
  const unavailable = slots.filter((s) => !s.available);

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <span className="text-4xl mb-3">📅</span>
        <p className="text-sm">
          Select a doctor, date, and appointment type to see available slots.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="flex gap-3 text-sm">
        <span className="flex items-center gap-1.5 font-medium text-emerald-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
          {available.length} available
        </span>
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" />
          {unavailable.length} unavailable
        </span>
      </div>

      {/* Available slots */}
      {available.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Available slots
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {available.map((slot) => (
              <button
                key={slot.time}
                onClick={() => onSelect(slot)}
                className="flex flex-col items-center py-2.5 px-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 transition-all group"
              >
                <span className="text-sm font-semibold text-emerald-700">
                  {slot.time}
                </span>
                <span className="text-[10px] text-emerald-500 mt-0.5">
                  → {slot.endTime}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {available.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-xl border border-gray-100">
          <span className="text-3xl mb-2">😔</span>
          <p className="text-sm text-gray-500">
            No available slots for this date
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try a different date or appointment type
          </p>
        </div>
      )}

      {/* Unavailable breakdown */}
      <details className="group">
        <summary className="text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer hover:text-gray-600 list-none flex items-center gap-1">
          <span className="group-open:rotate-90 transition-transform inline-block">
            ▶
          </span>
          Show unavailable slots ({unavailable.length})
        </summary>
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {unavailable.map((slot) => {
            const reasonLabel =
              slot.reason === "booked"
                ? "Booked"
                : slot.reason === "break"
                  ? "Break"
                  : "Off hours";
            const reasonColor =
              slot.reason === "booked"
                ? "text-red-400"
                : slot.reason === "break"
                  ? "text-amber-400"
                  : "text-gray-300";
            return (
              <div
                key={slot.time}
                className="flex flex-col items-center py-2.5 px-2 rounded-xl border border-gray-100 bg-gray-50 opacity-60"
              >
                <span className="text-sm font-medium text-gray-400 line-through">
                  {slot.time}
                </span>
                <span className={`text-[10px] mt-0.5 ${reasonColor}`}>
                  {reasonLabel}
                </span>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}

// ─── Confirm modal ────────────────────────────────────────────────────────────

function ConfirmModal({
  slot,
  doctor,
  date,
  apptType,
  onClose,
  onConfirm,
}: {
  slot: SlotResult;
  doctor: IDoctor;
  date: string;
  apptType: IAppointmentTypeDef;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-sm shadow-xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">
            Confirm Slot
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Doctor</span>
            <span className="font-medium text-gray-800">
              {doctor.first_name} {doctor.last_name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium text-gray-800">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time</span>
            <span className="font-medium text-gray-800">
              {slot.time} – {slot.endTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Type</span>
            <span className="font-medium text-gray-800">
              {apptType.icon} {apptType.label}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Proceeding will open the booking form with this slot pre-filled.
        </p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="text-sm px-4 py-2 bg-[#1a4f8a] hover:bg-[#163f70] text-white rounded-lg font-medium"
          >
            Book this slot
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AvailableSlotsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(todayString());
  const [selectedType, setSelectedType] =
    useState<IAppointmentTypeDef>(INIT_TYPE);
  const [confirmSlot, setConfirmSlot] = useState<SlotResult | null>(null);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [doctors, setDoctors] = useState<IDoctor[]>();
  const [departments, setDepartments] = useState<IDepartment[]>();
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDoctors, resDepartments, resAppointments] = await Promise.all(
          [
            api<IDoctor[]>("/api/doctors"),
            api<IDepartment[]>("/api/departments"),
            api<IAppointment[]>("/api/appointments/booking"),
          ],
        );

        setDepartments(resDepartments.data ?? []);
        setDoctors(resDoctors.data ?? []);
        setAppointments(resAppointments.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const bookedAppointments = useMemo<IBookedAppointment[]>(() => {
    return appointments
      .filter((a) => a.status !== "cancelled")
      .map((a) => {
        const type = APPOINTMENT_TYPES_DETAIL.find((t) => t.id === a.type);

        return {
          doctorId: a.doctor,
          date: a.date,
          time: a.time,
          duration: type?.duration ?? 30,
        };
      });
  }, [appointments]);
  const slots = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return [];

    return generateSlots(
      selectedDoctor,
      selectedDate,
      selectedType!.duration,
      bookedAppointments,
    );
  }, [selectedDoctor, selectedDate, selectedType, bookedAppointments]);
  const handleConfirm = () => {
    setConfirmSlot(null);
    setBookedSuccess(true);
    setTimeout(() => setBookedSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            ช่วงเวลาว่างสำหรับการนัดหมาย
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            ค้นหาช่วงเวลาที่สามารถนัดหมายได้ตามแพทย์ วันที่
            และประเภทการนัดหมาย{" "}
          </p>
        </div>
        {bookedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2 rounded-xl">
            ✅ Slot booked successfully!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* ── Left panel: filters ───────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Date picker */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              วันที่นัดหมาย
            </p>
            <input
              type="date"
              className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedDate}
              min={todayString()}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Appointment type */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              ประเภทการนัดหมาย{" "}
            </p>
            <div className="flex flex-col gap-2">
              {APPOINTMENT_TYPES_DETAIL.map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    setSelectedType({
                      id: t.type,
                      label: t.name,
                      duration: t.duration,
                      icon: t.icon,
                      color: t.color,
                    })
                  }
                  className={`flex items-center justify-between text-left px-3 py-2 rounded-lg border text-sm transition-all ${selectedType?.id === t.id
                    ? "border-[#1a4f8a] bg-blue-50 text-[#1a4f8a] font-medium"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600"
                    }`}
                >
                  <span>
                    {t.icon} {t.name}
                  </span>

                  <span className="text-xs text-gray-400">
                    {t.duration} นาที
                  </span>
                </button>
              ))}{" "}
            </div>
          </div>

          {/* Doctor list */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Doctor
            </p>
            <div className="flex flex-col gap-2">
              {doctors?.map((d) => (
                <DoctorCard
                  key={d.id}
                  doctor={d}
                  department={departments?.find(
                    (dept) => dept.id === d.department_id,
                  )}
                  selected={selectedDoctor?.id === d.id}
                  onClick={() => setSelectedDoctor(d)}
                  dateStr={selectedDate}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel: slots ────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          {/* Selected context bar */}
          {selectedDoctor && selectedDate && (
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-5 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-[#1a4f8a] text-white flex items-center justify-center text-xs font-bold">
                {"SC"}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-800">
                  {selectedDoctor.first_name} {selectedDoctor.last_name}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {
                    departments?.find(
                      (dept) => dept.id === selectedDoctor.department_id,
                    )?.name
                  }
                </span>
              </div>
              <span className="text-gray-200">·</span>
              <span className="text-sm text-gray-600">{selectedDate}</span>
              <span className="text-gray-200">·</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${selectedType?.color}`}
              >
                {selectedType?.icon} {selectedType?.label} (
                {selectedType?.duration}min)
              </span>
            </div>
          )}

          <SlotGrid slots={slots} onSelect={(slot) => setConfirmSlot(slot)} />
        </div>
      </div>

      {/* Confirm modal */}
      {confirmSlot && selectedDoctor && (
        <ConfirmModal
          slot={confirmSlot}
          doctor={selectedDoctor}
          date={selectedDate}
          apptType={selectedType}
          onClose={() => setConfirmSlot(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
