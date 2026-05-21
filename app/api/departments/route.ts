import { NextResponse } from "next/server";
import { get } from "@vercel/blob";
import { streamToJson } from "@/helper/api.helper";
import { IDepartment } from "@/schemas/departments";

const FILE = "tmp/departments.json";

// =========================
// GET
// =========================
export async function GET() {
  try {
    const res = await get(FILE, { access: "private" });

    if (!res || res.statusCode !== 200 || !res.stream) {
      return NextResponse.json({ data: [] });
    }

    const data = await streamToJson(res.stream);

    return NextResponse.json({
      data: data as IDepartment[],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      data: [],
    });
  }
}
