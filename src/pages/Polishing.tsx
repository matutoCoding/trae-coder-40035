import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import { polishingRecords } from '@/utils/mockData';
import { Sparkles, Diamond, Ruler, CircleDot, Activity, Search } from 'lucide-react';

interface PolishingHead {
  id: number;
  type: string;
  typeLabel: string;
  typeClass: string;
  rpm: number;
  depth: number;
}

interface EdgeParam {
  label: string;
  value: string;
  unit: string;
  range: string;
}

export default function Polishing() {
  const polishingHeads: PolishingHead[] = [
    { id: 1, type: 'rough', typeLabel: '粗磨', typeClass: 'bg-kiln-500', rpm: 280, depth: 0.45 },
    { id: 2, type: 'rough', typeLabel: '粗磨', typeClass: 'bg-kiln-500', rpm: 320, depth: 0.38 },
    { id: 3, type: 'mid', typeLabel: '精磨', typeClass: 'bg-gold-500', rpm: 380, depth: 0.28 },
    { id: 4, type: 'mid', typeLabel: '精磨', typeClass: 'bg-gold-500', rpm: 420, depth: 0.22 },
    { id: 5, type: 'fine', typeLabel: '抛光', typeClass: 'bg-emerald-500', rpm: 480, depth: 0.15 },
    { id: 6, type: 'fine', typeLabel: '抛光', typeClass: 'bg-emerald-500', rpm: 520, depth: 0.12 },
    { id: 7, type: 'fine', typeLabel: '抛光', typeClass: 'bg-emerald-500', rpm: 560, depth: 0.08 },
    { id: 8, type: 'finish', typeLabel: '镜面', typeClass: 'bg-blue-500', rpm: 600, depth: 0.05 },
  ];

  const edgeParams: EdgeParam[] = [
    { label: '磨边量', value: '1.2', unit: 'mm', range: '0.8 - 1.5' },
    { label: '倒角角度', value: '45', unit: '°', range: '30 - 60' },
    { label: '进给速度', value: '14.5', unit: 'm/min', range: '10 - 20' },
    { label: '尺寸公差', value: '±0.08', unit: 'mm', range: '±0.15以内' },
  ];

  function GlossinessGauge({ value }: { value: number }) {
    const pct = (value / 100) * 100;
    const passPct = (85 / 100) * 100;
    const excellentPct = (95 / 100) * 100;

    return (
      <div className="relative">
        <div className="relative w-full h-56">
          <svg className="w-full h-full" viewBox="0 0 280 160">
            <defs>
              <linearGradient id="glossArc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="30%" stopColor="#F97316" />
                <stop offset="50%" stopColor="#EAB308" />
                <stop offset="70%" stopColor="#10B981" />
                <stop offset="85%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="glossBg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F3F4F6" />
                <stop offset="100%" stopColor="#F3F4F6" />
              </linearGradient>
            </defs>

            <path
              d="M 20 140 A 120 120 0 0 1 260 140"
              fill="none"
              stroke="url(#glossBg)"
              strokeWidth="22"
              strokeLinecap="round"
            />

            <path
              d="M 20 140 A 120 120 0 0 1 260 140"
              fill="none"
              stroke="url(#glossArc)"
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray={`${pct * 3.77} 377`}
            />

            <line
              x1="140"
              y1="140"
              x2={140 + 100 * Math.cos(((180 - pct * 1.8) * Math.PI) / 180)}
              y2={140 - 100 * Math.sin(((180 - pct * 1.8) * Math.PI) / 180)}
              stroke="#1A1D21"
              strokeWidth="3"
              strokeLinecap="round"
            />

            <circle cx="140" cy="140" r="8" fill="#1A1D21" />
            <circle cx="140" cy="140" r="4" fill="#D4A547" />

            <g>
              <line x1={20 + (passPct * 3.77) * Math.cos((180 - passPct * 1.8) * Math.PI / 180) / 100 * 120} y1="0" x2="0" y2="0" stroke="#10B981" strokeWidth="1" />
            </g>
          </svg>

          <div className="absolute left-0 bottom-2 text-[10px] font-mono text-industrial-400">0</div>
          <div className="absolute left-1/4 bottom-2 text-[10px] font-mono text-industrial-400">25</div>
          <div className="absolute left-1/2 -translate-x-1/2 top-12 text-[10px] font-mono text-industrial-400">50</div>
          <div className="absolute right-1/4 bottom-2 text-[10px] font-mono text-industrial-400">75</div>
          <div className="absolute right-0 bottom-2 text-[10px] font-mono text-industrial-400">100</div>

          <div
            className="absolute -translate-x-1/2 text-[10px] font-bold text-emerald-600"
            style={{ left: `${passPct}%`, top: '8px' }}
          >
            <div className="w-px h-4 bg-emerald-500 mx-auto mb-1" />
            合格线85
          </div>
          <div
            className="absolute -translate-x-1/2 text-[10px] font-bold text-blue-600"
            style={{ left: `${excellentPct}%`, top: '8px' }}
          >
            <div className="w-px h-4 bg-blue-500 mx-auto mb-1" />
            优良95
          </div>
        </div>

        <div className="text-center -mt-4">
          <span className="font-display text-5xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            {value}
          </span>
          <span className="text-lg text-industrial-500 ml-1">%</span>
          <div className="text-sm text-industrial-600 mt-1 font-medium">平均光泽度</div>
          <div className="mt-2 inline-flex items-center gap-1.5">
            <span className="badge bg-blue-50 text-blue-700 border border-blue-200">优良等级</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SectionHeader
        title="抛光磨边 · 精加工"
        subtitle="表面光泽控制 · 尺寸精度管理"
        icon={<Sparkles className="w-5 h-5" />}
        actions={['add', 'export', 'refresh']}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="抛光线运行"
          value="2/2"
          unit="条"
          icon={<Diamond className="w-6 h-6" />}
          change={0}
          accent="text-kiln-600"
          iconBg="bg-kiln-50"
        />
        <StatCard
          title="今日抛光"
          value="21560"
          unit="片"
          icon={<Activity className="w-6 h-6" />}
          change={3.2}
          accent="text-gold-600"
          iconBg="bg-gold-50"
        />
        <StatCard
          title="平均光泽度"
          value="92.3"
          unit="%"
          icon={<Sparkles className="w-6 h-6" />}
          change={0.8}
          accent="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="尺寸合格率"
          value="98.5"
          unit="%"
          icon={<Ruler className="w-6 h-6" />}
          change={0.5}
          accent="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="card p-5 xl:col-span-2 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gradient-to-br from-kiln-500/5 to-gold-500/5" />
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display text-lg font-semibold text-industrial-900 flex items-center gap-2">
                  <Diamond className="w-5 h-5 text-kiln-500" />
                  磨头配置阵列
                </h3>
                <p className="text-xs text-industrial-500 mt-0.5">8组渐进式磨头排列 · 粗磨→精磨→抛光→镜面</p>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">全部运行正常</span>
            </div>

            <div className="mb-5">
              <div className="h-2 rounded-full bg-industrial-100 overflow-hidden flex">
                <div className="bg-kiln-500 h-full" style={{ width: '25%' }} />
                <div className="bg-gold-500 h-full" style={{ width: '25%' }} />
                <div className="bg-emerald-500 h-full" style={{ width: '37.5%' }} />
                <div className="bg-blue-500 h-full" style={{ width: '12.5%' }} />
              </div>
              <div className="flex justify-between mt-2 text-[10px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-kiln-500" />
                  粗磨 (1-2)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-gold-500" />
                  精磨 (3-4)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  抛光 (5-7)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                  镜面 (8)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {polishingHeads.map((head) => (
                <div
                  key={head.id}
                  className="rounded-xl border border-industrial-200 bg-gradient-to-b from-white to-industrial-50/50 p-3 text-center hover:shadow-md hover:border-kiln-300 transition-all group"
                >
                  <div className="relative inline-block mb-2">
                    <div
                      className={`w-14 h-14 rounded-full ${head.typeClass} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                      style={{ animation: 'spin 4s linear infinite' }}
                    >
                      <CircleDot className="w-7 h-7 text-white" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white border-2 border-industrial-100 text-[10px] font-bold text-industrial-700 flex items-center justify-center shadow-sm">
                      {head.id}
                    </span>
                  </div>
                  <div className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold text-white ${head.typeClass}`}>
                    {head.typeLabel}
                  </div>
                  <div className="mt-2 space-y-1">
                    <div>
                      <div className="text-[10px] text-industrial-400">转速</div>
                      <div className="font-mono text-sm font-bold text-industrial-800">{head.rpm} <span className="text-[10px] font-normal text-industrial-400">rpm</span></div>
                    </div>
                    <div>
                      <div className="text-[10px] text-industrial-400">下刀量</div>
                      <div className="font-mono text-sm font-bold text-kiln-600">{head.depth.toFixed(2)} <span className="text-[10px] font-normal text-industrial-400">mm</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-5 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/5 to-emerald-500/5" />
          <div className="relative">
            <div className="mb-5">
              <h3 className="font-display text-lg font-semibold text-industrial-900 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-blue-500" />
                磨边倒角参数
              </h3>
              <p className="text-xs text-industrial-500 mt-0.5">四边精磨 · 倒角规整 · 尺寸一致</p>
            </div>

            <div className="space-y-3">
              {edgeParams.map((param, idx) => {
                const iconMap = [Ruler, CircleDot, Activity, Search];
                const Icon = iconMap[idx % 4];
                const colorMap = ['text-kiln-600', 'text-gold-600', 'text-emerald-600', 'text-blue-600'];
                const bgMap = ['bg-kiln-50', 'bg-gold-50', 'bg-emerald-50', 'bg-blue-50'];
                return (
                  <div
                    key={param.label}
                    className="rounded-xl bg-industrial-50/50 border border-industrial-100 p-3 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${bgMap[idx]} ${colorMap[idx]} flex items-center justify-center`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-industrial-600">{param.label}</div>
                          <div className="text-[10px] text-industrial-400">范围 {param.range}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-display text-xl font-bold ${colorMap[idx]}`}>
                          {param.value}
                        </span>
                        <span className="text-xs text-industrial-400 ml-0.5">{param.unit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-500" />
              光泽度质量仪表
            </h3>
            <p className="text-xs text-industrial-500 mt-0.5">在线实时检测 · 合格线85% · 优良线95%</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600" />
              <span className="text-industrial-600">合格 (≥85%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-600" />
              <span className="text-industrial-600">优良 (≥95%)</span>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto">
          <GlossinessGauge value={92.3} />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-industrial-100 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">抛光记录</h3>
            <p className="text-xs text-industrial-500 mt-0.5">最近 {polishingRecords.length} 批次抛光磨边记录</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="搜索批次..." className="input-field !w-48 !py-2 text-sm" />
            <select className="input-field !w-36 !py-2 text-sm">
              <option>全部磨头配置</option>
              <option>8组磨头</option>
              <option>9组磨头</option>
              <option>10组磨头</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-industrial-100">
                <th className="table-th">批次</th>
                <th className="table-th">磨头配置</th>
                <th className="table-th">转速(rpm)</th>
                <th className="table-th">进给量</th>
                <th className="table-th">抛光液</th>
                <th className="table-th">光泽度</th>
                <th className="table-th">平面度(mm)</th>
                <th className="table-th">倒角(°)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-50">
              {polishingRecords.map((record) => (
                <tr key={record.id} className="hover:bg-industrial-50/50 transition-colors">
                  <td className="table-td font-mono text-xs text-kiln-600 font-semibold">{record.batchNo}</td>
                  <td className="table-td">
                    <span className="badge bg-gold-50 text-gold-700 border border-gold-200">{record.polishingHeadConfig}</span>
                  </td>
                  <td className="table-td font-mono">{record.polishingSpeed.toFixed(0)}</td>
                  <td className="table-td font-mono">{record.feedRate.toFixed(1)} m/min</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-100 to-cyan-100 border border-blue-200 flex items-center justify-center">
                        <Diamond className="w-3 h-3 text-blue-600" />
                      </span>
                      <span className="font-medium text-industrial-700">{record.polishingFluid}</span>
                    </div>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-industrial-200 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            record.glossiness >= 95
                              ? 'bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500'
                              : record.glossiness >= 85
                              ? 'bg-gradient-to-r from-gold-500 to-emerald-500'
                              : 'bg-gradient-to-r from-kiln-400 to-gold-500'
                          }`}
                          style={{ width: `${record.glossiness}%` }}
                        />
                      </div>
                      <span className={`font-mono font-bold w-12 ${
                        record.glossiness >= 95 ? 'text-blue-600' : record.glossiness >= 85 ? 'text-emerald-600' : 'text-kiln-600'
                      }`}>
                        {record.glossiness.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className={`font-mono font-semibold ${
                      record.surfaceFlatness > 0.2 ? 'text-kiln-600' : 'text-emerald-600'
                    }`}>
                      {record.surfaceFlatness.toFixed(2)}
                    </span>
                  </td>
                  <td className="table-td font-mono font-semibold text-industrial-700">{record.chamferAngle}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-industrial-100 flex items-center justify-between text-sm text-industrial-500">
          <span>共 {polishingRecords.length} 条记录</span>
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
