"use client";

import React, { useState } from "react";
import {
  Plus,
  X,
  User,
  Check,
  Download
} from "lucide-react";
import { COLORS, th, td, inputStyle, primaryBtn, ghostBtn, dangerBtn, successBtn } from "@/lib/theme";
import { fmtDate, uid } from "@/lib/utils";
import {
  CLASSES
} from "@/lib/data/seed";
import { Badge, Card, EmptyState, Field, IconBtn, Modal, SectionHeading, StatBlock, StatusPill } from "@/components/ui/Primitives";

export function AdminApprovals({ ctx, setApprovals, setTeachers, setParents, toast }) {
  const [filter, setFilter] = useState("pending");
  const list = ctx.approvals.filter((a) => filter === "all" || a.status === filter);
  const act = (a, status) => {
    setApprovals((prev) => prev.map((x) => x.id === a.id ? { ...x, status } : x));
    if (status === "approved") {
      if (a.type === "Teacher Account") setTeachers((prev) => prev.map((t) => a.person.includes(t.name) ? { ...t, status: "approved" } : t));
      if (a.type === "Parent Account") setParents((prev) => prev.map((p) => a.person.includes(p.name) ? { ...p, status: "approved" } : p));
      toast(`${a.type} approved for ${a.person}.`);
    } else if (status === "rejected") {
      toast(`${a.type} rejected for ${a.person}.`);
    } else {
      toast(`Clarification requested from ${a.submittedBy}.`);
    }
  };
  return (
    <div>
      <SectionHeading eyebrow="ADMINISTRATION" title="Approval Center" />
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {[["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"], ["all", "All"]].map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 700, cursor: "pointer", border: `1px solid ${filter === k ? COLORS.tealDeep : COLORS.line}`, background: filter === k ? COLORS.tealDeep : "#fff", color: filter === k ? "#fff" : COLORS.ink }}>{label}</button>
        ))}
      </div>
      {list.length === 0 && <EmptyState text="Nothing here." />}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((a) => (
          <Card key={a.id}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
              <Badge color={COLORS.brass}>{a.type}</Badge><StatusPill status={a.status} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{a.person}</div>
            <div style={{ fontSize: 12.5, color: COLORS.textMuted, marginTop: 2 }}>Submitted by {a.submittedBy} · {fmtDate(a.date)}</div>
            <div style={{ fontSize: 13, color: "#3A362B", marginTop: 6 }}>{a.details}</div>
            {a.status === "pending" && (
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <button onClick={() => act(a, "approved")} style={{ ...successBtn, padding: "7px 12px", fontSize: 12, display: "flex", gap: 5, alignItems: "center" }}><Check size={12} /> Approve</button>
                <button onClick={() => act(a, "rejected")} style={{ ...dangerBtn, padding: "7px 12px", fontSize: 12, display: "flex", gap: 5, alignItems: "center" }}><X size={12} /> Reject</button>
                <button onClick={() => act(a, "pending")} style={{ ...ghostBtn, padding: "7px 12px", fontSize: 12 }}>Request Clarification</button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}


export function AdminMeetings({ ctx, setParentMeetings, toast }) {
  const [show, setShow] = useState(false);
  const attended = ctx.parentMeetings.reduce((s, m) => s + (m.attended || 0), 0);
  const invited = ctx.parentMeetings.reduce((s, m) => s + m.invited, 0);
  const rate = invited ? Math.round((attended / invited) * 100) : 0;
  return (
    <div>
      <SectionHeading eyebrow="ADMINISTRATION" title="Parent Meetings" action={<button onClick={() => setShow(true)} style={{ ...primaryBtn, padding: "9px 14px", display: "flex", gap: 6, alignItems: "center" }}><Plus size={14} /> Schedule meeting</button>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 16 }}>
        <StatBlock label="Total invited" value={invited} color={COLORS.ink} /><StatBlock label="Attended" value={attended} color={COLORS.moss} />
        <StatBlock label="Attendance rate" value={`${rate}%`} color={COLORS.brass} /><StatBlock label="Follow-ups pending" value={1} color={COLORS.clay} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ctx.parentMeetings.map((m) => (
          <Card key={m.id} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{m.title}</div><div style={{ fontSize: 12, color: COLORS.textMuted }}>{fmtDate(m.date)} · Invited {m.invited}{m.attended ? ` · Attended ${m.attended}` : ""}</div></div>
            <StatusPill status={m.status === "upcoming" ? "upcoming" : "completed"} />
          </Card>
        ))}
      </div>
      {show && (
        <Modal onClose={() => setShow(false)} width={420}>
          <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: COLORS.ink, marginTop: 0 }}>Schedule parent meeting</h3>
          <Field label="Title"><input style={inputStyle} placeholder="e.g. Term 2 Progress Meeting" /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}><Field label="Date"><input type="date" style={inputStyle} /></Field><Field label="Time"><input type="time" style={inputStyle} /></Field></div>
          <Field label="Class"><select style={inputStyle}>{CLASSES.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <button onClick={() => { setParentMeetings((prev) => [{ id: uid("pm"), date: "2026-10-05", time: "10:00 AM", title: "New Parent Meeting", invited: 31, attended: 0, status: "upcoming" }, ...prev]); setShow(false); toast("Meeting scheduled and parents notified."); }} style={{ ...primaryBtn, width: "100%" }}>Schedule</button>
        </Modal>
      )}
    </div>
  );
}


