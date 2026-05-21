"use client";

import {
  Card,
  CardHeader,
  Chip,
  Switch,
  Input,
  Button,
  Separator,
  toast,
} from "@heroui/react";

import { Clock3, Stethoscope, Building2 } from "lucide-react";

import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { IDoctor } from "@/schemas/doctor";
import { api } from "@/helper/api.helper";
import { IDepartment } from "@/schemas/departments";

export default function SchedulePage() {
  const [doctorSchedules, setDoctorSchedules] = useState<IDoctor[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  useEffect(() => {
    const init = async () => {
      try {
        const [resDoctor, resDepartments] = await Promise.all([
          api<IDoctor[]>("/api/doctors"),
          api<IDepartment[]>("/api/departments"),
        ]);
        setDoctorSchedules(resDoctor.data ?? []);
        setDepartments(resDepartments.data ?? []);
      } catch (error) {
        console.error(error);

        toast.danger("โหลดข้อมูลเริ่มต้นไม่สำเร็จ");
      }
    };

    init();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={title()}>ตารางเวลาของแพทย์</h1>

          <p className="mt-2 text-start text-sm text-default-500">
            ข้อมูลตารางการทำงานและตารางนัดหมายของแพทย์{" "}
          </p>
        </div>

        {/* <Button>Add Schedule</Button> */}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {doctorSchedules.map((doctor) => (
          <Card key={doctor.id}>
            <Card.Content className="flex flex-col gap-4">
              {/* Top */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-start text-lg font-semibold">
                    {doctor.first_name} {doctor.last_name}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-sm text-default-500">
                    <Building2 size={16} />
                    {
                      departments.find((d) => d.id === doctor.department_id)
                        ?.name
                    }{" "}
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
                    Working Day: <strong>{doctor.schedule.workingDay}</strong>
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
                {/* <Button size="sm">Edit</Button> */}

                {/* <Button variant="danger" size="sm"> */}
                {/*   Disable */}
                {/* </Button> */}
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}
