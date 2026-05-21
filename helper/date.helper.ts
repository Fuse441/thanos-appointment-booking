const thaiDays = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัส",
  "ศุกร์",
  "เสาร์",
];
export function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} นาที`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} ชั่วโมง ${m} นาที` : `${h} ชั่วโมง`;
}
export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr).getDay();
}

export function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getAvailableDaysInMonth(
  calendarDate: Date,
  availableWeekDays: number[],
): number[] {
  console.log({ calendarDate, availableWeekDays });
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  console.log({ year, month });
  const result: number[] = [];

  const maxDay = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= maxDay; day++) {
    const date = new Date(year, month, day);

    const weekDay = date.getDay();

    if (availableWeekDays.includes(weekDay)) {
      result.push(day);
    }
  }

  return result;
}
export const getNameOfDay = (day: number | number[]) => {
  if (Array.isArray(day)) {
    return day.map((d) => thaiDays[d] || "").join(", ");
  }

  return thaiDays[day] || "";
};
