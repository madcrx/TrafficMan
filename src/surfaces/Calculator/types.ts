export type UserRole = 'planner' | 'controller';

export type AustralianState = 'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type RoadClassification = 'freeway' | 'highway' | 'arterial' | 'collector' | 'local';

export type WorksCategory = 'static' | 'mobile' | 'stli';

export type WorksType =
  // Static — Around the Worksite (AGTTM Part 3, Section 3.2)
  | 'around_detour'
  | 'around_sidetrack'
  | 'around_contraflow'
  // Static — Through the Worksite (AGTTM Part 3, Section 3.3)
  | 'through_alternating'
  | 'through_shuttle'
  | 'through_pilot'
  // Static — Past the Worksite (AGTTM Part 3, Section 3.4)
  | 'past_lane_closure'
  | 'past_contraflow'
  | 'past_shoulder'
  | 'past_pavement'
  | 'past_bridge'
  // Mobile Works (AGTTM Part 4)
  | 'mobile_class1'
  | 'mobile_class2'
  | 'mobile_class3'
  // STLI — Within Traffic Lane (AGTTM Part 5, Sections 4.1–4.5)
  | 'stli_specialist'
  | 'stli_gaps'
  | 'stli_short_term'
  | 'stli_freq_lane'
  | 'stli_moving'
  // STLI — Outside Traffic Lane (AGTTM Part 5, Sections 5.1–5.3)
  | 'stli_shoulder_foot'
  | 'stli_shoulder_plant'
  | 'stli_freq_outside';

export type WorksDuration = 'short_term' | 'day_works' | 'night_works' | 'multi_day';
export type ControlMethod = 'none' | 'stop_slow_bats' | 'portable_signals' | 'pilot_vehicle' | 'police';
export type RoadGeometry = 'straight' | 'curve' | 'crest';
export type WeatherCondition = 'clear' | 'rain' | 'fog' | 'high_wind';

export interface CriteriaCheck {
  id: string;
  criterion: string;
  status: 'pass' | 'fail' | 'check';
  detail?: string;
}

export interface WizardInputs {
  // Step 1 – Who & project
  userRole: UserRole;
  state: AustralianState;
  projectName: string;
  projectRef: string;
  date: string;
  preparedBy: string;
  location: string;

  // Step 2 – Road
  roadName: string;
  classification: RoadClassification;
  postedSpeed: number;
  lanesInDirection: number;
  laneWidth: number;
  medianDivided: boolean;
  medianWidth: number;            // metres — 0 = unknown/not applicable
  geometry: RoadGeometry;
  curveRadius: number;
  sightIssue: boolean;

  // Step 3 – Works
  worksCategory: WorksCategory;
  worksType: WorksType;
  worksDescription: string;
  worksLength: number;
  duration: WorksDuration;
  nightWorks: boolean;
  workersOnFoot: boolean;
  numberOfWorkers: number;
  workerProximity: number;
  plantOnSite: boolean;
  plantProximity: number;
  excavations: boolean;
  excavationDepth: number;
  excavationProximity: number;
  freshBitumen: boolean;
  footpathClosed: boolean;

  // Step 4 – Traffic & environment
  peakHourVolume: number;
  heavyVehiclePercent: number;
  weather: WeatherCondition;
  visibility: 'good' | 'reduced' | 'poor';
  nearIntersection: boolean;
  intersectionDistance: number;

  // Step 5 – Control
  controlMethod: ControlMethod;
  numberOfControllers: number;
  arrowBoard: boolean;
  vms: boolean;
  overrideTemp: boolean;
  manualTempSpeed: number;

  // Queue calculation
  maxStopTime: number;  // minutes — 0 = auto-estimate from zone length
}

// ─── Output types ──────────────────────────────────────────────

export interface SignItem {
  sequence: number;
  code: string;
  description: string;
  distanceFromTaperStart: number;
  notes: string;
}

export interface EquipmentItem {
  item: string;
  quantity: string;
  specification: string;
}

export interface SpeedStep {
  from: number;
  to: number;
  method: string;
}

export interface CalculationResult {
  // Design step
  designStepName: string;
  designStepRef: string;
  designStepDescription: string;
  criteriaChecks: CriteriaCheck[];
  mandatoryRequirements: string[];

  // Speeds
  recommendedTempSpeed: number;
  speedReductionSteps: SpeedStep[];
  tempSpeedJustification: string;

  // Key distances (metres)
  approachSignSpacing: number;
  sightDistanceM: number;
  mergeTaperLength: number;
  lateralShiftTaper: number;
  bufferZoneLength: number;
  distBetweenTapers: number;
  coneSpacingM: number;
  coneSpacingTaperM: number;

  // Queue
  estimatedQueueLength: number | null;
  queueStopTimeUsed: number | null;
  prepareToStopRepeater: boolean;

  // Sign schedules
  approachSigns: SignItem[];
  departureSigns: SignItem[];
  noSignSchedule: boolean;  // true for STLI/mobile types

  // Equipment
  equipment: EquipmentItem[];

  // Compliance
  references: string[];
  warnings: string[];
  notes: string[];

  minTempZoneLength: number;
}
