import { Router, type Request, type Response } from "express";

const router = Router();

const generateId = () => Math.random().toString(36).substring(2, 11);

const operators = ["张建国", "李明华", "王志强", "赵德伟", "刘建军", "陈红斌"];
const shifts: ("day" | "night")[] = ["day", "night"];

function randomDate(hoursAgo: number = 24): string {
  const d = new Date();
  d.setHours(d.getHours() - Math.floor(Math.random() * hoursAgo));
  d.setMinutes(Math.floor(Math.random() * 60));
  return d.toISOString().slice(0, 19).replace("T", " ");
}

function batchNo(): string {
  const d = new Date();
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `B${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}${n}`;
}

const formulas = [
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

const ballMillingRecords = Array.from({ length: 12 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(48),
  shift: shifts[i % 2],
  operator: operators[i % operators.length],
  batchNo: batchNo(),
  formulaId: formulas[i % formulas.length].id,
  formulaName: formulas[i % formulas.length].name,
  recipe: formulas[i % formulas.length].recipe,
  ballMillId: `BM-${101 + (i % 4)}`,
  speed: Number((16 + Math.random() * 4).toFixed(1)),
  ballRatio: Number((1.5 + Math.random() * 0.5).toFixed(2)),
  duration: Number((10 + Math.random() * 6).toFixed(1)),
  fineness: Number((0.8 + Math.random() * 1.2).toFixed(2)),
  slurryDensity: Number((1.65 + Math.random() * 0.15).toFixed(2)),
  viscosity: Math.floor(350 + Math.random() * 150),
  moisture: Number((34 + Math.random() * 4).toFixed(1)),
  status: (["running", "completed", "paused"] as const)[i % 3],
}));

const sprayDryingRecords = Array.from({ length: 10 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(36),
  shift: shifts[i % 2],
  operator: operators[(i + 1) % operators.length],
  batchNo: batchNo(),
  towerId: `SD-${201 + (i % 2)}`,
  inletTemp: Math.floor(520 + Math.random() * 40),
  outletTemp: Math.floor(90 + Math.random() * 15),
  pressure: Number((1.8 + Math.random() * 0.6).toFixed(2)),
  feedRate: Number((18 + Math.random() * 6).toFixed(1)),
  powderSize: Math.floor(60 + Math.random() * 40),
  powderMoisture: Number((5.5 + Math.random() * 2.5).toFixed(1)),
  flowability: Math.floor(85 + Math.random() * 10),
  bulkDensity: Number((0.9 + Math.random() * 0.15).toFixed(2)),
  efficiency: Number((72 + Math.random() * 12).toFixed(1)),
}));

const pressFormingRecords = Array.from({ length: 15 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(24),
  shift: shifts[i % 2],
  operator: operators[(i + 2) % operators.length],
  batchNo: batchNo(),
  pressId: `PR-${301 + (i % 6)}`,
  moldSpec: ["800×800", "600×1200", "600×600", "750×1500"][i % 4],
  pressure: Math.floor(280 + Math.random() * 80),
  holdingTime: Number((0.8 + Math.random() * 0.6).toFixed(2)),
  exhaustCount: 2 + Math.floor(Math.random() * 3),
  brickWeight: Number((14 + Math.random() * 4).toFixed(2)),
  thickness: Number((10 + Math.random() * 2).toFixed(1)),
  thicknessTolerance: Number((Math.random() * 0.5).toFixed(2)),
  cycleTime: Number((6 + Math.random() * 3).toFixed(1)),
  outputCount: Math.floor(1800 + Math.random() * 1200),
  defectRate: Number((0.5 + Math.random() * 3).toFixed(2)),
}));

const glazingRecords = Array.from({ length: 10 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(20),
  shift: shifts[i % 2],
  operator: operators[(i + 3) % operators.length],
  batchNo: batchNo(),
  dryerTemp: [120, 160, 190, 210, 200, 170].map((t) => Math.floor(t + Math.random() * 20)),
  dryingTime: Math.floor(45 + Math.random() * 20),
  glazeDensity: Number((1.45 + Math.random() * 0.15).toFixed(2)),
  glazeAmount: Math.floor(450 + Math.random() * 150),
  patternId: `PT-${1001 + i}`,
  patternName: ["爵士白", "卡拉拉", "鱼肚白", "大花白", "莎安娜", "意大利米黄"][i % 6],
  glazeThickness: Number((0.5 + Math.random() * 0.4).toFixed(2)),
  dryingLoss: Number((0.2 + Math.random() * 0.5).toFixed(2)),
}));

const kilnFiringRecords = Array.from({ length: 8 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(16),
  shift: shifts[i % 2],
  operator: operators[(i + 4) % operators.length],
  batchNo: batchNo(),
  kilnId: "K-1",
  zoneTemps: Array.from({ length: 12 }, (_, j) => {
    if (j < 3) return Math.floor(300 + j * 150 + Math.random() * 30);
    if (j < 8) return Math.floor(1180 + Math.random() * 40);
    return Math.floor(900 - (j - 8) * 180 + Math.random() * 20);
  }),
  zoneCount: 12,
  kilnSpeed: Number((8 + Math.random() * 4).toFixed(1)),
  totalFiringTime: Number((60 + Math.random() * 20).toFixed(1)),
  oxygenLevel: Number((2 + Math.random() * 4).toFixed(1)),
  airFuelRatio: Number((10 + Math.random() * 2).toFixed(1)),
  kilnPressure: Number((12 + Math.random() * 8).toFixed(1)),
  maxTemp: Math.floor(1200 + Math.random() * 30),
  fuelConsumption: Number((2.8 + Math.random() * 0.8).toFixed(2)),
}));

