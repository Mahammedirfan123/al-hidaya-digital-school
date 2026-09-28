"use client";

import React, { useState } from "react";
import {
  Plus,
  Download
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { COLORS, th, td, inputStyle, primaryBtn, successBtn } from "@/lib/theme";
import { fmtDate } from "@/lib/utils";
import {
  SUBJECTS,
  STUDENTS,
  ATTENDANCE_TODAY,
  EXAMS,
  ATTENDANCE_BY_GRADE
} from "@/lib/data/seed";
import { Badge, Card, Field, IconBtn, Modal, SectionHeading, StatBlock, StatusPill } from "@/components/ui/Primitives";

export function AcadAttendanceMgmt() {
  return (
    <div>
      <SectionHeading eyebrow="ACADEMICS" title="Attendance — school-wide" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 10, marginBottom: 16 }}>
        <StatBlock label="Present" value={ATTENDANCE_TODAY.present} color={COLORS.moss} />
        <StatBlock label="Absent" value={ATTENDANCE_TODAY.absent} color={COLORS.clay} />
        <StatBlock label="Late" value={ATTENDANCE_TODAY.late} color={COLORS.amber} />
        <StatBlock label="Leave" value={ATTENDANCE_TODAY.leave} color={COLORS.blue} />
      </div>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>Attendance by grade</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ATTENDANCE_BY_GRADE}><CartesianGrid stroke={COLORS.line} vertical={false} /><XAxis dataKey="grade" tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={{ stroke: COLORS.line }} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="rate" fill={COLORS.tealDeep} radius={[4, 4, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}


export function AcadHomeworkMgmt({ ctx }) {
  return (
    <div>
      <SectionHeading eyebrow="ACADEMICS" title="Homework — school-wide" />
      <Card style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr><th style={th}>Title</th><th style={th}>Subject</th><th style={th}>Class</th><th style={th}>Teacher</th><th style={th}>Due</th><th style={th}>Status</th></tr></thead>
          <tbody>{ctx.homework.map((h) => (
            <tr key={h.id} style={{ borderTop: `1px solid ${COLORS.line}` }}>
              <td style={td}>{h.title}</td><td style={td}>{h.subject}</td><td style={td}>{h.cls}-{h.section}</td><td style={td}>{h.teacher}</td><td style={td}>{fmtDate(h.due)}</td>
              <td style={td}><StatusPill status={h.draft ? "draft" : h.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}


export function AcadClassworkMgmt({ ctx }) {
  return (
    <div>
      <SectionHeading eyebrow="ACADEMICS" title="Classwork — school-wide" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ctx.lessons.map((l) => (
          <Card key={l.id} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div><div style={{ fontSize: 12, fontWeight: 700, color: COLORS.teal }}>{l.subject} · {l.cls}-{l.section} · {l.teacher}</div><div style={{ fontSize: 13.5, color: COLORS.ink, fontWeight: 600 }}>{l.topic}</div></div>
            <span style={{ fontSize: 11.5, color: COLORS.textMuted }}>{fmtDate(l.date)}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}


export function AcadExamsMgmt({ ctx, setExams, toast }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <SectionHeading eyebrow="ACADEMICS" title="Exams" action={<button onClick={() => setShow(true)} style={{ ...primaryBtn, padding: "9px 14px", display: "flex", gap: 6, alignItems: "center" }}><Plus size={14} /> Create exam</button>} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {EXAMS.map((ex) => (
          <Card key={ex.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div><div style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}>{ex.name}</div><div style={{ fontSize: 12, color: COLORS.textMuted }}>{fmtDate(ex.date)} · Max {ex.maxMarks} · Pass {ex.passMarks} · All subjects</div></div>
            <StatusPill status={ex.status === "published" ? "completed" : "upcoming"} />
          </Card>
        ))}
      </div>
      {show && (
        <Modal onClose={() => setShow(false)} width={440}>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: COLORS.ink, marginTop: 0 }}>Create examination</h3>
          <Field label="Exam name"><input style={inputStyle} placeholder="e.g. Periodic Test 3" /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Date"><input type="date" style={inputStyle} /></Field><Field label="Max marks"><input type="number" style={inputStyle} defaultValue={50} /></Field>
          </div>
          <Field label="Passing marks"><input type="number" style={inputStyle} defaultValue={18} /></Field>
          <Field label="Subjects included"><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{SUBJECTS.map((s) => <Badge key={s} color={COLORS.teal}>{s}</Badge>)}</div></Field>
          <button onClick={() => { setShow(false); toast("Examination created and scheduled."); }} style={{ ...primaryBtn, width: "100%" }}>Create exam</button>
        </Modal>
      )}
    </div>
  );
}


export function AcadMarksMgmt() {
  return (
    <div>
      <SectionHeading eyebrow="ACADEMICS" title="Marks — review & approve" />
      <Card style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr><th style={th}>Class</th><th style={th}>Subject</th><th style={th}>Exam</th><th style={th}>Entered by</th><th style={th}>Status</th><th style={th}></th></tr></thead>
          <tbody>
            {[["Grade 5-A", "Social Science", "Periodic Test 1", "Mr. Farooq", "approved"], ["Grade 5-A", "English", "Periodic Test 1", "Ms. Fernandes", "approved"],
              ["Grade 5-A", "Science", "Periodic Test 2", "Mrs. Pillai", "pending"], ["Grade 4-A", "Kannada", "Periodic Test 2", "Mrs. Shanthi", "pending"]].map((r, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${COLORS.line}` }}>
                <td style={td}>{r[0]}</td><td style={td}>{r[1]}</td><td style={td}>{r[2]}</td><td style={td}>{r[3]}</td>
                <td style={td}><StatusPill status={r[4]} /></td>
                <td style={td}>{r[4] === "pending" && <button style={{ ...successBtn, padding: "5px 10px", fontSize: 11 }}>Approve</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}


export function AcadReportCardsMgmt() {
  return (
    <div>
      <SectionHeading eyebrow="ACADEMICS" title="Report Cards" />
      <Card style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr><th style={th}>Student</th><th style={th}>Class</th><th style={th}>Term 1 status</th><th style={th}></th></tr></thead>
          <tbody>{STUDENTS.map((s, i) => (
            <tr key={s.id} style={{ borderTop: `1px solid ${COLORS.line}` }}>
              <td style={td}>{s.name}</td><td style={td}>{s.cls}-{s.section}</td>
              <td style={td}><StatusPill status={i % 3 === 0 ? "pending" : "published"} /></td>
              <td style={td}><IconBtn Icon={Download} /></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

