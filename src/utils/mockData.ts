import type {
  BallMillingRecord,
  SprayDryingRecord,
  PressFormingRecord,
  GlazingRecord,
  KilnFiringRecord,
  PolishingRecord,
  GradingRecord,
  DashboardKPI,
  Alarm,
  TrendPoint,
  KilnRealtimeZone,
  Formula,
} from "../types";

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function randomDate(hoursAgo: number = 24): string {
  const d = new Date();
  d.setHours(d.getHours() - Math.floor(Math.random() * hoursAgo));
  d.setMinutes(Math.floor(Math.random() * 60));
  return d.toISOString().slice(0, 19).replace("T", " ");
}

const operators = ["张建国", "李明华", "王志强", "赵德伟", "刘建军", "陈红斌"];
const shifts: ("day" | "night")[] = ["day", "night"];

function batchNo(): string {
  const d = new Date();
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `B${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}${n}`;
}

export const formulas: Formula[] = [
  {
    id: "F001",
    name: "800×800抛釉砖配方A",
    recipe: [
      { material: "高岭土", ratio: 35 },
      { material: "长石", ratio: 25 },
      { material: "石英", ratio: 20 },
      { material: "瓷砂", ratio: 15 },
      { material: "膨润土", ratio: 5 },
    ],
    description: "常规抛釉砖基础配方，适用于中温烧成",
    usageCount: 1256,
  },
  {
    id: "F002",
    name: "600×1200大理石系列",
    recipe: [
      { material: "高岭土", ratio: 32 },
      { material: "钾长石", ratio: 28 },
      { material: "石英砂", ratio: 22 },
      { material: "氧化铝", ratio: 10 },
      { material: "助熔剂", ratio: 8 },
    ],
    description: "仿大理石纹大规格瓷砖配方",
    usageCount: 892,
  },
  {
    id: "F003",
    name: "仿古砖哑光系列",
    recipe: [
      { material: "黑泥", ratio: 40 },
      { material: "长石", ratio: 22 },
      { material: "石英", ratio: 18 },
      { material: "滑石", ratio: 12 },
      { material: "色料", ratio: 8 },
    ],
    description: "哑光仿古砖专用配方",
    usageCount: 634,
  },
];

export const ballMillingRecords: BallMillingRecord[] = Array.from({ length: 12 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(48),
  shift: shifts[i % 2],
  operator: operators[i % operators.length],
  batchNo: batchNo(),
  formulaId: formulas[i % formulas.length].id,
  formulaName: formulas[i % formulas.length].name,
  recipe: formulas[i % formulas.length].recipe,
  ballMillId: `BM-${101 + (i % 4)}`,
  speed: 16 + Math.random() * 4,
  ballRatio: 1.5 + Math.random() * 0.5,
  duration: 10 + Math.random() * 6,
  fineness: 0.8 + Math.random() * 1.2,
  slurryDensity: 1.65 + Math.random() * 0.15,
  viscosity: 350 + Math.random() * 150,
  moisture: 34 + Math.random() * 4,
  status: (["running", "completed", "paused"] as const)[i % 3],
}));

export const sprayDryingRecords: SprayDryingRecord[] = Array.from({ length: 10 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(36),
  shift: shifts[i % 2],
  operator: operators[(i + 1) % operators.length],
  batchNo: batchNo(),
  towerId: `SD-${201 + (i % 2)}`,
  inletTemp: 520 + Math.random() * 40,
  outletTemp: 90 + Math.random() * 15,
  pressure: 1.8 + Math.random() * 0.6,
  feedRate: 18 + Math.random() * 6,
  powderSize: 60 + Math.random() * 40,
  powderMoisture: 5.5 + Math.random() * 2.5,
  flowability: 85 + Math.random() * 10,
  bulkDensity: 0.9 + Math.random() * 0.15,
  efficiency: 72 + Math.random() * 12,
}));

