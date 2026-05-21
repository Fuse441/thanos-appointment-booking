import { IAppointmentType } from "@/schemas/appointment";
import { state } from "@/state/common_state";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  let appointmentType: IAppointmentType[] = state.appointmentsType || [];
  return NextResponse.json({ data: appointmentType });
}
