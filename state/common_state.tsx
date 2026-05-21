import { IDoctor } from "@/schemas/doctor";
import { IDepartment } from "@/schemas/departments";
import { IAppointmentType } from "@/schemas/appointment";
import { APPOINTMENT_TYPES_DETAIL } from "@/config/appointmentType";

export const appointmentsType = APPOINTMENT_TYPES_DETAIL.map((t, index) => ({
  id: crypto.randomUUID(),

  // CODE
  code: t.type.toUpperCase().replace("-", "_"),

  // BASIC
  name: t.name,
  description: t.description,

  // TIME
  duration_minutes: t.duration,
  buffer_minutes: t.buffer,

  // BOOKING RULES
  allow_online_booking: true,
  requires_approval: t.requiresConsentForm,
  allow_walk_in: t.allowSameDayBooking,

  // EXTRA RULES
  requires_prior_visit: t.requiresPriorVisit,
  requires_room: t.requiresRoom,
  same_doctor_only: t.sameDocOnly,

  // ADVANCE BOOKING
  advance_booking_min_hours: t.advanceBookingMin,
  advance_booking_max_days: t.advanceBookingMax,

  // DISPLAY
  color: t.colorHex,
  icon: t.icon,

  // MOCK PRICE
  consultation_fee:
    t.type === "procedure"
      ? 3000
      : t.type === "new-patient"
        ? 1200
        : t.type === "follow-up"
          ? 500
          : 800,

  // PRIORITY
  priority_level: index + 1,

  // RULES
  rules: t.rules,

  // SYSTEM
  is_active: true,
  created_at: new Date().toISOString(),
}));
export const state: {
  doctors: IDoctor[];
  departments?: IDepartment[];
  appointmentsType?: IAppointmentType[];
} = {
  doctors: [],
  departments: [
    {
      id: crypto.randomUUID(),
      code: "CARD",
      name: "โรคหัวใจ",
      description: "ดูแลรักษาโรคหัวใจและระบบหลอดเลือด",
      phone: "021111111",
      email: "cardiology@hospital.com",
      building: "อาคาร A",
      floor: "3",
      room: "A-301",
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      code: "NEUR",
      name: "ระบบประสาท",
      description: "ดูแลรักษาโรคเกี่ยวกับสมองและระบบประสาท",
      phone: "022222222",
      email: "neurology@hospital.com",
      building: "อาคาร B",
      floor: "2",
      room: "B-201",
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      code: "ORTH",
      name: "ศัลยกรรมกระดูก",
      description: "รักษากระดูก ข้อ และกล้ามเนื้อ",
      phone: "023333333",
      email: "orthopedics@hospital.com",
      building: "อาคาร C",
      floor: "4",
      room: "C-401",
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      code: "PED",
      name: "กุมารเวชกรรม",
      description: "ดูแลรักษาเด็กและทารก",
      phone: "024444444",
      email: "pediatrics@hospital.com",
      building: "อาคาร D",
      floor: "1",
      room: "D-101",
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      code: "DERM",
      name: "ผิวหนัง",
      description: "รักษาโรคผิวหนัง เส้นผม และเล็บ",
      phone: "025555555",
      email: "dermatology@hospital.com",
      building: "อาคาร E",
      floor: "5",
      room: "E-501",
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      code: "GEN",
      name: "อายุรกรรมทั่วไป",
      description: "ตรวจรักษาโรคทั่วไปและโรคภายใน",
      phone: "026666666",
      email: "general@hospital.com",
      building: "อาคาร A",
      floor: "2",
      room: "A-201",
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ],
  appointmentsType: appointmentsType,
};
