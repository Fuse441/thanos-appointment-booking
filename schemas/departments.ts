// Department Schema

export interface IDepartment {
  id: string;

  // department info
  code: string; // เช่น "CARD"
  name: string; // Cardiology
  description?: string;

  // contact
  phone?: string;
  email?: string;

  // location
  building?: string;
  floor?: string;
  room?: string;

  // management
  head_doctor_id?: string;

  // system
  is_active: boolean;

  created_at: string;
  updated_at?: string;
}
