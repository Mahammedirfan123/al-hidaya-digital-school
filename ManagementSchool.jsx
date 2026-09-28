"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit3,
  UserPlus
} from "lucide-react";
import { COLORS, th, td, inputStyle, primaryBtn, ghostBtn } from "@/lib/theme";
import {
  SUBJECTS,
  CLASSES,
  STUDENTS
} from "@/lib/data/seed";
import { Badge, Card, IconBtn, SectionHeading, StatusPill } from "@/components/ui/Primitives";

export function SchStudents() {
  const [q, setQ] = useState("");
  const list = STUDENTS.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <SectionHeading eyebrow="SCHOOL" title="Students" action={<button style={{ ...primaryBtn, padding: "9px 14px", display: "flex", gap: 6, alignItems: "center" }}><UserPlus size={14} /> Add student</button>} />
      <input style={{ ...inputStyle, marginBottom: 12, maxWidth: 300 }} placeholder="Search students…" value={q} onChange={(e) => setQ(e.target.value)} />
      <Card style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr><th style={th}>Student</th><th style={th}>Admission No.</th><th style={th}>Class</th><th style={th}>Van</th><th style={th}></th></tr></thead>
          <tbody>{list.map((s) => (
            <tr key={s.id} style={{ borderTop: `1px solid ${COLORS.line}` }}>
              <td style={td}>{s.photo} {s.name}</td><td style={td}>{s.admissionNo}</td><td style={td}>{s.cls}-{s.section}</td><td style={td}>{s.van || "—"}</td>
              <td style={td}><IconBtn Icon={Edit3} /></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}


export function SchParents({ ctx, setParents, setApprovals, toast }) {
  return (
    <div>
      <SectionHeading eyebrow="SCHOOL" title="Parents" />
      <Card style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr><th style={th}>Parent</th><th style={th}>Mobile</th><th style={th}>Children</th><th style={th}>Status</th></tr></thead>
          <tbody>{ctx.parents.map((p) => (
            <tr key={p.id} style={{ borderTop: `1px solid ${COLORS.line}` }}>
              <td style={td}>{p.name}</td><td style={td}>{p.mobile}</td>
              <td style={td}>{p.children.length ? p.children.map((c) => STUDENTS.find((s) => s.id === c)?.name).join(", ") : "—"}</td>
              <td style={td}><StatusPill status={p.status} /></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}


export function SchTeachers({ ctx, setTeachers, toast }) {
  return (
    <div>
      <SectionHeading eyebrow="SCHOOL" title="Teachers" action={<button style={{ ...primaryBtn, padding: "9px 14px", display: "flex", gap: 6, alignItems: "center" }}><UserPlus size={14} /> Add teacher</button>} />
      <Card style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr><th style={th}>Teacher</th><th style={th}>Employee ID</th><th style={th}>Subjects</th><th style={th}>Classes</th><th style={th}>Status</th></tr></thead>
          <tbody>{ctx.teachers.map((t) => (
            <tr key={t.id} style={{ borderTop: `1px solid ${COLORS.line}` }}>
              <td style={td}>{t.name}</td><td style={td}>{t.empId}</td><td style={td}>{t.subjects.join(", ")}</td><td style={td}>{t.classes.join(", ")}</td>
              <td style={td}><StatusPill status={t.status === "approved" ? "approved" : "pending"} /></td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}


export function SchClasses() {
  return (
    <div>
      <SectionHeading eyebrow="SCHOOL" title="Classes & Subjects" sub="Manage class structure and subject list" />
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>Classes</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{CLASSES.map((c) => <Badge key={c}>{c}</Badge>)}</div>
      </Card>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink }}>Subjects</div>
          <button style={{ ...ghostBtn, padding: "6px 11px", fontSize: 11.5, display: "flex", gap: 5, alignItems: "center" }}><Plus size={12} /> Add subject</button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{SUBJECTS.map((s) => <Badge key={s} color={COLORS.teal}>{s}</Badge>)}</div>
        <div style={{ fontSize: 11.5, color: COLORS.textMuted, marginTop: 10 }}>Subjects are configured here once and used throughout the platform — homework, exams, results and materials all read from this list.</div>
      </Card>
    </div>
  );
}

