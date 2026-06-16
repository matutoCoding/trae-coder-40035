import { useEffect } from "react";
import { X, FileText, Flame, Gauge, Wind, ThermometerSun, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { KilnFiringRecord } from "@/types";

interface BatchDetailModalProps {
  record: KilnFiringRecord;
  onClose: () => void;
}

const zoneSetTemps = [350, 550, 780, 1050, 1180, 1230, 1220, 1150, 850, 600, 320, 80];

function getZoneName(index: number): string {
  if (index < 3) return `Z${index + 1}预热`;
  if (index < 8) return `Z${index + 1}烧成`;
  return `Z${index + 1}冷却`;
}

function getDeformationRisk(maxTemp: number, passRate: number): { level: string; label: string; color: string; bgColor: string } {
  const score = (maxTemp - 1200) / 30 * 0.6 + (97 - passRate) / 5 * 0.4;
  if (score < 0.3) return { level: "低", label: "低风险", color: "text-emerald-600", bgColor: "bg-emerald-50" };
  if (score < 0.6) return { level: "中", label: "中等风险", color: "text-gold-600", bgColor: "bg-gold-50" };
  return { level: "高", label: "高风险", color: "text-kiln-600", bgColor: "bg-kiln-50" };
}

function getColorDifferenceRisk(passRate: number, oxygenLevel: number): { level: string; label: string; color: string; bgColor: string } {
  const score = (97 - passRate) / 5 * 0.5 + Math.abs(oxygenLevel - 3) / 3 * 0.5;
  if (score < 0.3) return { level: "低", label: "低风险", color: "text-emerald-600", bgColor: "bg-emerald-50" };
  if (score < 0.6) return { level: "中", label: "中等风险", color: "text-gold-600", bgColor: "bg-gold-50" };
  return { level: "高", label: "高风险", color: "text-kiln-600", bgColor: "bg-kiln-50" };
}

export default function BatchDetailModal({ record, onClose }: BatchDetailModalProps) {
  const chartData = record.zoneTemps.map((temp, i) => ({
    zone: `Z${i + 1}`,
    name: getZoneName(i),
    setTemp: zoneSetTemps[i],
    actualTemp: Math.round(temp),
  }));

  const passRate = record.passRate ?? 0;
  const deformationRisk = getDeformationRisk(record.maxTemp, passRate);
  const colorDiffRisk = getColorDifferenceRisk(passRate, record.oxygenLevel);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleExport = () => {
    const lines = [
      "烧成批次详情报告",
      "==================",
      "",
      `批次号: ${record.batchNo}`,
      `窑号: ${record.kilnId}`,
      `班次: ${record.shift === "day" ? "白班" : "夜班"}`,
      `操作员: ${record.operator}`,
      `时间: ${record.timestamp}`,
      "",
      "--- 温区温度(℃) ---",
      ...chartData.map((d) => `${d.name}: 设定${d.setTemp}℃ / 实际${d.actualTemp}℃`),
      "",
      "--- 能耗分析 ---",
      `燃料消耗: ${record.fuelConsumption.toFixed(2)} kcal/kg`,
      `空燃比: ${record.airFuelRatio.toFixed(2)}`,
      `氧含量: ${record.oxygenLevel.toFixed(1)} %`,
      `窑压: ${record.kilnPressure.toFixed(1)} Pa`,
      "",
      "--- 质量判定 ---",
      `合格率: ${passRate.toFixed(1)} %`,
      `最高温度: ${record.maxTemp.toFixed(0)} ℃`,
      `变形风险: ${deformationRisk.label}`,
      `色差风险: ${colorDiffRisk.label}`,
      "",
      `报告生成时间: ${new Date().toLocaleString()}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `烧成报告_${record.batchNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-industrial-100 flex items-center justify-between bg-gradient-to-r from-kiln-50/50 to-gold-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kiln-500 to-kiln-600 flex items-center justify-center text-white">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-industrial-900">烧成批次详情</h2>
              <p className="text-xs text-industrial-500 mt-0.5 font-mono">{record.batchNo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-industrial-400 hover:text-industrial-700 hover:bg-industrial-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-6 space-y-6">
            <div className="card p-5">
              <h3 className="font-display text-base font-semibold text-industrial-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-kiln-500 rounded-full" />
                基本信息
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-industrial-400 mb-1">窑号</p>
                  <p className="text-sm font-semibold text-industrial-800">{record.kilnId}</p>
                </div>
                <div>
                  <p className="text-xs text-industrial-400 mb-1">班次</p>
                  <p className="text-sm font-semibold text-industrial-800">
                    {record.shift === "day" ? "白班" : "夜班"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-industrial-400 mb-1">操作员</p>
                  <p className="text-sm font-semibold text-industrial-800">{record.operator}</p>
                </div>
                <div>
                  <p className="text-xs text-industrial-400 mb-1">烧成时间</p>
                  <p className="text-sm font-semibold text-industrial-800">{record.timestamp}</p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-base font-semibold text-industrial-900 flex items-center gap-2">
                  <span className="w-1 h-5 bg-gold-500 rounded-full" />
                  温区温度曲线
                </h3>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-kiln-500" />
                    <span className="text-industrial-500">设定温度</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-emerald-500" />
                    <span className="text-industrial-500">实际温度</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDEAE4" />
                    <XAxis
                      dataKey="zone"
                      tick={{ fontSize: 11, fill: "#6B6255" }}
                      axisLine={{ stroke: "#D8D3C8" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6B6255" }}
                      axisLine={{ stroke: "#D8D3C8" }}
                      tickLine={false}
                      domain={[0, "auto"]}
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
                      formatter={(value: number, name: string) => [
                        `${value}℃`,
                        name === "setTemp" ? "设定温度" : "实际温度",
                      ]}
                      labelFormatter={(label: string) => {
                        const item = chartData.find((d) => d.zone === label);
                        return item ? item.name : label;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="setTemp"
                      name="设定温度"
                      stroke="#C8381F"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3, fill: "#C8381F", strokeWidth: 2, stroke: "#fff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="actualTemp"
                      name="实际温度"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 3.5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-display text-base font-semibold text-industrial-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded-full" />
                能耗分析
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-kiln-50/50 border border-kiln-100">
                  <div className="w-9 h-9 rounded-lg bg-kiln-100 flex items-center justify-center text-kiln-600 mb-3">
                    <Flame className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-industrial-500 mb-1">燃料消耗</p>
                  <p className="font-display text-xl font-bold text-kiln-600">
                    {record.fuelConsumption.toFixed(2)}
                    <span className="text-xs font-normal text-industrial-400 ml-1">kcal/kg</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-industrial-500 mb-1">空燃比</p>
                  <p className="font-display text-xl font-bold text-blue-600">
                    {record.airFuelRatio.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-50/50 border border-cyan-100">
                  <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600 mb-3">
                    <Wind className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-industrial-500 mb-1">氧含量</p>
                  <p className="font-display text-xl font-bold text-cyan-600">
                    {record.oxygenLevel.toFixed(1)}
                    <span className="text-xs font-normal text-industrial-400 ml-1">%</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-industrial-500 mb-1">窑压</p>
                  <p className="font-display text-xl font-bold text-emerald-600">
                    {record.kilnPressure.toFixed(1)}
                    <span className="text-xs font-normal text-industrial-400 ml-1">Pa</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-display text-base font-semibold text-industrial-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-emerald-500 rounded-full" />
                质量判定
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-gold-50/50 border border-emerald-100">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-industrial-500 mb-1">合格率</p>
                  <p className={`font-display text-2xl font-bold ${
                    passRate >= 95 ? "text-emerald-600" : passRate >= 92 ? "text-gold-600" : "text-kiln-600"
                  }`}>
                    {passRate.toFixed(1)}
                    <span className="text-xs font-normal text-industrial-400 ml-1">%</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
                    <ThermometerSun className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-industrial-500 mb-1">最高温度</p>
                  <p className="font-display text-2xl font-bold text-orange-600">
                    {record.maxTemp.toFixed(0)}
                    <span className="text-xs font-normal text-industrial-400 ml-1">℃</span>
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${deformationRisk.bgColor} border-opacity-50`} style={{ borderColor: 'currentColor' }}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                    deformationRisk.level === "低" ? "bg-emerald-100 text-emerald-600" :
                    deformationRisk.level === "中" ? "bg-gold-100 text-gold-600" :
                    "bg-kiln-100 text-kiln-600"
                  }`}>
                    {deformationRisk.level === "低" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : deformationRisk.level === "中" ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-xs text-industrial-500 mb-1">变形风险</p>
                  <p className={`font-display text-lg font-bold ${deformationRisk.color}`}>
                    {deformationRisk.label}
                  </p>
                </div>
                <div className={`p-4 rounded-xl border ${colorDiffRisk.bgColor} border-opacity-50`} style={{ borderColor: 'currentColor' }}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                    colorDiffRisk.level === "低" ? "bg-emerald-100 text-emerald-600" :
                    colorDiffRisk.level === "中" ? "bg-gold-100 text-gold-600" :
                    "bg-kiln-100 text-kiln-600"
                  }`}>
                    {colorDiffRisk.level === "低" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : colorDiffRisk.level === "中" ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-xs text-industrial-500 mb-1">色差风险</p>
                  <p className={`font-display text-lg font-bold ${colorDiffRisk.color}`}>
                    {colorDiffRisk.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-industrial-100 flex items-center justify-end gap-3 bg-industrial-50/50">
          <button onClick={onClose} className="btn-secondary !py-2 text-sm">
            关闭
          </button>
          <button
            onClick={handleExport}
            className="btn-primary !py-2 text-sm inline-flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            导出报告
          </button>
        </div>
      </div>
    </div>
  );
}
