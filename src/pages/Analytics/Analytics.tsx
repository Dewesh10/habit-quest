import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts"
import CalendarHeatmap from "../../components/analytics/CalendarHeatmap"
import CornerBrackets from "../../components/common/CornerBrackets"
import AnalyticsSkeleton from "../../components/analytics/AnalyticsSkeleton"
import { useHabits } from "../../hooks/useHabits"
import { useCompletions } from "../../hooks/useCompletions"
import { getMonthDates, getMonthName } from "../../utils/date"
import {
  buildDailyChartData,
  buildWeeklyChartData,
  buildCategoryChartData,
  buildHabitComparisonData,
  buildXPProgressionData,
} from "../../utils/chartData"

const NEON = "#38bdf8"
const NEON_DIM = "rgba(56, 189, 248, 0.15)"

function BarGradientDefs() {
  return (
    <defs>
      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7dd3fc" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>
  )
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-950 border border-cyan-500/40 rounded-lg px-3 py-2 text-xs text-white font-mono shadow-[0_0_16px_rgba(56,189,248,0.3)]">
      <p className="font-bold mb-1 text-cyan-300">
        {label ?? payload[0].payload.name ?? payload[0].payload.category}
      </p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-slate-300">
          {p.name || p.dataKey}: {p.value}
          {typeof p.value === "number" && p.dataKey !== "xp" ? "%" : ""}
        </p>
      ))}
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
  hero = false,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  hero?: boolean
}) {
  return (
    <div
      className={`${hero ? "hero-panel" : "system-panel card-hover"} relative p-5 md:p-6 overflow-hidden ${className}`}
    >
      <CornerBrackets />
      <div className="mb-4 font-mono">
        <h2 className="system-panel-header font-bold text-cyan-300 tracking-wider">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Analytics() {
  const { habits, loaded: habitsLoaded } = useHabits()
  const { completions, loaded: completionsLoaded } = useCompletions()

  if (!habitsLoaded || !completionsLoaded) {
    return <AnalyticsSkeleton />
  }

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const monthDates = getMonthDates(year, month)

  const dailyData = buildDailyChartData(habits, completions, monthDates)
  const weeklyData = buildWeeklyChartData(habits, completions, monthDates)
  const categoryData = buildCategoryChartData(habits, completions, monthDates)
  const comparisonData = buildHabitComparisonData(habits, completions, monthDates)
  const xpData = buildXPProgressionData(habits, completions, monthDates)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white uppercase tracking-wider">
          Hunter Combat & Quest Analytics
        </h1>
        <p className="text-slate-400 text-xs font-mono mt-0.5">
          {getMonthName(month)} {year} &middot; Performance & XP Analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Daily Quest Clearance" subtitle="Percent of scheduled quests completed per day">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyData}>
              <BarGradientDefs />
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} unit="%" tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: NEON_DIM }} />
              <Bar dataKey="percent" fill={NEON} radius={[4, 4, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Clearance Pace" subtitle="Aggregated completion rate by week">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} unit="%" tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: NEON_DIM }} />
              <Bar dataKey="percent" fill={NEON} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="XP Progression Curve" subtitle="Cumulative XP trajectory this month" className="lg:col-span-2" hero>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={xpData}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={NEON} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={NEON} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: NEON, strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="xp"
                stroke={NEON}
                strokeWidth={2}
                fill="url(#xpGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category Mastery Radar" subtitle="Completion density by quest category">
          {categoryData.length === 0 ? (
            <p className="text-slate-500 font-mono text-sm py-8 text-center">No category data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={categoryData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis stroke="#334155" fontSize={9} domain={[0, 100]} />
                <Radar dataKey="percent" stroke={NEON} fill={NEON} fillOpacity={0.35} />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Quest Ranking Comparison" subtitle="Quests ranked by clearance percentage">
          {comparisonData.length === 0 ? (
            <p className="text-slate-500 font-mono text-sm py-8 text-center">No active quests yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={comparisonData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#475569" fontSize={11} unit="%" tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={90} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: NEON_DIM }} />
                <Bar dataKey="percent" fill={NEON} radius={[0, 4, 4, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Hunter Activity Heatmap" subtitle="Consistency over the last 26 weeks" className="lg:col-span-2">
          <CalendarHeatmap habits={habits} completions={completions} weeksToShow={26} />
        </ChartCard>
      </div>
    </div>
  )
}
