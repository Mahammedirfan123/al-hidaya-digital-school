"use client";

import { COLORS, th, td, dangerBtn, successBtn } from "@/lib/theme";
import {
  TRANSPORT_ROUTES
} from "@/lib/data/seed";
import { Card, SectionHeading, StatBlock, StatusPill } from "@/components/ui/Primitives";

export function FinFeesMgmt({ ctx }) {
  return (
    <div>
      <SectionHeading eyebrow="FINANCE" title="Fees — overview" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 16 }}>
        <StatBlock label="Total billed" value="₹94.2L" color={COLORS.ink} /><StatBlock label="Collected" value="₹77.4L" color={COLORS.moss} />
        <StatBlock label="Pending" value="₹16.8L" color={COLORS.clay} /><StatBlock label="Collection rate" value="82%" color={COLORS.brass} />
      </div>
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.ink, marginBottom: 10 }}>Fee categories — school-wide</div>
        {["Tuition Fee", "Admission Fee", "Examination Fee", "Activity Fee", "Van Charge"].map((c, i) => (
          <div key={c} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${COLORS.line}`, fontSize: 13 }}>
            <span>{c}</span><span style={{ fontWeight: 700 }}>{85 - i * 3}% collected</span>
          </div>
        ))}
      </Card>
    </div>
  );
}


export function FinPaymentsMgmt({ ctx, setFeeCategories, setApprovals, toast }) {
  const pending = ctx.approvals.filter((a) => a.type === "Fee Approval");
  return (
    <div>
      <SectionHeading eyebrow="FINANCE" title="Payments — verification queue" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {pending.map((a) => (
          <Card key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{a.person}</div><div style={{ fontSize: 12, color: COLORS.textMuted }}>{a.details}</div></div>
            {a.status === "pending" ? (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setApprovals((prev) => prev.map((x) => x.id === a.id ? { ...x, status: "approved" } : x)); toast("Payment verified."); }} style={{ ...successBtn, padding: "7px 12px", fontSize: 12 }}>Verify</button>
                <button onClick={() => setApprovals((prev) => prev.map((x) => x.id === a.id ? { ...x, status: "rejected" } : x))} style={{ ...dangerBtn, padding: "7px 12px", fontSize: 12 }}>Reject</button>
              </div>
            ) : <StatusPill status={a.status === "approved" ? "verified" : a.status} />}
          </Card>
        ))}
      </div>
    </div>
  );
}


export function FinVanMgmt() {
  return (
    <div>
      <SectionHeading eyebrow="FINANCE" title="Van Charges — routes" />
      <Card style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr><th style={th}>Van</th><th style={th}>Route</th><th style={th}>Driver</th><th style={th}>Capacity</th><th style={th}>Assigned</th></tr></thead>
          <tbody>{TRANSPORT_ROUTES.map((r) => (
            <tr key={r.id} style={{ borderTop: `1px solid ${COLORS.line}` }}>
              <td style={td}>{r.van}</td><td style={td}>{r.route}</td><td style={td}>{r.driver}</td><td style={td}>{r.capacity}</td>
              <td style={td}>{r.assigned}/{r.capacity}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
    </div>
  );
}

