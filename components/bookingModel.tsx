import { IBookingModalProps } from "@/schemas/bookingModelProps";
import { useEffect, useState } from "react";
import { Field } from "./field";
import { TAppointmentStatus } from "@/schemas/appointment";
import { IDepartment } from "@/schemas/departments";
import { api } from "@/helper/api.helper";
import { state } from "@/state/common_state";
import { IDoctor } from "@/schemas/doctor";
import { randomBytes } from "crypto";
const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

export function BookingModal({
  initialDate,
  initialDoctors,
  initialTypes,
  onClose,
  onConfirm,
}: IBookingModalProps) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDoctor, resDepartments] = await Promise.all([
          api<IDoctor[]>("/api/doctors"),
          api<IDepartment[]>("/api/departments"),
        ]);
        console.log("Fetched doctors:", resDoctor.data);
        setDoctors(resDoctor.data ?? []);
        setDepartments(resDepartments.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [doctors, setDoctors] = useState<IDoctor[]>([]);

  const [dept, setDept] = useState("");
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState("09:00");
  const [type, setType] = useState("Consultation");
  const [status, setStatus] = useState<TAppointmentStatus>("confirmed");
  const [reason, setReason] = useState("");
  const [staff, setStaff] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);

  let nextId = 20;

  // Auto-fill department when doctor is selected
  const handleDoctorChange = (name: string) => {
    setDoctor(name);
    const found = initialDoctors?.find((d) => d.first_name === name);
    if (found) setDept(found.department_id);
  };

  const handleSubmit = () => {
    const errs: string[] = [];
    if (!patient.trim()) errs.push("Patient name is required.");
    if (!doctor) errs.push("Doctor is required.");
    if (!date) errs.push("Appointment date is required.");
    if (errs.length) {
      setErrors(errs);
      return;
    }

    onConfirm({
      id: nextId++,
      patient: patient.trim(),
      doctor,
      dept,
      date,
      time,
      type,
      status,
      reason: reason.trim() || undefined,
      staff: staff.trim(),
    });
    onClose();
  };

  const inputClass =
    "w-full text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    /* Overlay */
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center overflow-y-auto px-4 py-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            Book Appointment
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none px-1"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
              {errors.map((e, i) => (
                <p key={i}>{e}</p>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label="Patient Name">
              <input
                className={inputClass}
                placeholder="Enter patient name"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
              />
            </Field>
            <Field label="Department">
              <select
                className={inputClass}
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <option value="">Select department</option>
                {departments?.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Doctor">
              <select
                className={inputClass}
                value={doctor}
                onChange={(e) => handleDoctorChange(e.target.value)}
              >
                <option value="">Select doctor</option>
                {doctors
                  ?.filter((d) => d.department_id === dept || !dept)
                  .map((d) => (
                    <option key={d.id} value={d.id}>
                      {" "}
                      {d.first_name} — {d.last_name}
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Appointment Type">
              <select
                className={inputClass}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {initialTypes?.map((t) => <option key={t.id}>{t.name}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Appointment Date">
              <input
                type="date"
                className={inputClass}
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
              />{" "}
            </Field>
            <Field label="Appointment Time">
              <select
                className={inputClass}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                {doctors
                  .find((d) => d.id === doctor)
                  ?.schedule?.slotTimeworking.map((time, index) => (
                    <option key={`${time}-${index}`} value={time}>
                      {time}
                    </option>
                  ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select
                className={inputClass}
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as TAppointmentStatus)
                }
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </Field>
            <Field label="Created by (Staff)">
              <input
                className={inputClass}
                placeholder="Staff name or ID"
                value={staff}
                onChange={(e) => setStaff(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Reason for Visit (optional)">
            <textarea
              className={`${inputClass} resize-y min-h-[72px]`}
              placeholder="Describe symptoms or reason for visit…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm px-4 py-2 bg-[#1a4f8a] hover:bg-[#163f70] text-white rounded-lg font-medium transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