export const pressFormingRecords: PressFormingRecord[] = Array.from({ length: 15 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(24),
  shift: shifts[i % 2],
  operator: operators[(i + 2) % operators.length],
  batchNo: batchNo(),
  pressId: `PR-${301 + (i % 6)}`,
  moldSpec: ["800×800", "600×1200", "600×600", "750×1500"][i % 4],
  pressure: 280 + Math.random() * 80,
  holdingTime: 0.8 + Math.random() * 0.6,
  exhaustCount: 2 + Math.floor(Math.random() * 3),
  brickWeight: 14 + Math.random() * 4,
  thickness: 10 + Math.random() * 2,
  thicknessTolerance: Math.random() * 0.5,
  cycleTime: 6 + Math.random() * 3,
  outputCount: Math.floor(1800 + Math.random() * 1200),
  defectRate: 0.5 + Math.random() * 3,
}));

export const glazingRecords: GlazingRecord[] = Array.from({ length: 10 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(20),
  shift: shifts[i % 2],
  operator: operators[(i + 3) % operators.length],
  batchNo: batchNo(),
  dryerTemp: [120, 160, 190, 210, 200, 170].map((t) => t + Math.random() * 20),
  dryingTime: 45 + Math.random() * 20,
  glazeDensity: 1.45 + Math.random() * 0.15,
  glazeAmount: 450 + Math.random() * 150,
  patternId: `PT-${1001 + i}`,
  patternName: ["爵士白", "卡拉拉", "鱼肚白", "大花白", "莎安娜", "意大利米黄"][i % 6],
  glazeThickness: 0.5 + Math.random() * 0.4,
  dryingLoss: 0.2 + Math.random() * 0.5,
}));

export const kilnFiringRecords: KilnFiringRecord[] = Array.from({ length: 8 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(16),
  shift: shifts[i % 2],
  operator: operators[(i + 4) % operators.length],
  batchNo: batchNo(),
  kilnId: `K-${1}`,
  zoneTemps: Array.from({ length: 12 }, (_, j) => {
    if (j < 3) return 300 + j * 150 + Math.random() * 30;
    if (j < 8) return 1180 + Math.random() * 40;
    return 900 - (j - 8) * 180 + Math.random() * 20;
  }),
  zoneCount: 12,
  kilnSpeed: 8 + Math.random() * 4,
  totalFiringTime: 60 + Math.random() * 20,
  oxygenLevel: 2 + Math.random() * 4,
  airFuelRatio: 10 + Math.random() * 2,
  kilnPressure: 12 + Math.random() * 8,
  maxTemp: 1200 + Math.random() * 30,
  fuelConsumption: 2.8 + Math.random() * 0.8,
}));

export const polishingRecords: PolishingRecord[] = Array.from({ length: 10 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(12),
  shift: shifts[i % 2],
  operator: operators[(i + 5) % operators.length],
  batchNo: batchNo(),
  polishingHeadConfig: `${8 + (i % 3)}组磨头`,
  polishingSpeed: 4 + Math.random() * 3,
  feedRate: 12 + Math.random() * 6,
  polishingFluid: ["菱苦土", "氧化铈", "氧化硅"][i % 3],
  edgeGrindingAmount: 0.8 + Math.random() * 0.8,
  chamferAngle: 45,
  dimensionalTolerance: Math.random() * 0.3,
  glossiness: 85 + Math.random() * 12,
  surfaceFlatness: 0.1 + Math.random() * 0.2,
}));

export const gradingRecords: GradingRecord[] = Array.from({ length: 14 }).map((_, i) => {
  const gradeRoll = Math.random();
  const grade = gradeRoll < 0.7 ? "A" : gradeRoll < 0.88 ? "B" : gradeRoll < 0.97 ? "C" : "D";
  return {
    id: generateId(),
    timestamp: randomDate(10),
    shift: shifts[i % 2],
    operator: operators[i % operators.length],
    batchNo: batchNo(),
    flatness: 0.05 + Math.random() * 0.25,
    squareness: 0.1 + Math.random() * 0.3,
    edgeStraightness: 0.08 + Math.random() * 0.2,
    colorDifference: 0.3 + Math.random() * 1.2,
    colorNo: `C${101 + (i % 12)}`,
    grade,
    packagingSpec: ["2片/箱", "3片/箱", "4片/箱"][i % 3],
    quantity: Math.floor(400 + Math.random() * 800),
    defectTypes: [
      { type: "针孔", count: Math.floor(Math.random() * 20) },
      { type: "变形", count: Math.floor(Math.random() * 15) },
      { type: "色差", count: Math.floor(Math.random() * 10) },
    ],
  };
});

