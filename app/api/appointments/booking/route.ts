import { NextRequest, NextResponse } from "next/server";
import { put, get } from "@vercel/blob";
import { IAppointment } from "@/schemas/appointment";
import { streamToJson } from "@/helper/api.helper";

const FILE = "tmp/appointments.json";

// =====================
// helper: load
// =====================
async function loadAppointments(): Promise<IAppointment[]> {
  try {
    const res = await get(FILE, { access: "private" });

    if (!res || res.statusCode !== 200 || !res.stream) return [];

    return await streamToJson(res.stream);
  } catch {
    return [];
  }
}

// =====================
// helper: save
// =====================
async function saveAppointments(data: IAppointment[]) {
  await put(FILE, JSON.stringify(data), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
  });
}

// =====================
// GET
// =====================
export async function GET() {
  const appointments = await loadAppointments();

  return NextResponse.json({
    data: appointments,
  });
}

// =====================
// POST (BOOK APPOINTMENT)
// =====================
export async function POST(req: NextRequest) {
  try {
    const body: IAppointment = await req.json();

    if (!body.patient || !body.doctor || !body.date || !body.time) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const appointments = await loadAppointments();

    // validate past date
    const appointmentDate = new Date(`${body.date}T${body.time}`);
    if (appointmentDate < new Date()) {
      return NextResponse.json(
        { message: "Cannot book in the past" },
        { status: 400 },
      );
    }

    // duplicate check
    const duplicated = appointments.find(
      (a) =>
        a.doctor === body.doctor &&
        a.date === body.date &&
        a.time === body.time &&
        a.status !== "cancelled",
    );

    if (duplicated) {
      return NextResponse.json(
        { message: "This slot is already booked" },
        { status: 409 },
      );
    }

    const appointment: IAppointment = {
      ...body,
      id: Date.now(),
      status: body.status ?? "booked",
    };

    const updated = [...appointments, appointment];

    await saveAppointments(updated);

    return NextResponse.json(
      {
        message: "Appointment booked successfully",
        data: appointment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal server error", error: String(error) },
      { status: 500 },
    );
  }
}
