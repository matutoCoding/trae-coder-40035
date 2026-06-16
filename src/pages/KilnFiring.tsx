import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import KilnVisualizer, { calcZoneTemps, calcEnergyIndex, defaultMaxTemp, defaultKilnSpeed, defaultFiringTime, defaultAirFuel } from '@/components/kiln/KilnVisualizer';
import BatchDetailModal from '@/components/kiln/BatchDetailModal';
import DataTable from '@/components/common/DataTable';
import { kilnFiringRecords } from '@/utils/mockData';
import type { KilnFiringRecord } from '@/types';
import { Flame, ThermometerSun, Gauge, Wind, Timer, Settings, Minus, Plus, Zap, AlertTriangle, Search, Download, Eye, Save, Trash2, Check } from 'lucide-react';

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

interface ProcessScheme {
  id: string;
  name: string;
  description: string;
  params: { key: string; value: number }[];
  color: string;
}

const presetSchemes: ProcessScheme[] = [
  {
    id: 'scheme-a',
    name: '方案A - 标准工艺',
    description: '平衡能耗与品质，适合常规量产',
    params: [
      { key: 'maxTemp', value: 1230 },
      { key: 'kilnSpeed', value: 9.6 },
      { key: 'firingTime', value: 62.5 },
      { key: 'oxygenLevel', value: 3.2 },
      { key: 'airFuelRatio', value: 10.8 },
    ],
    color: '#10B981',
  },
  {
    id: 'scheme-b',
    name: '方案B - 高温长周期',
    description: '提升致密度与强度，适合高透产品',
    params: [
      { key: 'maxTemp', value: 1250 },
      { key: 'kilnSpeed', value: 8.5 },
      { key: 'firingTime', value: 72 },
      { key: 'oxygenLevel', value: 3.5 },
      { key: 'airFuelRatio', value: 11.2 },
    ],
    color: '#C8381F',
  },
  {
    id: 'scheme-c',
    name: '方案C - 低温快烧',
    description: '降低能耗，提升产量，适合普通砖',
    params: [
      { key: 'maxTemp', value: 1210 },
      { key: 'kilnSpeed', value: 11.0 },
      { key: 'firingTime', value: 55 },
      { key: 'oxygenLevel', value: 2.8 },
      { key: 'airFuelRatio', value: 10.5 },
    ],
    color: '#3B82F6',
  },
];

