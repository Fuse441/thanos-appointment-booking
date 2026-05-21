import { readJsonFile, writeJsonFile } from "@/helper/file.db";
import { randomDoctor } from "@/helper/localhost.helper";
import { IDoctor } from "@/schemas/doctor";
import { state } from "@/state/common_state";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
const FILE_NAME = "doctors.json";
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const department = searchParams.get("department");

  const doctors = readJsonFile<IDoctor[]>(FILE_NAME);

  const filtered = department
    ? doctors.filter((d) => d.department_id === department)
    : doctors;

  return NextResponse.json({ data: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body: IDoctor = await req.json();

    const { first_name, last_name, license_number } = body;

    if (!first_name || !last_name || !license_number) {
      return NextResponse.json(
        {
          error: "first_name, last_name, license_number are required",
        },
        { status: 400 },
      );
    }

    const doctors = readJsonFile<IDoctor[]>(FILE_NAME);

    const duplicated = doctors.find(
      (d) =>
        d.license_number === license_number ||
        d.employee_id === body.employee_id,
    );

    if (duplicated) {
      return NextResponse.json(
        { error: "Doctor already exists" },
        { status: 409 },
      );
    }

    const newDoctor: IDoctor = {
      ...body,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    doctors.push(newDoctor);

    writeJsonFile(FILE_NAME, doctors);

    return NextResponse.json({ data: newDoctor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
