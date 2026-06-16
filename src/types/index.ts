export interface ProductionRecord {
  id: string;
  timestamp: string;
  shift: "day" | "night";
  operator: string;
  batchNo: string;
}

export interface BallMillingRecord extends ProductionRecord {
  formulaId: string;
  formulaName: string;
  recipe: { material: string; ratio: number }[];
  ballMillId: string;
  speed: number;
  ballRatio: number;
  duration: number;
  fineness: number;
  slurryDensity: number;
  viscosity: number;
  moisture: number;
  status: "running" | "completed" | "paused";
}

export interface SprayDryingRecord extends ProductionRecord {
  towerId: string;
  inletTemp: number;
  outletTemp: number;
  pressure: number;
  feedRate: number;
  powderSize: number;
  powderMoisture: number;
  flowability: number;
  bulkDensity: number;
  efficiency: number;
}

export interface PressFormingRecord extends ProductionRecord {
  pressId: string;
  moldSpec: string;
  pressure: number;
  holdingTime: number;
  exhaustCount: number;
  brickWeight: number;
  thickness: number;
  thicknessTolerance: number;
  cycleTime: number;
  outputCount: number;
  defectRate: number;
}

export interface GlazingRecord extends ProductionRecord {
  dryerTemp: number[];
  dryingTime: number;
  glazeDensity: number;
  glazeAmount: number;
  patternId: string;
  patternName: string;
  glazeThickness: number;
  dryingLoss: number;
}

export interface KilnFiringRecord extends ProductionRecord {
  kilnId: string;
  zoneTemps: number[];
  zoneCount: number;
  kilnSpeed: number;
  totalFiringTime: number;
  oxygenLevel: number;
  airFuelRatio: number;
  kilnPressure: number;
  maxTemp: number;
  fuelConsumption: number;
}

export interface PolishingRecord extends ProductionRecord {
  polishingHeadConfig: string;
  polishingSpeed: number;
  feedRate: number;
  polishingFluid: string;
  edgeGrindingAmount: number;
  chamferAngle: number;
  dimensionalTolerance: number;
  glossiness: number;
  surfaceFlatness: number;
}

export interface GradingRecord extends ProductionRecord {
  flatness: number;
  squareness: number;
  edgeStraightness: number;
  colorDifference: number;
  colorNo: string;
  grade: "A" | "B" | "C" | "D";
  packagingSpec: string;
  quantity: number;
  defectTypes: { type: string; count: number }[];
}

export interface DashboardKPI {
  todayOutput: number;
  outputChange: number;
  passRate: number;
  passRateChange: number;
  energyConsumption: number;
  energyChange: number;
  activeAlarms: number;
  runningEquipment: number;
  totalEquipment: number;
  currentShift: string;
}

export interface Alarm {
  id: string;
  level: "critical" | "warning" | "info";
  module: string;
  message: string;
  timestamp: string;
  status: "pending" | "processing" | "resolved";
  handler?: string;
}

export interface TrendPoint {
  time: string;
  output: number;
  passRate: number;
  energy: number;
}

export interface KilnRealtimeZone {
  zone: number;
  name: string;
  type: "preheat" | "firing" | "cooling";
  setTemp: number;
  actualTemp: number;
  status: "normal" | "high" | "low";
}

export interface Formula {
  id: string;
  name: string;
  recipe: { material: string; ratio: number }[];
  description: string;
  usageCount: number;
}

export type ModuleKey =
  | "dashboard"
  | "ball-milling"
  | "spray-drying"
  | "press-forming"
  | "glazing"
  | "kiln-firing"
  | "polishing"
  | "grading-packaging";
