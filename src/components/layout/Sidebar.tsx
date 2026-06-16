import {
  LayoutDashboard,
  FlaskConical,
  CloudRain,
  Hammer,
  PaintBucket,
  Flame,
  Sparkles,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Factory,
  GitBranch,
} from "lucide-react";
import { useAppStore } from "../../store/productionStore";
import type { ModuleKey } from "../../types";

const navItems: { key: ModuleKey; label: string; icon: typeof LayoutDashboard; accent: string }[] = [
  { key: "dashboard", label: "数据看板", icon: LayoutDashboard, accent: "from-kiln-500 to-kiln-600" },
  { key: "ball-milling", label: "原料球磨", icon: FlaskConical, accent: "from-blue-500 to-blue-600" },
  { key: "spray-drying", label: "喷雾干燥", icon: CloudRain, accent: "from-cyan-500 to-cyan-600" },
  { key: "press-forming", label: "压制成型", icon: Hammer, accent: "from-amber-500 to-amber-600" },
  { key: "glazing", label: "干燥施釉", icon: PaintBucket, accent: "from-teal-500 to-teal-600" },
  { key: "kiln-firing", label: "辊道窑烧成", icon: Flame, accent: "from-kiln-500 to-kiln-700" },
  { key: "polishing", label: "抛光磨边", icon: Sparkles, accent: "from-violet-500 to-violet-600" },
  { key: "grading-packaging", label: "分级包装", icon: Boxes, accent: "from-emerald-500 to-emerald-600" },
  { key: "batch-tracking", label: "批次追溯", icon: GitBranch, accent: "from-gold-500 to-gold-600" },
];

export default function Sidebar() {
  const { activeModule, setActiveModule, sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={`relative flex flex-col bg-gradient-to-b from-industrial-900 via-industrial-800 to-industrial-900 text-white transition-all duration-300 ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-kiln-500 to-gold-500 shadow-lg shadow-kiln-500/30">
          <Factory className="w-6 h-6 text-white" />
          <div className="absolute inset-0 rounded-xl bg-kiln-400 animate-pulse-slow opacity-30" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display text-lg font-bold whitespace-nowrap">窑火智造</h1>
            <p className="text-xs text-industrial-300 whitespace-nowrap">陶瓷生产智能管理</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveModule(item.key)}
              className={`group relative flex items-center w-full gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? `bg-gradient-to-r ${item.accent} text-white shadow-lg`
                  : "text-industrial-300 hover:text-white hover:bg-white/5"
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`} />
              {!sidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              {isActive && !sidebarCollapsed && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-glow" />
              )}
            </button>
          );
        })}
      </nav>

      {!sidebarCollapsed && (
        <div className="mx-3 mb-4 p-4 rounded-xl bg-gradient-to-br from-kiln-600/20 to-gold-500/10 border border-kiln-500/20">
          <div className="text-xs text-industrial-300 mb-1">当前班次</div>
          <div className="font-display text-base font-semibold text-white">白班 · 08:00-20:00</div>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-300">生产线运行中</span>
          </div>
        </div>
      )}

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-industrial-700 border-2 border-industrial-900 flex items-center justify-center text-industrial-300 hover:bg-kiln-500 hover:text-white transition-colors"
      >
        {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
}
