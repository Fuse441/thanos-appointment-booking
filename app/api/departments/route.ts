import { readJsonFile } from "@/helper/file.db";
import { IDepartment } from "@/schemas/departments";
import { NextResponse } from "next/server";

const FILE = "departments.json";

export async function GET() {
  const departments = readJsonFile<IDepartment[]>(FILE);

  return NextResponse.json({
    data: departments,
  });
}
