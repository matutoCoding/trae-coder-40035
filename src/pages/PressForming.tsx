import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import { pressFormingRecords } from '@/utils/mockData';
import { Hammer, Gauge, Ruler, Box } from 'lucide-react';

export default function PressForming() {
  const presses = [
    { id: 'PR-301', mold: '800×800', pressure: 320, pressureMax: 400, cycle: 7.2, output: 2680, status: 'running' },
    { id: 'PR-302', mold: '600×1200', pressure: 295, pressureMax: 400, cycle: 8.1, output: 2340, status: 'running' },
    { id: 'PR-303', mold: '800×800', pressure: 245, pressureMax: 400, cycle: 7.5, output: 1890, status: 'warning' },
    { id: 'PR-304', mold: '600×600', pressure: 310, pressureMax: 400, cycle: 6.3, output: 3120, status: 'running' },
    { id: 'PR-305', mold: '750×1500', pressure: 340, pressureMax: 400, cycle: 9.2, output: 1980, status: 'running' },
    { id: 'PR-306', mold: '800×800', pressure: 0, pressureMax: 400, cycle: 0, output: 0, status: 'maintenance' },
  ];

  const statusConfig = {
    running: { light: 'bg-emerald-500', label: '运行中', labelClass: 'text-emerald-700 bg-emerald-50' },
    warning: { light: 'bg-amber-500', label: '异常', labelClass: 'text-amber-700 bg-amber-50 animate-pulse' },
    maintenance: { light: 'bg-industrial-400', label: '维护中', labelClass: 'text-industrial-600 bg-industrial-100' },
  };

  return (
    <div className="p-6">
      <SectionHeader
        title="压制成型 · 砖坯成型"
        subtitle="液压压机状态与砖坯成型质量监控"
        icon={<Hammer className="w-5 h-5" />}
        actions={['add', 'export', 'refresh']}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="压机运行"
          value="5/6"
          unit="台"
          icon={<Hammer className="w-6 h-6" />}
          change={0}
          accent="text-kiln-600"
          iconBg="bg-kiln-50"
        />
        <StatCard
          title="今日成型"
          value="24680"
          unit="片"
          icon={<Box className="w-6 h-6" />}
          change={3.6}
          accent="text-gold-600"
          iconBg="bg-gold-50"
        />
        <StatCard
          title="平均缺陷率"
          value="1.8"
          unit="%"
          icon={<Gauge className="w-6 h-6" />}
          change={-0.4}
          accent="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="模具在产"
          value="4"
          unit="套"
          icon={<Ruler className="w-6 h-6" />}
          change={1}
          changeLabel="较昨日"
          accent="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">压机状态网格</h3>
            <p className="text-xs text-industrial-500 mt-0.5">当前车间6台全自动液压压机</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-industrial-600">运行中</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-industrial-600">异常</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-industrial-400" />
              <span className="text-industrial-600">维护</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {presses.map((press) => {
            const cfg = statusConfig[press.status as keyof typeof statusConfig];
            const pressurePct = (press.pressure / press.pressureMax) * 100;
            return (
              <div
                key={press.id}
                className={`rounded-2xl border p-5 transition-all hover:shadow-lg relative overflow-hidden ${
                  press.status === 'warning'
                    ? 'border-amber-200 bg-gradient-to-br from-amber-50/50 to-white'
                    : press.status === 'maintenance'
                    ? 'border-industrial-200 bg-gradient-to-br from-industrial-50/50 to-white opacity-75'
                    : 'border-industrial-200 bg-gradient-to-br from-kiln-50/30 to-white hover:border-kiln-300'
                }`}
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-kiln-500/5" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                          press.status === 'maintenance' ? 'bg-industrial-100' : 'bg-gradient-to-br from-kiln-500 to-kiln-600'
                        }`}>
                          <Hammer className={`w-6 h-6 ${press.status === 'maintenance' ? 'text-industrial-500' : 'text-white'}`} />
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${cfg.light} ring-2 ring-white shadow-sm`} />
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-bold text-industrial-900">{press.id}</h4>
                        <span className={`badge ${cfg.labelClass} mt-1`}>{cfg.label}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-industrial-500">模具规格</div>
                      <div className="font-display font-bold text-industrial-800">{press.mold}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-industrial-600 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-kiln-500" />
                        当前压力
                      </span>
                      <span className="font-mono font-bold text-industrial-800">
                        {press.pressure} <span className="text-industrial-500 font-normal">/ {press.pressureMax} bar</span>
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-industrial-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          press.status === 'warning'
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                            : press.status === 'maintenance'
                            ? 'bg-industrial-300'
                            : 'bg-gradient-to-r from-kiln-500 to-gold-500'
                        }`}
                        style={{ width: `${pressurePct}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-industrial-100">
                    <div className="text-center">
                      <div className="text-[10px] text-industrial-500 mb-0.5">节拍</div>
                      <div className="font-display font-bold text-industrial-800">
                        {press.cycle > 0 ? `${press.cycle}s` : '--'}
                      </div>
                    </div>
                    <div className="text-center border-x border-industrial-100">
                      <div className="text-[10px] text-industrial-500 mb-0.5">班产</div>
                      <div className="font-display font-bold text-kiln-600">
                        {press.output > 0 ? press.output.toLocaleString() : '--'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-industrial-500 mb-0.5">状态灯</div>
                      <div className="flex items-center justify-center gap-1 h-6">
                        <span className={`w-2 h-2 rounded-full ${cfg.light} ${press.status === 'running' ? 'animate-pulse' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-industrial-100 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">成型记录</h3>
            <p className="text-xs text-industrial-500 mt-0.5">最近 {pressFormingRecords.length} 批次砖坯成型记录</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="搜索批次..." className="input-field !w-48 !py-2 text-sm" />
            <select className="input-field !w-36 !py-2 text-sm">
              <option>全部压机</option>
              {presses.map((p) => (
                <option key={p.id}>{p.id}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-industrial-100">
                <th className="table-th">批次</th>
                <th className="table-th">压机</th>
                <th className="table-th">模具</th>
                <th className="table-th">压力(bar)</th>
                <th className="table-th">保压(s)</th>
                <th className="table-th">砖重(kg)</th>
                <th className="table-th">厚度(mm)</th>
                <th className="table-th">缺陷率(%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-50">
              {pressFormingRecords.map((record) => (
                <tr key={record.id} className="hover:bg-industrial-50/50 transition-colors">
                  <td className="table-td font-mono text-xs text-kiln-600 font-semibold">{record.batchNo}</td>
                  <td className="table-td">
                    <span className="badge bg-industrial-100 text-industrial-700">{record.pressId}</span>
                  </td>
                  <td className="table-td font-mono font-semibold">{record.moldSpec}</td>
                  <td className="table-td font-mono">{record.pressure.toFixed(0)}</td>
                  <td className="table-td font-mono">{record.holdingTime.toFixed(2)}</td>
                  <td className="table-td font-mono">{record.brickWeight.toFixed(2)}</td>
                  <td className="table-td font-mono">{record.thickness.toFixed(2)}</td>
                  <td className="table-td">
                    <span className={`font-mono font-semibold ${
                      record.defectRate > 2.5 ? 'text-kiln-600' : record.defectRate > 1.5 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {record.defectRate.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-industrial-100 flex items-center justify-between text-sm text-industrial-500">
          <span>共 {pressFormingRecords.length} 条记录</span>
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
