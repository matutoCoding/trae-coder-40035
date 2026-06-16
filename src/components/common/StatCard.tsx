import type { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  accent?: string;
  iconBg?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  icon,
  change,
  changeLabel,
  accent = "text-kiln-600",
  iconBg = "bg-kiln-50",
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0;
  const changeGood = title.includes("合格") || title.includes("产量") ? isPositive : !isPositive;

  return (
    <div className="card p-5 group overflow-hidden relative">
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle, ${iconBg.includes("kiln") ? "rgba(200,56,31,0.08)" : "rgba(212,165,71,0.08)"} 0%, transparent 70%)` }} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-industrial-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className={`stat-value ${accent} transition-transform duration-300 group-hover:scale-105 inline-block`}>
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {unit && <span className="text-sm font-medium text-industrial-400">{unit}</span>}
          </div>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-semibold ${
                changeGood
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-kiln-50 text-kiln-700"
              }`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-industrial-400">{changeLabel ?? "较昨日"}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${accent} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
