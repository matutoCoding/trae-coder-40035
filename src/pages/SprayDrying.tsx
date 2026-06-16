import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import { sprayDryingRecords } from '@/utils/mockData';
import { CloudRain, Thermometer, Droplets, Wind } from 'lucide-react';

export default function SprayDrying() {
  const towers = [
    {
      id: 'SD-201',
      status: '运行中',
      inletTemp: 542,
      inletSet: 550,
      outletTemp: 98,
      outletSet: 95,
      pressure: 2.1,
      pressureMax: 3.0,
      feedRate: 21.5,
      feedRateMax: 30,
    },
    {
      id: 'SD-202',
      status: '运行中',
      inletTemp: 538,
      inletSet: 550,
      outletTemp: 92,
      outletSet: 95,
      pressure: 1.9,
      pressureMax: 3.0,
      feedRate: 19.8,
      feedRateMax: 30,
    },
  ];

  return (
    <div className="p-6">
      <SectionHeader
        title="喷雾干燥 · 造粒监控"
        subtitle="喷雾干燥塔运行状态与粉料质量追踪"
        icon={<CloudRain className="w-5 h-5" />}
        actions={['add', 'export', 'refresh']}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="塔运行"
          value="2/2"
          unit="台"
          icon={<Thermometer className="w-6 h-6" />}
          change={0}
          accent="text-kiln-600"
          iconBg="bg-kiln-50"
        />
        <StatCard
          title="今日造粒"
          value="98.2"
          unit="吨"
          icon={<CloudRain className="w-6 h-6" />}
          change={4.2}
          accent="text-gold-600"
          iconBg="bg-gold-50"
        />
        <StatCard
          title="平均水分"
          value="6.8"
          unit="%"
          icon={<Droplets className="w-6 h-6" />}
          change={-0.5}
          accent="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="造粒效率"
          value="78.5"
          unit="%"
          icon={<Wind className="w-6 h-6" />}
          change={2.3}
          accent="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">塔实时状态</h3>
            <p className="text-xs text-industrial-500 mt-0.5">双喷塔并行运行 · 实时参数监控</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-industrial-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              在线运行
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {towers.map((tower) => (
            <div key={tower.id} className="rounded-2xl border border-industrial-200 bg-gradient-to-br from-industrial-50 to-white p-5 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-kiln-500/5" />
              <div className="absolute right-8 top-8 w-16 h-16 rounded-full bg-gold-500/5" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kiln-500 to-gold-500 flex items-center justify-center text-white shadow-lg">
                      <CloudRain className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-bold text-industrial-900">{tower.id} 号塔</h4>
                      <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
                        {tower.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-industrial-500">进料量</div>
                    <div className="font-display text-xl font-bold text-kiln-600">
                      {tower.feedRate}<span className="text-xs font-normal text-industrial-500"> m³/h</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="rounded-xl bg-white p-4 border border-industrial-100 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-industrial-500 flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-kiln-500" />
                        进口温度
                      </span>
                      <span className="text-[10px] text-industrial-400">设定 {tower.inletSet}℃</span>
                    </div>
                    <div className="font-display text-3xl font-bold text-kiln-600 leading-tight">
                      {tower.inletTemp}
                      <span className="text-sm font-normal text-industrial-500 ml-1">℃</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-industrial-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-kiln-500 to-kiln-600"
                        style={{ width: `${(tower.inletTemp / tower.inletSet) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-4 border border-industrial-100 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-industrial-500 flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5 text-emerald-500" />
                        出口温度
                      </span>
                      <span className="text-[10px] text-industrial-400">设定 {tower.outletSet}℃</span>
                    </div>
                    <div className="font-display text-3xl font-bold text-emerald-600 leading-tight">
                      {tower.outletTemp}
                      <span className="text-sm font-normal text-industrial-500 ml-1">℃</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-industrial-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                        style={{ width: `${Math.min((tower.outletTemp / 120) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-industrial-600 flex items-center gap-1">
                        <Wind className="w-3.5 h-3.5 text-gold-500" />
                        喷雾压力
                      </span>
                      <span className="font-mono font-semibold text-industrial-800">{tower.pressure.toFixed(1)} MPa</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-industrial-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-600 transition-all"
                        style={{ width: `${(tower.pressure / tower.pressureMax) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-industrial-600 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-500" />
                        进料速率
                      </span>
                      <span className="font-mono font-semibold text-industrial-800">{tower.feedRate.toFixed(1)} / {tower.feedRateMax} m³/h</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-industrial-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                        style={{ width: `${(tower.feedRate / tower.feedRateMax) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-industrial-100 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">粉料质量分析</h3>
            <p className="text-xs text-industrial-500 mt-0.5">最近 {sprayDryingRecords.length} 批次粉料检测记录</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="搜索批次..." className="input-field !w-48 !py-2 text-sm" />
            <select className="input-field !w-36 !py-2 text-sm">
              <option>全部塔号</option>
              <option>SD-201</option>
              <option>SD-202</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-industrial-100">
                <th className="table-th">批次</th>
                <th className="table-th">塔号</th>
                <th className="table-th">进温(℃)</th>
                <th className="table-th">出温(℃)</th>
                <th className="table-th">压力(MPa)</th>
                <th className="table-th">粉料粒径(μm)</th>
                <th className="table-th">水分(%)</th>
                <th className="table-th">流动性(%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-50">
              {sprayDryingRecords.map((record) => (
                <tr key={record.id} className="hover:bg-industrial-50/50 transition-colors">
                  <td className="table-td font-mono text-xs text-kiln-600 font-semibold">{record.batchNo}</td>
                  <td className="table-td">
                    <span className={`badge ${record.towerId === 'SD-201' ? 'bg-kiln-50 text-kiln-700' : 'bg-gold-50 text-gold-700'}`}>
                      {record.towerId}
                    </span>
                  </td>
                  <td className="table-td font-mono">{record.inletTemp.toFixed(0)}</td>
                  <td className="table-td font-mono">{record.outletTemp.toFixed(0)}</td>
                  <td className="table-td font-mono">{record.pressure.toFixed(2)}</td>
                  <td className="table-td">
                    <span className={`font-mono font-semibold ${record.powderSize < 60 || record.powderSize > 90 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {record.powderSize.toFixed(1)}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className={`font-mono font-semibold ${record.powderMoisture > 7.5 ? 'text-kiln-600' : 'text-emerald-600'}`}>
                      {record.powderMoisture.toFixed(1)}
                    </span>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 rounded-full bg-industrial-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                          style={{ width: `${record.flowability}%` }}
                        />
                      </div>
                      <span className="font-mono font-semibold text-industrial-700 w-10">{record.flowability.toFixed(0)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-industrial-100 flex items-center justify-between text-sm text-industrial-500">
          <span>共 {sprayDryingRecords.length} 条记录</span>
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
