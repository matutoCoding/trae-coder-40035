import { useState, useMemo } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import StatCard from '@/components/common/StatCard';
import {
  BarChart3,
  TrendingUp,
  Gauge,
  Award,
  Flame,
  AlertTriangle,
  ChevronRight,
  Lightbulb,
  Settings2,
  Droplets,
  Eye,
  Search,
  X,
} from 'lucide-react';
import { kilnFiringRecords, gradingRecords } from '@/utils/mockData';

interface ScatterPoint {
  x: number;
  y: number;
  z: number;
  grade: string;
  batch: string;
  spec: string;
  processType: string;
  daysAgo: number;
}
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

const timeRanges = ['今日', '近7日', '近30日'];
const productSpecs = ['全部', '800×800', '600×1200', '600×600', '750×1500'];
const gradeOptions = ['全部', 'A', 'B', 'C', 'D'];
const processTypes = ['全部', '高温长周期', '中温标准', '低温快烧'];

const rawScatterData: ScatterPoint[] = [
  { x: 1195, y: 96.2, z: 285, grade: 'A', batch: 'TC20260617-001', spec: '800×800', processType: '中温标准', daysAgo: 0 },
  { x: 1210, y: 97.5, z: 295, grade: 'A', batch: 'TC20260617-002', spec: '600×1200', processType: '高温长周期', daysAgo: 1 },
  { x: 1205, y: 94.8, z: 302, grade: 'B', batch: 'TC20260617-003', spec: '600×600', processType: '低温快烧', daysAgo: 0 },
  { x: 1220, y: 98.1, z: 308, grade: 'A', batch: 'TC20260617-004', spec: '750×1500', processType: '中温标准', daysAgo: 2 },
  { x: 1188, y: 89.5, z: 278, grade: 'C', batch: 'TC20260617-005', spec: '800×800', processType: '低温快烧', daysAgo: 1 },
  { x: 1235, y: 95.6, z: 325, grade: 'A', batch: 'TC20260617-006', spec: '600×1200', processType: '高温长周期', daysAgo: 3 },
  { x: 1228, y: 93.2, z: 318, grade: 'B', batch: 'TC20260617-007', spec: '600×600', processType: '中温标准', daysAgo: 2 },
  { x: 1245, y: 91.8, z: 342, grade: 'C', batch: 'TC20260617-008', spec: '750×1500', processType: '高温长周期', daysAgo: 4 },
  { x: 1215, y: 96.8, z: 300, grade: 'A', batch: 'TC20260617-009', spec: '800×800', processType: '中温标准', daysAgo: 3 },
  { x: 1198, y: 92.5, z: 288, grade: 'B', batch: 'TC20260617-010', spec: '600×1200', processType: '低温快烧', daysAgo: 5 },
  { x: 1255, y: 87.2, z: 358, grade: 'D', batch: 'TC20260617-011', spec: '600×600', processType: '高温长周期', daysAgo: 2 },
  { x: 1225, y: 97.2, z: 312, grade: 'A', batch: 'TC20260617-012', spec: '750×1500', processType: '中温标准', daysAgo: 6 },
  { x: 1208, y: 95.8, z: 298, grade: 'A', batch: 'TC20260617-013', spec: '800×800', processType: '低温快烧', daysAgo: 4 },
  { x: 1240, y: 94.5, z: 335, grade: 'B', batch: 'TC20260617-014', spec: '600×1200', processType: '高温长周期', daysAgo: 7 },
  { x: 1192, y: 90.8, z: 282, grade: 'C', batch: 'TC20260617-015', spec: '600×600', processType: '低温快烧', daysAgo: 5 },
  { x: 1218, y: 96.5, z: 305, grade: 'A', batch: 'TC20260617-016', spec: '750×1500', processType: '中温标准', daysAgo: 8 },
  { x: 1232, y: 92.8, z: 322, grade: 'B', batch: 'TC20260617-017', spec: '800×800', processType: '高温长周期', daysAgo: 6 },
  { x: 1250, y: 88.5, z: 348, grade: 'D', batch: 'TC20260617-018', spec: '600×1200', processType: '高温长周期', daysAgo: 9 },
  { x: 1202, y: 95.2, z: 292, grade: 'A', batch: 'TC20260617-019', spec: '600×600', processType: '低温快烧', daysAgo: 7 },
  { x: 1222, y: 97.8, z: 310, grade: 'A', batch: 'TC20260617-020', spec: '750×1500', processType: '中温标准', daysAgo: 10 },
  { x: 1248, y: 90.2, z: 345, grade: 'C', batch: 'TC20260617-021', spec: '800×800', processType: '高温长周期', daysAgo: 8 },
  { x: 1212, y: 96.0, z: 296, grade: 'A', batch: 'TC20260617-022', spec: '600×1200', processType: '中温标准', daysAgo: 11 },
  { x: 1195, y: 93.8, z: 286, grade: 'B', batch: 'TC20260617-023', spec: '600×600', processType: '低温快烧', daysAgo: 12 },
  { x: 1230, y: 94.2, z: 320, grade: 'B', batch: 'TC20260617-024', spec: '750×1500', processType: '高温长周期', daysAgo: 13 },
  { x: 1258, y: 85.8, z: 362, grade: 'D', batch: 'TC20260617-025', spec: '800×800', processType: '高温长周期', daysAgo: 14 },
];

