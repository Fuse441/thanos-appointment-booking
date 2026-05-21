export interface IDoctor {
  id: string; // รหัสเฉพาะสำหรับแต่ละแพทย์
  employee_id: string; // รหัสพนักงาน เช่น "DR-001"
  first_name: string;
  last_name: string;
  license_number: string; // เลขใบประกอบวิชาชีพ
  speciality: string; // เช่น "Cardiology"
  phone: string;
  email: string;
  is_active: boolean;
  available_days: number[]; // เช่น ["Monday", "Wednesday", "Friday"]
  department_id: string; // เช่น "Cardiology"
  created_at: string;
  deleted_at?: string | null;
  updated_at?: string | null;
  schedule: IDoctorSchedule;
}
export interface IDoctorSchedule {
  id: string;
  workingDay: number[];
  startTime: string; // "08:00"
  endTime: string;
  breakTime: string;
  slotTimeworking: string[];
  acceptsBooking: boolean;
}
