// app/api/appointments/route.ts

import { IAppointment } from "@/schemas/appointment";
import { NextRequest, NextResponse } from "next/server";

let appointments: IAppointment[] = [];

export async function GET() {
  return NextResponse.json({
    data: appointments,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: IAppointment = await req.json();

    if (!body.patient) {
      return NextResponse.json(
        {
          message: "Patient is required",
        },
        { status: 400 },
      );
    }

    if (!body.doctor) {
      return NextResponse.json(
        {
          message: "Doctor is required",
        },
        { status: 400 },
      );
    }

    if (!body.date) {
      return NextResponse.json(
        {
          message: "Date is required",
        },
        { status: 400 },
      );
    }

    if (!body.time) {
      return NextResponse.json(
        {
          message: "Time is required",
        },
        { status: 400 },
      );
    }

    const appointmentDate = new Date(`${body.date}T${body.time}`);

    if (appointmentDate < new Date()) {
      return NextResponse.json(
        {
          message: "Cannot book in the past",
        },
        { status: 400 },
      );
    }

    const duplicated = appointments.find(
      (a) =>
        a.doctor === body.doctor &&
        a.date === body.date &&
        a.time === body.time &&
        a.status !== "cancelled",
    );

    if (duplicated) {
      return NextResponse.json(
        {
          message: "This slot is already booked",
        },
        { status: 409 },
      );
    }

    const appointment: IAppointment = {
      ...body,
      id: Date.now(),
    };

    appointments.push(appointment);

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
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
