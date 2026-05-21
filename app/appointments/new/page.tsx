"use client";

import { useState, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import AppointmentTypesSection from "@/components/appointments";
import { getAvailableDaysInMonth, todayString } from "@/helper/date.helper";
import { api } from "@/helper/api.helper";
import { IDoctor } from "@/schemas/doctor";
import { BookingModal } from "@/components/bookingModel";
import { IDepartment } from "@/schemas/departments";
import { title } from "process";
import {
  IAppointment,
  IAppointmentType,
  TAppointmentStatus,
} from "@/schemas/appointment";
import { toast, Toast } from "@heroui/react";

const STATUS_COLORS: Record<TAppointmentStatus, Record<string, string>> = {
  confirmed: { name: "ยืนยันแล้ว", color: "#3b82f6" },
  pending: { name: "รอการยืนยัน", color: "#f59e0b" },
  cancelled: { name: "ยกเลิก", color: "#ef4444" },
};

export default function AppointmentCalendarPage() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          resDoctors,
          resDepartments,
          resAppointmentTypes,
          resAppointmentBooking,
        ] = await Promise.all([
          api<IDoctor[]>("/api/doctors"),
          api<IDepartment[]>("/api/departments"),
          api<IAppointmentType[]>("/api/appointments/type"),
          api<IAppointment[]>("/api/appointments/booking"), // ← เพิ่มการดึงข้อมูลนัดหมายทั้งหมด
        ]);

        setDoctors(resDoctors.data ?? []);

        setDepartments(resDepartments.data ?? []);

        setAppointmentTypes(resAppointmentTypes.data ?? []);

        setAppointments(resAppointmentBooking.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [appointmentTypes, setAppointmentTypes] = useState<IAppointmentType[]>(
    [],
  );
  const [calendarDate, setCalendarDate] = useState(new Date());

  // ── Filtered appointments → FullCalendar events ──────────────────────────
  const events = useMemo(() => {
    doctors.find((d) => d.id === filterDoctor);
    console.log("Filtering appointments with:", {
      filterDoctor,
      filterDept,
      filterStatus,
    });
    return appointments
      .filter(
        (a) =>
          (!filterDoctor || a.doctor === filterDoctor) && // ← เพิ่มกลับ
          (!filterDept || a.dept === filterDept) &&
          (!filterStatus || a.status === filterStatus),
      )
      .map((a) => ({
        id: String(a.id),
        title: `${a.time} — ${a.patient}`,
        date: a.date,
        backgroundColor: STATUS_COLORS[a.status].color,
        borderColor: STATUS_COLORS[a.status].color,
        textColor: "#fff",
        extendedProps: a,
      }));
  }, [appointments, filterDoctor, filterDept, filterStatus]); // ── Availability background events for selected doctor ───────────────────
  const backgroundEvents = useMemo(() => {
    if (!filterDoctor) return [];

    const available_days =
      doctors.find((d) => d.id === filterDoctor)?.available_days ?? [];

    const days = getAvailableDaysInMonth(calendarDate, available_days);

    const result = [];

    const today = new Date();

    const currentYear = today.getFullYear();

    const currentMonth = today.getMonth();

    const year = calendarDate.getFullYear();

    const month = calendarDate.getMonth();

    const isCurrentMonth = year === currentYear && month === currentMonth;

    for (const day of days) {
      // ถ้าเป็นเดือนปัจจุบัน
      // และวันย้อนหลัง
      // ข้าม
      if (isCurrentMonth && day < today.getDate()) {
        continue;
      }

      const dateObj = new Date(year, month, day);

      const date = [
        dateObj.getFullYear(),
        String(dateObj.getMonth() + 1).padStart(2, "0"),
        String(dateObj.getDate()).padStart(2, "0"),
      ].join("-");

      result.push({
        id: `avail-${date}`,
        start: date,
        display: "background",
        backgroundColor: "#2ba900",
      });
    }

    return result;
  }, [filterDoctor, doctors, calendarDate]);
  const handleDateClick = (info: { dateStr: string }) => {
    const date = new Date(info.dateStr).getDate();
    const available_days =
      doctors.find((d) => d.id === filterDoctor)?.available_days ?? [];
    const days = getAvailableDaysInMonth(
      new Date(info.dateStr),
      available_days,
    );
    const currentDate = new Date();
    console.log("check availability for date:", info.dateStr, {
      days,
      currentDate,
    });
    if (
      (info.dateStr >= currentDate.toISOString().split("T")[0] &&
        days.length == 0) ||
      (days.includes(date) &&
        info.dateStr >= currentDate.toISOString().split("T")[0])
    ) {
      console.log("Doctor is available on this date, opening modal.");
      setSelectedDate(info.dateStr);

      setModalOpen(true);
    } else {
      return toast.warning(
        "ไม่สามารถจองนัดหมายได้ เนื่องจากแพทย์ไม่ให้บริการในวันดังกล่าว",
      );
    }
  };

  const handleAddAppointment = async (appt: IAppointment) => {
    try {
      const res = await fetch("/api/appointments/booking", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(appt),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }
      setAppointments((prev) => [...prev, data.data]);
      console.log("Booking success", data);
    } catch (error) {
      console.error("Booking error:", error);
    }
  };
  const selectClass =
    "text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]";

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">ปฏิทินนัดหมาย </h1>
        <p className="mt-1 text-sm text-gray-500">
          จัดการนัดหมายและตารางเวลาของแพทย์.{" "}
        </p>
      </div>

      {/* ── Filters & Book button ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Doctor filter */}
        <select
          className={selectClass}
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
        >
          <option value="">แพทย์ทุกคน</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.first_name} {d.last_name}
            </option>
          ))}
        </select>

        {/* Department filter */}
        <select
          className={selectClass}
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="">ทุกแผนก</option>
          {departments.map((d) => (
            <option key={d.id}>{d.name}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          className={selectClass}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">สถานะทั้งหมด</option>
          <option value="confirmed">ยืนยันแล้ว</option>
          <option value="pending">รอดำเนินการ</option>
          <option value="cancelled">ยกเลิก</option>
        </select>

        <div className="flex-1" />

        <button
          onClick={() => {
            setSelectedDate(todayString());
            setModalOpen(true);
          }}
          className="flex items-center gap-1.5 text-sm px-4 py-2 bg-[#1a4f8a] hover:bg-[#163f70] text-white rounded-lg font-medium transition-colors"
        >
          + จองนัดหมาย{" "}
        </button>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        {(["confirmed", "pending", "cancelled"] as TAppointmentStatus[]).map(
          (s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded"
                style={{ background: STATUS_COLORS[s].color }}
              />
              {STATUS_COLORS[s].name}
            </span>
          ),
        )}
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded bg-green-200" />
          มีแพทย์ให้บริการ (เลือกแพทย์ที่ต้องการพบ){" "}
        </span>
      </div>

      {/* ── Calendar ───────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="80vh"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          events={[...events, ...backgroundEvents]}
          dateClick={handleDateClick}
          editable={false}
          eventDisplay="block"
          datesSet={(arg) => {
            console.log("Full ==> ", arg.view.currentStart);
            setCalendarDate(arg.view.currentStart);
          }}
        />
      </div>

      {/* ── Booking Modal ───────────────────────────────────────────────── */}
      {modalOpen && (
        <BookingModal
          initialDoctors={doctors}
          initialTypes={appointmentTypes}
          initialDate={selectedDate}
          onClose={() => setModalOpen(false)}
          onConfirm={handleAddAppointment}
        />
      )}

      <AppointmentTypesSection />
    </div>
  );
}
