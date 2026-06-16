import { AlertTriangle, AlertCircle, Info, Clock, User, CheckCircle2, PlayCircle } from "lucide-react";
import { alarms } from "../../utils/mockData";
import type { Alarm } from "../../types";

const levelConfig: Record<Alarm["level"], { icon: typeof AlertTriangle; color: string; bg: string; border: string; label: string }> = {
  critical: { icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", label: "严重" },
  warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "预警" },
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "提示" },
};

const statusConfig: Record<Alarm["status"], { icon: typeof PlayCircle; color: string; label: string }> = {
  pending: { icon: AlertCircle, color: "text-rose-500", label: "待处理" },
  processing: { icon: PlayCircle, color: "text-amber-500", label: "处理中" },
  resolved: { icon: CheckCircle2, color: "text-emerald-500", label: "已解决" },
};

export default function AlarmPanel() {
  const pending = alarms.filter((a) => a.status !== "resolved").length;
  const criticalCount = alarms.filter((a) => a.level === "critical").length;

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-industrial-100 flex items-center justify-between bg-gradient-to-r from-rose-50/50 to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            {criticalCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                {criticalCount}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">异常告警中心</h3>
            <p className="text-xs text-industrial-500 mt-0.5">
              共 {alarms.length} 条告警 · {pending} 条待处理
            </p>
          </div>
        </div>
        <button className="btn-secondary !py-2 text-sm">查看全部</button>
      </div>

      <div className="divide-y divide-industrial-50 max-h-[380px] overflow-y-auto scrollbar-thin">
        {alarms.map((alarm) => {
          const lv = levelConfig[alarm.level];
          const st = statusConfig[alarm.status];
          const StatusIcon = st.icon;
          const LevelIcon = lv.icon;

          return (
            <div
              key={alarm.id}
              className={`px-5 py-4 hover:bg-industrial-50/50 transition-colors border-l-4 ${
                alarm.level === "critical"
                  ? "border-l-rose-500"
                  : alarm.level === "warning"
                  ? "border-l-amber-500"
                  : "border-l-blue-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-8 h-8 rounded-lg ${lv.bg} flex items-center justify-center ${lv.color} flex-shrink-0 ${alarm.status === "pending" ? "animate-pulse" : ""}`}>
                  <LevelIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`badge ${lv.bg} ${lv.color}`}>{lv.label}</span>
                    <span className="badge bg-industrial-100 text-industrial-600">{alarm.module}</span>
                    <span className={`badge flex items-center gap-1 ${st.color.replace("text-", "bg-").replace("500", "50")} ${st.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {st.label}
                    </span>
                  </div>
                  <p className="text-sm text-industrial-800 leading-relaxed">{alarm.message}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-industrial-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alarm.timestamp.split(" ")[1]}
                    </span>
                    {alarm.handler && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        处理人：{alarm.handler}
                      </span>
                    )}
                    <span className="text-industrial-400">#{alarm.id}</span>
                  </div>
                </div>
                {alarm.status === "pending" && (
                  <button className="btn-primary !py-1.5 !px-3 text-xs flex-shrink-0">处理</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
