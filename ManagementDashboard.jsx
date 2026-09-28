"use client";

import {
  Users,
  GraduationCap,
  Wallet,
  ClipboardCheck,
  ShieldCheck,
  ListChecks
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { COLORS } from "@/lib/theme";
import {
  TEACHERS,
  STUDENTS,
  CLASS_COMPLETION,
  ATTENDANCE_BY_GRADE,
  FEE_COLLECTION,
  TEACHER_ACTIVITY
} from "@/lib/data/seed";
import { Card, StatBlock } from "@/components/ui/Primitives";

export function ManagementDashboard({ ctx, setPage }) {
  const pendingCount = ctx.approvals.filter((a) => a.status === "pending").length;
  const pieData = [
    { name: "Completed", value: 68, color: COLORS.moss },
    { name: "Pending", value: 24, color: COLORS.amber },
    { name: "Overdue", value: 8, color: COLORS.clay },
  ];
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, color: COLORS.ink, fontWeight: 600 }}>School at a Glance</div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 3 }}>Al Hidaya International School · Muthkur, Bengaluru</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 20 }}>
        <StatBlock label="Total Students" value={STUDENTS.length * 39} color={COLORS.ink} Icon={Users} />
        <StatBlock label="Total Teachers" value={TEACHERS.length + 32} color={COLORS.teal} Icon={GraduationCap} />
        <StatBlock label="Today's Attendance" value="93%" color={COLORS.moss} Icon={ClipboardCheck} />
        <StatBlock label="Fee Collection" value="82%" color={COLORS.brass} Icon={Wallet} />
        <StatBlock label="Pending Fees" value="₹4.1L" color={COLORS.clay} Icon={Wallet} />
        <StatBlock label="Homework Completion" value="88%" color={COLORS.moss} Icon={ListChecks} />
        <StatBlock label="Exam Eligibility" value="91% Eligible" color={COLORS.blue} Icon={ShieldCheck} />
        <StatBlock label="Pending Approvals" value={pendingCount} color={COLORS.amber} Icon={ShieldCheck} onClick={() => setPage("admin.approvals")} />
      </div>

      <div className="mgmt-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>Homework completion rate by grade</div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={CLASS_COMPLETION}>
              <CartesianGrid stroke={COLORS.line} vertical={false} />
              <XAxis dataKey="grade" tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={{ stroke: COLORS.line }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: COLORS.textMuted }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip /><Bar dataKey="rate" fill={COLORS.tealDeep} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>Submission status — school-wide</div>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart><Pie data={pieData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={76} paddingAngle={2}>{pieData.map((d, i) => <Cell key={i} fill={d.color} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, fontSize: 10.5, marginTop: 4, flexWrap: "wrap" }}>{pieData.map((d) => <span key={d.name} style={{ color: d.color, fontWeight: 700 }}>● {d.name}</span>)}</div>
        </Card>
      </div>
      <div className="mgmt-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>Attendance by grade</div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={ATTENDANCE_BY_GRADE}><CartesianGrid stroke={COLORS.line} vertical={false} /><XAxis dataKey="grade" tick={{ fontSize: 10.5, fill: COLORS.textMuted }} axisLine={{ stroke: COLORS.line }} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fontSize: 10.5, fill: COLORS.textMuted }} axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="rate" fill={COLORS.brass} radius={[4, 4, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>Fee collection trend</div>
          <ResponsiveContainer width="100%" height={190}>
            <LineChart data={FEE_COLLECTION}><CartesianGrid stroke={COLORS.line} vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 10.5, fill: COLORS.textMuted }} axisLine={{ stroke: COLORS.line }} tickLine={false} /><YAxis domain={[0, 100]} tick={{ fontSize: 10.5, fill: COLORS.textMuted }} axisLine={false} tickLine={false} /><Tooltip /><Line type="monotone" dataKey="collected" stroke={COLORS.tealDeep} strokeWidth={2.5} dot={{ r: 4 }} /></LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>Teacher activity</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={TEACHER_ACTIVITY} layout="vertical" margin={{ left: 6 }}>
            <CartesianGrid stroke={COLORS.line} horizontal={false} /><XAxis type="number" tick={{ fontSize: 10.5, fill: COLORS.textMuted }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: COLORS.ink }} axisLine={false} tickLine={false} width={86} />
            <Tooltip /><Bar dataKey="assigned" fill={COLORS.brass} radius={[0, 4, 4, 0]} /><Bar dataKey="reviewed" fill={COLORS.teal} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

