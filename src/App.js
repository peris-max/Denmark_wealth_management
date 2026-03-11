import { useState, useEffect, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar,
} from "recharts";

/* ─── Design Tokens ──────────────────────────────────────── */
const T = {
  gold: "#C9A050",
  goldLight: "#E8C97A",
  goldDim: "#C9A05033",
  bg: "#080810",
  surface: "#10101e",
  surfaceHigh: "#16162a",
  border: "#C9A05018",
  borderMid: "#C9A05033",
  text: "#EDE8DF",
  muted: "#7a7a9a",
  green: "#4CAF82",
  red: "#E05C6A",
  blue: "#4A8FD4",
  purple: "#9B7FD4",
};

const ALLOC_COLORS = [T.gold, T.green, T.blue, T.purple, "#E09050"];
const SP500 = [1.8, 0.6, 3.2, 2.1, 1.4, 2.9];

/* ─── Data ───────────────────────────────────────────────── */
const CLIENTS = [
  {
    id: 1,
    name: "Eleanor Harrington",
    initials: "EH",
    age: 58,
    riskProfile: "Conservative",
    totalAUM: 2_400_000,
    goalLabel: "Retirement Income",
    goalTarget: 3_000_000,
    goalCurrent: 2_400_000,
    allocation: [
      { name: "Bonds", value: 55 },
      { name: "Equities", value: 25 },
      { name: "Real Estate", value: 10 },
      { name: "Cash", value: 10 },
    ],
    performance: [
      { month: "Jan", return: 1.2, bench: 1.8 },
      { month: "Feb", return: 0.8, bench: 0.6 },
      { month: "Mar", return: 1.5, bench: 3.2 },
      { month: "Apr", return: 0.9, bench: 2.1 },
      { month: "May", return: 1.1, bench: 1.4 },
      { month: "Jun", return: 1.3, bench: 2.9 },
    ],
    health: {
      diversification: 82,
      riskAlignment: 91,
      liquidity: 78,
      growth: 44,
      esgScore: 70,
    },
    alerts: ["Bond duration risk elevated", "Consider inflation-linked bonds"],
    nextReview: "Apr 15, 2026",
    advisor: "James R.",
  },
  {
    id: 2,
    name: "Marcus Osei",
    initials: "MO",
    age: 38,
    riskProfile: "Aggressive",
    totalAUM: 850_000,
    goalLabel: "Early Retirement",
    goalTarget: 2_000_000,
    goalCurrent: 850_000,
    allocation: [
      { name: "Equities", value: 70 },
      { name: "Bonds", value: 10 },
      { name: "Alternatives", value: 15 },
      { name: "Cash", value: 5 },
    ],
    performance: [
      { month: "Jan", return: 3.4, bench: 1.8 },
      { month: "Feb", return: -1.2, bench: 0.6 },
      { month: "Mar", return: 4.1, bench: 3.2 },
      { month: "Apr", return: 2.8, bench: 2.1 },
      { month: "May", return: -0.5, bench: 1.4 },
      { month: "Jun", return: 3.9, bench: 2.9 },
    ],
    health: {
      diversification: 55,
      riskAlignment: 88,
      liquidity: 65,
      growth: 94,
      esgScore: 52,
    },
    alerts: [
      "Concentration risk: >70% equities",
      "Rebalance alternatives target",
    ],
    nextReview: "May 22, 2026",
    advisor: "Sarah K.",
  },
  {
    id: 3,
    name: "Sofia Lundgren",
    initials: "SL",
    age: 47,
    riskProfile: "Moderate",
    totalAUM: 1_600_000,
    goalLabel: "Kids College + Retirement",
    goalTarget: 2_500_000,
    goalCurrent: 1_600_000,
    allocation: [
      { name: "Equities", value: 45 },
      { name: "Bonds", value: 35 },
      { name: "Real Estate", value: 15 },
      { name: "Cash", value: 5 },
    ],
    performance: [
      { month: "Jan", return: 2.1, bench: 1.8 },
      { month: "Feb", return: 1.4, bench: 0.6 },
      { month: "Mar", return: 2.8, bench: 3.2 },
      { month: "Apr", return: 1.7, bench: 2.1 },
      { month: "May", return: 0.9, bench: 1.4 },
      { month: "Jun", return: 2.3, bench: 2.9 },
    ],
    health: {
      diversification: 88,
      riskAlignment: 85,
      liquidity: 72,
      growth: 68,
      esgScore: 80,
    },
    alerts: [],
    nextReview: "Jun 1, 2026",
    advisor: "James R.",
  },
  {
    id: 4,
    name: "Raj Patel",
    initials: "RP",
    age: 52,
    riskProfile: "Moderate",
    totalAUM: 3_200_000,
    goalLabel: "Wealth Preservation",
    goalTarget: 4_000_000,
    goalCurrent: 3_200_000,
    allocation: [
      { name: "Equities", value: 40 },
      { name: "Bonds", value: 30 },
      { name: "Real Estate", value: 20 },
      { name: "Alternatives", value: 10 },
    ],
    performance: [
      { month: "Jan", return: 1.9, bench: 1.8 },
      { month: "Feb", return: 1.1, bench: 0.6 },
      { month: "Mar", return: 2.4, bench: 3.2 },
      { month: "Apr", return: 2.0, bench: 2.1 },
      { month: "May", return: 1.5, bench: 1.4 },
      { month: "Jun", return: 2.1, bench: 2.9 },
    ],
    health: {
      diversification: 90,
      riskAlignment: 83,
      liquidity: 68,
      growth: 62,
      esgScore: 75,
    },
    alerts: ["Real estate illiquidity: review in Q3"],
    nextReview: "Jul 10, 2026",
    advisor: "Sarah K.",
  },
];

