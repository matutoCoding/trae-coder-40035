import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { RotateCcw } from "lucide-react";

interface KilnVisualizerProps {
  maxTemp?: number;
  kilnSpeed?: number;
  oxygenLevel?: number;
  showChangeIndicator?: boolean;
  onReset?: () => void;
}

const defaultMaxTemp = 1230;
const defaultKilnSpeed = 9.6;
const defaultOxygen = 3.2;

function tempToColor(temp: number, type: string): string {
  if (type === "preheat") {
    if (temp < 400) return "from-blue-400 to-cyan-400";
    if (temp < 700) return "from-cyan-400 to-green-400";
    return "from-green-400 to-lime-400";
  }
  if (type === "firing") {
    if (temp < 1150) return "from-amber-400 to-orange-400";
    if (temp < 1230) return "from-orange-500 to-kiln-500";
    return "from-kiln-500 to-kiln-700";
  }
  if (temp > 500) return "from-lime-400 to-green-400";
  if (temp > 200) return "from-green-400 to-cyan-400";
  return "from-cyan-400 to-blue-400";
}

function calcZoneTemps(maxTemp: number, kilnSpeed: number, oxygenLevel: number) {
  const baseMax = 1230;
  const tempRatio = maxTemp / baseMax;
  const speedFactor = kilnSpeed / 9.6;

  const zones = [
    { zone: 1, name: "Z1预热", type: "preheat" as const, set: 350 },
    { zone: 2, name: "Z2预热", type: "preheat" as const, set: 550 },
    { zone: 3, name: "Z3预热", type: "preheat" as const, set: 780 },
    { zone: 4, name: "Z4烧成", type: "firing" as const, set: 1050 },
    { zone: 5, name: "Z5烧成", type: "firing" as const, set: 1180 },
    { zone: 6, name: "Z6烧成", type: "firing" as const, set: maxTemp },
    { zone: 7, name: "Z7烧成", type: "firing" as const, set: maxTemp - 15 },
    { zone: 8, name: "Z8烧成", type: "firing" as const, set: 1150 },
    { zone: 9, name: "Z9急冷", type: "cooling" as const, set: 850 },
    { zone: 10, name: "Z10缓冷", type: "cooling" as const, set: 600 },
    { zone: 11, name: "Z11末冷", type: "cooling" as const, set: 320 },
    { zone: 12, name: "Z12出口", type: "cooling" as const, set: 80 },
  ];

  const oxygenBias = (oxygenLevel - 3.2) * 8;
  const speedBias = (1 - speedFactor) * 25;

  return zones.map((z) => {
    let actual = z.set * tempRatio + speedBias + oxygenBias * (z.type === "firing" ? 1 : 0.3);
    actual = actual + (Math.random() - 0.5) * 6;

    let status: "normal" | "high" | "low" = "normal";
    if (actual > z.set * 1.03) status = "high";
    if (actual < z.set * 0.97) status = "low";

    return { ...z, actual: Math.round(actual), status };
  });
}

