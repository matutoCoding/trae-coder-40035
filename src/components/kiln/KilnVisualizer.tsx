import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { RotateCcw } from 'lucide-react';

interface KilnVisualizerProps {
  maxTemp?: number;
  kilnSpeed?: number;
  oxygenLevel?: number;
  firingTime?: number;
  airFuelRatio?: number;
  showChangeIndicator?: boolean;
  onReset?: () => void;
}

const defaultMaxTemp = 1230;
const defaultKilnSpeed = 9.6;
const defaultOxygen = 3.2;
const defaultFiringTime = 62.5;
const defaultAirFuel = 10.8;

function tempToColor(temp: number, type: string): string {
  if (type === 'preheat') {
    if (temp < 400) return 'from-blue-400 to-cyan-400';
    if (temp < 700) return 'from-cyan-400 to-green-400';
    return 'from-green-400 to-lime-400';
  }
  if (type === 'firing') {
    if (temp < 1150) return 'from-amber-400 to-orange-400';
    if (temp < 1230) return 'from-orange-500 to-kiln-500';
    return 'from-kiln-500 to-kiln-700';
  }
  if (temp > 500) return 'from-lime-400 to-green-400';
  if (temp > 200) return 'from-green-400 to-cyan-400';
  return 'from-cyan-400 to-blue-400';
}

