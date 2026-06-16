import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import { gradingRecords } from '@/utils/mockData';
import { Boxes, Search, Palette, CheckSquare, Package, Triangle, Layers, ScanLine, Tag, Shield } from 'lucide-react';

interface GradeStat {
  grade: string;
  name: string;
  ratio: number;
  quantity: number;
  gradient: string;
  textColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

interface DeformationParam {
  label: string;
  value: number;
  min: number;
  max: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ColorCard {
  colorNo: string;
  deltaE: number;
  color: string;
}

export default function GradingPackaging() {
  const gradeStats: GradeStat[] = [
    {
      grade: 'A',
      name: '优等品',
      ratio: 72,
      quantity: 20628,
      gradient: 'from-emerald-400 via-emerald-500 to-teal-500',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-300',
      badgeBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
      badgeText: 'text-emerald-700',
      badgeBorder: 'border-emerald-300',
    },
    {
      grade: 'B',
      name: '一级品',
      ratio: 18,
      quantity: 5157,
      gradient: 'from-blue-400 via-blue-500 to-indigo-500',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-300',
      badgeBg: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      badgeText: 'text-blue-700',
      badgeBorder: 'border-blue-300',
    },
    {
      grade: 'C',
      name: '合格品',
      ratio: 8,
      quantity: 2292,
      gradient: 'from-industrial-300 via-industrial-400 to-industrial-500',
      textColor: 'text-industrial-700',
      borderColor: 'border-industrial-300',
      badgeBg: 'bg-gradient-to-br from-industrial-100 to-industrial-200',
      badgeText: 'text-industrial-700',
      badgeBorder: 'border-industrial-300',
    },
    {
      grade: 'D',
      name: '次品',
      ratio: 2,
      quantity: 573,
      gradient: 'from-kiln-400 via-kiln-500 to-red-600',
      textColor: 'text-kiln-700',
      borderColor: 'border-kiln-300',
      badgeBg: 'bg-gradient-to-br from-kiln-50 to-red-100',
      badgeText: 'text-kiln-700',
      badgeBorder: 'border-kiln-300',
    },
  ];

  const deformationParams: DeformationParam[] = [
    { label: '平整度', value: 0.12, min: 0, max: 0.2, color: 'bg-emerald-500', icon: Layers },
    { label: '直角度', value: 0.15, min: 0, max: 0.25, color: 'bg-gold-500', icon: Triangle },
    { label: '边直度', value: 0.11, min: 0, max: 0.2, color: 'bg-blue-500', icon: Tag },
  ];

  const colorCards: ColorCard[] = [
    { colorNo: 'C101', deltaE: 0.32, color: '#E8E0D0' },
    { colorNo: 'C102', deltaE: 0.45, color: '#DBD2BE' },
    { colorNo: 'C103', deltaE: 0.68, color: '#D0C5AE' },
    { colorNo: 'C104', deltaE: 0.28, color: '#E5DDCB' },
    { colorNo: 'C105', deltaE: 0.52, color: '#CEC3AB' },
    { colorNo: 'C106', deltaE: 0.41, color: '#D8CEB9' },
    { colorNo: 'C107', deltaE: 0.75, color: '#C8BBA2' },
    { colorNo: 'C108', deltaE: 0.36, color: '#E2D9C6' },
    { colorNo: 'C109', deltaE: 0.58, color: '#D1C6AE' },
    { colorNo: 'C110', deltaE: 0.48, color: '#DDD3BC' },
    { colorNo: 'C111', deltaE: 0.62, color: '#CABFA6' },
    { colorNo: 'C112', deltaE: 0.39, color: '#DFD5BF' },
  ];

  const packagingRules = [
    { icon: CheckSquare, title: '色号隔离', desc: '不同色号严禁混装，每箱一色号' },
    { icon: Shield, title: '等级分装', desc: 'A/B/C/D分级装箱，外箱标识清晰' },
    { icon: Package, title: '标准包装', desc: '800×800规格：3片/箱，毛重约52kg' },
    { icon: ScanLine, title: '扫码追溯', desc: '每箱贴二维码，支持全程追溯' },
  ];

  function TriangleDiagram() {
    return (
      <div className="relative w-full aspect-square max-w-[220px] mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="triFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4A547" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#C8381F" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          <polygon
            points="100,20 180,175 20,175"
            fill="url(#triFill)"
            stroke="#B5AD9C"
            strokeWidth="2"
            strokeDasharray="6 4"
          />

          <circle cx="100" cy="175" r="6" fill="#10B981" stroke="#fff" strokeWidth="2" />
          <text x="100" y="195" textAnchor="middle" className="text-[10px] font-bold fill-emerald-700">平整度</text>
          <text x="100" y="165" textAnchor="middle" className="text-[11px] font-bold fill-industrial-800">0.12mm</text>

          <circle cx="180" cy="175" r="6" fill="#D4A547" stroke="#fff" strokeWidth="2" />
          <text x="180" y="195" textAnchor="middle" className="text-[10px] font-bold fill-gold-700">直角度</text>
          <text x="180" y="165" textAnchor="middle" className="text-[11px] font-bold fill-industrial-800">0.15mm</text>

          <circle cx="20" cy="175" r="6" fill="#3B82F6" stroke="#fff" strokeWidth="2" />
          <text x="20" y="195" textAnchor="middle" className="text-[10px] font-bold fill-blue-700">边直度</text>
          <text x="20" y="165" textAnchor="middle" className="text-[11px] font-bold fill-industrial-800">0.11mm</text>

          <circle cx="100" cy="20" r="6" fill="#C8381F" stroke="#fff" strokeWidth="2" />
          <text x="100" y="10" textAnchor="middle" className="text-[10px] font-bold fill-kiln-700">变形检测三角</text>

          <polygon
            points="100,60 150,155 50,155"
            fill="none"
            stroke="#D4A547"
            strokeWidth="2"
            strokeDasharray="4 3"
            opacity="0.6"
          />

          <circle cx="100" cy="125" r="5" fill="#C8381F" stroke="#fff" strokeWidth="2">
            <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    );
  }

  const getGradeConfig = (grade: string) => {
    return gradeStats.find((g) => g.grade === grade) || gradeStats[3];
  };

  return (
    <div className="p-6">
      <SectionHeader
        title="分级包装 · 色差分选"
        subtitle="变形检测 · 智能分级 · 成品入库"
        icon={<Boxes className="w-5 h-5" />}
        actions={['add', 'export', 'refresh']}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="检测线运行"
          value="3/3"
          unit="条"
          icon={<ScanLine className="w-6 h-6" />}
          change={0}
          accent="text-kiln-600"
          iconBg="bg-kiln-50"
        />
        <StatCard
          title="今日分级"
          value="28650"
          unit="片"
          icon={<Boxes className="w-6 h-6" />}
          change={2.8}
          accent="text-gold-600"
          iconBg="bg-gold-50"
        />
        <StatCard
          title="优等品率"
          value="72.0"
          unit="%"
          icon={<CheckSquare className="w-6 h-6" />}
          change={1.5}
          accent="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="入库完成率"
          value="94.6"
          unit="%"
          icon={<Package className="w-6 h-6" />}
          change={0.8}
          accent="text-blue-600"
          iconBg="bg-blue-50"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-kiln-50 to-gold-50 border border-kiln-100 flex items-center justify-center text-kiln-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-industrial-900">品级分布总览</h3>
              <p className="text-xs text-industrial-500 mt-0.5">今日分级产品 28,650片 · A品率稳步提升</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {gradeStats.map((stat) => (
            <div
              key={stat.grade}
              className={`card p-5 relative overflow-hidden border-2 ${stat.borderColor} group hover:shadow-card-hover transition-all`}
            >
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${stat.gradient}`} />
              <div className={`absolute -right-16 -bottom-16 w-48 h-48 rounded-full bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`} />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${stat.badgeBg} border ${stat.badgeBorder} shadow-sm`}>
                      <span className={`font-display text-3xl font-bold ${stat.badgeText}`}>{stat.grade}</span>
                    </div>
                  </div>
                  <div className={`badge ${stat.badgeBg} ${stat.badgeText} border ${stat.badgeBorder} text-xs`}>
                    {stat.name}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-end gap-2 mb-1">
                    <span className={`font-display text-5xl font-bold ${stat.textColor}`}>{stat.ratio}</span>
                    <span className={`text-xl font-bold ${stat.textColor} mb-2`}>%</span>
                  </div>
                  <div className="text-xs text-industrial-500">占比 · 合格判定</div>
                </div>

                <div className="mb-4">
                  <div className="h-3 rounded-full bg-industrial-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-700`}
                      style={{ width: `${stat.ratio}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-end justify-between pt-3 border-t border-industrial-100">
                  <div>
                    <div className="text-[11px] text-industrial-400 mb-0.5">数量</div>
                    <div className="font-display text-lg font-bold text-industrial-800">
                      {stat.quantity.toLocaleString()} <span className="text-sm font-normal text-industrial-400">片</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${stat.badgeBg} ${stat.badgeText} flex items-center justify-center border ${stat.badgeBorder}`}>
                    <Boxes className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="card p-5 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-gold-500/5 to-kiln-500/5" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-industrial-900 flex items-center gap-2">
                  <Triangle className="w-5 h-5 text-gold-500" />
                  变形检测三角
                </h3>
                <p className="text-xs text-industrial-500 mt-0.5">平整度·直角度·边直度三项几何指标</p>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">全部合格</span>
            </div>

            <TriangleDiagram />

            <div className="mt-4 space-y-3">
              {deformationParams.map((param) => {
                const Icon = param.icon;
                const pct = ((param.value - param.min) / (param.max - param.min)) * 100;
                return (
                  <div key={param.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg ${param.color.replace('bg-', 'bg-').replace('500', '50')} text-${param.color.replace('bg-', '').replace('500', '')}-600 flex items-center justify-center`} style={{ color: param.color.includes('emerald') ? '#059669' : param.color.includes('gold') ? '#A87120' : '#2563EB' }}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-medium text-industrial-700">{param.label}</span>
                      </div>
                      <span className="font-mono font-bold text-industrial-800">{param.value.toFixed(2)} <span className="text-xs font-normal text-industrial-400">/ {param.max}mm</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-industrial-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${param.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card p-5 relative overflow-hidden xl:col-span-2">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display text-lg font-semibold text-industrial-900 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-blue-500" />
                  色差分选
                </h3>
                <p className="text-xs text-industrial-500 mt-0.5">C101-C112 共12个色号 · ΔE ≤ 0.8 为合格品</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600" />
                  <span className="text-industrial-600">ΔE ≤ 0.5</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-br from-gold-400 to-gold-600" />
                  <span className="text-industrial-600">ΔE ≤ 0.8</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
              {colorCards.map((card) => {
                const deltaColor = card.deltaE <= 0.5 ? 'text-emerald-600' : card.deltaE <= 0.8 ? 'text-gold-600' : 'text-kiln-600';
                const deltaBg = card.deltaE <= 0.5 ? 'bg-emerald-50 border-emerald-200' : card.deltaE <= 0.8 ? 'bg-gold-50 border-gold-200' : 'bg-kiln-50 border-kiln-200';
                return (
                  <div
                    key={card.colorNo}
                    className="rounded-xl border border-industrial-200 bg-gradient-to-b from-white to-industrial-50/30 p-3 text-center hover:shadow-md hover:border-kiln-300 transition-all group"
                  >
                    <div className="relative mb-2 mx-auto">
                      <div
                        className="w-12 h-12 rounded-xl shadow-md group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: card.color, border: '2px solid rgba(26,29,33,0.08)' }}
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 via-transparent to-black/10" />
                      </div>
                    </div>
                    <div className="font-display text-sm font-bold text-industrial-800">{card.colorNo}</div>
                    <div className={`mt-1.5 inline-block px-1.5 py-0.5 rounded-md border text-[10px] font-mono font-bold ${deltaBg} ${deltaColor}`}>
                      ΔE {card.deltaE.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-industrial-900">分级包装规则</h3>
              <p className="text-xs text-industrial-500 mt-0.5">标准化作业 · 确保产品可追溯</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {packagingRules.map((rule, idx) => {
            const Icon = rule.icon;
            const colorArr = ['kiln', 'gold', 'emerald', 'blue'];
            const c = colorArr[idx];
            return (
              <div
                key={rule.title}
                className="rounded-xl border border-industrial-100 bg-gradient-to-br from-white to-industrial-50/50 p-4 hover:shadow-md hover:border-kiln-200 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-${c}-50 border border-${c}-100 text-${c}-600 flex items-center justify-center flex-shrink-0`}
                    style={{
                      backgroundColor: c === 'kiln' ? '#FDF5F2' : c === 'gold' ? '#FBF7EF' : c === 'emerald' ? '#ECFDF5' : '#EFF6FF',
                      borderColor: c === 'kiln' ? '#FAE8E1' : c === 'gold' ? '#F5EBD5' : c === 'emerald' ? '#D1FAE5' : '#DBEAFE',
                      color: c === 'kiln' ? '#A82A16' : c === 'gold' ? '#A87120' : c === 'emerald' ? '#059669' : '#2563EB',
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-industrial-800 text-sm mb-1">{rule.title}</h4>
                    <p className="text-xs text-industrial-500 leading-relaxed">{rule.desc}</p>
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
            <h3 className="font-display text-lg font-semibold text-industrial-900">分级记录</h3>
            <p className="text-xs text-industrial-500 mt-0.5">最近 {gradingRecords.length} 批次产品分级包装记录</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="搜索批次..." className="input-field !w-48 !py-2 text-sm" />
            <select className="input-field !w-36 !py-2 text-sm">
              <option>全部等级</option>
              <option>A 优等品</option>
              <option>B 一级品</option>
              <option>C 合格品</option>
              <option>D 次品</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-industrial-100">
                <th className="table-th">批次</th>
                <th className="table-th">平整度</th>
                <th className="table-th">直角度</th>
                <th className="table-th">色差ΔE</th>
                <th className="table-th">色号</th>
                <th className="table-th">等级</th>
                <th className="table-th">包装规格</th>
                <th className="table-th">数量</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-50">
              {gradingRecords.map((record) => {
                const gradeCfg = getGradeConfig(record.grade);
                return (
                  <tr key={record.id} className="hover:bg-industrial-50/50 transition-colors">
                    <td className="table-td font-mono text-xs text-kiln-600 font-semibold">{record.batchNo}</td>
                    <td className="table-td">
                      <span className={`font-mono font-semibold ${
                        record.flatness > 0.2 ? 'text-kiln-600' : record.flatness > 0.15 ? 'text-gold-600' : 'text-emerald-600'
                      }`}>
                        {record.flatness.toFixed(2)}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className={`font-mono font-semibold ${
                        record.squareness > 0.25 ? 'text-kiln-600' : record.squareness > 0.2 ? 'text-gold-600' : 'text-emerald-600'
                      }`}>
                        {record.squareness.toFixed(2)}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-industrial-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              record.colorDifference <= 0.5
                                ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                                : record.colorDifference <= 0.8
                                ? 'bg-gradient-to-r from-gold-400 to-gold-600'
                                : 'bg-gradient-to-r from-kiln-400 to-kiln-600'
                            }`}
                            style={{ width: `${Math.min((record.colorDifference / 1.5) * 100, 100)}%` }}
                          />
                        </div>
                        <span className={`font-mono font-semibold w-12 ${
                          record.colorDifference <= 0.5 ? 'text-emerald-600' : record.colorDifference <= 0.8 ? 'text-gold-600' : 'text-kiln-600'
                        }`}>
                          {record.colorDifference.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-md border border-industrial-200 shadow-sm"
                          style={{ backgroundColor: colorCards[(parseInt(record.colorNo.replace('C', '')) - 101) % 12]?.color || '#E8E0D0' }}
                        />
                        <span className="font-mono font-semibold text-industrial-700">{record.colorNo}</span>
                      </div>
                    </td>
                    <td className="table-td">
                      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${gradeCfg.badgeBg} border-2 ${gradeCfg.badgeBorder} shadow-sm`}>
                        <span className={`font-display text-lg font-bold ${gradeCfg.badgeText}`}>{record.grade}</span>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="badge bg-industrial-100 text-industrial-700 border border-industrial-200">{record.packagingSpec}</span>
                    </td>
                    <td className="table-td font-mono font-bold text-industrial-800">{record.quantity.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-industrial-100 flex items-center justify-between text-sm text-industrial-500">
          <span>共 {gradingRecords.length} 条记录</span>
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
