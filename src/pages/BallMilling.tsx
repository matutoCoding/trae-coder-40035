import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import { ballMillingRecords, formulas } from '@/utils/mockData';
import { FlaskConical, Beaker, Scale, Clock, Eye, Edit2, Play } from 'lucide-react';

export default function BallMilling() {
  const statusConfig = {
    running: { label: '运行中', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    completed: { label: '已完成', className: 'bg-industrial-50 text-industrial-600 border-industrial-200' },
    paused: { label: '已暂停', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  };

  return (
    <div className="p-6">
      <SectionHeader
        title="原料球磨 · 泥浆配料"
        subtitle="球磨配方管理与泥浆细度监控"
        icon={<FlaskConical className="w-5 h-5" />}
        actions={['add', 'export', 'refresh']}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="球磨机运行中"
          value="3/4"
          unit="台"
          icon={<Beaker className="w-6 h-6" />}
          change={0}
          accent="text-kiln-600"
          iconBg="bg-kiln-50"
        />
        <StatCard
          title="今日处理量"
          value="128.5"
          unit="吨"
          icon={<Scale className="w-6 h-6" />}
          change={6.8}
          accent="text-gold-600"
          iconBg="bg-gold-50"
        />
        <StatCard
          title="平均细度"
          value="1.2"
          unit="%"
          icon={<FlaskConical className="w-6 h-6" />}
          change={-0.3}
          accent="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="平均球磨时间"
          value="12.4"
          unit="h"
          icon={<Clock className="w-6 h-6" />}
          change={-2.1}
          accent="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">配方管理</h3>
            <p className="text-xs text-industrial-500 mt-0.5">当前在产配方共 {formulas.length} 套</p>
          </div>
          <button className="btn-secondary !py-2 text-sm">管理配方</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {formulas.map((formula) => (
            <div key={formula.id} className="rounded-xl border border-industrial-200 bg-industrial-50/50 p-4 hover:border-kiln-300 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="badge bg-kiln-50 text-kiln-700 border border-kiln-200">{formula.id}</span>
                  <h4 className="font-display text-base font-semibold text-industrial-900 mt-2">{formula.name}</h4>
                </div>
                <span className="text-xs text-industrial-500">使用 {formula.usageCount} 次</span>
              </div>
              <p className="text-xs text-industrial-500 mb-3">{formula.description}</p>
              <div className="space-y-2 mb-4">
                {formula.recipe.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-industrial-600">{item.material}</span>
                      <span className="font-semibold text-industrial-800">{item.ratio}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-industrial-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-kiln-500 to-gold-500 transition-all duration-500"
                        style={{ width: `${item.ratio}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-secondary !py-1.5 !px-3 text-xs flex-1 inline-flex items-center justify-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  详情
                </button>
                <button className="btn-secondary !py-1.5 !px-3 text-xs flex-1 inline-flex items-center justify-center gap-1">
                  <Edit2 className="w-3.5 h-3.5" />
                  编辑
                </button>
                <button className="btn-primary !py-1.5 !px-3 text-xs flex-1 inline-flex items-center justify-center gap-1">
                  <Play className="w-3.5 h-3.5" />
                  启用
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-industrial-100 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">球磨记录</h3>
            <p className="text-xs text-industrial-500 mt-0.5">最近 {ballMillingRecords.length} 条球磨批次记录</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="搜索批次号..." className="input-field !w-48 !py-2 text-sm" />
            <select className="input-field !w-36 !py-2 text-sm">
              <option>全部状态</option>
              <option>运行中</option>
              <option>已完成</option>
              <option>已暂停</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-industrial-100">
                <th className="table-th">批次号</th>
                <th className="table-th">球磨机</th>
                <th className="table-th">配方</th>
                <th className="table-th">转速(rpm)</th>
                <th className="table-th">球石比</th>
                <th className="table-th">时长(h)</th>
                <th className="table-th">细度(%)</th>
                <th className="table-th">泥浆比重</th>
                <th className="table-th">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-50">
              {ballMillingRecords.map((record) => {
                const status = statusConfig[record.status];
                return (
                  <tr key={record.id} className="hover:bg-industrial-50/50 transition-colors">
                    <td className="table-td font-mono text-xs text-kiln-600 font-semibold">{record.batchNo}</td>
                    <td className="table-td">
                      <span className="badge bg-industrial-100 text-industrial-700">{record.ballMillId}</span>
                    </td>
                    <td className="table-td max-w-[200px] truncate" title={record.formulaName}>{record.formulaName}</td>
                    <td className="table-td font-mono">{record.speed.toFixed(1)}</td>
                    <td className="table-td font-mono">{record.ballRatio.toFixed(2)}:1</td>
                    <td className="table-td font-mono">{record.duration.toFixed(1)}</td>
                    <td className="table-td">
                      <span className={`font-mono font-semibold ${record.fineness > 1.8 ? 'text-kiln-600' : 'text-emerald-600'}`}>
                        {record.fineness.toFixed(2)}
                      </span>
                    </td>
                    <td className="table-td font-mono">{record.slurryDensity.toFixed(3)}</td>
                    <td className="table-td">
                      <span className={`badge border ${status.className}`}>{status.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-industrial-100 flex items-center justify-between text-sm text-industrial-500">
          <span>共 {ballMillingRecords.length} 条记录</span>
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
