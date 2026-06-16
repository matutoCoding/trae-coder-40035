import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { trendData } from "../../utils/mockData";

export default function TrendCharts() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-6">
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">产量与合格率趋势</h3>
            <p className="text-xs text-industrial-500 mt-0.5">最近24小时生产数据概览</p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-kiln-500" />
              <span className="text-industrial-600">小时产量</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500" />
              <span className="text-industrial-600">合格率</span>
            </div>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDEAE4" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#6B6255" }} axisLine={{ stroke: "#D8D3C8" }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: "#6B6255" }}
                axisLine={{ stroke: "#D8D3C8" }}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[85, 100]}
                tick={{ fontSize: 11, fill: "#6B6255" }}
                axisLine={{ stroke: "#D8D3C8" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1A1D21",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                }}
                labelStyle={{ color: "#D4A547", fontWeight: 600, marginBottom: 4 }}
              />
              <Bar
                yAxisId="left"
                dataKey="output"
                name="产量(片)"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="passRate"
                name="合格率(%)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8381F" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#DC6B4A" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">能耗指数分布</h3>
            <p className="text-xs text-industrial-500 mt-0.5">单位能耗 kWh/百片 · 目标值 ≤ 135</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
            节能优化中
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4A547" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#D4A547" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDEAE4" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#6B6255" }} axisLine={{ stroke: "#D8D3C8" }} />
              <YAxis domain={[80, 160]} tick={{ fontSize: 11, fill: "#6B6255" }} axisLine={{ stroke: "#D8D3C8" }} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#1A1D21",
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#D4A547", fontWeight: 600 }}
              />
              <Area
                type="monotone"
                dataKey={() => 135}
                name="目标值"
                stroke="#10b981"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                fill="url(#targetGradient)"
              />
              <Area
                type="monotone"
                dataKey="energy"
                name="实际能耗"
                stroke="#D4A547"
                strokeWidth={2.5}
                fill="url(#energyGradient)"
                dot={{ r: 3, fill: "#D4A547", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6 }}
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
