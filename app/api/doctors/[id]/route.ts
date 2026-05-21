import { readJsonFile, writeJsonFile } from "@/helper/file.db";
import { IDoctor } from "@/schemas/doctor";
import { NextRequest, NextResponse } from "next/server";

const FILE = "/tmp/doctors.json";

type Context = {
  params: Promise<{ id: string }>;
};

// =========================
// UPDATE
// =========================
export async function PUT(req: NextRequest, context: Context) {
  const { id } = await context.params;

  const body: Partial<IDoctor> = await req.json();

  const doctors = readJsonFile<IDoctor[]>(FILE);

  const index = doctors.findIndex((d) => d.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  doctors[index] = {
    ...doctors[index],
    ...body,
    updated_at: new Date().toISOString(),
  };

  writeJsonFile(FILE, doctors);

  return NextResponse.json({
    message: "updated",
    data: doctors[index],
  });
}

// =========================
// SOFT DELETE
// =========================
export async function DELETE(_: NextRequest, context: Context) {
  const { id } = await context.params;

  const doctors = readJsonFile<IDoctor[]>(FILE);

  const index = doctors.findIndex((d) => d.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  doctors[index] = {
    ...doctors[index],
    deleted_at: new Date().toISOString(),
    is_active: false,
  };

  writeJsonFile(FILE, doctors);

  return NextResponse.json({
    message: "deleted",
  });
}
