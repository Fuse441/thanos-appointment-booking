import { IDoctor } from "@/schemas/doctor";
import { state } from "@/state/common_state";
import { randomUUID } from "crypto";

function randomTime(minHour = 7, maxHour = 10): string {
  const hour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;

  return `${String(hour).padStart(2, "0")}:00`;
}

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(":").map(Number);

  const date = new Date();

  date.setHours(h);
  date.setMinutes(m);

  date.setHours(date.getHours() + hours);

  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;
}

function generateTimeSlots(
  startTime: string,
  endTime: string,
  intervalMinutes = 30,
): string[] {
  const slots: string[] = [];

  const current = new Date();
  const end = new Date();

  const [startH, startM] = startTime.split(":").map(Number);

  const [endH, endM] = endTime.split(":").map(Number);

  current.setHours(startH, startM, 0, 0);

  end.setHours(endH, endM, 0, 0);

  while (current < end) {
    const hh = String(current.getHours()).padStart(2, "0");

    const mm = String(current.getMinutes()).padStart(2, "0");

    slots.push(`${hh}:${mm}`);

    current.setMinutes(current.getMinutes() + intervalMinutes);
  }

  return slots;
}

const FIRST_NAMES = [
  "สมชาย",
  "สมหญิง",
  "ณัฐพล",
  "กิตติ",
  "ธีรภัทร",
  "ปกรณ์",
  "ชญานิน",
  "วรินทร",
  "ธนพล",
  "พีรวิชญ์",
  "สุภาวดี",
  "พิมพ์ชนก",
  "อรทัย",
  "กัญญารัตน์",
  "ชลธิชา",
  "ศิริพร",
  "ปาริฉัตร",
  "ณิชาภัทร",
  "วาสนา",
  "ธัญญา",
];

const LAST_NAMES = [
  "ใจดี",
  "สุขสันต์",
  "วัฒนากูล",
  "ตั้งเจริญ",
  "ทองสุข",
  "ศรีสมบัติ",
  "บุญมี",
  "พัฒนชัย",
  "รุ่งเรือง",
  "ชาญวิทย์",
  "กิตติพงศ์",
  "ศักดิ์ศรี",
  "อินทรา",
  "วโรดม",
  "เจริญผล",
  "ธรรมรักษ์",
  "โชติอนันต์",
  "พิทักษ์ชัย",
  "สุนทรภักดี",
  "อุดมทรัพย์",
];

const SPECIALITIES = [
  "แพทย์โรคหัวใจ",
  "แพทย์ระบบประสาท",
  "แพทย์กระดูกและข้อ",
  "กุมารแพทย์",
  "แพทย์ผิวหนัง",
  "แพทย์เวชศาสตร์ทั่วไป",
  "จักษุแพทย์",
  "แพทย์หู คอ จมูก",
  "สูตินรีแพทย์",
  "ศัลยแพทย์",
];
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomPhone() {
  return "08" + Math.floor(10000000 + Math.random() * 89999999);
}

function randomLicense() {
  return String(Math.floor(1000000000 + Math.random() * 9000000000));
}

export function randomDoctor(index: number): IDoctor {
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  const startTime = randomTime(7, 9);

  const endTime = addHours(startTime, Math.floor(Math.random() * 3) + 8);

  const slotTimeWorking = generateTimeSlots(startTime, endTime, 30);
  return {
    id: randomUUID(),

    employee_id: `DR-${String(index + 1).padStart(3, "0")}`,

    first_name: firstName,

    last_name: lastName,

    department_id: randomItem(state.departments!.map((d) => d.id)),

    speciality: randomItem(SPECIALITIES),

    license_number: randomLicense(),

    phone: randomPhone(),

    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hospital.com`,

    is_active: Math.random() > 0.2,
    available_days: [0, 1, 2, 3, 4, 5, 6].filter(() => Math.random() > 0.5),
    created_at: new Date().toISOString(),
    schedule: {
      id: `${randomUUID()}`,
      workingDay: [0, 1, 2, 3, 4, 5, 6].filter(() => Math.random() > 0.5),
      startTime: "08:00",
      endTime: "17:00",
      slotTimeworking: slotTimeWorking,
      breakTime: "12:00 - 13:00",
      acceptsBooking: true,
    },
  };
}
