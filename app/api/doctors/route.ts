import { readJsonFile, writeJsonFile } from "@/helper/file.db";
import { IDoctor } from "@/schemas/doctor";
import { NextRequest, NextResponse } from "next/server";

const FILE = "doctors.json";

// =========================
// GET ALL
// =========================
export async function GET() {
  const doctors = readJsonFile<IDoctor[]>(FILE);

  return NextResponse.json({
    data: doctors.filter((d) => !d.deleted_at),
  });
}

// =========================
// CREATE
// =========================
export async function POST(req: NextRequest) {
  try {
    const body: Partial<IDoctor> = await req.json();

    if (!body.first_name || !body.last_name || !body.department_id) {
      return NextResponse.json(
        { message: "missing required fields" },
        { status: 400 },
      );
    }

    const doctors = readJsonFile<IDoctor[]>(FILE);

    const duplicated = doctors.find(
      (d) =>
        d.employee_id === body.employee_id ||
        d.license_number === body.license_number,
    );

    if (duplicated) {
      return NextResponse.json(
        { message: "Doctor already exists" },
        { status: 409 },
      );
    }

    const counter = doctors.length + 1;

    const doctor: IDoctor = {
      id: crypto.randomUUID(),
      employee_id: `${body.first_name}.${body.last_name?.charAt(0).toUpperCase()}-${counter}`,
      first_name: body.first_name,
      last_name: body.last_name,
      department_id: body.department_id,
      speciality: body.speciality ?? "",
      license_number: body.license_number ?? "",
      phone: body.phone ?? "",
      email: body.email ?? "",
      is_active: body.is_active ?? true,
      available_days: body.available_days ?? [],
      created_at: new Date().toISOString(),
      schedule: body.schedule ?? {
        id: crypto.randomUUID(),
        workingDay: [],
        startTime: "08:00",
        endTime: "17:00",
        slotTimeworking: [],
        breakTime: "12:00 - 13:00",
        acceptsBooking: true,
      },
    };

    doctors.push(doctor);
    writeJsonFile(FILE, doctors);

    return NextResponse.json(
      { message: "Doctor created successfully", data: doctor },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
