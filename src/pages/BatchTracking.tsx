import { useState, useMemo } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import {
  FlaskConical,
  CloudRain,
  Hammer,
  PaintBucket,
  Flame,
  Sparkles,
  Boxes,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  Package,
  Activity,
} from 'lucide-react';
import {
  ballMillingRecords,
  sprayDryingRecords,
  pressFormingRecords,
  glazingRecords,
  kilnFiringRecords,
  polishingRecords,
  gradingRecords,
} from '@/utils/mockData';

interface ProcessStep {
  key: string;
  name: string;
  icon: typeof FlaskConical;
  color: string;
  bgColor: string;
  status: 'completed' | 'in-progress' | 'pending' | 'abnormal';
  time?: string;
  operator?: string;
  params: { label: string; value: string }[];
  abnormalities?: { level: 'warning' | 'critical'; message: string }[];
}

const processStages = [
  { key: 'ball-milling', name: '原料球磨', icon: FlaskConical, color: 'text-blue-600', bg: 'bg-blue-500', bgLight: 'bg-blue-50', border: 'border-blue-200' },
  { key: 'spray-drying', name: '喷雾干燥', icon: CloudRain, color: 'text-cyan-600', bg: 'bg-cyan-500', bgLight: 'bg-cyan-50', border: 'border-cyan-200' },
  { key: 'press-forming', name: '压制成型', icon: Hammer, color: 'text-amber-600', bg: 'bg-amber-500', bgLight: 'bg-amber-50', border: 'border-amber-200' },
  { key: 'glazing', name: '干燥施釉', icon: PaintBucket, color: 'text-teal-600', bg: 'bg-teal-500', bgLight: 'bg-teal-50', border: 'border-teal-200' },
  { key: 'kiln-firing', name: '辊道窑烧成', icon: Flame, color: 'text-kiln-600', bg: 'bg-kiln-500', bgLight: 'bg-kiln-50', border: 'border-kiln-200' },
  { key: 'polishing', name: '抛光磨边', icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-500', bgLight: 'bg-violet-50', border: 'border-violet-200' },
  { key: 'grading', name: '分级包装', icon: Boxes, color: 'text-emerald-600', bg: 'bg-emerald-500', bgLight: 'bg-emerald-50', border: 'border-emerald-200' },
];

function getGradeLabel(grade: string): string {
  switch (grade) {
    case 'A': return '优等品';
    case 'B': return '一级品';
    case 'C': return '合格品';
    default: return '次品';
  }
}

function getBatchProcessData(batchNo: string): ProcessStep[] {
  const ball = ballMillingRecords.find((r) => r.batchNo === batchNo);
  const spray = sprayDryingRecords.find((r) => r.batchNo === batchNo);
  const press = pressFormingRecords.find((r) => r.batchNo === batchNo);
  const glaze = glazingRecords.find((r) => r.batchNo === batchNo);
  const kiln = kilnFiringRecords.find((r) => r.batchNo === batchNo);
  const polish = polishingRecords.find((r) => r.batchNo === batchNo);
  const grade = gradingRecords.find((r) => r.batchNo === batchNo);

  const steps: ProcessStep[] = [];

  if (ball) {
    steps.push({
      key: 'ball-milling',
      name: '原料球磨',
      icon: FlaskConical,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      status: ball.status === 'running' ? 'in-progress' : ball.status === 'completed' ? 'completed' : 'pending',
      time: ball.timestamp,
      operator: ball.operator,
      params: [
        { label: '球磨机', value: ball.ballMillId },
        { label: '配方', value: ball.formulaName },
        { label: '球磨时间', value: `${ball.duration.toFixed(1)}h` },
        { label: '出磨细度', value: `${ball.fineness.toFixed(2)}%` },
        { label: '泥浆比重', value: ball.slurryDensity.toFixed(2) },
      ],
      abnormalities: ball.fineness > 1.8 ? [{ level: 'warning' as const, message: `出磨细度 ${ball.fineness.toFixed(2)}% 略高于标准上限 1.8%` }] : [],
    });
  }

  if (spray) {
    steps.push({
      key: 'spray-drying',
      name: '喷雾干燥',
      icon: CloudRain,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-500',
      status: 'completed',
      time: spray.timestamp,
      operator: spray.operator,
      params: [
        { label: '喷雾塔', value: spray.towerId },
        { label: '进温', value: `${spray.inletTemp}℃` },
        { label: '出温', value: `${spray.outletTemp}℃` },
        { label: '粉料水分', value: `${spray.powderMoisture.toFixed(1)}%` },
        { label: '造粒效率', value: `${spray.efficiency.toFixed(1)}%` },
      ],
      abnormalities: spray.outletTemp < 85 ? [{ level: 'warning' as const, message: `出口温度 ${spray.outletTemp}℃ 偏低，粉料水分上升` }] : [],
    });
  }

  if (press) {
    steps.push({
      key: 'press-forming',
      name: '压制成型',
      icon: Hammer,
      color: 'text-amber-600',
      bgColor: 'bg-amber-500',
      status: 'completed',
      time: press.timestamp,
      operator: press.operator,
      params: [
        { label: '压机', value: press.pressId },
        { label: '模具规格', value: press.moldSpec },
        { label: '成型压力', value: `${press.pressure}bar` },
        { label: '砖坯厚度', value: `${press.thickness.toFixed(1)}mm` },
        { label: '班产量', value: `${press.outputCount}片` },
        { label: '缺陷率', value: `${press.defectRate.toFixed(2)}%` },
      ],
      abnormalities: press.defectRate > 2.5 ? [{ level: 'critical' as const, message: `缺陷率 ${press.defectRate.toFixed(2)}% 超过阈值 2.5%` }] : press.defectRate > 1.8 ? [{ level: 'warning' as const, message: `缺陷率 ${press.defectRate.toFixed(2)}% 接近上限` }] : [],
    });
  }

  if (glaze) {
    steps.push({
      key: 'glazing',
      name: '干燥施釉',
      icon: PaintBucket,
      color: 'text-teal-600',
      bgColor: 'bg-teal-500',
      status: 'completed',
      time: glaze.timestamp,
      operator: glaze.operator,
      params: [
        { label: '图案', value: glaze.patternName },
        { label: '干燥时间', value: `${glaze.dryingTime}min` },
        { label: '釉浆比重', value: glaze.glazeDensity.toFixed(2) },
        { label: '施釉量', value: `${glaze.glazeAmount}g/㎡` },
        { label: '釉层厚度', value: `${glaze.glazeThickness.toFixed(2)}mm` },
      ],
      abnormalities: [],
    });
  }

  if (kiln) {
    steps.push({
      key: 'kiln-firing',
      name: '辊道窑烧成',
      icon: Flame,
      color: 'text-kiln-600',
      bgColor: 'bg-kiln-500',
      status: 'completed',
      time: kiln.timestamp,
      operator: kiln.operator,
      params: [
        { label: '窑号', value: kiln.kilnId },
        { label: '最高温度', value: `${kiln.maxTemp}℃` },
        { label: '窑速', value: `${kiln.kilnSpeed.toFixed(1)}m/min` },
        { label: '烧成周期', value: `${kiln.totalFiringTime.toFixed(1)}min` },
        { label: '单位能耗', value: `${kiln.fuelConsumption.toFixed(2)}kcal/kg` },
        { label: '合格率', value: `${kiln.passRate?.toFixed(1) ?? '-'}%` },
      ],
      abnormalities: kiln.maxTemp > 1240 ? [{ level: 'critical' as const, message: `最高温度 ${kiln.maxTemp}℃ 超过上限 1240℃` }] : [],
    });
  }

  if (polish) {
    steps.push({
      key: 'polishing',
      name: '抛光磨边',
      icon: Sparkles,
      color: 'text-violet-600',
      bgColor: 'bg-violet-500',
      status: 'completed',
      time: polish.timestamp,
      operator: polish.operator,
      params: [
        { label: '磨头配置', value: polish.polishingHeadConfig },
        { label: '抛光速度', value: `${polish.polishingSpeed.toFixed(1)}m/min` },
        { label: '光泽度', value: `${polish.glossiness.toFixed(1)}%` },
        { label: '平面度', value: `${polish.surfaceFlatness.toFixed(2)}mm` },
        { label: '倒角角度', value: `${polish.chamferAngle}°` },
      ],
      abnormalities: [],
    });
  }

  if (grade) {
    steps.push({
      key: 'grading',
      name: '分级包装',
      icon: Boxes,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500',
      status: 'completed',
      time: grade.timestamp,
      operator: grade.operator,
      params: [
        { label: '产品等级', value: getGradeLabel(grade.grade) },
        { label: '色号', value: grade.colorNo },
        { label: '平整度', value: `${grade.flatness.toFixed(2)}mm` },
        { label: '直角度', value: `${grade.squareness.toFixed(2)}mm` },
        { label: '色差ΔE', value: grade.colorDifference.toFixed(2) },
        { label: '包装规格', value: grade.packagingSpec },
        { label: '数量', value: `${grade.quantity}片` },
      ],
      abnormalities: grade.grade !== 'A' ? [{ level: grade.grade === 'D' ? 'critical' : 'warning' as const, message: `产品定级为${getGradeLabel(grade.grade)}` }] : [],
    });
  }

  return steps;
}

function getAllBatchNos(): string[] {
  const set = new Set<string>();
  ballMillingRecords.forEach((r) => set.add(r.batchNo));
  sprayDryingRecords.forEach((r) => set.add(r.batchNo));
  pressFormingRecords.forEach((r) => set.add(r.batchNo));
  glazingRecords.forEach((r) => set.add(r.batchNo));
  kilnFiringRecords.forEach((r) => set.add(r.batchNo));
  polishingRecords.forEach((r) => set.add(r.batchNo));
  gradingRecords.forEach((r) => set.add(r.batchNo));
  return Array.from(set).sort();
}

export default function BatchTracking() {
  const allBatches = getAllBatchNos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>(allBatches[0] || '');

  const filteredBatches = useMemo(() => {
    if (!searchTerm) return allBatches;
    return allBatches.filter((b) => b.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, allBatches]);

  const processSteps = useMemo(() => getBatchProcessData(selectedBatch), [selectedBatch]);

  const completedCount = processSteps.filter((s) => s.status === 'completed').length;
  const abnormalCount = processSteps.filter((s) => s.abnormalities && s.abnormalities.length > 0).length;

  const StatusIcon = ({ status }: { status: ProcessStep['status'] }) => {
    if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (status === 'in-progress') return <Clock className="w-5 h-5 text-kiln-500 animate-pulse" />;
    if (status === 'abnormal') return <AlertTriangle className="w-5 h-5 text-rose-500" />;
    return <div className="w-5 h-5 rounded-full border-2 border-industrial-300" />;
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="批次流转追踪"
        subtitle="全流程追溯 · 从原料到成品的完整工艺记录"
        icon={<Activity className="w-5 h-5" />}
        actions={['export']}
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* 批次列表 */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-industrial-100 bg-gradient-to-r from-kiln-50 to-transparent">
            <h3 className="font-display text-base font-semibold text-industrial-900">批次列表</h3>
            <p className="text-[11px] text-industrial-500 mt-0.5">共 {allBatches.length} 个在产批次</p>
          </div>
          <div className="p-3">
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-industrial-400" />
              <input
                type="text"
                placeholder="搜索批次号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field !w-full !pl-8 !py-2 text-sm"
              />
            </div>
            <div className="max-h-[480px] overflow-y-auto scrollbar-thin space-y-1">
              {filteredBatches.map((batch) => {
                const steps = getBatchProcessData(batch);
                const lastStep = steps[steps.length - 1];
                const hasAbnormal = steps.some((s) => s.abnormalities && s.abnormalities.length > 0);
                const isSelected = batch === selectedBatch;
                return (
                  <button
                    key={batch}
                    onClick={() => setSelectedBatch(batch)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                      isSelected
                        ? 'bg-kiln-50 border border-kiln-200 shadow-sm'
                        : 'hover:bg-industrial-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-xs font-semibold ${isSelected ? 'text-kiln-600' : 'text-industrial-700'}`}>
                        {batch}
                      </span>
                      {hasAbnormal && (
                        <span className="w-2 h-2 rounded-full bg-kiln-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex-1 h-1.5 rounded-full bg-industrial-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-kiln-400 to-gold-400 transition-all"
                          style={{ width: `${(steps.length / 7) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-industrial-500 font-mono w-8 text-right">
                        {steps.length}/7
                      </span>
                    </div>
                    {lastStep && (
                      <div className="text-[10px] text-industrial-400 mt-1">
                        当前：{lastStep.name}
                      </div>
                    )}
                  </button>
                );
              })}
              {filteredBatches.length === 0 && (
                <div className="py-8 text-center text-sm text-industrial-400">
                  未找到匹配的批次
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 流转详情 */}
        <div className="xl:col-span-3 space-y-5">
          {/* 批次概览 */}
          <div className="card p-5">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kiln-500 to-gold-500 flex items-center justify-center text-white shadow-md">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-industrial-900">{selectedBatch}</h2>
                    <p className="text-sm text-industrial-500 mt-0.5">
                      {completedCount}/7 工序完成
                      {abnormalCount > 0 && <span className="ml-2 text-kiln-600 font-medium">· {abnormalCount} 项异常</span>}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-industrial-500">整体进度</div>
                  <div className="font-display text-xl font-bold text-kiln-600">
                    {Math.round((completedCount / 7) * 100)}%
                  </div>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#EDEAE4"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${(completedCount / 7) * 100}, 100`}
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#C8381F" />
                        <stop offset="100%" stopColor="#D4A547" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 流转时间轴 */}
          <div className="card p-5">
            <h3 className="font-display text-lg font-semibold text-industrial-900 mb-5">工序流转详情</h3>
            <div className="space-y-4">
              {processStages.map((stage, idx) => {
                const step = processSteps.find((s) => s.key === stage.key);
                const StageIcon = stage.icon;
                const isActive = !!step;
                const isLast = idx === processStages.length - 1;
                const hasAbnormal = step?.abnormalities && step.abnormalities.length > 0;

                return (
                  <div key={stage.key} className="relative flex gap-4">
                    {/* 连接线 */}
                    {!isLast && (
                      <div className="absolute left-[22px] top-12 bottom-0 w-px bg-gradient-to-b from-industrial-200 to-industrial-100" />
                    )}

                    {/* 节点图标 */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                          isActive
                            ? `${stage.bg} text-white shadow-md`
                            : 'bg-industrial-100 text-industrial-400'
                        } ${hasAbnormal ? 'ring-2 ring-kiln-400 ring-offset-2' : ''}`}
                      >
                        <StageIcon className="w-5 h-5" />
                      </div>
                      {step?.status === 'completed' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white">
                          <CheckCircle2 className="w-3 h-3" />
                        </div>
                      )}
                      {step?.status === 'in-progress' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-kiln-500 text-white flex items-center justify-center border-2 border-white animate-pulse">
                          <Clock className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* 内容区 */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-semibold ${isActive ? 'text-industrial-800' : 'text-industrial-400'}`}>
                            {stage.name}
                          </h4>
                          {step?.status === 'completed' && (
                            <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
                              已完成
                            </span>
                          )}
                          {step?.status === 'in-progress' && (
                            <span className="badge bg-kiln-50 text-kiln-700 border border-kiln-200 text-[10px]">
                              进行中
                            </span>
                          )}
                          {!step && (
                            <span className="badge bg-industrial-100 text-industrial-500 text-[10px]">
                              未开始
                            </span>
                          )}
                          {hasAbnormal && (
                            <span className="badge bg-rose-50 text-rose-700 border border-rose-200 text-[10px]">
                              有异常
                            </span>
                          )}
                        </div>
                        {step?.time && (
                          <span className="text-xs text-industrial-500 font-mono">{step.time}</span>
                        )}
                      </div>

                      {step?.operator && (
                        <div className="text-xs text-industrial-500 mt-1">操作员：{step.operator}</div>
                      )}

                      {step && (
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                          {step.params.map((p) => (
                            <div
                              key={p.label}
                              className="px-3 py-2 rounded-lg bg-industrial-50/80 border border-industrial-100"
                            >
                              <div className="text-[10px] text-industrial-500">{p.label}</div>
                              <div className="text-sm font-semibold text-industrial-800 mt-0.5">{p.value}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {hasAbnormal && step.abnormalities && (
                        <div className="mt-3 space-y-2">
                          {step.abnormalities.map((ab, i) => (
                            <div
                              key={i}
                              className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${
                                ab.level === 'critical'
                                  ? 'bg-rose-50 border-rose-200'
                                  : 'bg-amber-50 border-amber-200'
                              }`}
                            >
                              <AlertTriangle
                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                  ab.level === 'critical' ? 'text-rose-500' : 'text-amber-500'
                                }`}
                              />
                              <div className="text-xs text-industrial-700">{ab.message}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!step && (
                        <div className="mt-2 text-xs text-industrial-400 italic">
                          等待上道工序完成后进入
                        </div>
                      )}
                    </div>

                    {/* 箭头 */}
                    {!isLast && (
                      <div className="absolute right-0 top-5 text-industrial-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 追溯信息 */}
          <div className="card p-5">
            <h3 className="font-display text-lg font-semibold text-industrial-900 mb-4">追溯信息</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="text-xs text-blue-600 font-medium">原料批次</div>
                <div className="font-mono text-sm font-semibold text-blue-800 mt-1">YL20260617-003</div>
              </div>
              <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-100">
                <div className="text-xs text-cyan-600 font-medium">料仓编号</div>
                <div className="font-mono text-sm font-semibold text-cyan-800 mt-1">LC-A5</div>
              </div>
              <div className="p-3 rounded-lg bg-violet-50 border border-violet-100">
                <div className="text-xs text-violet-600 font-medium">釉料批次</div>
                <div className="font-mono text-sm font-semibold text-violet-800 mt-1">YL-GZ-0617</div>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="text-xs text-emerald-600 font-medium">入库仓位</div>
                <div className="font-mono text-sm font-semibold text-emerald-800 mt-1">CK-B2-08</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