const defectContribution = [
  { process: '烧成工序', weight: 35, highlight: true },
  { process: '压制成型', weight: 20, highlight: true },
  { process: '施釉工序', weight: 15, highlight: false },
  { process: '球磨工序', weight: 12, highlight: false },
  { process: '干燥工序', weight: 8, highlight: false },
  { process: '抛光工序', weight: 5, highlight: false },
  { process: '分级工序', weight: 5, highlight: false },
];

const heatmapRows = ['最高温', '窑速', '周期', '氧含量', '球磨细度', '粉料水分', '施釉量', '抛光速度'];
const heatmapCols = ['A品率', '色差ΔE', '变形量', '光泽度', '平整度'];
const heatmapData: number[][] = [
  [0.82, -0.65, -0.78, 0.55, 0.62],
  [-0.58, 0.42, 0.71, -0.38, -0.45],
  [0.65, -0.35, -0.52, 0.48, 0.51],
  [0.45, -0.28, -0.38, 0.32, 0.28],
  [0.52, -0.48, 0.62, -0.35, -0.42],
  [0.38, -0.22, 0.45, -0.18, -0.35],
  [0.48, 0.55, -0.28, 0.68, 0.32],
  [-0.25, 0.18, 0.22, 0.72, 0.58],
];

const bubbleMatrix: { row: string; col: string; count: number; highlight: boolean }[][] = [
  [
    { row: '低能耗<300', col: '优秀≥96', count: 8, highlight: false },
    { row: '低能耗<300', col: '良好92-96', count: 5, highlight: false },
    { row: '低能耗<300', col: '待改善<92', count: 2, highlight: false },
  ],
  [
    { row: '中能耗300-330', col: '优秀≥96', count: 12, highlight: false },
    { row: '中能耗300-330', col: '良好92-96', count: 18, highlight: false },
    { row: '中能耗300-330', col: '待改善<92', count: 6, highlight: false },
  ],
  [
    { row: '高能耗>330', col: '优秀≥96', count: 3, highlight: false },
    { row: '高能耗>330', col: '良好92-96', count: 7, highlight: false },
    { row: '高能耗>330', col: '待改善<92', count: 11, highlight: true },
  ],
];

const anomalyList = [
  { level: 'critical', desc: '烧成温度>1250℃ 且 周期<58min 组合，次品率上升12%', batches: 8, suggestion: '降低最高温至1230℃以下，延长周期至62min以上' },
  { level: 'critical', desc: '球磨细度>1.8% 且 粉料水分>7% 时，压制缺陷率激增', batches: 6, suggestion: '严格控制球磨细度1.2-1.6%，粉料水分6.0-6.5%' },
  { level: 'warning', desc: '窑速>10.5m/min 时，A品率下降约4.5%', batches: 12, suggestion: '窑速建议控制在9.2-10.0m/min区间' },
  { level: 'warning', desc: '施釉量<420g/㎡ 时，色差ΔE超过标准值概率增大', batches: 9, suggestion: '施釉量下限调整为440g/㎡，保证釉层均匀' },
  { level: 'warning', desc: '氧含量<2.0% 与 变形量呈显著负相关', batches: 7, suggestion: '保持氧含量在2.5-4.0%合理区间' },
  { level: 'info', desc: '抛光速度>8m/min 时，光泽度略有提升但平整度下降', batches: 15, suggestion: '根据产品定位平衡抛光速度参数' },
  { level: 'info', desc: '粉料水分波动>±0.8%时，砖坯重量偏差增大', batches: 11, suggestion: '加强喷雾干燥工序稳定性管控' },
];

