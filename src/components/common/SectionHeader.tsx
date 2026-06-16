import type { ReactNode } from "react";
import { Plus, Download, Filter, RefreshCw } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ("add" | "export" | "filter" | "refresh")[];
  onAction?: (action: string) => void;
}

export default function SectionHeader({
  title,
  subtitle,
  icon,
  actions = [],
  onAction,
}: SectionHeaderProps) {
  const actionConfig = {
    add: { icon: Plus, label: "新增记录", className: "btn-primary" },
    export: { icon: Download, label: "导出Excel", className: "btn-secondary" },
    filter: { icon: Filter, label: "筛选", className: "btn-secondary" },
    refresh: { icon: RefreshCw, label: "刷新", className: "btn-secondary" },
  };

  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kiln-50 to-gold-50 border border-kiln-100 flex items-center justify-center text-kiln-600">
            {icon}
          </div>
        )}
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="text-sm text-industrial-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((a) => {
            const cfg = actionConfig[a];
            const Icon = cfg.icon;
            return (
              <button
                key={a}
                onClick={() => onAction?.(a)}
                className={`${cfg.className} !py-2 text-sm inline-flex items-center gap-1.5`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{cfg.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