/* ─── Helpers ─────────────────────────────────────────────── */
const fmt = (v) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(2)}M`
    : `$${(v / 1000).toFixed(0)}K`;
const avgRet = (c) =>
  (
    c.performance.reduce((s, p) => s + p.return, 0) / c.performance.length
  ).toFixed(2);
const healthScore = (c) =>
  Math.round(
    Object.values(c.health).reduce((a, b) => a + b, 0) /
      Object.keys(c.health).length
  );

const riskColor = { Conservative: T.blue, Moderate: T.gold, Aggressive: T.red };
const riskBg = {
  Conservative: T.blue + "22",
  Moderate: T.gold + "22",
  Aggressive: T.red + "22",
};

/* ─── Sub-components ─────────────────────────────────────── */

function ScoreRing({ score, size = 80, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? T.green : score >= 60 ? T.gold : T.red;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={T.border}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        fill={color}
        fontSize={size * 0.22}
        fontWeight="700"
        style={{
          transform: "rotate(90deg)",
          transformOrigin: "center",
          fontFamily: "Georgia",
        }}
      >
        {score}
      </text>
    </svg>
  );
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div
      style={{
        background: T.surfaceHigh,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: "18px 22px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 16,
          fontSize: 20,
          opacity: 0.15,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 10,
          color: T.muted,
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || T.text }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{sub}</div>
      )}
    </div>
  );
}

function AlertBadge({ text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: T.red + "15",
        border: `1px solid ${T.red}33`,
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 12,
        color: "#f0a0a8",
      }}
    >
      <span style={{ color: T.red }}>⚠</span> {text}
    </div>
  );
}

function GoalBar({ label, current, target }) {
  const pct = Math.min((current / target) * 100, 100).toFixed(1);
  const color = pct >= 80 ? T.green : pct >= 50 ? T.gold : T.blue;
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
          fontSize: 13,
        }}
      >
        <span style={{ color: T.text }}>{label}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div
        style={{
          background: T.surface,
          borderRadius: 6,
          height: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            borderRadius: 6,
            transition: "width 1s ease",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
          fontSize: 11,
          color: T.muted,
        }}
      >
        <span>{fmt(current)} saved</span>
        <span>Goal: {fmt(target)}</span>
      </div>
    </div>
  );
}

/* ─── Main App ───────────────────────────────────────────── */
export default function App() {
  const [clients, setClients] = useState(CLIENTS);
  const [sel, setSel] = useState(CLIENTS[0]);
  const [tab, setTab] = useState("overview");
  const [view, setView] = useState("client"); // "client" | "firm"
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    riskProfile: "Moderate",
    totalAUM: "",
    goal: "",
  });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, [sel]);
  useEffect(() => {
    setAnimated(false);
    setTab("overview");
  }, [sel.id]);

  const totalAUM = clients.reduce((s, c) => s + c.totalAUM, 0);
  const avgHealth = Math.round(
    clients.reduce((s, c) => s + healthScore(c), 0) / clients.length
  );
  const alertCount = clients.reduce((s, c) => s + c.alerts.length, 0);

  const firmByRisk = ["Conservative", "Moderate", "Aggressive"].map((r) => ({
    name: r,
    value:
      clients
        .filter((c) => c.riskProfile === r)
        .reduce((s, c) => s + c.totalAUM, 0) / 1_000_000,
  }));

  const addClient = () => {
    if (!form.name || !form.totalAUM) return;
    const c = {
      id: Date.now(),
      name: form.name,
      initials: form.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      age: parseInt(form.age) || 40,
      riskProfile: form.riskProfile,
      totalAUM: parseFloat(form.totalAUM) * 1000,
      goalLabel: form.goal || "Wealth Building",
      goalTarget: parseFloat(form.totalAUM) * 2000,
      goalCurrent: parseFloat(form.totalAUM) * 1000,
      allocation: [
        { name: "Equities", value: 50 },
        { name: "Bonds", value: 30 },
        { name: "Cash", value: 20 },
      ],
      performance: SP500.map((b, i) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
        return: +(b * 0.8 + Math.random() * 0.5).toFixed(2),
        bench: b,
      })),
      health: {
        diversification: 70,
        riskAlignment: 75,
        liquidity: 80,
        growth: 65,
        esgScore: 60,
      },
      alerts: ["Portfolio recently created — awaiting first review"],
      nextReview: "Aug 1, 2026",
      advisor: "James R.",
    };
    const updated = [...clients, c];
    setClients(updated);
    setSel(c);
    setShowAdd(false);
    setForm({
      name: "",
      age: "",
      riskProfile: "Moderate",
      totalAUM: "",
      goal: "",
    });
  };

  const radarData = Object.entries(sel.health).map(([k, v]) => ({
    subject: {
      diversification: "Diversif.",
      riskAlignment: "Risk Align",
      liquidity: "Liquidity",
      growth: "Growth",
      esgScore: "ESG",
    }[k],
    value: v,
    fullMark: 100,
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.text,
        fontFamily: "'Georgia', 'Palatino', serif",
        backgroundImage: `radial-gradient(ellipse at 20% 0%, #1a1a3a 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, #0a1a2a 0%, transparent 60%)`,
      }}
    >
      {/* ── TOP NAV ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: `1px solid ${T.borderMid}`,
          background: "rgba(8,8,16,0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 900,
              color: T.bg,
            }}
          >
            W
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 0.5 }}>
              WealthOS
            </div>
            <div
              style={{
                fontSize: 10,
                color: T.muted,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Portfolio Manager
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {["client", "firm"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                background: view === v ? T.goldDim : "transparent",
                border: `1px solid ${view === v ? T.gold : T.border}`,
                color: view === v ? T.gold : T.muted,
                padding: "7px 18px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 12,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {v === "client" ? "Client View" : "Firm Overview"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 10,
                color: T.muted,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Total AUM
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: T.gold }}>
              {fmt(totalAUM)}
            </div>
          </div>
          {alertCount > 0 && (
            <div
              style={{
                background: T.red + "20",
                border: `1px solid ${T.red}44`,
                borderRadius: 20,
                padding: "4px 12px",
                fontSize: 12,
                color: T.red,
              }}
            >
              ⚠ {alertCount} alert{alertCount > 1 ? "s" : ""}
            </div>
          )}
          <button
            onClick={() => setShowAdd(true)}
            style={{
              background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
              color: T.bg,
              border: "none",
              padding: "9px 20px",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 12,
              letterSpacing: 1,
              fontFamily: "inherit",
              textTransform: "uppercase",
            }}
          >
            + Add Client
          </button>
        </div>
      </div>

      {/* ── FIRM VIEW ── */}
      {view === "firm" && (
        <div style={{ padding: "32px 36px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
            Firm Analytics
          </div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 28 }}>
            Portfolio-wide performance and distribution
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <StatCard
              label="Total AUM"
              value={fmt(totalAUM)}
              sub={`${clients.length} clients`}
              color={T.gold}
              icon="💼"
            />
            <StatCard
              label="Avg Health Score"
              value={`${avgHealth}/100`}
              sub="Across all portfolios"
              color={T.green}
              icon="📊"
            />
            <StatCard
              label="Active Alerts"
              value={alertCount}
              sub="Need attention"
              color={alertCount > 0 ? T.red : T.green}
              icon="🔔"
            />
            <StatCard
              label="Avg Monthly Return"
              value={`${(
                clients.reduce((s, c) => s + parseFloat(avgRet(c)), 0) /
                clients.length
              ).toFixed(2)}%`}
              sub="Last 6 months"
              color={T.blue}
              icon="📈"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
          >
            <div
              style={{
                background: T.surfaceHigh,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: T.muted,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                AUM by Risk Tier ($M)
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={firmByRisk} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: T.muted, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: T.muted, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: T.surface,
                      border: `1px solid ${T.borderMid}`,
                      borderRadius: 8,
                      color: T.text,
                    }}
                    formatter={(v) => [`$${v.toFixed(2)}M`]}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {firmByRisk.map((e, i) => (
                      <Cell key={i} fill={Object.values(riskColor)[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div
              style={{
                background: T.surfaceHigh,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: T.muted,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Client Roster
              </div>
              {clients.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSel(c);
                    setView("client");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: `1px solid ${T.border}`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${
                          riskColor[c.riskProfile]
                        }44, ${riskColor[c.riskProfile]}22)`,
                        border: `1px solid ${riskColor[c.riskProfile]}55`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        color: riskColor[c.riskProfile],
                      }}
                    >
                      {c.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 11, color: T.muted }}>
                        {c.riskProfile}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, color: T.gold }}>
                      {fmt(c.totalAUM)}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: healthScore(c) >= 80 ? T.green : T.gold,
                      }}
                    >
                      Score: {healthScore(c)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CLIENT VIEW ── */}
      {view === "client" && (
        <div style={{ display: "flex", flex: 1 }}>
          {/* Sidebar */}
          <div
            style={{
              width: 240,
              background: T.surface,
              borderRight: `1px solid ${T.border}`,
              padding: "20px 0",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: "0 14px 16px",
                fontSize: 10,
                color: T.muted,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Clients
            </div>
            {clients.map((c) => (
              <div
                key={c.id}
                onClick={() => setSel(c)}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderLeft:
                    sel.id === c.id
                      ? `3px solid ${T.gold}`
                      : "3px solid transparent",
                  background: sel.id === c.id ? T.surfaceHigh : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background:
                        sel.id === c.id
                          ? `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`
                          : `${riskColor[c.riskProfile]}22`,
                      border: `1px solid ${
                        sel.id === c.id
                          ? T.gold
                          : riskColor[c.riskProfile] + "55"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: sel.id === c.id ? T.bg : riskColor[c.riskProfile],
                    }}
                  >
                    {c.initials}
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, color: T.gold }}>
                      {fmt(c.totalAUM)}
                    </div>
                  </div>
                </div>
                {c.alerts.length > 0 && (
                  <div
                    style={{
                      marginTop: 6,
                      marginLeft: 44,
                      fontSize: 10,
                      color: T.red,
                    }}
                  >
                    ⚠ {c.alerts.length} alert{c.alerts.length > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Main */}
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
            {/* Client header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
                paddingBottom: 24,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${T.gold}44, ${T.gold}22)`,
                    border: `2px solid ${T.gold}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    color: T.gold,
                  }}
                >
                  {sel.initials}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
                    {sel.name}
                  </h2>
                  <div
                    style={{
                      marginTop: 5,
                      display: "flex",
                      gap: 12,
                      fontSize: 12,
                      color: T.muted,
                      alignItems: "center",
                    }}
                  >
                    <span>Age {sel.age}</span>
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: T.muted,
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        color: riskColor[sel.riskProfile],
                        background: riskBg[sel.riskProfile],
                        padding: "2px 8px",
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {sel.riskProfile}
                    </span>
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: T.muted,
                        display: "inline-block",
                      }}
                    />
                    <span>Advisor: {sel.advisor}</span>
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: T.muted,
                        display: "inline-block",
                      }}
                    />
                    <span>Next review: {sel.nextReview}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <ScoreRing score={healthScore(sel)} size={72} />
                  <div
                    style={{
                      fontSize: 10,
                      color: T.muted,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginTop: 4,
                    }}
                  >
                    Health
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: T.muted,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    AUM
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: T.gold }}>
                    {fmt(sel.totalAUM)}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: parseFloat(avgRet(sel)) >= 1.5 ? T.green : T.gold,
                    }}
                  >
                    {parseFloat(avgRet(sel)) >= 1.5 ? "▲" : "▼"} {avgRet(sel)}%
                    avg / mo
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {sel.alerts.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 24,
                  flexWrap: "wrap",
                }}
              >
                {sel.alerts.map((a, i) => (
                  <AlertBadge key={i} text={a} />
                ))}
              </div>
            )}

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 2,
                marginBottom: 24,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              {["overview", "allocation", "performance", "health", "goals"].map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "9px 18px",
                      color: tab === t ? T.gold : T.muted,
                      fontWeight: tab === t ? 700 : 400,
                      borderBottom: `2px solid ${
                        tab === t ? T.gold : "transparent"
                      }`,
                      cursor: "pointer",
                      fontSize: 12,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      fontFamily: "inherit",
                      marginBottom: -1,
                      transition: "color 0.15s",
                    }}
                  >
                    {t}
                  </button>
                )
              )}
            </div>

            {/* Overview */}
            {tab === "overview" && (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 14,
                    marginBottom: 20,
                  }}
                >
                  <StatCard
                    label="Portfolio Value"
                    value={fmt(sel.totalAUM)}
                    sub="Total AUM"
                    color={T.gold}
                    icon="💼"
                  />
                  <StatCard
                    label="Avg Monthly Return"
                    value={`${avgRet(sel)}%`}
                    sub="Last 6 months"
                    color={T.green}
                    icon="📈"
                  />
                  <StatCard
                    label="Health Score"
                    value={`${healthScore(sel)}/100`}
                    sub="Portfolio wellness"
                    color={healthScore(sel) >= 80 ? T.green : T.gold}
                    icon="🏥"
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  <StatCard
                    label="Asset Classes"
                    value={sel.allocation.length}
                    sub="Diversification"
                    color={T.blue}
                    icon="🧩"
                  />
                  <StatCard
                    label="Active Alerts"
                    value={sel.alerts.length}
                    sub={
                      sel.alerts.length === 0 ? "All clear ✓" : "Review needed"
                    }
                    color={sel.alerts.length === 0 ? T.green : T.red}
                    icon="🔔"
                  />
                </div>
              </div>
            )}

            {/* Allocation */}
            {tab === "allocation" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    background: T.surfaceHigh,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: T.muted,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      marginBottom: 16,
                    }}
                  >
                    Asset Mix
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={sel.allocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        dataKey="value"
                        paddingAngle={4}
                      >
                        {sel.allocation.map((_, i) => (
                          <Cell
                            key={i}
                            fill={ALLOC_COLORS[i % ALLOC_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: T.surface,
                          border: `1px solid ${T.borderMid}`,
                          borderRadius: 8,
                          color: T.text,
                        }}
                        formatter={(v) => [`${v}%`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div
                  style={{
                    background: T.surfaceHigh,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: T.muted,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      marginBottom: 16,
                    }}
                  >
                    Breakdown & Value
                  </div>
                  {sel.allocation.map((a, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 5,
                          fontSize: 13,
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: ALLOC_COLORS[i],
                              display: "inline-block",
                            }}
                          />
                          {a.name}
                        </span>
                        <span
                          style={{ color: ALLOC_COLORS[i], fontWeight: 700 }}
                        >
                          {a.value}%
                        </span>
                      </div>
                      <div
                        style={{
                          background: T.surface,
                          borderRadius: 4,
                          height: 5,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${a.value}%`,
                            height: "100%",
                            background: ALLOC_COLORS[i],
                            borderRadius: 4,
                            transition: "width 0.8s ease",
                          }}
                        />
                      </div>
                      <div
                        style={{ fontSize: 11, color: T.muted, marginTop: 3 }}
                      >
                        {fmt((sel.totalAUM * a.value) / 100)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance */}
            {tab === "performance" && (
              <div>
                <div
                  style={{
                    background: T.surfaceHigh,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: 24,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: T.muted,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Monthly Returns vs S&P 500 Benchmark
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 20,
                      marginBottom: 16,
                      fontSize: 12,
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          width: 20,
                          height: 2,
                          background: T.gold,
                          display: "inline-block",
                          borderRadius: 2,
                        }}
                      />{" "}
                      {sel.name.split(" ")[0]}
                    </span>
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          width: 20,
                          height: 2,
                          background: T.muted,
                          display: "inline-block",
                          borderRadius: 2,
                          borderTop: `2px dashed ${T.muted}`,
                        }}
                      />{" "}
                      S&P 500
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={sel.performance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff07" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: T.muted, fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: T.muted, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: T.surface,
                          border: `1px solid ${T.borderMid}`,
                          borderRadius: 8,
                          color: T.text,
                        }}
                        formatter={(v) => [`${v}%`]}
                      />
                      <Line
                        type="monotone"
                        dataKey="return"
                        stroke={T.gold}
                        strokeWidth={2.5}
                        dot={{ fill: T.gold, r: 4 }}
                        name="Client"
                      />
                      <Line
                        type="monotone"
                        dataKey="bench"
                        stroke={T.muted}
                        strokeWidth={1.5}
                        strokeDasharray="5 4"
                        dot={false}
                        name="S&P 500"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: 14,
                  }}
                >
                  {[
                    {
                      label: "Best Month",
                      value: `${Math.max(
                        ...sel.performance.map((p) => p.return)
                      )}%`,
                      color: T.green,
                    },
                    {
                      label: "Worst Month",
                      value: `${Math.min(
                        ...sel.performance.map((p) => p.return)
                      )}%`,
                      color: T.red,
                    },
                    {
                      label: "vs Benchmark",
                      value: `${(
                        parseFloat(avgRet(sel)) -
                        SP500.reduce((a, b) => a + b, 0) / SP500.length
                      ).toFixed(2)}%`,
                      color:
                        parseFloat(avgRet(sel)) >
                        SP500.reduce((a, b) => a + b, 0) / SP500.length
                          ? T.green
                          : T.red,
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        background: T.surfaceHigh,
                        border: `1px solid ${T.border}`,
                        borderRadius: 10,
                        padding: "16px 20px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: T.muted,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 700,
                          color: s.color,
                          marginTop: 8,
                        }}
                      >
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Health */}
            {tab === "health" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    background: T.surfaceHigh,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: T.muted,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      marginBottom: 16,
                    }}
                  >
                    Portfolio Health Radar
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke={T.border} />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: T.muted, fontSize: 11 }}
                      />
                      <Radar
                        dataKey="value"
                        stroke={T.gold}
                        fill={T.gold}
                        fillOpacity={0.15}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div
                  style={{
                    background: T.surfaceHigh,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: T.muted,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                      marginBottom: 20,
                    }}
                  >
                    Score Breakdown
                  </div>
                  {Object.entries(sel.health).map(([k, v], i) => {
                    const labels = {
                      diversification: "Diversification",
                      riskAlignment: "Risk Alignment",
                      liquidity: "Liquidity",
                      growth: "Growth Potential",
                      esgScore: "ESG Score",
                    };
                    const color = v >= 80 ? T.green : v >= 60 ? T.gold : T.red;
                    return (
                      <div key={k} style={{ marginBottom: 14 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 5,
                            fontSize: 13,
                          }}
                        >
                          <span>{labels[k]}</span>
                          <span style={{ color, fontWeight: 700 }}>{v}</span>
                        </div>
                        <div
                          style={{
                            background: T.surface,
                            borderRadius: 4,
                            height: 6,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${v}%`,
                              height: "100%",
                              background: `linear-gradient(90deg, ${color}88, ${color})`,
                              borderRadius: 4,
                              transition: "width 0.8s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div
                    style={{
                      marginTop: 20,
                      padding: "12px 16px",
                      background: T.surface,
                      borderRadius: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 13, color: T.muted }}>
                      Overall Score
                    </span>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: healthScore(sel) >= 80 ? T.green : T.gold,
                      }}
                    >
                      {healthScore(sel)}/100
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Goals */}
            {tab === "goals" && (
              <div
                style={{
                  background: T.surfaceHigh,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: T.muted,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 24,
                  }}
                >
                  Financial Goal Progress
                </div>
                <GoalBar
                  label={sel.goalLabel}
                  current={sel.goalCurrent}
                  target={sel.goalTarget}
                />
                <div
                  style={{ height: 1, background: T.border, margin: "20px 0" }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 14,
                    marginTop: 8,
                  }}
                >
                  {[
                    {
                      label: "Current Value",
                      value: fmt(sel.goalCurrent),
                      color: T.gold,
                    },
                    {
                      label: "Target",
                      value: fmt(sel.goalTarget),
                      color: T.text,
                    },
                    {
                      label: "Gap",
                      value: fmt(sel.goalTarget - sel.goalCurrent),
                      color: T.red,
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        background: T.surface,
                        borderRadius: 10,
                        padding: "16px 18px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          color: T.muted,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: s.color,
                        }}
                      >
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 24,
                    padding: 16,
                    background: T.surface,
                    borderRadius: 10,
                    borderLeft: `3px solid ${T.gold}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: T.gold,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Advisor Insight
                  </div>
                  <div style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>
                    At the current avg monthly return of{" "}
                    <strong style={{ color: T.gold }}>{avgRet(sel)}%</strong>,{" "}
                    {sel.name.split(" ")[0]} is on track to reach{" "}
                    {fmt(sel.goalTarget)} in approximately{" "}
                    <strong style={{ color: T.gold }}>
                      {Math.ceil(
                        Math.log(sel.goalTarget / sel.goalCurrent) /
                          Math.log(1 + parseFloat(avgRet(sel)) / 100)
                      )}{" "}
                      months
                    </strong>{" "}
                    — assuming consistent compounding.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Add Client Modal ── */}
      {showAdd && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000000dd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            style={{
              background: T.surfaceHigh,
              border: `1px solid ${T.borderMid}`,
              borderRadius: 14,
              padding: 36,
              width: 420,
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 22 }}>
              Add New Client
            </div>
            {[
              { label: "Full Name", key: "name", type: "text" },
              { label: "Age", key: "age", type: "number" },
              { label: "Portfolio Size ($K)", key: "totalAUM", type: "number" },
              { label: "Investment Goal", key: "goal", type: "text" },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label
                  style={{
                    fontSize: 10,
                    color: T.muted,
                    letterSpacing: 2.5,
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [f.key]: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    background: T.surface,
                    border: `1px solid ${T.borderMid}`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    color: T.text,
                    fontSize: 14,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  fontSize: 10,
                  color: T.muted,
                  letterSpacing: 2.5,
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Risk Profile
              </label>
              <select
                value={form.riskProfile}
                onChange={(e) =>
                  setForm((p) => ({ ...p, riskProfile: e.target.value }))
                }
                style={{
                  width: "100%",
                  background: T.surface,
                  border: `1px solid ${T.borderMid}`,
                  borderRadius: 8,
                  padding: "10px 14px",
                  color: T.text,
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                }}
              >
                <option>Conservative</option>
                <option>Moderate</option>
                <option>Aggressive</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={addClient}
                style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
                  color: T.bg,
                  border: "none",
                  padding: 12,
                  borderRadius: 8,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: "inherit",
                }}
              >
                Add Client
              </button>
              <button
                onClick={() => setShowAdd(false)}
                style={{
                  flex: 1,
                  background: "#ffffff0a",
                  color: T.text,
                  border: `1px solid ${T.border}`,
                  padding: 12,
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                  fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