export const dashboardKPI: DashboardKPI = {
  todayOutput: 28650,
  outputChange: 5.2,
  passRate: 94.8,
  passRateChange: 1.3,
  energyConsumption: 128.6,
  energyChange: -2.4,
  activeAlarms: 7,
  runningEquipment: 32,
  totalEquipment: 36,
  currentShift: "白班 (08:00-20:00)",
};

export const alarms: Alarm[] = [
  {
    id: "ALM-001",
    level: "critical",
    module: "辊道窑烧成",
    message: "K1窑烧成区Z6温度过高，达到1258℃，超过上限1250℃",
    timestamp: "2026-06-17 09:32:15",
    status: "processing",
    handler: "李明华",
  },
  {
    id: "ALM-002",
    level: "critical",
    module: "压制成型",
    message: "PR-303压机液压压力异常，实际压力245bar低于设定280bar",
    timestamp: "2026-06-17 09:18:42",
    status: "pending",
  },
  {
    id: "ALM-003",
    level: "warning",
    module: "喷雾干燥",
    message: "SD-201塔出口温度偏低，仅82℃，粉料水分上升",
    timestamp: "2026-06-17 08:55:28",
    status: "processing",
    handler: "王志强",
  },
  {
    id: "ALM-004",
    level: "warning",
    module: "分级包装",
    message: "色差分选A品率下降至68%，建议检查釉线稳定性",
    timestamp: "2026-06-17 08:42:10",
    status: "pending",
  },
  {
    id: "ALM-005",
    level: "warning",
    module: "原料球磨",
    message: "BM-102球磨机出磨细度1.9%，略高于标准上限1.8%",
    timestamp: "2026-06-17 07:58:33",
    status: "resolved",
    handler: "张建国",
  },
  {
    id: "ALM-006",
    level: "info",
    module: "干燥施釉",
    message: "釉浆批次更换中，请确认新批次比重1.52g/cm³",
    timestamp: "2026-06-17 07:30:05",
    status: "resolved",
    handler: "赵德伟",
  },
  {
    id: "ALM-007",
    level: "info",
    module: "抛光磨边",
    message: "3号抛光机磨头寿命剩余18%，建议本周更换",
    timestamp: "2026-06-17 06:45:12",
    status: "pending",
  },
];

export const trendData: TrendPoint[] = Array.from({ length: 24 }).map((_, i) => {
  const h = String(i).padStart(2, "0");
  const base = 1000 + Math.sin(i / 4) * 200;
  return {
    time: `${h}:00`,
    output: Math.floor(base + Math.random() * 400),
    passRate: Number((92 + Math.random() * 6).toFixed(1)),
    energy: Number((110 + Math.random() * 40).toFixed(1)),
  };
});

export const kilnRealtimeZones: KilnRealtimeZone[] = [
  { zone: 1, name: "Z1预热", type: "preheat", setTemp: 350, actualTemp: 348, status: "normal" },
  { zone: 2, name: "Z2预热", type: "preheat", setTemp: 550, actualTemp: 562, status: "high" },
  { zone: 3, name: "Z3预热", type: "preheat", setTemp: 780, actualTemp: 775, status: "normal" },
  { zone: 4, name: "Z4烧成", type: "firing", setTemp: 1050, actualTemp: 1047, status: "normal" },
  { zone: 5, name: "Z5烧成", type: "firing", setTemp: 1180, actualTemp: 1184, status: "normal" },
  { zone: 6, name: "Z6烧成", type: "firing", setTemp: 1230, actualTemp: 1258, status: "high" },
  { zone: 7, name: "Z7烧成", type: "firing", setTemp: 1220, actualTemp: 1215, status: "normal" },
  { zone: 8, name: "Z8烧成", type: "firing", setTemp: 1150, actualTemp: 1143, status: "normal" },
  { zone: 9, name: "Z9急冷", type: "cooling", setTemp: 850, actualTemp: 845, status: "normal" },
  { zone: 10, name: "Z10缓冷", type: "cooling", setTemp: 600, actualTemp: 610, status: "normal" },
  { zone: 11, name: "Z11末冷", type: "cooling", setTemp: 320, actualTemp: 318, status: "normal" },
  { zone: 12, name: "Z12出口", type: "cooling", setTemp: 80, actualTemp: 83, status: "normal" },
];
