import { useState, useMemo } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import KilnVisualizer from '@/components/kiln/KilnVisualizer';
import BatchDetailModal from '@/components/kiln/BatchDetailModal';
import DataTable from '@/components/common/DataTable';
import { kilnFiringRecords } from '@/utils/mockData';
import type { KilnFiringRecord } from '@/types';
import { Flame, ThermometerSun, Gauge, Wind, Timer, Settings, Minus, Plus, Zap, AlertTriangle, Search, Filter, Download, Eye } from 'lucide-react';

interface ControlParam {
  key: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  iconBg: string;
}

export default function KilnFiring() {
  const [params, setParams] = useState<ControlParam[]>([
    { key: 'kilnSpeed', label: '窑速调节', value: 9.6, min: 5, max: 15, step: 0.1, unit: 'm/min', icon: Timer, color: 'text-kiln-600', bg: 'bg-kiln-500', iconBg: 'bg-kiln-50' },
    { key: 'maxTemp', label: '最高温度', value: 1230, min: 1180, max: 1280, step: 5, unit: '℃', icon: ThermometerSun, color: 'text-orange-600', bg: 'bg-gradient-to-r from-orange-500 to-kiln-500', iconBg: 'bg-orange-50' },
    { key: 'firingTime', label: '烧成周期', value: 62.5, min: 50, max: 80, step: 0.5, unit: 'min', icon: Zap, color: 'text-gold-600', bg: 'bg-gold-500', iconBg: 'bg-gold-50' },
    { key: 'oxygenLevel', label: '氧含量', value: 3.2, min: 1, max: 8, step: 0.1, unit: '%', icon: Wind, color: 'text-cyan-600', bg: 'bg-cyan-500', iconBg: 'bg-cyan-50' },
    { key: 'airFuelRatio', label: '空燃比', value: 10.8, min: 9, max: 13, step: 0.1, unit: '', icon: Gauge, color: 'text-blue-600', bg: 'bg-blue-500', iconBg: 'bg-blue-50' },
    { key: 'kilnPressure', label: '窑压', value: 15.6, min: 5, max: 25, step: 0.1, unit: 'Pa', icon: Gauge, color: 'text-emerald-600', bg: 'bg-emerald-500', iconBg: 'bg-emerald-50' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<KilnFiringRecord | null>(null);

  const maxTemp = params.find((p) => p.key === 'maxTemp')?.value ?? 1230;
  const kilnSpeed = params.find((p) => p.key === 'kilnSpeed')?.value ?? 9.6;
  const oxygenLevel = params.find((p) => p.key === 'oxygenLevel')?.value ?? 3.2;

  const handleSliderChange = (key: string, value: number) => {
    setParams((prev) =>
      prev.map((p) => (p.key === key ? { ...p, value } : p))
    );
  };

  const handleAdjust = (key: string, delta: number) => {
    setParams((prev) =>
      prev.map((p) => {
        if (p.key !== key) return p;
        const newValue = Math.max(p.min, Math.min(p.max, +(p.value + delta).toFixed(2)));
        return { ...p, value: newValue };
      })
    );
  };

  const handleReset = () => {
    setParams([
      { key: 'kilnSpeed', label: '窑速调节', value: 9.6, min: 5, max: 15, step: 0.1, unit: 'm/min', icon: Timer, color: 'text-kiln-600', bg: 'bg-kiln-500', iconBg: 'bg-kiln-50' },
      { key: 'maxTemp', label: '最高温度', value: 1230, min: 1180, max: 1280, step: 5, unit: '℃', icon: ThermometerSun, color: 'text-orange-600', bg: 'bg-gradient-to-r from-orange-500 to-kiln-500', iconBg: 'bg-orange-50' },
      { key: 'firingTime', label: '烧成周期', value: 62.5, min: 50, max: 80, step: 0.5, unit: 'min', icon: Zap, color: 'text-gold-600', bg: 'bg-gold-500', iconBg: 'bg-gold-50' },
      { key: 'oxygenLevel', label: '氧含量', value: 3.2, min: 1, max: 8, step: 0.1, unit: '%', icon: Wind, color: 'text-cyan-600', bg: 'bg-cyan-500', iconBg: 'bg-cyan-50' },
      { key: 'airFuelRatio', label: '空燃比', value: 10.8, min: 9, max: 13, step: 0.1, unit: '', icon: Gauge, color: 'text-blue-600', bg: 'bg-blue-500', iconBg: 'bg-blue-50' },
      { key: 'kilnPressure', label: '窑压', value: 15.6, min: 5, max: 25, step: 0.1, unit: 'Pa', icon: Gauge, color: 'text-emerald-600', bg: 'bg-emerald-500', iconBg: 'bg-emerald-50' },
    ]);
  };

  const filteredRecords = useMemo(() => {
    return kilnFiringRecords.filter((r) => {
      const matchSearch =
        !searchTerm ||
        r.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.kilnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.operator.includes(searchTerm);
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'high' && r.maxTemp > 1240) ||
        (filterStatus === 'normal' && r.maxTemp <= 1240);
      return matchSearch && matchStatus;
    });
  }, [searchTerm, filterStatus]);

  const handleExport = () => {
    const headers = ['批次号', '窑号', '最高温度(℃)', '窑速(m/min)', '周期(min)', '氧含量(%)', '能耗(kcal/kg)', '合格率(%)', '操作员'];
    const rows = filteredRecords.map((r) => [
      r.batchNo,
      r.kilnId,
      r.maxTemp,
      r.kilnSpeed.toFixed(1),
      r.totalFiringTime.toFixed(1),
      r.oxygenLevel.toFixed(1),
      r.fuelConsumption.toFixed(2),
      r.passRate?.toFixed(1) || '-',
      r.operator,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `烧成记录_${new Date().toLocaleDateString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { key: 'batchNo', title: '批次号', render: (r: KilnFiringRecord) => (
      <span className="font-mono text-xs text-kiln-600 font-semibold cursor-pointer hover:underline" onClick={() => setSelectedRecord(r)}>
        {r.batchNo}
      </span>
    )},
    { key: 'kilnId', title: '窑号', render: (r: KilnFiringRecord) => (
      <span className="badge bg-kiln-50 text-kiln-700 border border-kiln-200">{r.kilnId}</span>
    )},
    { key: 'maxTemp', title: '最高温度(℃)', render: (r: KilnFiringRecord) => (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${r.maxTemp > 1240 ? 'bg-kiln-500 animate-pulse' : 'bg-emerald-500'}`} />
        <span className={`font-mono font-semibold ${r.maxTemp > 1240 ? 'text-kiln-600' : 'text-industrial-800'}`}>{r.maxTemp}</span>
      </div>
    )},
    { key: 'kilnSpeed', title: '窑速', render: (r: KilnFiringRecord) => <span className="font-mono">{r.kilnSpeed.toFixed(1)} m/min</span> },
    { key: 'totalFiringTime', title: '周期(min)', render: (r: KilnFiringRecord) => <span className="font-mono">{r.totalFiringTime.toFixed(1)}</span> },
    { key: 'oxygenLevel', title: '氧含量(%)', render: (r: KilnFiringRecord) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-2 rounded-full bg-industrial-200 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${(r.oxygenLevel / 8) * 100}%` }} />
        </div>
        <span className="font-mono font-semibold text-industrial-700 w-10">{r.oxygenLevel.toFixed(1)}</span>
      </div>
    )},
    { key: 'fuelConsumption', title: '能耗(kcal/kg)', render: (r: KilnFiringRecord) => <span className="font-mono">{r.fuelConsumption.toFixed(2)}</span> },
    { key: 'passRate', title: '合格率', render: (r: KilnFiringRecord) => {
      const rate = r.passRate ?? 0;
      const color = rate >= 95 ? 'text-emerald-600' : rate >= 92 ? 'text-gold-600' : 'text-kiln-600';
      return <span className={`font-mono font-bold ${color}`}>{rate.toFixed(1)}%</span>;
    }},
    { key: 'action', title: '操作', render: (r: KilnFiringRecord) => (
      <button onClick={() => setSelectedRecord(r)} className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-kiln-600 bg-kiln-50 rounded-md hover:bg-kiln-100 transition-colors">
        <Eye className="w-3.5 h-3.5" />
        详情
      </button>
    )},
  ];

  const avgPassRate = (kilnFiringRecords.reduce((s, r) => s + (r.passRate ?? 0), 0) / kilnFiringRecords.length).toFixed(1);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="辊道窑烧成 · 温度控制"
        subtitle="12温区智能温控 · 烧成周期精确管理"
        icon={<Flame className="w-5 h-5" />}
        actions={['refresh']}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="辊道窑运行"
          value="正常"
          icon={<Flame className="w-6 h-6" />}
          change={0}
          accent="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="今日出窑"
          value="22680"
          unit="片"
          icon={<Zap className="w-6 h-6" />}
          change={4.8}
          accent="text-kiln-600"
          iconBg="bg-kiln-50"
        />
        <StatCard
          title="平均烧成合格率"
          value={avgPassRate}
          unit="%"
          icon={<Gauge className="w-6 h-6" />}
          change={1.2}
          accent="text-gold-600"
          iconBg="bg-gold-50"
        />
        <StatCard
          title="单位能耗"
          value="312"
          unit="kcal/kg"
          icon={<ThermometerSun className="w-6 h-6" />}
          change={-2.1}
          accent="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      <KilnVisualizer
        maxTemp={maxTemp}
        kilnSpeed={kilnSpeed}
        oxygenLevel={oxygenLevel}
        showChangeIndicator
        onReset={handleReset}
      />

      <div className="card">
        <div className="px-5 py-4 border-b border-industrial-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kiln-50 to-gold-50 border border-kiln-100 flex items-center justify-center text-kiln-600">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-industrial-900">参数调控中心</h3>
              <p className="text-xs text-industrial-500 mt-0.5">实时调节窑炉关键工艺参数 · 支持滑块拖动与精准微调</p>
            </div>
          </div>
          <button onClick={handleReset} className="btn-secondary !py-2 text-sm inline-flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>一键复位</span>
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {params.map((param) => {
            const Icon = param.icon;
            const pct = ((param.value - param.min) / (param.max - param.min)) * 100;
            const borderColor = param.color.includes('kiln') ? '#C8381F'
              : param.color.includes('gold') ? '#D4A547'
              : param.color.includes('orange') ? '#F97316'
              : param.color.includes('cyan') ? '#06B6D4'
              : param.color.includes('blue') ? '#3B82F6'
              : '#10B981';
            return (
              <div key={param.key} className="card p-5 relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle, rgba(200,56,31,0.06) 0%, transparent 70%)' }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${param.iconBg} flex items-center justify-center ${param.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-industrial-800">{param.label}</h4>
                        <p className="text-[11px] text-industrial-400 mt-0.5">范围 {param.min} - {param.max} {param.unit}</p>
                      </div>
                    </div>
                    <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">正常区间</span>
                  </div>

                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <span className={`font-display text-3xl font-bold ${param.color} transition-transform duration-300 group-hover:scale-105 inline-block`}>
                        {param.value.toFixed(param.step < 1 ? 1 : 0)}
                      </span>
                      {param.unit && <span className="text-sm font-medium text-industrial-400 ml-1">{param.unit}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdjust(param.key, -param.step)}
                        className="w-8 h-8 rounded-lg border border-industrial-200 bg-white flex items-center justify-center text-industrial-600 hover:bg-kiln-50 hover:border-kiln-300 hover:text-kiln-600 transition-all active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAdjust(param.key, param.step)}
                        className="w-8 h-8 rounded-lg border border-industrial-200 bg-white flex items-center justify-center text-industrial-600 hover:bg-kiln-50 hover:border-kiln-300 hover:text-kiln-600 transition-all active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="relative h-2 rounded-full bg-industrial-200">
                      <div className={`absolute left-0 top-0 h-full rounded-full ${param.bg} transition-all duration-300`} style={{ width: `${pct}%` }} />
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={param.value}
                        onChange={(e) => handleSliderChange(param.key, parseFloat(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 shadow-md transition-all duration-300 pointer-events-none"
                        style={{ left: `calc(${pct}% - 10px)`, borderColor }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-industrial-400 mt-2 font-mono">
                    <span>{param.min}</span>
                    <span className="text-industrial-500">最佳值</span>
                    <span>{param.max}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-industrial-100 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">烧成记录</h3>
            <p className="text-xs text-industrial-500 mt-0.5">共 {filteredRecords.length} / {kilnFiringRecords.length} 条记录</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-industrial-400" />
              <input
                type="text"
                placeholder="搜索批次/窑号/操作员..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field !w-56 !pl-9 !py-2 text-sm"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field !w-32 !py-2 text-sm"
            >
              <option value="all">全部状态</option>
              <option value="normal">温度正常</option>
              <option value="high">超温</option>
            </select>
            <button onClick={handleExport} className="btn-secondary !py-2 text-sm inline-flex items-center gap-1.5">
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredRecords}
          rowKey="id"
          emptyText="暂无烧成记录"
        />

        <div className="px-5 py-4 border-t border-industrial-100 flex items-center justify-between text-sm text-industrial-500">
          <span>显示 {filteredRecords.length} 条记录</span>
          <div className="flex items-center gap-1">
            <button className="btn-secondary !py-1.5 !px-3 text-xs">上一页</button>
            <span className="px-3 py-1.5 text-kiln-600 font-semibold">1</span>
            <button className="btn-secondary !py-1.5 !px-3 text-xs">下一页</button>
          </div>
        </div>
      </div>

      {selectedRecord && (
        <BatchDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </div>
  );
}
