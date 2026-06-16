import { useMemo, useState } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import DataTable from '@/components/common/DataTable';
import { glazingRecords } from '@/utils/mockData';
import type { GlazingRecord } from '@/types';
import { PaintBucket, Sun, Palette, Droplet, Search, Filter, Download } from 'lucide-react';

export default function Glazing() {
  const [searchText, setSearchText] = useState('');
  const [glazeFilter, setGlazeFilter] = useState('all');

  const dryerZones = [
    { name: 'Z1预热', temp: 132, max: 150, color: 'from-blue-400 to-cyan-400' },
    { name: 'Z2升温', temp: 168, max: 200, color: 'from-cyan-400 to-green-400' },
    { name: 'Z3恒温', temp: 195, max: 220, color: 'from-green-400 to-lime-400' },
    { name: 'Z4高温', temp: 215, max: 240, color: 'from-lime-400 to-amber-400' },
    { name: 'Z5均热', temp: 202, max: 240, color: 'from-amber-400 to-orange-400' },
    { name: 'Z6降温', temp: 172, max: 220, color: 'from-orange-400 to-kiln-400' },
  ];

  const glazeParams = [
    { label: '釉浆比重', value: 1.52, min: 1.3, max: 1.7, unit: 'g/cm³', color: 'text-kiln-600', bg: 'bg-kiln-500', icon: PaintBucket },
    { label: '施釉量', value: 520, min: 300, max: 700, unit: 'g/m²', color: 'text-gold-600', bg: 'bg-gold-500', icon: Droplet },
    { label: '釉层厚度', value: 0.68, min: 0.3, max: 1.0, unit: 'mm', color: 'text-blue-600', bg: 'bg-blue-500', icon: Palette },
  ];

  function Gauge({ value, min, max, bg }: { value: number; min: number; max: number; bg: string }) {
    const pct = ((value - min) / (max - min)) * 100;
    const angle = (pct / 100) * 180 - 90;
    return (
      <div className="relative w-36 h-20 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 140 80">
          <defs>
            <linearGradient id={`gauge-${bg}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e5e7eb" />
              <stop offset={`${pct * 0.8}%`} stopColor={bg === 'bg-kiln-500' ? '#C8381F' : bg === 'bg-gold-500' ? '#D4A547' : '#3B82F6'} />
              <stop offset={`${pct}%`} stopColor={bg === 'bg-kiln-500' ? '#C8381F' : bg === 'bg-gold-500' ? '#D4A547' : '#3B82F6'} />
              <stop offset={`${pct + 0.1}%`} stopColor="#e5e7eb" />
              <stop offset="100%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path
            d="M 10 70 A 60 60 0 0 1 130 70"
            fill="none"
            stroke={`url(#gauge-${bg})`}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <line
            x1="70"
            y1="70"
            x2={70 + 50 * Math.cos((angle * Math.PI) / 180)}
            y2={70 + 50 * Math.sin((angle * Math.PI) / 180)}
            stroke="#1A1D21"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="70" cy="70" r="5" fill="#1A1D21" />
        </svg>
      </div>
    );
  }

  const filteredRecords = useMemo(() => {
    return glazingRecords.filter((record) => {
      const matchSearch =
        searchText === '' ||
        record.batchNo.toLowerCase().includes(searchText.toLowerCase()) ||
        record.patternName.toLowerCase().includes(searchText.toLowerCase()) ||
        record.operator.toLowerCase().includes(searchText.toLowerCase());

      let matchGlaze = true;
      if (glazeFilter === 'thin') {
        matchGlaze = record.glazeThickness < 0.55;
      } else if (glazeFilter === 'normal') {
        matchGlaze = record.glazeThickness >= 0.55 && record.glazeThickness <= 0.75;
      } else if (glazeFilter === 'thick') {
        matchGlaze = record.glazeThickness > 0.75;
      }

      return matchSearch && matchGlaze;
    });
  }, [searchText, glazeFilter]);

  const handleExport = () => {
    const headers = ['批次号', '图案名称', '干燥时间(min)', '釉浆比重', '施釉量(g/㎡)', '釉层厚度(mm)', '干燥损失(%)', '操作员'];
    const rows = filteredRecords.map((record) => [
      record.batchNo,
      record.patternName,
      record.dryingTime.toFixed(1),
      record.glazeDensity.toFixed(3),
      record.glazeAmount.toFixed(0),
      record.glazeThickness.toFixed(2),
      record.dryingLoss.toFixed(2),
      record.operator,
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `施釉记录_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      key: 'batchNo',
      title: '批次',
      render: (row: GlazingRecord) => (
        <span className="font-mono text-xs text-kiln-600 font-semibold">{row.batchNo}</span>
      ),
    },
    {
      key: 'patternName',
      title: '图案',
      render: (row: GlazingRecord) => (
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-gold-100 to-kiln-100 border border-gold-200 flex items-center justify-center">
            <Palette className="w-3.5 h-3.5 text-kiln-600" />
          </span>
          <span className="font-medium text-industrial-800">{row.patternName}</span>
        </div>
      ),
    },
    {
      key: 'dryingTime',
      title: '干燥时间(min)',
      render: (row: GlazingRecord) => <span className="font-mono">{row.dryingTime.toFixed(1)}</span>,
    },
    {
      key: 'glazeDensity',
      title: '釉比重',
      render: (row: GlazingRecord) => (
        <span
          className={`font-mono font-semibold ${
            row.glazeDensity > 1.6 || row.glazeDensity < 1.4 ? 'text-amber-600' : 'text-emerald-600'
          }`}
        >
          {row.glazeDensity.toFixed(3)}
        </span>
      ),
    },
    {
      key: 'glazeAmount',
      title: '施釉量',
      render: (row: GlazingRecord) => (
        <span className="font-mono">{row.glazeAmount.toFixed(0)} g/m²</span>
      ),
    },
    {
      key: 'glazeThickness',
      title: '釉厚(mm)',
      render: (row: GlazingRecord) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 rounded-full bg-industrial-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-kiln-500"
              style={{ width: `${(row.glazeThickness / 1.0) * 100}%` }}
            />
          </div>
          <span className="font-mono font-semibold text-industrial-700 w-12">
            {row.glazeThickness.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      key: 'dryingLoss',
      title: '干燥损失(%)',
      render: (row: GlazingRecord) => (
        <span
          className={`font-mono font-semibold ${row.dryingLoss > 0.6 ? 'text-kiln-600' : 'text-emerald-600'}`}
        >
          {row.dryingLoss.toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <SectionHeader
        title="干燥施釉 · 淋釉印花"
        subtitle="砖坯干燥曲线与施釉工艺参数监控"
        icon={<PaintBucket className="w-5 h-5" />}
        actions={['add', 'export', 'refresh']}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="干燥窑运行"
          value="正常"
          icon={<Sun className="w-6 h-6" />}
          accent="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="施釉线运行"
          value="2"
          unit="条"
          icon={<PaintBucket className="w-6 h-6" />}
          change={0}
          accent="text-kiln-600"
          iconBg="bg-kiln-50"
        />
        <StatCard
          title="釉料批次"
          value="今日 5"
          unit="批"
          icon={<Palette className="w-6 h-6" />}
          change={1}
          accent="text-gold-600"
          iconBg="bg-gold-50"
        />
        <StatCard
          title="图案切换"
          value="3"
          unit="次"
          icon={<Droplet className="w-6 h-6" />}
          changeLabel="今日"
          accent="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">干燥曲线</h3>
            <p className="text-xs text-industrial-500 mt-0.5">6温区干燥窑实时温度 · 砖坯预热至固化全流程</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">曲线正常</span>
            <span className="text-xs text-industrial-500">更新于 09:45:12</span>
          </div>
        </div>

        <div className="relative pt-8 pb-4">
          <div className="absolute left-0 right-0 top-4 h-[calc(100%-2rem)] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dryArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8381F" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#C8381F" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M ${[65, 195, 195, 325, 455, 585, 715].map((x, i) => {
                  const t = i === 0 ? 132 : dryerZones[i - 1].temp;
                  const y = 20 + (240 - t) * 0.7;
                  return `${x} ${y}`;
                }).join(' L ')} L 715 195 L 65 195 Z`}
                fill="url(#dryArea)"
              />
              <polyline
                fill="none"
                stroke="#C8381F"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={[65, 195, 195, 325, 455, 585, 715].map((x, i) => {
                  const t = i === 0 ? 132 : dryerZones[i - 1].temp;
                  const y = 20 + (240 - t) * 0.7;
                  return `${x},${y}`;
                }).join(' ')}
              />
              {[65, 195, 325, 455, 585, 715].map((x, i) => {
                const t = i === 0 ? 132 : dryerZones[i - 1].temp;
                const y = 20 + (240 - t) * 0.7;
                return (
                  <circle key={i} cx={x} cy={y} r="5" fill="#fff" stroke="#C8381F" strokeWidth="2.5" />
                );
              })}
            </svg>
          </div>

          <div className="grid grid-cols-6 gap-3 relative">
            {dryerZones.map((zone, idx) => {
              const heightPct = (zone.temp / zone.max) * 100;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-xs font-mono font-bold text-industrial-800 mb-2">{zone.temp}℃</div>
                  <div className="w-full h-32 rounded-t-xl bg-industrial-100 relative overflow-hidden flex items-end shadow-inner">
                    <div
                      className={`w-full rounded-t-xl bg-gradient-to-t ${zone.color} transition-all duration-700 relative`}
                      style={{ height: `${heightPct}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white/90 drop-shadow-md bg-black/20 px-1.5 py-0.5 rounded">
                        {zone.temp}°
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs font-semibold text-industrial-700">{zone.name}</div>
                    <div className="text-[10px] text-industrial-500">设定 {zone.max}°</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-industrial-100 grid grid-cols-4 gap-3 text-center">
            {[
              { label: '干燥周期', value: '52', unit: 'min' },
              { label: '最高温度', value: '215', unit: '℃' },
              { label: '砖坯水分', value: '0.8', unit: '%' },
              { label: '传送速度', value: '6.8', unit: 'm/min' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-industrial-50 p-3">
                <div className="font-display text-xl font-bold text-industrial-800">
                  {item.value}<span className="text-xs font-normal text-industrial-500 ml-0.5">{item.unit}</span>
                </div>
                <div className="text-[11px] text-industrial-500 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        {glazeParams.map((param) => {
          const Icon = param.icon;
          const pct = ((param.value - param.min) / (param.max - param.min)) * 100;
          return (
            <div key={param.label} className="card p-5 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-kiln-500/5 to-gold-500/5" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-lg ${param.color.replace('text-', 'bg-').replace('600', '50')} flex items-center justify-center ${param.color}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="font-semibold text-industrial-800">{param.label}</span>
                  </div>
                  <span className="badge bg-emerald-50 text-emerald-700 text-[10px]">合格</span>
                </div>

                <Gauge
                  value={param.value}
                  min={param.min}
                  max={param.max}
                  bg={param.bg}
                />

                <div className="text-center mt-2">
                  <span className={`font-display text-2xl font-bold ${param.color}`}>
                    {typeof param.value === 'number' ? param.value.toFixed(param.value < 10 ? 2 : 0) : param.value}
                  </span>
                  <span className="text-sm text-industrial-500 ml-1">{param.unit}</span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[10px] text-industrial-500 mb-1">
                    <span>{param.min} {param.unit}</span>
                    <span>{param.max} {param.unit}</span>
                  </div>
                  <div className="h-2 rounded-full bg-industrial-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${param.bg}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-industrial-100 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">施釉记录</h3>
            <p className="text-xs text-industrial-500 mt-0.5">
              最近 {glazingRecords.length} 批次施釉干燥记录
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-industrial-400" />
              <input
                type="text"
                placeholder="搜索批次号、图案、操作员..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="input-field !w-72 !py-2 !pl-8 text-sm"
              />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-industrial-400" />
              <select
                value={glazeFilter}
                onChange={(e) => setGlazeFilter(e.target.value)}
                className="input-field !w-36 !py-2 !pl-8 text-sm appearance-none pr-8"
              >
                <option value="all">全部釉厚</option>
                <option value="thin">偏薄</option>
                <option value="normal">正常</option>
                <option value="thick">偏厚</option>
              </select>
            </div>
            <button
              onClick={handleExport}
              className="btn-primary !py-2 text-sm inline-flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>

        <DataTable<GlazingRecord>
          columns={columns}
          data={filteredRecords}
          rowKey="id"
        />

        <div className="px-5 py-4 border-t border-industrial-100 flex items-center justify-between text-sm text-industrial-500">
          <span>
            显示 {filteredRecords.length} / 共 {glazingRecords.length} 条记录
          </span>
          <div className="flex items-center gap-1">
            <button className="btn-secondary !py-1.5 !px-3 text-xs">上一页</button>
            <span className="px-3 py-1.5 text-kiln-600 font-semibold">1</span>
            <button className="btn-secondary !py-1.5 !px-3 text-xs">下一页</button>
          </div>
        </div>
      </div>
    </div>
  );
}