export default function KilnFiring() {
  const [schemes, setSchemes] = useState<ProcessScheme[]>(presetSchemes);
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
  const firingTime = params.find((p) => p.key === 'firingTime')?.value ?? 62.5;
  const airFuelRatio = params.find((p) => p.key === 'airFuelRatio')?.value ?? 10.8;

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

  const getSchemeParam = (scheme: ProcessScheme, key: string) =>
    scheme.params.find((p) => p.key === key)?.value ?? 0;

  const calcPassRate = (maxTemp: number, firingTime: number) => {
    let rate = 90;
    const tempOk = maxTemp >= 1220 && maxTemp <= 1240;
    const timeOk = firingTime >= 60 && firingTime <= 68;
    if (tempOk) rate += 4;
    if (timeOk) rate += 2;
    if (tempOk && timeOk) rate += 1;
    const tempDeviation = Math.max(0, Math.abs(maxTemp - 1230) - 10);
    const timeDeviation = Math.max(0, Math.abs(firingTime - 64) - 6);
    rate -= tempDeviation * 0.3 + timeDeviation * 0.25;
    return Math.max(82, Math.min(98, rate));
  };

  const calcRiskLevel = (maxTemp: number, firingTime: number, kilnSpeed: number) => {
    if (maxTemp > 1245 || firingTime < 55 || kilnSpeed > 12) return '高';
    if (maxTemp > 1240 || firingTime < 58 || kilnSpeed > 11.2) return '中';
    return '低';
  };

  const isCurrentScheme = (scheme: ProcessScheme) => {
    const keys = ['maxTemp', 'kilnSpeed', 'firingTime', 'oxygenLevel', 'airFuelRatio'];
    return keys.every((key) => {
      const current = params.find((p) => p.key === key)?.value ?? 0;
      const target = getSchemeParam(scheme, key);
      return Math.abs(current - target) < 0.01;
    });
  };

  const handleApplyScheme = (scheme: ProcessScheme) => {
    setParams((prev) =>
      prev.map((p) => {
        const sp = scheme.params.find((s) => s.key === p.key);
        return sp ? { ...p, value: sp.value } : p;
      })
    );
  };

  const handleSaveScheme = () => {
    const currentKeys = ['maxTemp', 'kilnSpeed', 'firingTime', 'oxygenLevel', 'airFuelRatio'];
    const schemeParams = currentKeys.map((key) => ({
      key,
      value: params.find((p) => p.key === key)?.value ?? 0,
    }));
    const customCount = schemes.filter((s) => s.id.startsWith('custom-')).length;
    const defaultName = `自定义方案${customCount + 1}`;
    const userInput = window.prompt('请输入方案名称：', defaultName);
    if (userInput === null) return;
    const name = userInput.trim() || defaultName;
    const palette = ['#8B5CF6', '#F97316', '#EC4899', '#06B6D4', '#84CC16'];
    const color = palette[customCount % palette.length];
    const newScheme: ProcessScheme = {
      id: `custom-${Date.now()}`,
      name,
      description: '用户自定义保存的工艺参数',
      params: schemeParams,
      color,
    };
    setSchemes((prev) => [...prev, newScheme]);
  };

  const handleDeleteScheme = (id: string) => {
    if (!window.confirm('确定要删除此方案吗？')) return;
    setSchemes((prev) => prev.filter((s) => s.id !== id));
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
        firingTime={firingTime}
        airFuelRatio={airFuelRatio}
        showChangeIndicator
        onReset={handleReset}
      />

      <div className="card">
        <div className="px-5 py-4 border-b border-industrial-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-industrial-900">工艺方案对比</h3>
              <p className="text-xs text-industrial-500 mt-0.5">保存多组参数方案，并排对比温度曲线与指标表现</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-kiln-50 text-kiln-700 border border-kiln-200 text-xs">
              {schemes.length} 个方案
            </span>
            <button
              onClick={handleSaveScheme}
              className="btn-primary !py-2 text-sm inline-flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              保存当前参数为新方案
            </button>
          </div>
        </div>

        <div className="p-5 overflow-x-auto">
          <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
            {schemes.map((scheme) => {
              const sMaxTemp = getSchemeParam(scheme, 'maxTemp');
              const sKilnSpeed = getSchemeParam(scheme, 'kilnSpeed');
              const sFiringTime = getSchemeParam(scheme, 'firingTime');
              const sOxygenLevel = getSchemeParam(scheme, 'oxygenLevel');
              const sAirFuelRatio = getSchemeParam(scheme, 'airFuelRatio');
              const zones = calcZoneTemps(sMaxTemp, sKilnSpeed, sOxygenLevel, sFiringTime, sAirFuelRatio);
              const chartData = zones.map((z) => ({
                name: z.name.replace('Z', ''),
                实际: z.actual,
              }));
              const energyIdx = calcEnergyIndex(sMaxTemp, sFiringTime, sKilnSpeed, sAirFuelRatio);
              const energyBaseIdx = calcEnergyIndex(defaultMaxTemp, defaultFiringTime, defaultKilnSpeed, defaultAirFuel);
              const energyDelta = ((energyIdx - energyBaseIdx) / energyBaseIdx) * 100;
              const passRate = calcPassRate(sMaxTemp, sFiringTime);
              const riskLevel = calcRiskLevel(sMaxTemp, sFiringTime, sKilnSpeed);
              const isCurrent = isCurrentScheme(scheme);
              const riskColor = riskLevel === '低' ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                : riskLevel === '中' ? 'text-gold-600 bg-gold-50 border-gold-200'
                : 'text-kiln-600 bg-kiln-50 border-kiln-200';

              return (
                <div
                  key={scheme.id}
                  className={`w-80 flex-shrink-0 rounded-xl border-2 bg-white transition-all ${
                    isCurrent ? 'border-emerald-500 shadow-lg shadow-emerald-100/50' : 'border-industrial-100 hover:border-industrial-200 hover:shadow-md'
                  }`}
                >
                  <div className="p-4 border-b border-industrial-100">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: scheme.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-industrial-900 truncate">{scheme.name}</h4>
                            {isCurrent && (
                              <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] inline-flex items-center gap-0.5">
                                <Check className="w-3 h-3" />
                                当前使用
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-industrial-500 mt-0.5 truncate">{scheme.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteScheme(scheme.id)}
                        className="p-1.5 rounded-lg text-industrial-400 hover:text-kiln-600 hover:bg-kiln-50 transition-colors flex-shrink-0"
                        title="删除方案"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="px-4 py-3 border-b border-industrial-100 bg-industrial-50/50">
                    <div className="h-28">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: -10 }}>
                          <Line
                            type="monotone"
                            dataKey="实际"
                            stroke={scheme.color}
                            strokeWidth={2.5}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-5 gap-2">
                    <div className="text-center">
                      <div className="text-[10px] text-industrial-500">最高温度</div>
                      <div className="font-mono font-bold text-industrial-800 text-sm mt-0.5">{sMaxTemp}°</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-industrial-500">烧成周期</div>
                      <div className="font-mono font-bold text-industrial-800 text-sm mt-0.5">{sFiringTime.toFixed(0)}分</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-industrial-500">能耗变化</div>
                      <div className={`font-mono font-bold text-sm mt-0.5 ${energyDelta > 0 ? 'text-kiln-600' : 'text-emerald-600'}`}>
                        {energyDelta > 0 ? '+' : ''}{energyDelta.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-industrial-500">预计合格</div>
                      <div className={`font-mono font-bold text-sm mt-0.5 ${passRate >= 95 ? 'text-emerald-600' : passRate >= 92 ? 'text-gold-600' : 'text-kiln-600'}`}>
                        {passRate.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-industrial-500">风险等级</div>
                      <span className={`badge text-[10px] px-1.5 py-0.5 mt-0.5 inline-block border ${riskColor}`}>
                        {riskLevel}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handleApplyScheme(scheme)}
                      disabled={isCurrent}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center justify-center gap-1.5 ${
                        isCurrent
                          ? 'bg-industrial-100 text-industrial-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-kiln-500 to-orange-500 text-white hover:from-kiln-600 hover:to-orange-600 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-4 h-4" />
                          已应用当前方案
                        </>
                      ) : (
                        '应用此方案'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