const suggestions = [
  { icon: Settings2, title: '窑速回调建议', desc: '建议将窑速从10.2调回9.6，周期延长至64min，预计A品率↑3.2%', effect: 'A品率 +3.2%', color: 'text-kiln-600', bg: 'bg-kiln-50' },
  { icon: Droplets, title: '球磨细度控制', desc: '球磨细度控制在1.2%-1.5%区间，对变形率改善显著', effect: '变形率 -18%', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Gauge, title: '粉料水分稳定', desc: '粉料水分稳定在6%-6.5%可减少压制缺陷约18%', effect: '压制缺陷 -18%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return '#10B981';
    case 'B': return '#3B82F6';
    case 'C': return '#6B7280';
    case 'D': return '#DC2626';
    default: return '#6B7280';
  }
}

function getHeatmapColor(value: number): string {
  if (value >= 0.6) return '#10B981';
  if (value >= 0.3) return '#84CC16';
  if (value >= 0) return '#FACC15';
  if (value >= -0.3) return '#FB923C';
  if (value >= -0.6) return '#F97316';
  return '#DC2626';
}

function getBubbleBg(highlight: boolean, count: number): string {
  if (highlight) return 'bg-gradient-to-br from-rose-500 to-kiln-600 text-white';
  if (count >= 15) return 'bg-gradient-to-br from-kiln-100 to-gold-100 text-kiln-700';
  if (count >= 8) return 'bg-gradient-to-br from-gold-50 to-amber-100 text-gold-700';
  return 'bg-gradient-to-br from-industrial-50 to-industrial-100 text-industrial-600';
}

function getLevelBadge(level: string) {
  switch (level) {
    case 'critical':
      return <span className="badge bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-semibold">严重</span>;
    case 'warning':
      return <span className="badge bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-semibold">警告</span>;
    default:
      return <span className="badge bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-semibold">提示</span>;
  }
}

