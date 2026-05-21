import { IDepartment } from "@/schemas/departments";
import { IDoctor } from "@/schemas/doctor";
import { state } from "@/state/common_state";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  let department: IDepartment[] = state.departments || [];
  //mock

    return NextResponse.json({ data: department });
}

export async function POST(req: NextRequest) {
  try {
    const body: IDoctor = await req.json();
    const { first_name, last_name, license_number, speciality } = body;

    if (!first_name || !last_name || !license_number) {
      return NextResponse.json(
        { error: "first_name, last_name, license_number are required" },
        { status: 400 },
      );
    }

    const newDoctor = {
      ...body,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    state.doctors.push(newDoctor);
    return NextResponse.json({ data: newDoctor }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
