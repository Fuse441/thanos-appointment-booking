import { IDoctor } from "@/schemas/doctor";
import { state } from "@/state/common_state";
import { NextRequest, NextResponse } from "next/server";
let counter = state.doctors.length;
type Params = {
  params: Promise<{
    id: string;
  }>;
};
export async function GET() {
  return NextResponse.json({
    data: state.doctors,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body: Partial<IDoctor> = await req.json();

    // if (!body.employee_id) {
    //   return NextResponse.json(
    //     {
    //       message: "employee_id is required",
    //     },
    //     { status: 400 },
    //   );
    // }

    if (!body.first_name) {
      return NextResponse.json(
        {
          message: "first_name is required",
        },
        { status: 400 },
      );
    }

    if (!body.last_name) {
      return NextResponse.json(
        {
          message: "last_name is required",
        },
        { status: 400 },
      );
    }

    if (!body.department_id) {
      return NextResponse.json(
        {
          message: "department_id is required",
        },
        { status: 400 },
      );
    }

    if (!body.schedule) {
      return NextResponse.json(
        {
          message: "schedule is required",
        },
        { status: 400 },
      );
    }

    const duplicated = state.doctors.find(
      (d) =>
        d.employee_id === body.employee_id ||
        d.license_number === body.license_number,
    );

    if (duplicated) {
      return NextResponse.json(
        {
          message: "Doctor already exists",
        },
        { status: 409 },
      );
    }

    const doctor: IDoctor = {
      id: crypto.randomUUID(),

      employee_id: `${body.first_name}.${body.last_name.charAt(0).toUpperCase()}-${counter++}`,

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

      schedule: {
        id: body.schedule.id ?? crypto.randomUUID(),

        workingDay: body.schedule.workingDay ?? [],

        startTime: body.schedule.startTime ?? "08:00",

        endTime: body.schedule.endTime ?? "17:00",

        slotTimeworking: body.schedule.slotTimeworking ?? [],

        breakTime: body.schedule.breakTime ?? "12:00 - 13:00",

        acceptsBooking: body.schedule.acceptsBooking ?? true,
      },
    };

    state.doctors.push(doctor);

    return NextResponse.json(
      {
        message: "Doctor created successfully",
        data: doctor,
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
} // UPDATE doctor
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const body: Partial<IDoctor> = await req.json();

    const index = state.doctors.findIndex((d) => d.id === id && !d.deleted_at);

    if (index === -1) {
      return NextResponse.json(
        {
          error: "Doctor not found",
        },
        {
          status: 404,
        },
      );
    }

    state.doctors[index] = {
      ...state.doctors[index],
      ...body,
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      data: state.doctors[index],
      message: "Doctor updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid request body",
      },
      {
        status: 400,
      },
    );
  }
}

// SOFT DELETE doctor
export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params;

  const index = state.doctors.findIndex((d) => d.id === id && !d.deleted_at);

  if (index === -1) {
    return NextResponse.json(
      {
        error: "Doctor not found",
      },
      {
        status: 404,
      },
    );
  }

  state.doctors[index] = {
    ...state.doctors[index],
    deleted_at: new Date().toISOString(),
    is_active: false,
  };

  return NextResponse.json({
    message: "Doctor deleted successfully",
  });
}
