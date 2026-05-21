"use client";

import { useEffect, useState } from "react";
import { api } from "@/helper/api.helper";
import { IDepartment } from "@/schemas/departments";
import { IDoctor } from "@/schemas/doctor";
import { toast } from "@heroui/react";

const DAYS = [
  { label: "อา", value: 0 },
  { label: "จ", value: 1 },
  { label: "อ", value: 2 },
  { label: "พ", value: 3 },
  { label: "พฤ", value: 4 },
  { label: "ศ", value: 5 },
  { label: "ส", value: 6 },
];

function generateSlotTimes(startTime: string, endTime: string, step = 30) {
  const result: string[] = [];

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  let current = startH * 60 + startM;
  const end = endH * 60 + endM;

  while (current < end) {
    const h = Math.floor(current / 60);
    const m = current % 60;

    result.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);

    current += step;
  }

  return result;
}

export default function DoctorManagementPage() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Partial<IDoctor>>({
    employee_id: "",
    first_name: "",
    last_name: "",
    department_id: "",
    speciality: "",
    license_number: "",
    phone: "",
    email: "",
    is_active: true,
    available_days: [1, 2, 3, 4, 5],
    created_at: new Date().toISOString(),
    schedule: {
      id: crypto.randomUUID(),
      workingDay: [1, 2, 3, 4, 5],
      startTime: "08:00",
      endTime: "17:00",
      slotTimeworking: generateSlotTimes("08:00", "17:00"),
      breakTime: "12:00 - 13:00",
      acceptsBooking: true,
    },
  });

  const fetchDoctors = async () => {
    try {
      const res = await api<IDoctor[]>("/api/doctors");

      setDoctors(res.data ?? []);
    } catch (error) {
      console.error(error);

      toast.danger("โหลดข้อมูลแพทย์ไม่สำเร็จ");
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [resDepartments] = await Promise.all([
          api<IDepartment[]>("/api/departments"),
        ]);

        setDepartments(resDepartments.data ?? []);

        await fetchDoctors();
      } catch (error) {
        console.error(error);

        toast.danger("โหลดข้อมูลเริ่มต้นไม่สำเร็จ");
      }
    };

    init();
  }, []);

  const updateSchedule = (key: keyof IDoctor["schedule"], value: unknown) => {
    setForm((prev) => {
      const schedule = {
        ...prev.schedule!,
        [key]: value,
      };

      schedule.slotTimeworking = generateSlotTimes(
        schedule.startTime,
        schedule.endTime,
      );

      return {
        ...prev,
        schedule,
      };
    });
  };

  const toggleDay = (day: number, type: "available" | "working") => {
    setForm((prev) => {
      const current =
        type === "available"
          ? (prev.available_days ?? [])
          : (prev.schedule?.workingDay ?? []);

      const updated = current.includes(day)
        ? current.filter((d) => d !== day)
        : [...current, day];

      if (type === "available") {
        return {
          ...prev,
          available_days: updated,
        };
      }

      return {
        ...prev,
        schedule: {
          ...prev.schedule!,
          workingDay: updated,
        },
      };
    });
  };

  const resetForm = () => {
    setForm({
      employee_id: "",
      first_name: "",
      last_name: "",
      department_id: "",
      speciality: "",
      license_number: "",
      phone: "",
      email: "",
      is_active: true,
      available_days: [1, 2, 3, 4, 5],
      created_at: new Date().toISOString(),
      schedule: {
        id: crypto.randomUUID(),
        workingDay: [1, 2, 3, 4, 5],
        startTime: "08:00",
        endTime: "17:00",
        slotTimeworking: generateSlotTimes("08:00", "17:00"),
        breakTime: "12:00 - 13:00",
        acceptsBooking: true,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload: Partial<IDoctor> = {
        ...form,
      };

      const res = await fetch("/api/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.danger(json.error || "เกิดข้อผิดพลาด");

        return;
      }

      toast.success("เพิ่มแพทย์สำเร็จ");

      resetForm();

      await fetchDoctors();
    } catch (error) {
      console.error(error);

      toast.danger("ไม่สามารถเพิ่มแพทย์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Doctor Management</h1>

        <p className="mt-1 text-sm text-gray-500">
          จัดการข้อมูลแพทย์ ตารางงาน และวันเปิดรับนัด
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            เพิ่มแพทย์ใหม่
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            กรอกข้อมูลแพทย์และกำหนดตารางเวลาทำงาน
          </p>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <input
            placeholder="ชื่อ"
            className="px-4 py-2 border border-gray-200 rounded-xl"
            value={form.first_name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                first_name: e.target.value,
              }))
            }
          />

          <input
            placeholder="นามสกุล"
            className="px-4 py-2 border border-gray-200 rounded-xl"
            value={form.last_name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                last_name: e.target.value,
              }))
            }
          />

          <select
            className="px-4 py-2 border border-gray-200 rounded-xl bg-white"
            value={form.department_id}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                department_id: e.target.value,
              }))
            }
          >
            <option value="">เลือกแผนก</option>

            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            placeholder="ความเชี่ยวชาญ"
            className="px-4 py-2 border border-gray-200 rounded-xl"
            value={form.speciality}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                speciality: e.target.value,
              }))
            }
          />

          <input
            placeholder="เลขใบประกอบวิชาชีพ"
            className="px-4 py-2 border border-gray-200 rounded-xl"
            value={form.license_number}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                license_number: e.target.value,
              }))
            }
          />

          <input
            placeholder="เบอร์โทร"
            className="px-4 py-2 border border-gray-200 rounded-xl"
            value={form.phone}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
          />

          <input
            placeholder="อีเมล"
            className="px-4 py-2 border border-gray-200 rounded-xl"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
        </div>

        {/* Available Days */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-700">
            วันที่เปิดรับนัด
          </p>

          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const active = form.available_days?.includes(d.value) ?? false;

              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value, "available")}
                  className={`px-4 py-2 rounded-xl border text-sm transition-all ${active
                    ? "bg-blue-50 border-blue-200 text-[#1a4f8a]"
                    : "bg-white border-gray-200 text-gray-500"
                    }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Working Days */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-700">วันทำงานจริง</p>

          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const active =
                form.schedule?.workingDay.includes(d.value) ?? false;

              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value, "working")}
                  className={`px-4 py-2 rounded-xl border text-sm transition-all ${active
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-white border-gray-200 text-gray-500"
                    }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500">เริ่มงาน</label>

            <input
              type="time"
              value={form.schedule?.startTime}
              onChange={(e) => updateSchedule("startTime", e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500">เลิกงาน</label>

            <input
              type="time"
              value={form.schedule?.endTime}
              onChange={(e) => updateSchedule("endTime", e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-500">พักกลางวัน</label>

            <input
              value={form.schedule?.breakTime}
              onChange={(e) => updateSchedule("breakTime", e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl"
            />
          </div>
        </div>

        {/* Slot Preview */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-700">Slot เวลา</p>

          <div className="flex flex-wrap gap-2">
            {form.schedule?.slotTimeworking.map((slot) => (
              <div
                key={slot}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs text-gray-700"
              >
                {slot}
              </div>
            ))}
          </div>
        </div>

        {/* Active */}
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                is_active: e.target.checked,
              }))
            }
          />

          <span className="text-sm text-gray-700">เปิดใช้งานแพทย์</span>
        </label>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#1a4f8a] hover:bg-[#163f70] text-white font-medium transition-all disabled:opacity-50"
          >
            {loading ? "กำลังบันทึก..." : "บันทึกแพทย์"}
          </button>
        </div>
      </div>

      {/* Doctor List */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              รายชื่อแพทย์
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              รายการแพทย์ทั้งหมดในระบบ
            </p>
          </div>

          <div className="text-sm text-gray-400">
            ทั้งหมด {doctors.length} คน
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {doctors.map((doctor) => {
            const department = departments.find(
              (d) => d.id === doctor.department_id,
            );

            return (
              <div
                key={doctor.id}
                className="border border-gray-200 rounded-2xl p-4 bg-white hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {doctor.first_name} {doctor.last_name}
                    </h3>

                    <p className="text-sm text-gray-400 mt-0.5">
                      {doctor.speciality}
                    </p>
                  </div>

                  <div
                    className={`px-2 py-1 rounded-lg text-xs ${doctor.is_active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                      }`}
                  >
                    {doctor.is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500">
                  <span>🏥 {department?.name}</span>

                  <span>📞 {doctor.phone}</span>

                  <span className="truncate">✉️ {doctor.email}</span>

                  <span>
                    🕐 {doctor.schedule.startTime} - {doctor.schedule.endTime}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-1">
                  {doctor.schedule.workingDay.map((day) => {
                    const dayObj = DAYS.find((d) => d.value === day);

                    return (
                      <span
                        key={day}
                        className="px-2 py-1 rounded-lg bg-blue-50 text-[#1a4f8a] text-xs"
                      >
                        {dayObj?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
