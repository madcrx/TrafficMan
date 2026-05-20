export type UserRole = 'planner' | 'controller';

export type AustralianState = 'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type RoadClassification = 'freeway' | 'highway' | 'arterial' | 'collector' | 'local';

export type WorksType =
  | 'shoulder_only'
  | 'lane_closure_2lane'
  | 'lane_closure_multilane'
  | 'full_road_closure'
  | 'utility_underground'
  | 'pavement_resurfacing'
  | 'bridge_works'
  | 'tree_trimming'
  | 'other';

export type WorksDuration = 'short_term' | 'day_works' | 'night_works' | 'multi_day';
export type ControlMethod = 'none' | 'stop_slow_bats' | 'portable_signals' | 'pilot_vehicle' | 'police';
export type RoadGeometry = 'straight' | 'curve' | 'crest';
export type WeatherCondition = 'clear' | 'rain' | 'fog' | 'high_wind';

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
  postedSpeed: number;           // km/h
  lanesInDirection: number;      // lanes in direction of travel through works
  laneWidth: number;             // metres, default 3.5
  medianDivided: boolean;
  geometry: RoadGeometry;
  curveRadius: number;           // metres, if geometry = curve
  sightIssue: boolean;           // crest, bend, or obstruction reducing sight

  // Step 3 – Works
  worksType: WorksType;
  worksDescription: string;
  worksLength: number;           // metres
  duration: WorksDuration;
  nightWorks: boolean;
  workersOnFoot: boolean;
  numberOfWorkers: number;
  workerProximity: number;       // metres from nearest moving lane
  plantOnSite: boolean;
  plantProximity: number;        // metres from nearest moving lane
  excavations: boolean;
  excavationDepth: number;       // mm
  excavationProximity: number;   // metres from nearest moving lane
  freshBitumen: boolean;
  footpathClosed: boolean;

  // Step 4 – Traffic & environment
  peakHourVolume: number;        // vph, both directions combined
  heavyVehiclePercent: number;   // %
  weather: WeatherCondition;
  visibility: 'good' | 'reduced' | 'poor';
  nearIntersection: boolean;
  intersectionDistance: number;  // metres

  // Step 5 – Control
  controlMethod: ControlMethod;
  numberOfControllers: number;
  arrowBoard: boolean;
  vms: boolean;
  overrideTemp: boolean;         // user wants to override recommended temp speed
  manualTempSpeed: number;       // if override = true
}

// ─── Output types ──────────────────────────────────────────────

export interface SignItem {
  sequence: number;
  code: string;
  description: string;
  distanceFromTaperStart: number; // negative = upstream; positive = downstream
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
  // Speeds
  recommendedTempSpeed: number;
  speedReductionSteps: SpeedStep[];
  tempSpeedJustification: string;

  // Key distances (all in metres)
  approachSignSpacing: number;       // sign spacing in approach zone
  sightDistanceM: number;            // PREPARE TO STOP placement distance
  mergeTaperLength: number;          // approach (merge) taper
  lateralShiftTaper: number;         // lateral shift taper if used
  bufferZoneLength: number;
  distBetweenTapers: number;         // departure taper minimum offset
  coneSpacingM: number;
  coneSpacingTaperM: number;         // within taper (always 4m max)

  // Queue (for stop/slow scenarios)
  estimatedQueueLength: number | null;   // metres
  prepareToStopRepeater: boolean;        // if queue >240m

  // Sign schedule (approach end)
  approachSigns: SignItem[];
  departureSigns: SignItem[];

  // Equipment
  equipment: EquipmentItem[];

  // Compliance
  references: string[];
  warnings: string[];
  notes: string[];

  // Minimum temp speed zone length (from Table 5.5)
  minTempZoneLength: number;
}