const polishingRecords = Array.from({ length: 10 }).map((_, i) => ({
  id: generateId(),
  timestamp: randomDate(12),
  shift: shifts[i % 2],
  operator: operators[(i + 5) % operators.length],
  batchNo: batchNo(),
  polishingHeadConfig: `${8 + (i % 3)}组磨头`,
  polishingSpeed: Number((4 + Math.random() * 3).toFixed(1)),
  feedRate: Number((12 + Math.random() * 6).toFixed(1)),
  polishingFluid: ["菱苦土", "氧化铈", "氧化硅"][i % 3],
  edgeGrindingAmount: Number((0.8 + Math.random() * 0.8).toFixed(2)),
  chamferAngle: 45,
  dimensionalTolerance: Number((Math.random() * 0.3).toFixed(2)),
  glossiness: Number((85 + Math.random() * 12).toFixed(1)),
  surfaceFlatness: Number((0.1 + Math.random() * 0.2).toFixed(2)),
}));

const gradingRecords = Array.from({ length: 14 }).map((_, i) => {
  const gradeRoll = Math.random();
  const grade = (gradeRoll < 0.7 ? "A" : gradeRoll < 0.88 ? "B" : gradeRoll < 0.97 ? "C" : "D") as "A" | "B" | "C" | "D";
  return {
    id: generateId(),
    timestamp: randomDate(10),
    shift: shifts[i % 2],
    operator: operators[i % operators.length],
    batchNo: batchNo(),
    flatness: Number((0.05 + Math.random() * 0.25).toFixed(2)),
    squareness: Number((0.1 + Math.random() * 0.3).toFixed(2)),
    edgeStraightness: Number((0.08 + Math.random() * 0.2).toFixed(2)),
    colorDifference: Number((0.3 + Math.random() * 1.2).toFixed(2)),
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

const kilnRealtimeZones = [
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

router.get("/ball-milling/formulas", (_req: Request, res: Response) => {
  res.json({ success: true, data: formulas });
});

router.get("/ball-milling", (_req: Request, res: Response) => {
  res.json({ success: true, data: ballMillingRecords });
});

router.post("/ball-milling", (req: Request, res: Response) => {
  const record = {
    id: generateId(),
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
    ...req.body,
    status: "running",
  };
  ballMillingRecords.unshift(record);
  res.json({ success: true, data: record });
});

router.get("/spray-drying", (_req: Request, res: Response) => {
  res.json({ success: true, data: sprayDryingRecords });
});

router.post("/spray-drying", (req: Request, res: Response) => {
  const record = { id: generateId(), timestamp: new Date().toISOString().slice(0, 19).replace("T", " "), ...req.body };
  sprayDryingRecords.unshift(record);
  res.json({ success: true, data: record });
});

router.get("/press-forming", (_req: Request, res: Response) => {
  res.json({ success: true, data: pressFormingRecords });
});

router.post("/press-forming", (req: Request, res: Response) => {
  const record = { id: generateId(), timestamp: new Date().toISOString().slice(0, 19).replace("T", " "), ...req.body };
  pressFormingRecords.unshift(record);
  res.json({ success: true, data: record });
});

router.get("/glazing", (_req: Request, res: Response) => {
  res.json({ success: true, data: glazingRecords });
});

router.post("/glazing", (req: Request, res: Response) => {
  const record = { id: generateId(), timestamp: new Date().toISOString().slice(0, 19).replace("T", " "), ...req.body };
  glazingRecords.unshift(record);
  res.json({ success: true, data: record });
});

router.get("/kiln-firing", (_req: Request, res: Response) => {
  res.json({ success: true, data: kilnFiringRecords });
});

router.get("/kiln-firing/realtime", (_req: Request, res: Response) => {
  res.json({ success: true, data: kilnRealtimeZones });
});

router.post("/kiln-firing", (req: Request, res: Response) => {
  const record = { id: generateId(), timestamp: new Date().toISOString().slice(0, 19).replace("T", " "), ...req.body };
  kilnFiringRecords.unshift(record);
  res.json({ success: true, data: record });
});

router.get("/polishing", (_req: Request, res: Response) => {
  res.json({ success: true, data: polishingRecords });
});

router.post("/polishing", (req: Request, res: Response) => {
  const record = { id: generateId(), timestamp: new Date().toISOString().slice(0, 19).replace("T", " "), ...req.body };
  polishingRecords.unshift(record);
  res.json({ success: true, data: record });
});

router.get("/grading-packaging", (_req: Request, res: Response) => {
  res.json({ success: true, data: gradingRecords });
});

router.post("/grading-packaging", (req: Request, res: Response) => {
  const record = { id: generateId(), timestamp: new Date().toISOString().slice(0, 19).replace("T", " "), ...req.body };
  gradingRecords.unshift(record);
  res.json({ success: true, data: record });
});

export default router;