export default function KilnVisualizer({
  maxTemp = defaultMaxTemp,
  kilnSpeed = defaultKilnSpeed,
  oxygenLevel = defaultOxygen,
  showChangeIndicator = false,
  onReset,
}: KilnVisualizerProps) {
  const zones = calcZoneTemps(maxTemp, kilnSpeed, oxygenLevel);
  const chartData = zones.map((z) => ({
    name: z.name.replace("Z", ""),
    设定: z.set,
    实际: z.actual,
  }));

  const actualMax = Math.max(...zones.map((z) => z.actual));
  const firingTime = (280 / kilnSpeed).toFixed(1);
  const energyIndex = (maxTemp / 1230) * (kilnSpeed / 9.6) * 3.2;

  const isDifferent =
    maxTemp !== defaultMaxTemp ||
    kilnSpeed !== defaultKilnSpeed ||
    oxygenLevel !== defaultOxygen;

  return (
    <div className="card p-5 relative overflow-hidden">
      {showChangeIndicator && isDifferent && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <span className="badge bg-kiln-50 text-kiln-700 border border-kiln-200 animate-pulse">
            参数已调整
          </span>
          {onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-industrial-600 bg-white border border-industrial-200 rounded-lg hover:bg-industrial-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              复位
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-industrial-900 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-kiln-500 animate-pulse" />
            K1# 辊道窑实时温区监控
          </h3>
          <p className="text-xs text-industrial-500 mt-0.5">
            12温区 · 预热3段 · 烧成5段 · 冷却4段 · 全长280m
            {isDifferent && (
              <span className="ml-2 text-kiln-600 font-medium">· 仿真预览模式</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-500" />
            <span className="text-industrial-600">正常</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-kiln-500 to-kiln-700 animate-pulse" />
            <span className="text-industrial-600">超限</span>
          </div>
        </div>
      </div>

      {/* 温区可视化条 */}
      <div className="relative mb-6">
        {/* 区域标签 */}
        <div className="flex text-[10px] font-semibold text-industrial-500 mb-2">
          <div className="flex-[3] text-center text-blue-600">◄ 预热区 (3段) ►</div>
          <div className="flex-[5] text-center text-kiln-600">◄ 烧成区 (5段) ►</div>
          <div className="flex-[4] text-center text-emerald-600">◄ 冷却区 (4段) ►</div>
        </div>

        {/* 温区条 */}
        <div className="relative h-28 rounded-2xl overflow-hidden border-2 border-industrial-900/10 bg-industrial-900 shadow-inner">
          {/* 背景砖纹 */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 60px, transparent 60px 62px),
                              repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 20px, transparent 20px 22px)`,
            }}
          />

          <div className="relative h-full flex">
            {zones.map((zone, idx) => {
              const flexBasis = `${100 / 12}%`;
              const color = tempToColor(zone.actual, zone.type);
              const isHigh = zone.status === "high";
              const isLow = zone.status === "low";

              return (
                <div
                  key={zone.zone}
                  className={`relative h-full bg-gradient-to-b ${color} transition-all duration-700 ease-out ${
                    isHigh ? "ring-2 ring-kiln-400 ring-offset-1 ring-offset-industrial-900 z-10" : ""
                  } ${isLow ? "ring-2 ring-blue-400 ring-offset-1 ring-offset-industrial-900 z-10" : ""}`}
                  style={{ flex: `1 1 ${flexBasis}` }}
                >
                  <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent" />

                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/90 drop-shadow">
                    Z{zone.zone}
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div
                      className={`font-display font-bold text-white drop-shadow-lg ${
                        zone.actual > 1000 ? "text-xl" : "text-base"
                      } ${isHigh || isLow ? "animate-pulse" : ""}`}
                    >
                      {zone.actual}°
                    </div>
                    <div className="text-[9px] text-white/80 -mt-0.5">/{zone.set}</div>
                  </div>

                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/50" />

                  {idx < zones.length - 1 && (
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-black/30" />
                  )}
                </div>
              );
            })}
          </div>

          {/* 产品传送带示意 */}
          <div className="absolute inset-x-0 -bottom-1 h-2 bg-gradient-to-b from-industrial-700 to-industrial-900 rounded-b-xl flex items-center justify-around px-4 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-1 rounded-sm bg-gold-400/70"
                style={{ animation: `pulse 2s ${i * 0.08}s infinite` }}
              />
            ))}
          </div>
        </div>

        {/* 温度标尺 */}
        <div className="mt-6 h-3 rounded-full overflow-hidden temp-gradient shadow-inner" />
        <div className="flex justify-between text-[10px] text-industrial-500 mt-1 font-mono">
          <span>50°C</span>
          <span>400°C</span>
          <span>800°C</span>
          <span>1000°C</span>
          <span>1200°C</span>
          <span>1300°C</span>
        </div>
      </div>

      {/* 温度曲线 */}
      <div className="h-52 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEAE4" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6B6255" }} />
            <YAxis tick={{ fontSize: 10, fill: "#6B6255" }} domain={[0, 1400]} tickLine={false} />
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
            <ReferenceLine y={1250} stroke="#C8381F" strokeDasharray="3 3" strokeWidth={1} />
            <Line
              type="monotone"
              dataKey="设定"
              stroke="#374151"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              dot={{ r: 3, fill: "#fff", stroke: "#374151", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="实际"
              stroke="url(#tempLine)"
              strokeWidth={3}
              dot={{ r: 4, fill: "#fff", stroke: "#C8381F", strokeWidth: 2 }}
              activeDot={{ r: 7 }}
            />
            <defs>
              <linearGradient id="tempLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="40%" stopColor="#F97316" />
                <stop offset="70%" stopColor="#C8381F" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 参数汇总 */}
      <div className="grid grid-cols-4 gap-3 mt-5 pt-4 border-t border-industrial-100">
        {[
          {
            label: "窑速",
            value: kilnSpeed.toFixed(1),
            unit: "m/min",
            icon: "⚡",
            change: kilnSpeed !== defaultKilnSpeed ? (kilnSpeed - defaultKilnSpeed).toFixed(1) : null,
          },
          {
            label: "最高温度",
            value: String(actualMax),
            unit: "°C",
            icon: "🔥",
            alert: actualMax > 1250,
            change: maxTemp !== defaultMaxTemp ? (maxTemp - defaultMaxTemp).toString() : null,
          },
          {
            label: "烧成周期",
            value: firingTime,
            unit: "min",
            icon: "⏱️",
            change:
              kilnSpeed !== defaultKilnSpeed
                ? (parseFloat(firingTime) - 280 / 9.6).toFixed(1)
                : null,
          },
          {
            label: "氧含量",
            value: oxygenLevel.toFixed(1),
            unit: "%",
            icon: "💨",
            change: oxygenLevel !== defaultOxygen ? (oxygenLevel - defaultOxygen).toFixed(1) : null,
          },
        ].map((p) => (
          <div
            key={p.label}
            className={`rounded-xl p-3 text-center relative ${
              p.alert ? "bg-kiln-50 border border-kiln-200" : "bg-industrial-50"
            }`}
          >
            {p.change !== null && (
              <span
                className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  parseFloat(p.change) > 0
                    ? "bg-kiln-100 text-kiln-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {parseFloat(p.change) > 0 ? "▲" : "▼"}
                {Math.abs(parseFloat(p.change))}
              </span>
            )}
            <div className="text-xl mb-1">{p.icon}</div>
            <div className={`font-display text-xl font-bold ${p.alert ? "text-kiln-600" : "text-industrial-800"}`}>
              {p.value}
              <span className="text-xs font-normal text-industrial-500 ml-1">{p.unit}</span>
            </div>
            <div className="text-[11px] text-industrial-500 mt-0.5">{p.label}</div>
          </div>
        ))}
      </div>

      {/* 工艺状态评估 */}
      {isDifferent && (
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-gold-50 to-kiln-50 border border-gold-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-100 flex items-center justify-center text-gold-700 flex-shrink-0">
              📊
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-industrial-800">工艺调整预测</div>
              <div className="text-xs text-industrial-600 mt-1">
                根据当前参数调整，预计
                <span className="font-bold text-kiln-600 mx-1">
                  {energyIndex > 3.2 ? "单位能耗上升" : "单位能耗下降"} {Math.abs(Math.round((energyIndex - 3.2) * 100 / 3.2))}%
                </span>
                ，
                <span className="font-bold text-emerald-600 mx-1">
                  {actualMax > 1240 ? "烧成更充分，强度提升" : "烧成温和，变形风险降低"}
                </span>
                。建议监控色差和变形指标。
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
