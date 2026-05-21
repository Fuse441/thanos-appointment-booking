import { readJsonFile, writeJsonFile } from "@/helper/file.db";
import { IDoctor } from "@/schemas/doctor";
import { NextRequest, NextResponse } from "next/server";
import { put, get } from "@vercel/blob";
import { streamToJson } from "@/helper/api.helper";
const FILE = "tmp/doctors.json";

// =========================
// GET ALL
// =========================

export async function GET() {
  try {
    const res = await get(FILE, { access: "private" });

    // ไม่มีไฟล์
    if (!res || res.statusCode !== 200 || !res.stream) {
      return NextResponse.json({ data: [] });
    }

    // อ่าน stream → JSON
    const data = await streamToJson(res.stream);

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: [] });
  }
}

// helper load
async function loadDoctors(): Promise<IDoctor[]> {
  try {
    const res = await get(FILE, { access: "private" });

    if (!res || res.statusCode !== 200 || !res.stream) return [];

    return await streamToJson(res.stream);
  } catch {
    return [];
  }
}

// helper save
async function saveDoctors(data: IDoctor[]) {
  await put(FILE, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

// =========================
// POST (CREATE)
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

    const doctors = await loadDoctors();

    const counter = doctors.length + 1;

    const employeeId = `${body.first_name}.${body.last_name
      ?.charAt(0)
      .toUpperCase()}-${counter}`;

    const duplicated = doctors.find(
      (d) =>
        d.employee_id === employeeId ||
        d.license_number === body.license_number,
    );

    if (duplicated) {
      return NextResponse.json(
        { message: "Doctor already exists" },
        { status: 409 },
      );
    }

    const doctor: IDoctor = {
      id: crypto.randomUUID(),
      employee_id: employeeId,

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

    const updated = [...doctors, doctor];

    await saveDoctors(updated);

    return NextResponse.json(
      {
        message: "Doctor created successfully",
        data: doctor,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error:
          error instanceof Error
            ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
            : String(error),
      },
      { status: 500 },
    );
  }
}