export function AdminSuggestions({ ctx, setSuggestions, toast }) {
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const list = ctx.suggestions.filter((s) => (filterRole === "all" || s.role === filterRole) && (filterStatus === "all" || s.status === filterStatus));
  const counts = {
    total: ctx.suggestions.length,
    new: ctx.suggestions.filter((s) => s.status === "Submitted").length,
    review: ctx.suggestions.filter((s) => s.status === "Under Review").length,
    progress: ctx.suggestions.filter((s) => s.status === "In Progress").length,
    implemented: ctx.suggestions.filter((s) => s.status === "Implemented").length,
  };
  const advance = (id) => {
    const order = ["Submitted", "Under Review", "In Progress", "Implemented", "Closed"];
    setSuggestions((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      const idx = order.indexOf(s.status);
      return { ...s, status: order[Math.min(idx + 1, order.length - 1)] };
    }));
    toast("Suggestion status updated.");
  };
  return (
    <div>
      <SectionHeading eyebrow="ADMINISTRATION" title="Suggestions & Feedback" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(100px,1fr))", gap: 10, marginBottom: 16 }}>
        <StatBlock label="Total" value={counts.total} color={COLORS.ink} /><StatBlock label="New" value={counts.new} color={COLORS.blue} />
        <StatBlock label="Under review" value={counts.review} color={COLORS.amber} /><StatBlock label="In progress" value={counts.progress} color={COLORS.brass} />
        <StatBlock label="Implemented" value={counts.implemented} color={COLORS.moss} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <select style={{ ...inputStyle, width: "auto" }} value={filterRole} onChange={(e) => setFilterRole(e.target.value)}><option value="all">All roles</option><option value="parent">Parents</option><option value="teacher">Teachers</option></select>
        <select style={{ ...inputStyle, width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option value="all">All statuses</option>{["Submitted", "Under Review", "In Progress", "Implemented", "Closed"].map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map((s) => (
          <Card key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 6 }}><Badge color={s.role === "parent" ? COLORS.teal : COLORS.brass}>{s.category}</Badge><StatusPill status={s.status} /></div>
            <div style={{ fontSize: 13, color: "#3A362B" }}>{s.text}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{s.anonymous ? "Anonymous" : s.from} · {fmtDate(s.date)}</span>
              {s.status !== "Closed" && s.status !== "Implemented" && <button onClick={() => advance(s.id)} style={{ ...ghostBtn, padding: "5px 10px", fontSize: 11 }}>Advance status →</button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


export function AdminReports() {
  const reports = ["Attendance report", "Fee report", "Transport report", "Homework report", "Academic report", "Exam report", "Internal marks report", "Parent meeting report", "Teacher activity report", "Suggestion report", "Student report"];
  return (
    <div>
      <SectionHeading eyebrow="ADMINISTRATION" title="Reports" sub="Generate and export school reports" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
        {reports.map((r) => (
          <Card key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink }}>{r}</span><IconBtn Icon={Download} />
          </Card>
        ))}
      </div>
    </div>
  );
}


export function AdminAudit({ ctx }) {
  return (
    <div>
      <SectionHeading eyebrow="ADMINISTRATION" title="Audit Logs" />
      <Card style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr><th style={th}>User</th><th style={th}>Action</th><th style={th}>Date</th><th style={th}>Time</th></tr></thead>
          <tbody>{ctx.auditLog.map((a) => (
            <tr key={a.id} style={{ borderTop: `1px solid ${COLORS.line}` }}><td style={td}>{a.user}</td><td style={td}>{a.action}</td><td style={td}>{fmtDate(a.date)}</td><td style={td}>{a.time}</td></tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

/* =========================== GLOBAL SEARCH =========================== */