function seedRand(seed: number): () => number {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function calcZoneTemps(
  maxTemp: number,
  kilnSpeed: number,
  oxygenLevel: number,
  firingTime: number,
  airFuelRatio: number
) {
  const seed =
    Math.round(maxTemp * 1000) +
    Math.round(kilnSpeed * 100) +
    Math.round(oxygenLevel * 10) +
    Math.round(firingTime * 10) +
    Math.round(airFuelRatio * 100);
  const rand = seedRand(seed);

  const baseMax = 1230;
  const tempRatio = maxTemp / baseMax;
  const speedFactor = kilnSpeed / 9.6;

  const timeFactor = firingTime / 62.5;
  const preheatBoost = timeFactor > 1 ? (timeFactor - 1) * 18 : (timeFactor - 1) * 22;
  const coolingSlow = timeFactor > 1 ? (timeFactor - 1) * 25 : 0;
  const firingFlat = Math.abs(timeFactor - 1) < 0.1 ? 0 : (timeFactor - 1) * 12;

  const zones = [
    { zone: 1, name: 'Z1预热', type: 'preheat' as const, set: 350 + preheatBoost * 0.9 },
    { zone: 2, name: 'Z2预热', type: 'preheat' as const, set: 550 + preheatBoost * 0.8 },
    { zone: 3, name: 'Z3预热', type: 'preheat' as const, set: 780 + preheatBoost * 0.6 },
    { zone: 4, name: 'Z4烧成', type: 'firing' as const, set: 1050 + firingFlat * 0.5 },
    { zone: 5, name: 'Z5烧成', type: 'firing' as const, set: 1180 + firingFlat * 0.8 },
    { zone: 6, name: 'Z6烧成', type: 'firing' as const, set: maxTemp + firingFlat },
    { zone: 7, name: 'Z7烧成', type: 'firing' as const, set: maxTemp - 15 + firingFlat * 0.8 },
    { zone: 8, name: 'Z8烧成', type: 'firing' as const, set: 1150 + firingFlat * 0.4 },
    { zone: 9, name: 'Z9急冷', type: 'cooling' as const, set: 850 + coolingSlow * 0.7 },
    { zone: 10, name: 'Z10缓冷', type: 'cooling' as const, set: 600 + coolingSlow * 0.9 },
    { zone: 11, name: 'Z11末冷', type: 'cooling' as const, set: 320 + coolingSlow },
    { zone: 12, name: 'Z12出口', type: 'cooling' as const, set: 80 + coolingSlow * 0.5 },
  ];

  const oxygenBias = (oxygenLevel - 3.2) * 7;
  const speedBias = (1 - speedFactor) * 22;
  const fuelBias = (airFuelRatio - 10.8) * -6;

  return zones.map((z) => {
    let actual =
      z.set * tempRatio +
      speedBias +
      oxygenBias * (z.type === 'firing' ? 1 : 0.3) +
      fuelBias * (z.type === 'firing' ? 1 : 0.2);
    actual = actual + (rand() - 0.5) * 5;

    let status: 'normal' | 'high' | 'low' = 'normal';
    if (actual > z.set * 1.03) status = 'high';
    if (actual < z.set * 0.97) status = 'low';

    return { ...z, actual: Math.round(actual), status };
  });
}

export default function KilnVisualizer({
  maxTemp = defaultMaxTemp,
  kilnSpeed = defaultKilnSpeed,
  oxygenLevel = defaultOxygen,
  firingTime = defaultFiringTime,
  airFuelRatio = defaultAirFuel,
  showChangeIndicator = false,
  onReset,
}: KilnVisualizerProps) {
  const zones = useMemo(
    () => calcZoneTemps(maxTemp, kilnSpeed, oxygenLevel, firingTime, airFuelRatio),
    [maxTemp, kilnSpeed, oxygenLevel, firingTime, airFuelRatio]
  );

  const chartData = useMemo(
    () =>
      zones.map((z) => ({
        name: z.name.replace('Z', ''),
        设定: Math.round(z.set),
        实际: z.actual,
      })),
    [zones]
  );

  const actualMax = Math.max(...zones.map((z) => z.actual));

  const energyBase = 3.2;
  const energyIndex =
    (maxTemp / 1230) * 0.35 +
    (firingTime / 62.5) * 0.4 +
    (kilnSpeed / 9.6) * 0.15 +
    (1 / airFuelRatio) * 8.64;
  const energyDelta = ((energyIndex - energyBase) / energyBase) * 100;

  const isDifferent =
    maxTemp !== defaultMaxTemp ||
    kilnSpeed !== defaultKilnSpeed ||
    oxygenLevel !== defaultOxygen ||
    firingTime !== defaultFiringTime ||
    airFuelRatio !== defaultAirFuel;

  const defectRisk =
    (maxTemp > 1245 ? 25 : 0) +
    (firingTime < 55 ? 20 : firingTime > 75 ? 15 : 0) +
    (Math.abs(kilnSpeed - 9.6) > 2.5 ? 18 : 0) +
    (oxygenLevel > 5 ? 10 : 0);

  const strengthGain =
    (maxTemp > 1235 ? 10 : 0) +
    (firingTime > 68 ? 12 : 0) +
    (Math.abs(oxygenLevel - 3.2) < 0.8 ? 5 : 0);

  const uniformityScore =
    (firingTime > 60 ? 10 : 0) +
    (Math.abs(kilnSpeed - 9.6) < 1 ? 8 : 0) +
    (maxTemp <= 1245 ? 7 : 0);

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
              const isHigh = zone.status === 'high';
              const isLow = zone.status === 'low';

              return (
                <div
                  key={zone.zone}
                  className={`relative h-full bg-gradient-to-b ${color} transition-all duration-700 ease-out ${
                    isHigh ? 'ring-2 ring-kiln-400 ring-offset-1 ring-offset-industrial-900 z-10' : ''
                  } ${isLow ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-industrial-900 z-10' : ''}`}
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
                        zone.actual > 1000 ? 'text-xl' : 'text-base'
                      } ${isHigh || isLow ? 'animate-pulse' : ''}`}
                    >
                      {zone.actual}°
                    </div>
                    <div className="text-[9px] text-white/80 -mt-0.5">/{Math.round(zone.set)}</div>
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
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6B6255' }} />
            <YAxis tick={{ fontSize: 10, fill: '#6B6255' }} domain={[0, 1400]} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#1A1D21',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#D4A547', fontWeight: 600 }}
            />
            <ReferenceLine y={1250} stroke="#C8381F" strokeDasharray="3 3" strokeWidth={1} label={{ value: '上限', fill: '#C8381F', fontSize: 10, position: 'right' }} />
            <Line
              type="monotone"
              dataKey="设定"
              stroke="#374151"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              dot={{ r: 3, fill: '#fff', stroke: '#374151', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="实际"
              stroke="url(#tempLine)"
              strokeWidth={3}
              dot={{ r: 4, fill: '#fff', stroke: '#C8381F', strokeWidth: 2 }}
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
            label: '窑速',
            value: kilnSpeed.toFixed(1),
            unit: 'm/min',
            icon: '⚡',
            change: kilnSpeed !== defaultKilnSpeed ? (kilnSpeed - defaultKilnSpeed).toFixed(1) : null,
          },
          {
            label: '最高温度',
            value: String(actualMax),
            unit: '°C',
            icon: '🔥',
            alert: actualMax > 1250,
            change: maxTemp !== defaultMaxTemp ? (maxTemp - defaultMaxTemp).toString() : null,
          },
          {
            label: '烧成周期',
            value: firingTime.toFixed(1),
            unit: 'min',
            icon: '⏱️',
            change: firingTime !== defaultFiringTime ? (firingTime - defaultFiringTime).toFixed(1) : null,
          },
          {
            label: '氧含量',
            value: oxygenLevel.toFixed(1),
            unit: '%',
            icon: '💨',
            change: oxygenLevel !== defaultOxygen ? (oxygenLevel - defaultOxygen).toFixed(1) : null,
          },
        ].map((p) => (
          <div
            key={p.label}
            className={`rounded-xl p-3 text-center relative ${
              p.alert ? 'bg-kiln-50 border border-kiln-200' : 'bg-industrial-50'
            }`}
          >
            {p.change !== null && (
              <span
                className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  parseFloat(p.change) > 0
                    ? 'bg-kiln-100 text-kiln-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {parseFloat(p.change) > 0 ? '▲' : '▼'}
                {Math.abs(parseFloat(p.change))}
              </span>
            )}
            <div className="text-xl mb-1">{p.icon}</div>
            <div className={`font-display text-xl font-bold ${p.alert ? 'text-kiln-600' : 'text-industrial-800'}`}>
              {p.value}
              <span className="text-xs font-normal text-industrial-500 ml-1">{p.unit}</span>
            </div>
            <div className="text-[11px] text-industrial-500 mt-0.5">{p.label}</div>
          </div>
        ))}
      </div>

      {/* 工艺状态评估 */}
      <div
        className={`mt-4 p-4 rounded-xl border ${
          isDifferent
            ? 'bg-gradient-to-r from-gold-50 to-kiln-50 border-gold-200'
            : 'bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isDifferent ? 'bg-gold-100 text-gold-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            📊
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-industrial-800">
              {isDifferent ? '工艺调整仿真预测' : '当前工艺状态'}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2 mb-2">
              <div className="px-3 py-2 rounded-lg bg-white/70 border border-white">
                <div className="text-[10px] text-industrial-500">能耗变化</div>
                <div className={`text-sm font-bold ${energyDelta > 0 ? 'text-kiln-600' : 'text-emerald-600'}`}>
                  {energyDelta > 0 ? '+' : ''}{energyDelta.toFixed(1)}%
                </div>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/70 border border-white">
                <div className="text-[10px] text-industrial-500">强度提升</div>
                <div className="text-sm font-bold text-gold-600">+{strengthGain}</div>
              </div>
              <div className="px-3 py-2 rounded-lg bg-white/70 border border-white">
                <div className="text-[10px] text-industrial-500">缺陷风险</div>
                <div className={`text-sm font-bold ${defectRisk > 30 ? 'text-kiln-600' : defectRisk > 15 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {defectRisk}分
                </div>
              </div>
            </div>
            <div className="text-xs text-industrial-600 leading-relaxed">
              {isDifferent ? (
                <>
                  根据当前参数调整，预计
                  <span className={`font-bold mx-1 ${energyDelta > 0 ? 'text-kiln-600' : 'text-emerald-600'}`}>
                    单位能耗{energyDelta > 0 ? '上升' : '下降'} {Math.abs(energyDelta).toFixed(1)}%
                  </span>
                  ，
                  {firingTime > 68 ? (
                    <span className="font-bold text-gold-600 mx-1">烧成周期延长，产品致密性提升，强度+{strengthGain}</span>
                  ) : firingTime < 58 ? (
                    <span className="font-bold text-kiln-600 mx-1">周期偏短，升温速率过快，变形风险{defectRisk}分</span>
                  ) : maxTemp > 1245 ? (
                    <span className="font-bold text-kiln-600 mx-1">峰值温度过高，色差与气泡风险上升</span>
                  ) : (
                    <span className="font-bold text-emerald-600 mx-1">烧成均匀性{uniformityScore}/25分，工艺窗口合理</span>
                  )}
                  。
                </>
              ) : (
                <>
                  当前处于标准工艺窗口，温度分布均匀，建议关注氧含量稳定在 3.0%-3.5% 区间可进一步降低色差波动。
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
