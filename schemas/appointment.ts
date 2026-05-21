export type TAppointmentStatus = "confirmed" | "pending" | "cancelled";

type TAppointmentType =
  | "new-patient"
  | "follow-up"
  | "consultation"
  | "procedure";

export interface IAppointment {
  id: number;
  patient: string;
  doctor: string;
  dept: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: string;
  status: TAppointmentStatus;
  reason?: string;
  staff: string;
}
export interface IBookedAppointment {
  doctorId: string;
  date: string;
  time: string;
  duration: number;
}
export interface IAppointmentTypeDef {
  id: TAppointmentType;
  label: string;
  duration: number;
  icon: string;
  color: string;
}

export interface AppointmentTypeRule {
  id: string;
  name: string;
  type: TAppointmentType;
  duration: number; // minutes
  buffer: number; // minutes after appointment
  color: string; // tailwind bg class
  colorHex: string;
  icon: string;
  advanceBookingMin: number; // min hours before appointment
  advanceBookingMax: number; // max days in advance
  requiresPriorVisit: boolean;
  requiresConsentForm: boolean;
  requiresRoom: boolean;
  allowSameDayBooking: boolean;
  sameDocOnly: boolean;
  description: string;
  rules: string[];
}

export interface IAppointmentType {
  id: string;

  // basic info
  code: string; // CONSULT, FOLLOWUP
  name: string;
  description?: string;

  // scheduling
  duration_minutes: number;

  // rules
  allow_online_booking: boolean;
  requires_approval: boolean;
  allow_walk_in: boolean;

  // pricing
  consultation_fee?: number;

  // priority
  priority_level: number; // 1 = highest

  // UI
  color?: string;

  // system
  is_active: boolean;

  created_at: string;
  updated_at?: string;
}
