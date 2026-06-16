import StatCard from "../common/StatCard";
import { dashboardKPI } from "../../utils/mockData";
import {
  Package,
  CheckCircle2,
  Zap,
  AlertTriangle,
  Cpu,
  Gauge,
} from "lucide-react";

export default function KPISection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <StatCard
        title="今日产量"
        value={dashboardKPI.todayOutput.toLocaleString()}
        unit="片"
        icon={<Package className="w-6 h-6" />}
        change={dashboardKPI.outputChange}
        accent="text-kiln-600"
        iconBg="bg-kiln-50"
      />
      <StatCard
        title="合格率"
        value={dashboardKPI.passRate}
        unit="%"
        icon={<CheckCircle2 className="w-6 h-6" />}
        change={dashboardKPI.passRateChange}
        accent="text-emerald-600"
        iconBg="bg-emerald-50"
      />
      <StatCard
        title="能耗指数"
        value={dashboardKPI.energyConsumption}
        unit="kWh/百片"
        icon={<Zap className="w-6 h-6" />}
        change={dashboardKPI.energyChange}
        accent="text-amber-600"
        iconBg="bg-amber-50"
      />
      <StatCard
        title="活跃告警"
        value={dashboardKPI.activeAlarms}
        unit="条"
        icon={<AlertTriangle className="w-6 h-6" />}
        accent="text-rose-600"
        iconBg="bg-rose-50"
      />
      <StatCard
        title="设备开动率"
        value={Math.round((dashboardKPI.runningEquipment / dashboardKPI.totalEquipment) * 100)}
        unit="%"
        icon={<Cpu className="w-6 h-6" />}
        change={1.8}
        accent="text-blue-600"
        iconBg="bg-blue-50"
      />
      <StatCard
        title="窑速设定"
        value={9.6}
        unit="m/min"
        icon={<Gauge className="w-6 h-6" />}
        change={0.2}
        changeLabel="较上周"
        accent="text-violet-600"
        iconBg="bg-violet-50"
      />
    </div>
  );
}
