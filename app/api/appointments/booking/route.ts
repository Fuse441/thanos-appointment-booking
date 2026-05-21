// app/api/appointments/route.ts

import { readJsonFile, writeJsonFile } from "@/helper/file.db";
import { IAppointment } from "@/schemas/appointment";
import { NextRequest, NextResponse } from "next/server";

// app/api/appointments/route.ts

const FILE_NAME = "/tmp/appointments.json";

// =====================
// GET
// =====================
export async function GET() {
  const appointments = readJsonFile<IAppointment[]>(FILE_NAME);

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

    const appointments = readJsonFile<IAppointment[]>(FILE_NAME);

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
    };

    appointments.push(appointment);

    writeJsonFile(FILE_NAME, appointments);

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
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