export default function QualityAnalysis() {
  const [scatterData] = useState<ScatterPoint[]>(rawScatterData);
  const [timeRange, setTimeRange] = useState('近7日');
  const [productSpec, setProductSpec] = useState('全部');
  const [selectedGrades, setSelectedGrades] = useState<string[]>(['全部']);
  const [processType, setProcessType] = useState('全部');
  const [batchSearch, setBatchSearch] = useState('');
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return scatterData.filter((d) => {
      if (batchSearch && !d.batch.includes(batchSearch)) return false;
      if (timeRange === '今日' && d.daysAgo > 1) return false;
      if (timeRange === '近7日' && d.daysAgo > 7) return false;
      if (productSpec !== '全部' && d.spec !== productSpec) return false;
      if (!selectedGrades.includes('全部') && !selectedGrades.includes(d.grade)) return false;
      if (processType !== '全部' && d.processType !== processType) return false;
      return true;
    });
  }, [scatterData, timeRange, productSpec, selectedGrades, processType, batchSearch]);

  const kpiValues = useMemo(() => {
    if (filteredData.length === 0) {
      return { avgPass: '0.0', aRate: '0.0', avgEnergy: '0', anomalyCount: '0' };
    }
    const avgPass = (filteredData.reduce((s, d) => s + d.y, 0) / filteredData.length).toFixed(1);
    const aCount = filteredData.filter((d) => d.grade === 'A').length;
    const aRate = ((aCount / filteredData.length) * 100).toFixed(1);
    const avgEnergy = (filteredData.reduce((s, d) => s + d.z, 0) / filteredData.length).toFixed(0);
    const anomalyCount = filteredData.filter((d) => d.grade === 'C' || d.grade === 'D' || d.y < 92).length;
    return { avgPass, aRate, avgEnergy, anomalyCount: String(anomalyCount) };
  }, [filteredData]);

  const toggleGrade = (grade: string) => {
    if (grade === '全部') {
      setSelectedGrades(['全部']);
    } else {
      const filtered = selectedGrades.filter((g) => g !== '全部');
      if (filtered.includes(grade)) {
        const next = filtered.filter((g) => g !== grade);
        setSelectedGrades(next.length === 0 ? ['全部'] : next);
      } else {
        setSelectedGrades([...filtered, grade]);
      }
    }
  };

  const handleExport = () => {
    const headers = ['批次号', '最高温度(℃)', '合格率(%)', '能耗(kcal/kg)', '等级', '产品规格', '工艺类型', '距今天数'];
    const rows = filteredData.map((d) => [d.batch, d.x, d.y, d.z, d.grade, d.spec, d.processType, d.daysAgo]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `质量关联分析_${new Date().toLocaleDateString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getBatchDetail = (batch: string) => {
    const scatterItem = scatterData.find((d) => d.batch === batch);
    const kilnRec = kilnFiringRecords.find((r) => r.batchNo === batch);
    const gradingRec = gradingRecords.find((r) => r.batchNo === batch);
    return { scatterItem, kilnRec, gradingRec };
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="质量关联分析"
        subtitle="工艺参数·能耗·合格率·分级结果多维关联"
        icon={<BarChart3 className="w-5 h-5" />}
        actions={['refresh', 'export']}
        onAction={(a) => a === 'export' && handleExport()}
      />

      {/* 筛选区 */}
      <div className="card p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
          <div>
            <label className="text-xs font-medium text-industrial-500 mb-2 block">时间段</label>
            <div className="inline-flex rounded-lg border border-industrial-200 bg-industrial-50 p-1">
              {timeRanges.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeRange(t)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                    timeRange === t
                      ? 'bg-white text-kiln-600 shadow-sm'
                      : 'text-industrial-500 hover:text-industrial-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-industrial-500 mb-2 block">产品规格</label>
            <select
              value={productSpec}
              onChange={(e) => setProductSpec(e.target.value)}
              className="input-field !py-2 text-sm"
            >
              {productSpecs.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-industrial-500 mb-2 block">等级筛选</label>
            <div className="flex flex-wrap gap-1.5">
              {gradeOptions.map((g) => {
                const selected = selectedGrades.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGrade(g)}
                    className={`px-3 py-1 text-xs font-medium rounded-md border transition-all ${
                      selected
                        ? g === 'A' ? 'bg-emerald-500 text-white border-emerald-500'
                        : g === 'B' ? 'bg-blue-500 text-white border-blue-500'
                        : g === 'C' ? 'bg-gray-500 text-white border-gray-500'
                        : g === 'D' ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-kiln-500 text-white border-kiln-500'
                        : 'bg-white text-industrial-600 border-industrial-200 hover:border-industrial-300'
                    }`}
                  >
                    {g === '全部' ? '全部' : `${g}品`}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-industrial-500 mb-2 block">工艺类型</label>
            <select
              value={processType}
              onChange={(e) => setProcessType(e.target.value)}
              className="input-field !py-2 text-sm"
            >
              {processTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs font-medium text-industrial-500 mb-2 block">批次号筛选</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-industrial-400" />
            <input
              type="text"
              placeholder="输入批次号，如 B20260617-0003"
              value={batchSearch}
              onChange={(e) => setBatchSearch(e.target.value)}
              className="input-field !w-full !pl-8 !py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* KPI 卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="综合合格率"
          value={kpiValues.avgPass}
          unit="%"
          icon={<Gauge className="w-6 h-6" />}
          change={1.5}
          accent="text-kiln-600"
          iconBg="bg-kiln-50"
        />
        <StatCard
          title="A品率"
          value={kpiValues.aRate}
          unit="%"
          icon={<Award className="w-6 h-6" />}
          change={2.8}
          accent="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="单位能耗"
          value={kpiValues.avgEnergy}
          unit="kcal/kg"
          icon={<Flame className="w-6 h-6" />}
          change={-1.8}
          accent="text-gold-600"
          iconBg="bg-gold-50"
        />
        <StatCard
          title="关联异常点"
          value={kpiValues.anomalyCount}
          unit="处"
          icon={<AlertTriangle className="w-6 h-6" />}
          changeLabel="需重点关注"
          accent="text-rose-600"
          iconBg="bg-rose-50"
        />
      </div>

      {/* 核心图表区 2x2 网格 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* 图表1: 散点图 */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-industrial-900">烧成温度 vs 合格率</h3>
              <p className="text-xs text-industrial-500 mt-0.5">点大小代表能耗，颜色代表等级，点击查看批次详情</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /><span className="text-[11px] text-industrial-500">A品</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /><span className="text-[11px] text-industrial-500">B品</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-500" /><span className="text-[11px] text-industrial-500">C品</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /><span className="text-[11px] text-industrial-500">D品</span></div>
            </div>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEAE4" />
                <XAxis type="number" dataKey="x" name="最高烧成温度" unit="℃" domain={[1180, 1280]} tick={{ fontSize: 11, fill: '#6B6255' }} />
                <YAxis type="number" dataKey="y" name="合格率" unit="%" domain={[85, 100]} tick={{ fontSize: 11, fill: '#6B6255' }} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const d = payload[0].payload as ScatterPoint;
                    return (
                      <div className="bg-white border border-industrial-200 rounded-lg shadow-lg p-3">
                        <div className="font-mono text-xs font-semibold text-kiln-600 mb-2">{d.batch}</div>
                        <div className="text-xs text-industrial-600 space-y-1">
                          <div>最高温度: <span className="font-semibold text-industrial-800">{d.x}℃</span></div>
                          <div>合格率: <span className="font-semibold text-industrial-800">{d.y}%</span></div>
                          <div>单位能耗: <span className="font-semibold text-industrial-800">{d.z} kcal/kg</span></div>
                          <div>等级: <span className="font-semibold" style={{ color: getGradeColor(d.grade) }}>{d.grade}品</span></div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Scatter
                  data={filteredData}
                  onClick={(data: ScatterPoint) => {
                    if (data && data.batch) {
                      setExpandedBatch(expandedBatch === data.batch ? null : data.batch);
                    }
                  }}
                >
                  {filteredData.map((entry, index) => (
                    <Cell key={index} fill={getGradeColor(entry.grade)} fillOpacity={expandedBatch === entry.batch ? 1 : 0.8} stroke={expandedBatch === entry.batch ? '#1A1D21' : 'none'} strokeWidth={expandedBatch === entry.batch ? 2 : 0} style={{ cursor: 'pointer' }} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          {expandedBatch && (() => {
            const { scatterItem, kilnRec, gradingRec } = getBatchDetail(expandedBatch);
            if (!scatterItem) return null;
            const gradeBadgeClass = scatterItem.grade === 'A' ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
              : scatterItem.grade === 'B' ? 'bg-blue-100 text-blue-700 border-blue-200'
              : scatterItem.grade === 'C' ? 'bg-gray-100 text-gray-700 border-gray-200'
              : 'bg-rose-100 text-rose-700 border-rose-200';
            return (
              <div className="mt-4 pt-4 border-t border-industrial-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-kiln-600">{expandedBatch}</span>
                    <span className={`badge border text-[10px] font-semibold ${gradeBadgeClass}`}>{scatterItem.grade}品</span>
                  </div>
                  <button
                    onClick={() => setExpandedBatch(null)}
                    className="p-1 rounded-md hover:bg-industrial-100 text-industrial-400 hover:text-industrial-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-industrial-50/50 border border-industrial-100 p-3">
                    <div className="text-[11px] font-semibold text-industrial-700 mb-2">烧成参数</div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-industrial-500">最高温度</span><span className="font-semibold text-industrial-800">{kilnRec ? kilnRec.maxTemp.toFixed(1) : scatterItem.x}℃</span></div>
                      <div className="flex justify-between"><span className="text-industrial-500">窑速</span><span className="font-semibold text-industrial-800">{kilnRec ? kilnRec.kilnSpeed.toFixed(2) : (9.5 + (scatterItem.x - 1200) * 0.02).toFixed(2)} m/min</span></div>
                      <div className="flex justify-between"><span className="text-industrial-500">周期</span><span className="font-semibold text-industrial-800">{kilnRec ? kilnRec.totalFiringTime.toFixed(0) : (62 + (scatterItem.x - 1200) * 0.15).toFixed(0)} min</span></div>
                      <div className="flex justify-between"><span className="text-industrial-500">氧含量</span><span className="font-semibold text-industrial-800">{kilnRec ? kilnRec.oxygenLevel.toFixed(1) : (2.5 + (1250 - scatterItem.x) * 0.03).toFixed(1)}%</span></div>
                      <div className="flex justify-between"><span className="text-industrial-500">能耗</span><span className="font-semibold text-industrial-800">{scatterItem.z} kcal/kg</span></div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-industrial-50/50 border border-industrial-100 p-3">
                    <div className="text-[11px] font-semibold text-industrial-700 mb-2">分级结果</div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between"><span className="text-industrial-500">平整度</span><span className="font-semibold text-industrial-800">{gradingRec ? gradingRec.flatness.toFixed(3) : (0.1 + (98 - scatterItem.y) * 0.01).toFixed(3)} mm</span></div>
                      <div className="flex justify-between"><span className="text-industrial-500">直角度</span><span className="font-semibold text-industrial-800">{gradingRec ? gradingRec.squareness.toFixed(3) : (0.15 + (98 - scatterItem.y) * 0.012).toFixed(3)} mm</span></div>
                      <div className="flex justify-between"><span className="text-industrial-500">色差ΔE</span><span className="font-semibold text-industrial-800">{gradingRec ? gradingRec.colorDifference.toFixed(2) : (0.4 + (98 - scatterItem.y) * 0.08).toFixed(2)}</span></div>
                      <div className="flex justify-between"><span className="text-industrial-500">色号</span><span className="font-semibold text-industrial-800 font-mono">{gradingRec ? gradingRec.colorNo : 'C' + (100 + parseInt(scatterItem.batch.slice(-3)) % 20)}</span></div>
                      <div className="flex justify-between"><span className="text-industrial-500">数量</span><span className="font-semibold text-industrial-800">{gradingRec ? gradingRec.quantity : 600 + (parseInt(scatterItem.batch.slice(-3)) % 400)} 片</span></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* 图表2: 气泡矩阵 */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold text-industrial-900">能耗-合格率-等级气泡矩阵</h3>
            <p className="text-xs text-industrial-500 mt-0.5">行：能耗区间 · 列：合格率区间 · 数值：批次数</p>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-2">
              <div className="col-span-1" />
              <div className="col-span-2 text-center">
                <span className="text-[11px] font-medium text-emerald-600">优秀 ≥96%</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-[11px] font-medium text-gold-600">良好 92-96%</span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-[11px] font-medium text-rose-600">待改善 {'<'}92%</span>
              </div>
            </div>
            {bubbleMatrix.map((row, rowIdx) => (
              <div key={rowIdx} className="grid grid-cols-7 gap-2 items-center">
                <div className="col-span-1">
                  <span className={`text-[11px] font-medium ${
                    rowIdx === 0 ? 'text-emerald-600' : rowIdx === 1 ? 'text-gold-600' : 'text-rose-600'
                  }`}>
                    {row[0].row.split('').slice(0, 2).join('')}
                  </span>
                  <div className="text-[10px] text-industrial-400 leading-tight">
                    {row[0].row.split('').slice(2).join('')}
                  </div>
                </div>
                {row.map((cell, colIdx) => (
                  <div key={colIdx} className="col-span-2">
                    <div
                      className={`rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:scale-105 ${getBubbleBg(cell.highlight, cell.count)} ${cell.highlight ? 'ring-2 ring-rose-300 shadow-lg animate-pulse-slow' : ''}`}
                    >
                      <span className="font-display text-2xl font-bold">{cell.count}</span>
                      <span className="text-[10px] mt-0.5 opacity-80">批次</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div className="mt-4 flex items-center gap-3 pt-3 border-t border-industrial-100">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-rose-500 to-kiln-600" />
              <span className="text-[11px] text-industrial-500">红色警示格：高能耗-低合格率区间，需重点优化</span>
            </div>
          </div>
        </div>

        {/* 图表3: 工序缺陷贡献 */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold text-industrial-900">工序缺陷来源贡献</h3>
            <p className="text-xs text-industrial-500 mt-0.5">各工序对整体质量影响权重分布</p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={defectContribution}
                layout="vertical"
                margin={{ top: 5, right: 30, bottom: 5, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEAE4" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 40]} tick={{ fontSize: 11, fill: '#6B6255' }} unit="%" />
                <YAxis type="category" dataKey="process" tick={{ fontSize: 12, fill: '#554E44' }} width={80} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, '质量影响权重']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #EDEAE4' }}
                />
                <Bar dataKey="weight" radius={[0, 6, 6, 0]} barSize={22}>
                  {defectContribution.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.highlight ? (entry.weight >= 30 ? '#C8381F' : '#F97316') : '#B5AD9C'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 图表4: 相关性热力图 */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold text-industrial-900">关键参数-质量相关性热力图</h3>
            <p className="text-xs text-industrial-500 mt-0.5">红→黄→绿 表示负相关到正相关 (-1 ~ +1)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-1.5 text-left"></th>
                  {heatmapCols.map((col) => (
                    <th key={col} className="p-1.5 text-center text-[11px] font-medium text-industrial-600">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapRows.map((row, rowIdx) => (
                  <tr key={row}>
                    <td className="p-1.5 text-[11px] font-medium text-industrial-600 whitespace-nowrap pr-3">
                      {row}
                    </td>
                    {heatmapData[rowIdx].map((val, colIdx) => (
                      <td key={colIdx} className="p-1">
                        <div
                          className="rounded-md h-10 flex items-center justify-center text-xs font-bold transition-all hover:scale-110 cursor-default"
                          style={{ backgroundColor: getHeatmapColor(val), color: Math.abs(val) > 0.3 ? 'white' : '#1A1D21' }}
                          title={`${row} - ${heatmapCols[colIdx]}: ${val.toFixed(2)}`}
                        >
                          {val.toFixed(2)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-2 pt-3 border-t border-industrial-100">
            <div className="flex items-center gap-1">
              {['#DC2626', '#F97316', '#FB923C', '#FACC15', '#84CC16', '#10B981'].map((c) => (
                <div key={c} className="w-6 h-3 rounded" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="text-[10px] text-industrial-400">-1.0 强负相关</span>
            <span className="text-[10px] text-industrial-400 ml-auto">+1.0 强正相关</span>
          </div>
        </div>
      </div>

      {/* 异常关联分析列表 */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-50 to-kiln-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-industrial-900">异常关联分析</h3>
              <p className="text-xs text-industrial-500 mt-0.5">基于历史数据挖掘的工艺参数异常关联发现</p>
            </div>
          </div>
          <span className="badge bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium">
            共 {anomalyList.length} 条发现
          </span>
        </div>

        <div className="space-y-3">
          {anomalyList.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                item.level === 'critical'
                  ? 'bg-rose-50/40 border-rose-200'
                  : item.level === 'warning'
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-blue-50/40 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getLevelBadge(item.level)}
                    <span className="text-sm font-semibold text-industrial-800">{item.desc}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-industrial-500">
                      影响批次: <span className="font-mono font-semibold text-industrial-700">{item.batches}</span> 批
                    </span>
                    <span className="text-xs text-industrial-500">
                      建议措施: <span className="text-industrial-700">{item.suggestion}</span>
                    </span>
                  </div>
                </div>
                <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-kiln-600 bg-white border border-kiln-200 rounded-lg hover:bg-kiln-50 transition-colors shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                  查看详情
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 工艺调整建议 */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-50 to-amber-50 border border-gold-200 flex items-center justify-center text-gold-600">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-industrial-900">工艺调整优化建议</h3>
            <p className="text-xs text-industrial-500 mt-0.5">基于数据分析的智能工艺优化方向</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-5 rounded-xl border border-industrial-200 bg-gradient-to-br from-white to-industrial-50/50 hover:shadow-md transition-all group overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle, rgba(200,56,31,0.08) 0%, transparent 70%)' }} />
                <div className="relative">
                  <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center ${s.color} mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-industrial-800 mb-2">{s.title}</h4>
                  <p className="text-sm text-industrial-600 leading-relaxed mb-4">{s.desc}</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-700">预计效果: {s.effect}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
