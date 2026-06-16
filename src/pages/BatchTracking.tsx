import { useState, useMemo, useEffect } from 'react';
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
  X,
  Info,
  BarChart3,
  Link2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useAppStore } from '@/store/productionStore';
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

interface ChainNode {
  key: string;
  name: string;
  time: string;
  icon: typeof FlaskConical;
  iconColor: string;
  iconBg: string;
  isAbnormal: boolean;
  abnormalLevel: 'warning' | 'critical' | null;
  content: string;
  isKey?: boolean;
  isResult?: boolean;
  grade?: string;
  isOverTemp?: boolean;
}

interface QualityImpact {
  name: string;
  level: 'low' | 'medium' | 'high';
  direction: 'up' | 'down';
}

const qualityImpactMap: Record<string, QualityImpact[]> = {
  'ball-milling': [
    { name: '变形量', level: 'high', direction: 'up' },
    { name: '平整度', level: 'medium', direction: 'up' },
    { name: 'A品率', level: 'medium', direction: 'down' },
    { name: '强度', level: 'low', direction: 'down' },
  ],
  'spray-drying': [
    { name: '压制缺陷', level: 'high', direction: 'up' },
    { name: '重量偏差', level: 'medium', direction: 'up' },
    { name: '砖坯密度', level: 'medium', direction: 'down' },
  ],
  'press-forming': [
    { name: '平整度', level: 'high', direction: 'up' },
    { name: '尺寸精度', level: 'high', direction: 'up' },
    { name: '变形量', level: 'medium', direction: 'up' },
    { name: 'A品率', level: 'high', direction: 'down' },
  ],
  'glazing': [
    { name: '色差ΔE', level: 'high', direction: 'up' },
    { name: '釉面质量', level: 'high', direction: 'up' },
    { name: '光泽度', level: 'medium', direction: 'up' },
    { name: '针孔', level: 'medium', direction: 'up' },
  ],
  'kiln-firing': [
    { name: 'A品率', level: 'high', direction: 'down' },
    { name: '色差ΔE', level: 'high', direction: 'up' },
    { name: '变形量', level: 'high', direction: 'up' },
    { name: '强度', level: 'medium', direction: 'up' },
    { name: '平整度', level: 'high', direction: 'up' },
  ],
  'polishing': [
    { name: '光泽度', level: 'high', direction: 'up' },
    { name: '平面度', level: 'medium', direction: 'up' },
    { name: '尺寸精度', level: 'low', direction: 'up' },
  ],
  'grading': [],
};

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

const processOrder = ['ball-milling', 'spray-drying', 'press-forming', 'glazing', 'kiln-firing', 'polishing', 'grading'];

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

function getCompleteBatchNos(): string[] {
  const allBatches = getAllBatchNos();
  return allBatches.filter((batch) => {
    const steps = getBatchProcessData(batch);
    return steps.length === 7;
  });
}

