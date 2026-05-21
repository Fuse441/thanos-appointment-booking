"use client";
import { APPOINTMENT_TYPES_DETAIL } from "@/config/appointmentType";
import { formatDuration } from "@/helper/date.helper";
import { AppointmentTypeRule } from "@/schemas/appointment";
import { useState } from "react";

function RuleBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${ok
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-gray-50 text-gray-400 border-gray-200 line-through"
        }`}
    >
      {ok ? "✓" : "✕"} {label}
    </span>
  );
}

function TypeCard({
  type,
  selected,
  onClick,
}: {
  type: AppointmentTypeRule;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 transition-all ${selected
        ? "border-[#1a4f8a] ring-2 ring-[#1a4f8a]/20 bg-blue-50/50"
        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
        }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl"> {type.icon} </span>
          <span className="font-medium text-sm text-gray-800">
            {" "}
            {type.name}{" "}
          </span>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${type.color}`}
        >
          {formatDuration(type.duration)}
        </span>
      </div>
      <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">
        {type.description}
      </p>
    </button>
  );
}

export default function AppointmentTypesSection() {
  const [selected, setSelected] = useState<AppointmentTypeRule>(
    APPOINTMENT_TYPES_DETAIL[0],
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">ประเภทการนัดหมาย</h2>
        <p className="mt-1 text-sm text-gray-500">
          แต่ละประเภทมีระยะเวลา เวลาเผื่อ และกฎการจองที่กำหนดไว้ล่วงหน้า
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Type list */}
        <div className="flex flex-col gap-3">
          {APPOINTMENT_TYPES_DETAIL.map((t) => (
            <TypeCard
              key={t.id}
              type={t}
              selected={selected.id === t.id}
              onClick={() => setSelected(t)}
            />
          ))}
        </div>

        {/* Right — Detail panel */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6">
          {/* Title row */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selected.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {selected.name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {selected.description}
              </p>
            </div>
          </div>

          {/* Duration & Buffer */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "ระยะเวลานัด",
                value: formatDuration(selected.duration),
                sub: "ต่อการนัดหมาย",
              },
              {
                label: "เวลาพักคิว",
                value: `${selected.buffer} นาที`,
                sub: "หลังการนัดหมาย",
              },
              {
                label: "จองล่วงหน้าขั้นต่ำ",
                value:
                  selected.advanceBookingMin === 0
                    ? "ภายในวันเดียวกัน"
                    : `${selected.advanceBookingMin} ชั่วโมง`,
                sub: "ก่อนเวลานัด",
              },
              {
                label: "จองล่วงหน้าสูงสุด",
                value: `${selected.advanceBookingMax} วัน`,
                sub: "ล่วงหน้าได้",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 rounded-xl p-3 flex flex-col gap-0.5"
              >
                <span className="text-xs text-gray-400 font-medium">
                  {item.label}
                </span>
                <span className="text-lg font-bold text-gray-800">
                  {item.value}
                </span>
                <span className="text-xs text-gray-400">{item.sub}</span>
              </div>
            ))}
          </div>

          {/* Behavior flags */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Behavior flags
            </p>
            <div className="flex flex-wrap gap-2">
              <RuleBadge
                ok={selected.allowSameDayBooking}
                label="จองภายในวันเดียวกัน"
              />
              <RuleBadge
                ok={selected.requiresPriorVisit}
                label="ต้องมีประวัติการเข้าพบก่อน"
              />
              <RuleBadge
                ok={selected.sameDocOnly}
                label="ต้องเป็นแพทย์คนเดิม"
              />
              <RuleBadge
                ok={selected.requiresConsentForm}
                label="ต้องมีใบยินยอม"
              />
              <RuleBadge
                ok={selected.requiresRoom}
                label="ต้องกำหนดห้องรักษา"
              />{" "}
            </div>
          </div>

          {/* Rules */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Booking rules
            </p>
            <ul className="flex flex-col gap-2">
              {selected.rules.map((rule, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span
                    className="mt-0.5 w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: selected.colorHex }}
                  >
                    {i + 1}
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Assumptions note */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
            <span className="font-semibold">Assumption: </span>
            {selected.id === "new-patient" &&
              "กำหนดระยะเวลา 60 นาทีเพื่อรองรับการซักประวัติผู้ป่วยอย่างละเอียด รวมถึงการตรวจเบื้องต้นและจัดทำข้อมูลทางการแพทย์ โดยมีเวลาพักคิว 10 นาทีสำหรับเตรียมห้องและอัปเดตเวชระเบียน"}
            {selected.id === "follow-up" &&
              "ใช้เวลาเพียง 20 นาทีเนื่องจากแพทย์มีข้อมูลและประวัติผู้ป่วยอยู่แล้ว การบังคับให้พบแพทย์คนเดิมช่วยให้การรักษามีความต่อเนื่อง"}
            {selected.id === "consultation" &&
              "ระยะเวลา 30 นาทีเพียงพอสำหรับการให้คำปรึกษาทั่วไป และไม่มีข้อจำกัดเรื่องแพทย์เพื่อรองรับการส่งต่อข้ามแผนกได้อย่างยืดหยุ่น"}
            {selected.id === "procedure" &&
              "กำหนดเวลา 90 นาทีเพื่อรองรับขั้นตอนเตรียมการ การทำหัตถการ และการสังเกตอาการเบื้องต้นหลังทำ โดยมีเวลาพักคิว 15 นาทีสำหรับทำความสะอาดห้องและเตรียมอุปกรณ์ใหม่"}{" "}
          </div>
        </div>
      </div>

      {/* Summary table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700">Summary</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                <th className="text-left px-5 py-3">ประเภทการนัด</th>
                <th className="text-center px-4 py-3">ระยะเวลา</th>
                <th className="text-center px-4 py-3">เวลาพักคิว</th>
                <th className="text-center px-4 py-3">จองวันเดียวกัน</th>
                <th className="text-center px-4 py-3">เคยเข้าพบมาก่อน</th>
                <th className="text-center px-4 py-3">ใบยินยอม</th>
                <th className="text-center px-4 py-3">ห้องรักษา</th>
              </tr>
            </thead>
            <tbody>
              {APPOINTMENT_TYPES_DETAIL.map((t, i) => (
                <tr
                  key={t.id}
                  className={`border-t border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selected.id === t.id ? "bg-blue-50/40" : ""
                    }`}
                  onClick={() => setSelected(t)}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span>{t.icon}</span>
                      <span className="font-medium text-gray-700">
                        {t.name}
                      </span>
                    </div>
                  </td>
                  <td className="text-center px-4 py-3 text-gray-600">
                    {formatDuration(t.duration)}
                  </td>
                  <td className="text-center px-4 py-3 text-gray-600">
                    {t.buffer} นาที
                  </td>
                  <td className="text-center px-4 py-3">
                    {t.allowSameDayBooking ? "✅" : "❌"}
                  </td>
                  <td className="text-center px-4 py-3">
                    {t.requiresPriorVisit ? "✅" : "—"}
                  </td>
                  <td className="text-center px-4 py-3">
                    {t.requiresConsentForm ? "✅" : "—"}
                  </td>
                  <td className="text-center px-4 py-3">
                    {t.requiresRoom ? "✅" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
