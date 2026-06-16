import { Bell, Search, Settings, User, Clock, Calendar, AlertTriangle } from "lucide-react";
import { useAppStore } from "../../store/productionStore";
import { dashboardKPI } from "../../utils/mockData";
import { useState, useEffect } from "react";

export default function Header() {
  const { user } = useAppStore();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString("zh-CN", { hour12: false });
  const dateStr = now.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-industrial-100 flex items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-industrial-500">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{dateStr}</span>
        </div>
        <div className="flex items-center gap-2 text-industrial-700">
          <Clock className="w-4 h-4 text-kiln-500" />
          <span className="font-mono text-sm font-semibold tracking-wider">{timeStr}</span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-emerald-700">{dashboardKPI.currentShift}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-industrial-400" />
          <input
            type="text"
            placeholder="搜索批次号、设备..."
            className="w-64 pl-9 pr-4 py-2 bg-industrial-50 border border-industrial-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-kiln-500/30 focus:border-kiln-500 transition-all"
          />
        </div>

        <button className="relative p-2.5 rounded-xl hover:bg-industrial-50 transition-colors group">
          <Bell className="w-5 h-5 text-industrial-600 group-hover:text-kiln-600" />
          {dashboardKPI.activeAlarms > 0 && (
            <>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-kiln-500 rounded-full animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1.5 rounded-full bg-kiln-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                {dashboardKPI.activeAlarms}
              </span>
            </>
          )}
        </button>

        <button className="p-2.5 rounded-xl hover:bg-industrial-50 transition-colors group">
          <Settings className="w-5 h-5 text-industrial-600 group-hover:text-kiln-600" />
        </button>

        <div className="h-8 w-px bg-industrial-200 mx-1" />

        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-industrial-800">{user.name}</div>
            <div className="text-xs text-industrial-500">{user.role}</div>
          </div>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-kiln-500 to-kiln-700 flex items-center justify-center shadow-md">
            <User className="w-5 h-5 text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