export default function BatchTracking() {
  const allBatches = getAllBatchNos();
  const completeBatches = getCompleteBatchNos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>(completeBatches[0] || allBatches[0] || '');
  const [highlightStep, setHighlightStep] = useState<string | null>(null);
  const [selectedChainNode, setSelectedChainNode] = useState<string | null>(null);
  const setActiveModule = useAppStore((s) => s.setActiveModule);
  const setSelectedBatchForAnalysis = useAppStore((s) => s.setSelectedBatchForAnalysis);

  const filteredBatches = useMemo(() => {
    if (!searchTerm) return allBatches;
    return allBatches.filter((b) => b.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, allBatches]);

  const processSteps = useMemo(() => getBatchProcessData(selectedBatch), [selectedBatch]);

  const completedCount = processSteps.filter((s) => s.status === 'completed').length;
  const abnormalCount = processSteps.filter((s) => s.abnormalities && s.abnormalities.length > 0).length;

  const currentBatchGrade = useMemo(() => {
    return gradingRecords.find((g) => g.batchNo === selectedBatch);
  }, [selectedBatch]);

  const showQualityChain = useMemo(() => {
    const hasNonAGrade = currentBatchGrade && currentBatchGrade.grade !== 'A';
    const hasAbnormal = processSteps.some((s) => s.abnormalities && s.abnormalities.length > 0);
    return !!(hasNonAGrade || hasAbnormal);
  }, [currentBatchGrade, processSteps]);

  const chainNodes = useMemo((): ChainNode[] => {
    const ball = ballMillingRecords.find((r) => r.batchNo === selectedBatch);
    const spray = sprayDryingRecords.find((r) => r.batchNo === selectedBatch);
    const press = pressFormingRecords.find((r) => r.batchNo === selectedBatch);
    const glaze = glazingRecords.find((r) => r.batchNo === selectedBatch);
    const kiln = kilnFiringRecords.find((r) => r.batchNo === selectedBatch);
    const polish = polishingRecords.find((r) => r.batchNo === selectedBatch);
    const grade = gradingRecords.find((r) => r.batchNo === selectedBatch);

    const nodes = [];

    if (ball) {
      const isAbnormal = ball.fineness > 1.8;
      nodes.push({
        key: 'ball-milling',
        name: '球磨工序',
        time: ball.timestamp,
        icon: FlaskConical,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-500',
        isAbnormal,
        abnormalLevel: isAbnormal ? 'warning' as const : null,
        content: isAbnormal
          ? `出磨细度偏高：${ball.fineness.toFixed(2)}%（标准≤1.8%）`
          : `细度合格：${ball.fineness.toFixed(2)}%`,
      });
    }

    if (spray) {
      const isAbnormal = spray.outletTemp < 85 || spray.powderMoisture > 7;
      let content = `出口温度 ${spray.outletTemp}℃，粉料水分 ${spray.powderMoisture.toFixed(1)}%`;
      if (spray.outletTemp < 85) content = `出口温度偏低 ${spray.outletTemp}℃，粉料水分上升`;
      if (spray.powderMoisture > 7) content = `粉料水分偏高 ${spray.powderMoisture.toFixed(1)}%`;
      nodes.push({
        key: 'spray-drying',
        name: '喷雾干燥',
        time: spray.timestamp,
        icon: CloudRain,
        iconColor: 'text-cyan-600',
        iconBg: 'bg-cyan-500',
        isAbnormal,
        abnormalLevel: isAbnormal ? 'warning' as const : null,
        content,
      });
    }

    if (press) {
      let isAbnormal = false;
      let abnormalLevel: 'warning' | 'critical' | null = null;
      let content = `缺陷率 ${press.defectRate.toFixed(2)}%`;
      if (press.defectRate > 2.5) {
        isAbnormal = true;
        abnormalLevel = 'critical';
        content = `缺陷率超标：${press.defectRate.toFixed(2)}%（阈值2.5%）`;
      } else if (press.defectRate > 1.8) {
        isAbnormal = true;
        abnormalLevel = 'warning';
        content = `缺陷率接近上限：${press.defectRate.toFixed(2)}%`;
      }
      nodes.push({
        key: 'press-forming',
        name: '压制成型',
        time: press.timestamp,
        icon: Hammer,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-500',
        isAbnormal,
        abnormalLevel,
        content,
      });
    }

    if (glaze) {
      nodes.push({
        key: 'glazing',
        name: '干燥施釉',
        time: glaze.timestamp,
        icon: PaintBucket,
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-500',
        isAbnormal: false,
        abnormalLevel: null,
        content: `施釉量 ${glaze.glazeAmount}g/㎡，釉浆比重 ${glaze.glazeDensity.toFixed(2)}`,
      });
    }

    if (kiln) {
      const isOverTemp = kiln.maxTemp > 1240;
      nodes.push({
        key: 'kiln-firing',
        name: '辊道窑烧成',
        time: kiln.timestamp,
        icon: Flame,
        iconColor: 'text-kiln-600',
        iconBg: 'bg-kiln-500',
        isAbnormal: isOverTemp,
        abnormalLevel: isOverTemp ? 'critical' as const : null,
        isKey: true,
        content: `最高温度 ${kiln.maxTemp}℃${isOverTemp ? '（超温！）' : ''}，窑速 ${kiln.kilnSpeed.toFixed(1)}m/min，烧成周期 ${kiln.totalFiringTime.toFixed(1)}min，氧含量 ${kiln.oxygenLevel.toFixed(1)}%，合格率 ${kiln.passRate?.toFixed(1) ?? '-'}%`,
        isOverTemp,
      });
    }

    if (polish) {
      nodes.push({
        key: 'polishing',
        name: '抛光磨边',
        time: polish.timestamp,
        icon: Sparkles,
        iconColor: 'text-violet-600',
        iconBg: 'bg-violet-500',
        isAbnormal: false,
        abnormalLevel: null,
        content: `光泽度 ${polish.glossiness.toFixed(1)}%，平面度 ${polish.surfaceFlatness.toFixed(2)}mm`,
      });
    }

    if (grade) {
      const isNonA = grade.grade !== 'A';
      nodes.push({
        key: 'grading',
        name: '分级包装',
        time: grade.timestamp,
        icon: Boxes,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-500',
        isAbnormal: isNonA,
        abnormalLevel: isNonA ? (grade.grade === 'D' ? 'critical' as const : 'warning' as const) : null,
        isKey: true,
        isResult: true,
        grade: grade.grade,
        content: `定级${getGradeLabel(grade.grade)}，色差ΔE=${grade.colorDifference.toFixed(2)}，平整度 ${grade.flatness.toFixed(2)}mm，直角度 ${grade.squareness.toFixed(2)}mm`,
      });
    }

    return nodes;
  }, [selectedBatch]);

  const chainConclusion = useMemo(() => {
    const parts: string[] = [];
    const factors: string[] = [];

    const ball = ballMillingRecords.find((r) => r.batchNo === selectedBatch);
    const press = pressFormingRecords.find((r) => r.batchNo === selectedBatch);
    const kiln = kilnFiringRecords.find((r) => r.batchNo === selectedBatch);
    const grade = gradingRecords.find((r) => r.batchNo === selectedBatch);

    if (ball && ball.fineness > 1.8) {
      parts.push(`球磨细度偏高${ball.fineness.toFixed(2)}%`);
      factors.push('前序球磨细度波动');
    }
    if (press && press.defectRate > 1.8) {
      parts.push(`压制缺陷率${press.defectRate.toFixed(2)}%`);
      if (press.defectRate > 2.5) factors.push('压制成型缺陷率超标');
    }
    if (kiln && kiln.maxTemp > 1240) {
      parts.push(`烧成超温${kiln.maxTemp}℃`);
      factors.push('烧成温度偏高');
    }
    if (grade) {
      parts.push(`最终定级${getGradeLabel(grade.grade)}，色差ΔE=${grade.colorDifference.toFixed(2)}`);
    }

    let conclusion = '';
    if (parts.length > 0) {
      conclusion = '该批次' + parts.join(' → ');
      if (factors.length > 0) {
        conclusion += `。主要影响因素为${factors.map((f, i) => i === 0 ? `**${f}**` : `**${f}**`).join('和')}，建议加强前序工序参数监控及窑炉温度稳定性管控。`;
      }
    } else {
      conclusion = '该批次整体工艺参数正常，建议持续关注。';
    }

    return conclusion;
  }, [selectedBatch]);

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
                {highlightStep && (
                  <button
                    onClick={() => setHighlightStep(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-50 border border-gold-300 text-gold-700 text-xs font-medium hover:bg-gold-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    清除高亮
                  </button>
                )}
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
          <div className="card p-5" onClick={(e) => { if (e.target === e.currentTarget) setHighlightStep(null); }}>
            <h3 className="font-display text-lg font-semibold text-industrial-900 mb-5">工序流转详情</h3>
            <div className="space-y-4">
              {processStages.map((stage, idx) => {
                const step = processSteps.find((s) => s.key === stage.key);
                const StageIcon = stage.icon;
                const isActive = !!step;
                const isLast = idx === processStages.length - 1;
                const hasAbnormal = step?.abnormalities && step.abnormalities.length > 0;

                const highlightIndex = highlightStep ? processOrder.indexOf(highlightStep) : -1;
                const currentIndex = processOrder.indexOf(stage.key);
                const isHighlighted = highlightIndex >= 0 && currentIndex <= highlightIndex;
                const isDimmed = highlightIndex >= 0 && currentIndex > highlightIndex;

                return (
                  <div
                    key={stage.key}
                    className={`relative flex gap-4 rounded-xl p-3 -mx-3 transition-all duration-300 ${
                      isHighlighted
                        ? 'bg-gold-50/70 border-2 border-gold-300 shadow-sm'
                        : isDimmed
                        ? 'opacity-50'
                        : ''
                    }`}
                  >
                    {/* 可能影响质量 badge */}
                    {isHighlighted && (
                      <div className="absolute -top-2.5 right-4 z-20">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-400 text-white text-[10px] font-medium shadow-sm">
                          <Info className="w-3 h-3" />
                          可能影响此质量
                        </span>
                      </div>
                    )}

                    {/* 连接线 */}
                    {!isLast && (
                      <div className={`absolute left-[34px] top-14 bottom-0 w-px z-0 ${
                        isHighlighted && currentIndex < highlightIndex
                          ? 'bg-gradient-to-b from-gold-300 to-gold-200'
                          : 'bg-gradient-to-b from-industrial-200 to-industrial-100'
                      }`} />
                    )}

                    {/* 节点图标 */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? `${stage.bg} text-white shadow-md`
                            : 'bg-industrial-100 text-industrial-400'
                        } ${hasAbnormal ? 'ring-2 ring-kiln-400 ring-offset-2' : ''} ${
                          isHighlighted ? 'ring-2 ring-gold-400 ring-offset-2 animate-pulse' : ''
                        }`}
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
                          <button
                            onClick={() => isActive && setHighlightStep(highlightStep === stage.key ? null : stage.key)}
                            disabled={!isActive}
                            className={`font-semibold transition-colors ${
                              isActive
                                ? highlightStep === stage.key
                                  ? 'text-gold-700 cursor-pointer hover:text-gold-800'
                                  : 'text-industrial-800 cursor-pointer hover:text-kiln-600'
                                : 'text-industrial-400 cursor-default'
                            }`}
                          >
                            {stage.name}
                          </button>
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
                              className={`px-3 py-2 rounded-lg border transition-colors ${
                                isHighlighted
                                  ? 'bg-white/70 border-gold-200'
                                  : 'bg-industrial-50/80 border-industrial-100'
                              }`}
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
                            <button
                              key={i}
                              onClick={() => setHighlightStep(highlightStep === stage.key ? null : stage.key)}
                              className={`w-full flex items-start gap-2 px-3 py-2 rounded-lg border text-left cursor-pointer transition-all hover:shadow-md ${
                                ab.level === 'critical'
                                  ? 'bg-rose-50 border-rose-200 hover:bg-rose-100'
                                  : 'bg-amber-50 border-amber-200 hover:bg-amber-100'
                              } ${highlightStep === stage.key ? 'ring-2 ring-gold-400 ring-offset-1' : ''}`}
                            >
                              <AlertTriangle
                                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                  ab.level === 'critical' ? 'text-rose-500' : 'text-amber-500'
                                }`}
                              />
                              <div className="text-xs text-industrial-700 flex-1">{ab.message}</div>
                              <ChevronRight className="w-3.5 h-3.5 text-industrial-400 mt-0.5" />
                            </button>
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
                      <div className={`absolute right-0 top-5 transition-colors ${
                        isHighlighted && currentIndex < highlightIndex
                          ? 'text-gold-400'
                          : 'text-industrial-300'
                      }`}>
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

          {/* 质量影响链路 */}
          {showQualityChain && (
            <div className="card p-5">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-kiln-500 to-gold-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-industrial-900">质量影响链路分析</h3>
                    <p className="text-xs text-industrial-500 mt-1">展示该批次从前序异常→烧成参数→分级结果的完整传导路径</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedBatchForAnalysis(selectedBatch);
                    setActiveModule('quality-analysis');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-kiln-500 to-gold-500 text-white text-sm font-medium shadow-sm hover:shadow-md hover:from-kiln-600 hover:to-gold-600 transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  跳转质量分析
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative pl-2">
                {chainNodes.map((node, idx) => {
                  const NodeIcon = node.icon;
                  const isLast = idx === chainNodes.length - 1;
                  const isSelected = selectedChainNode === node.key;
                  const impacts = qualityImpactMap[node.key] || [];
                  const hasImpacts = impacts.length > 0;

                  const handleNodeClick = () => {
                    if (!hasImpacts) return;
                    if (isSelected) {
                      setSelectedChainNode(null);
                      setHighlightStep(null);
                    } else {
                      setSelectedChainNode(node.key);
                      setHighlightStep(node.key);
                    }
                  };

                  return (
                    <div key={node.key} className="relative flex gap-4 pb-6">
                      {!isLast && (
                        <div className="absolute left-[22px] top-11 bottom-0 w-0.5 bg-gradient-to-b from-industrial-200 to-industrial-100 z-0">
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-industrial-300" />
                        </div>
                      )}

                      <div className="relative z-10 flex-shrink-0">
                        <div
                          onClick={handleNodeClick}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm transition-all ${
                            hasImpacts ? 'cursor-pointer' : 'cursor-default'
                          } ${
                            isSelected
                              ? 'ring-2 ring-gold-400 ring-offset-2 scale-105'
                              : ''
                          } ${
                            node.isKey
                              ? 'bg-gradient-to-br from-kiln-500 to-gold-500 text-white ring-2 ring-gold-300 ring-offset-2'
                              : node.isAbnormal
                              ? node.abnormalLevel === 'critical'
                                ? 'bg-rose-500 text-white ring-2 ring-rose-300 ring-offset-2'
                                : 'bg-amber-500 text-white ring-2 ring-amber-300 ring-offset-2'
                              : `${node.iconBg} text-white`
                          }`}
                        >
                          <NodeIcon className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div
                          onClick={handleNodeClick}
                          className={`rounded-xl p-4 transition-all ${
                            hasImpacts ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                          } ${
                            isSelected
                              ? 'border-2 border-gold-400 bg-gold-50/80 shadow-md'
                              : node.isResult && node.isAbnormal
                              ? 'bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200'
                              : node.isKey
                              ? 'bg-gradient-to-r from-kiln-50 to-gold-50 border border-gold-200'
                              : node.isAbnormal
                              ? node.abnormalLevel === 'critical'
                                ? 'bg-rose-50 border border-rose-200'
                                : 'bg-amber-50 border border-amber-200'
                              : 'bg-industrial-50 border border-industrial-100'
                          }`}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-semibold ${
                                  isSelected
                                    ? 'text-gold-700'
                                    : node.isKey
                                    ? 'text-kiln-700'
                                    : node.isAbnormal
                                    ? node.abnormalLevel === 'critical'
                                      ? 'text-rose-700'
                                      : 'text-amber-700'
                                    : 'text-industrial-800'
                                }`}
                              >
                                {node.name}
                              </span>
                              {node.isKey && (
                                <span className="badge bg-gold-100 text-gold-700 border border-gold-200 text-[10px]">
                                  关键节点
                                </span>
                              )}
                              {node.isAbnormal && node.abnormalLevel && (
                                <span
                                  className={`badge text-[10px] ${
                                    node.abnormalLevel === 'critical'
                                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                                  }`}
                                >
                                  {node.abnormalLevel === 'critical' ? 'CRITICAL' : 'WARNING'}
                                </span>
                              )}
                              {isSelected && (
                                <span className="badge bg-gold-400 text-white border border-gold-300 text-[10px]">
                                  已选中
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-industrial-500 font-mono">{node.time}</span>
                          </div>
                          <div
                            className={`mt-2 text-sm ${
                              isSelected
                                ? 'text-gold-700 font-medium'
                                : node.isOverTemp
                                ? 'text-rose-600 font-semibold'
                                : node.isKey
                                ? 'text-kiln-700'
                                : node.isAbnormal
                                ? node.abnormalLevel === 'critical'
                                  ? 'text-rose-700 font-semibold'
                                  : 'text-amber-700 font-medium'
                                : 'text-industrial-700'
                            }`}
                          >
                            {node.content}
                          </div>
                        </div>

                        {isSelected && hasImpacts && (
                          <div className="mt-3 ml-2 p-4 rounded-xl bg-white border-2 border-gold-200 shadow-inner">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1 h-4 bg-gradient-to-b from-gold-400 to-kiln-400 rounded-full" />
                              <span className="text-sm font-semibold text-industrial-800">可能影响的质量指标</span>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {impacts.map((impact, i) => {
                                const levelBars = impact.level === 'high' ? 3 : impact.level === 'medium' ? 2 : 1;
                                const isGood = impact.direction === 'down' && impact.name.includes('A品率');
                                const isBad = impact.direction === 'up';
                                return (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-industrial-50 border border-industrial-100"
                                  >
                                    <span className="text-xs font-medium text-industrial-700">{impact.name}</span>
                                    <div className="flex items-center gap-1.5">
                                      <div className="flex gap-0.5">
                                        {[1, 2, 3].map((bar) => (
                                          <div
                                            key={bar}
                                            className={`w-1.5 rounded-full transition-all ${
                                              bar <= levelBars
                                                ? impact.level === 'high'
                                                  ? 'bg-rose-500 h-4'
                                                  : impact.level === 'medium'
                                                  ? 'bg-amber-500 h-3'
                                                  : 'bg-emerald-500 h-2'
                                                : 'bg-industrial-200 h-2'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <div
                                        className={`flex items-center gap-0.5 text-xs font-semibold ${
                                          isBad ? 'text-rose-600' : 'text-emerald-600'
                                        }`}
                                      >
                                        {impact.direction === 'up' ? (
                                          <ArrowUp className="w-3 h-3" />
                                        ) : (
                                          <ArrowDown className="w-3 h-3" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-3 flex items-center gap-4 text-[10px] text-industrial-500">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-2 rounded-full bg-emerald-500" />
                                <span>低</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-3 rounded-full bg-amber-500" />
                                <span>中</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-4 rounded-full bg-rose-500" />
                                <span>高</span>
                              </div>
                              <div className="flex items-center gap-1 ml-auto">
                                <ArrowUp className="w-3 h-3 text-rose-500" />
                                <span>上升/变差</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ArrowDown className="w-3 h-3 text-emerald-500" />
                                <span>下降/变好</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-kiln-50 via-gold-50 to-amber-50 border border-gold-200">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-industrial-700 leading-relaxed">
                    {chainConclusion.split('**').map((part, i) =>
                      i % 2 === 1 ? (
                        <span key={i} className="font-semibold text-kiln-700">
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
