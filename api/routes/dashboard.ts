import { Router, type Request, type Response } from "express";

const router = Router();

const dashboardKPI = {
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

const trendData = Array.from({ length: 24 }).map((_, i) => {
  const h = String(i).padStart(2, "0");
  const base = 1000 + Math.sin(i / 4) * 200;
  return {
    time: `${h}:00`,
    output: Math.floor(base + Math.random() * 400),
    passRate: Number((92 + Math.random() * 6).toFixed(1)),
    energy: Number((110 + Math.random() * 40).toFixed(1)),
  };
});

const alarms = [
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

router.get("/kpi", (_req: Request, res: Response) => {
  res.json({ success: true, data: dashboardKPI });
});

router.get("/trend", (_req: Request, res: Response) => {
  res.json({ success: true, data: trendData });
});

router.get("/alarms", (_req: Request, res: Response) => {
  res.json({ success: true, data: alarms });
});

export default router;
