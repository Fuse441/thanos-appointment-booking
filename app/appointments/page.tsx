"use client";

import {
  Card,
  CardHeader,
  Chip,
  Switch,
  Input,
  Button,
  Separator,
} from "@heroui/react";

import { Clock3, Stethoscope, Building2 } from "lucide-react";

import { title } from "@/components/primitives";
import { api } from "@/helper/api.helper";
import { useEffect, useState } from "react";
import { IDoctor } from "@/schemas/doctor";
import { getNameOfDay } from "@/helper/date.helper";

const doctorSchedules = [
  {
    id: 1,
    doctor: "Dr. Sarah Johnson",
    department: "Cardiology",
    workingDay: "Monday",
    startTime: "08:00",
    endTime: "16:00",
    breakTime: "12:00 - 13:00",
    acceptsBooking: true,
  },
  {
    id: 2,
    doctor: "Dr. Michael Lee",
    department: "Neurology",
    workingDay: "Tuesday",
    startTime: "09:00",
    endTime: "17:00",
    breakTime: "13:00 - 14:00",
    acceptsBooking: false,
  },
  {
    id: 3,
    doctor: "Dr. Michael Lee",
    department: "Neurology",
    workingDay: "Tuesday",
    startTime: "09:00",
    endTime: "17:00",
    breakTime: "13:00 - 14:00",
    acceptsBooking: false,
  },
];

export default function AppointmentsPage() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDoctors] = await Promise.all([
          api<IDoctor[]>("/api/doctors"),
        ]);

        setDoctors(resDoctors.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={title()}>Doctor Schedule</h1>

          <p className="mt-2 text-sm text-default-500">
            Manage doctor working schedules and appointment availability.
          </p>
        </div>

        <Button>Add Schedule</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {doctors.map((doctor) => (
          <Card key={doctor.schedule.id}>
            <Card.Content className="flex flex-col gap-4">
              {/* Top */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {doctor.first_name} - {doctor.last_name}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-sm text-default-500">
                    <Building2 size={16} />

                    <span>{doctor.department_id}</span>
                  </div>
                </div>

                <Chip
                  color={doctor.schedule.acceptsBooking ? "success" : "danger"}
                >
                  {doctor.schedule.acceptsBooking
                    ? "Booking Open"
                    : "Unavailable"}
                </Chip>
              </div>

              <Separator />

              {/* Details */}
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Stethoscope className="text-default-500" size={16} />

                  <span>
                    Working Day:{" "}
                    <strong>{getNameOfDay(doctor.schedule.workingDay)}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 className="text-default-500" size={16} />
                  <span>
                    Working Hours:&nbsp;
                    <strong>
                      {doctor.schedule.startTime} - {doctor.schedule.endTime}
                    </strong>
                  </span>{" "}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 className="text-default-500" size={16} />

                  <span>
                    Break Time: <strong>{doctor.schedule.breakTime}</strong>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-2 flex justify-end gap-2">
                <Button size="sm">Edit</Button>

                <Button variant="danger" size="sm">
                  Disable
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}
