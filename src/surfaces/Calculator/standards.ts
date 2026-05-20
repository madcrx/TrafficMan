import { AustralianState, WorksType, WorksCategory, WizardInputs, CriteriaCheck } from './types';

// ═══════════════════════════════════════════════════════════════
// Source: AS 1742.3:2019 / AGTTM 2021 / TCAWS v6.1 / QGTTM / WA CoP
// ═══════════════════════════════════════════════════════════════

// ─── Table 2.2 / Sign spacing (advance warning signs) ───────────
// AS 1742.3:2019 Table 2.2
export function signSpacing(speedKmh: number, _state?: AustralianState): number {
  if (speedKmh <= 55) return 15;
  if (speedKmh <= 65) return 30;  // 56–65 km/h band = 30 m
  return speedKmh;                // ≥66 km/h = speed value in metres
}

// ─── Table 2.3 / Sight distance to traffic control device ──────
export function sightDistance(speedKmh: number, state?: AustralianState): number {
  if (state === 'WA') {
    if (speedKmh <= 50) return 30;
    if (speedKmh <= 60) return 45;
    return speedKmh;
  }
  // AS 1742.3:2019 Table 2.3 — speed bands at 50/60/70 km/h
  if (speedKmh <= 50) return 50;
  if (speedKmh <= 60) return 70;
  if (speedKmh <= 70) return 90;
  return 2 * speedKmh; // ≥71 km/h
}

// ─── Table 5.7 / Taper lengths ──────────────────────────────────
export interface TaperLengths {
  laneClosureTaper: number | null;
  lateralShift: number;
  merge: number;
}

export function taperLengths(speedKmh: number): TaperLengths {
  if (speedKmh <= 45) return { laneClosureTaper: 15, lateralShift: 5,   merge: 15  };
  if (speedKmh <= 55) return { laneClosureTaper: 15, lateralShift: 15,  merge: 30  };
  if (speedKmh <= 65) return { laneClosureTaper: 30, lateralShift: 30,  merge: 60  };
  if (speedKmh <= 75) return { laneClosureTaper: null, lateralShift: 70,  merge: 115 };
  if (speedKmh <= 85) return { laneClosureTaper: null, lateralShift: 80,  merge: 130 };
  if (speedKmh <= 95) return { laneClosureTaper: null, lateralShift: 90,  merge: 145 };
  if (speedKmh <= 105) return { laneClosureTaper: null, lateralShift: 100, merge: 160 };
  return { laneClosureTaper: null, lateralShift: 110, merge: 180 };
}

export function scaleTaper(baseLength: number, actualLaneWidth: number): number {
  return Math.round(baseLength * (actualLaneWidth / 3.5));
}

// ─── Table 5.8 / Distance between tapers ───────────────────────
export function distBetweenTapers(speedKmh: number): number {
  if (speedKmh <= 45) return 10;
  if (speedKmh <= 55) return 25;
  if (speedKmh <= 65) return 70;
  return 1.5 * speedKmh;
}

// ─── Table 4.2 / Cone spacing ───────────────────────────────────
export function coneSpacing(speedKmh: number): number {
  if (speedKmh <= 55) return 4;
  if (speedKmh <= 75) return 12;
  return 18;
}

export const CONE_TAPER_SPACING = 4;

// ─── Table 5.5 / Recommended temp speed ────────────────────────
export function recommendedTempSpeed(
  postedSpeed: number,
  workerProximity: number | null,
  plantProximity: number | null,
  nightWorks: boolean,
  freshBitumen: boolean,
  weather: string,
  visibility: string,
): { speed: number; reason: string } {
  let speed = postedSpeed;
  const reasons: string[] = [];

  if (workerProximity !== null) {
    if (workerProximity < 1.2) {
      speed = Math.min(speed, 40);
      reasons.push('Workers on foot < 1.2 m from traffic (Table 5.5 — max 40 km/h)');
    } else if (workerProximity < 3) {
      speed = Math.min(speed, 60);
      reasons.push('Workers on foot 1.2–3 m from traffic (Table 5.5 — max 60 km/h)');
    } else if (workerProximity < 6) {
      speed = Math.min(speed, 80);
      reasons.push('Workers on foot 3–6 m from traffic (Table 5.5 — max 80 km/h)');
    }
  }

  if (plantProximity !== null) {
    if (plantProximity < 3) {
      speed = Math.min(speed, 60);
      reasons.push('Plant/machinery < 3 m from traffic (Table 5.5 — max 60 km/h)');
    } else if (plantProximity < 6) {
      speed = Math.min(speed, 80);
      reasons.push('Plant/machinery 3–6 m from traffic (Table 5.5 — max 80 km/h)');
    }
  }

  if (freshBitumen) {
    speed = Math.min(speed, 60);
    reasons.push('Fresh bitumen / seal coat present (Table 5.5 — max 60 km/h)');
  }

  if (nightWorks) {
    speed = Math.max(speed - 10, 40);
    reasons.push('Night works — speed reduced by 10 km/h (min 40 km/h)');
  }

  if (visibility === 'reduced') {
    speed = Math.max(speed - 10, 40);
    reasons.push('Reduced visibility — speed reduced by 10 km/h');
  }

  if (visibility === 'poor' || weather === 'fog') {
    speed = Math.max(speed - 20, 40);
    reasons.push('Poor visibility / fog — speed reduced by 20 km/h');
  }

  const stdSpeeds = [40, 50, 60, 70, 80, 90, 100, 110];
  const rounded = stdSpeeds.filter(s => s <= speed).pop() ?? 40;

  if (reasons.length === 0) reasons.push('No mandatory speed reduction required; posted speed may be maintained subject to risk assessment');
  return { speed: rounded, reason: reasons.join('. ') };
}

// ─── Table 5.5 / Minimum temp speed zone length ────────────────
// AGTTM Table 5.5 — minimum temp speed zone lengths
export function minTempZoneLength(tempSpeed: number): number {
  if (tempSpeed <= 40) return 100;
  if (tempSpeed <= 60) return 150;
  if (tempSpeed <= 80) return 300;  // 80 km/h → 300 m
  return 500;                        // 90–110 km/h → 500 m
}

// ─── Table 5.6 / Speed reduction steps ─────────────────────────
export function speedReductionSteps(
  postedSpeed: number,
  tempSpeed: number,
): Array<{ from: number; to: number; method: string }> {
  if (postedSpeed <= tempSpeed) return [];
  const reduction = postedSpeed - tempSpeed;
  const steps: Array<{ from: number; to: number; method: string }> = [];

  if (reduction <= 20) {
    steps.push({ from: postedSpeed, to: tempSpeed, method: 'Speed limit sign' });
  } else if (reduction <= 30) {
    const mid = postedSpeed - 20;
    steps.push({ from: postedSpeed, to: mid, method: 'Speed limit sign' });
    steps.push({ from: mid, to: tempSpeed, method: 'Speed limit sign' });
  } else {
    let cur = postedSpeed;
    while (cur - tempSpeed > 20) {
      const next = cur - 20;
      steps.push({ from: cur, to: next, method: 'Speed limit sign' });
      cur = next;
    }
    if (cur > tempSpeed) {
      steps.push({ from: cur, to: tempSpeed, method: 'Speed limit sign' });
    }
  }
  return steps;
}

// ─── Table 4.3 / Queue length estimate ─────────────────────────
export function estimatedQueueLength(
  vphOneDir: number,
  stopTimeMin: number,
  heavyPct: number,
): number {
  const fiveMinCount = vphOneDir / 12;
  const multipliers: Record<number, number> = { 2: 2.4, 5: 6, 10: 12, 15: 18, 30: 36 };
  const keys = [2, 5, 10, 15, 30];
  const nearest = keys.reduce((a, b) =>
    Math.abs(b - stopTimeMin) < Math.abs(a - stopTimeMin) ? b : a);
  const multiplier = multipliers[nearest] ?? 6;
  const baseQueueM = fiveMinCount * multiplier;
  const f = Math.min(Math.max(heavyPct / 100, 0), 1);
  const avgSpacingM = (1 - f) * 6 + f * 19;
  return Math.round(baseQueueM * (avgSpacingM / 6));
}

// ─── Suggest stop time from zone length ────────────────────────
export function suggestStopTime(worksLengthM: number): number {
  if (worksLengthM <= 100) return 2;
  if (worksLengthM <= 300) return 5;
  if (worksLengthM <= 600) return 10;
  if (worksLengthM <= 1000) return 15;
  return 30;
}

// ─── Buffer zone minimum ────────────────────────────────────────
export function bufferZoneMin(speedKmh: number, isMultilane: boolean): number {
  if (speedKmh <= 60) return isMultilane ? 50 : 20;
  if (speedKmh <= 80) return isMultilane ? 80 : 30;
  return isMultilane ? 100 : 50;
}

// ─── Table 5.4 / Shuttle flow max length ───────────────────────
export function maxShuttleFlowLength(vph: number): number {
  if (vph <= 300) return 800;
  if (vph <= 350) return 600;
  if (vph <= 400) return 500;
  if (vph <= 450) return 300;
  if (vph <= 500) return 200;
  return 100; // residential / >500 vph
}

// ─── State-specific standard references ────────────────────────
export function stateStandards(state: AustralianState): {
  primary: string[];
  secondary: string[];
  calculationTableRefs: string[];
} {
  if (state === 'WA') {
    return {
      primary: [
        'Main Roads WA — Traffic Management for Works on Roads Code of Practice (current edition)',
        'Main Roads WA — Specification 601 (Traffic Management)',
      ],
      secondary: [
        'Note: For events on roads, refer to the separate Main Roads WA — Traffic Management for Events on Roads Code of Practice',
      ],
      calculationTableRefs: [
        'WA COP (Sign spacing)',
        'WA COP (Sight distances)',
        'WA COP (Taper lengths)',
        'WA COP (Temporary speed zones)',
      ],
    };
  }
  if (state === 'QLD') {
    return {
      primary: [
        'QGTTM — Queensland Guide to Traffic Management for Works on Roads (TMR, current edition)',
      ],
      secondary: [],
      calculationTableRefs: [
        'QGTTM (Sign spacing)',
        'QGTTM (Sight distances)',
        'QGTTM (Taper lengths)',
        'QGTTM (Temporary speed zones)',
      ],
    };
  }
  // All other states and territories use AGTTM + AS 1742.3
  return {
    primary: [
      'AGTTM — Austroads Guide to Temporary Traffic Management (current edition)',
      'AS 1742.3:2019 — Manual of Uniform Traffic Control Devices, Part 3: Traffic Control for Works on Roads',
    ],
    secondary: [],
    calculationTableRefs: [
      'AS 1742.3:2019 — Table 2.2 (Sign spacing)',
      'AS 1742.3:2019 — Table 2.3 (Sight distances)',
      'AGTTM03-21 — Table 5.7 (Taper lengths)',
      'AGTTM03-21 — Table 5.5 (Temporary speed zones)',
    ],
  };
}

// ─── Translate AGTTM/AS 1742.3 refs to state-equivalent doc names ─
export function docRef(ref: string, state: AustralianState): string {
  if (state === 'WA') return ref.replace(/AGTTM\S*/g, 'WA COP').replace('AS 1742.3', 'WA COP');
  if (state === 'QLD') return ref.replace(/AGTTM\S*/g, 'QGTTM').replace('AS 1742.3', 'QGTTM');
  return ref;
}

// ─── Sign descriptions by state ────────────────────────────────
export function signName(generic: string, state: AustralianState): string {
  const nswNames: Record<string, string> = {
    'WORKS AHEAD': 'ROADWORK AHEAD',
    'TRAFFIC CONTROLLERS AHEAD': 'TRAFFIC CONTROL AHEAD',
  };
  if (state === 'NSW' && nswNames[generic]) return nswNames[generic];
  return generic;
}

// ═══════════════════════════════════════════════════════════════
// DESIGN STEPS — AGTTM Hierarchy with Eligibility Criteria
// ═══════════════════════════════════════════════════════════════

type AutoCheckFn = (inp: WizardInputs) => { status: 'pass' | 'fail' | 'check'; detail?: string };

export interface DesignStepCriteria {
  id: string;
  criterion: string;
  autoCheck?: AutoCheckFn;
}

export interface DesignStepDef {
  type: WorksType;
  name: string;
  category: WorksCategory;
  subcategory: string;
  agttmRef: string;
  description: string;
  criteria: DesignStepCriteria[];
  mandatory: string[];
  // Engine behaviour flags
  isFullClosure?: boolean;
  isAlternating?: boolean;
  isLaneClosure?: boolean;
  isShoulderOnly?: boolean;
  noSignSchedule?: boolean;
}

export const DESIGN_STEPS: DesignStepDef[] = [

  // ── STATIC — AROUND THE WORKSITE ──────────────────────────────

  {
    type: 'around_detour',
    name: 'Around — Detour Route',
    category: 'static',
    subcategory: 'Around the Worksite',
    agttmRef: 'AGTTM Part 3, Section 3.2.1',
    description: 'Traffic diverted via an alternative detour route while the work area is fully closed.',
    isFullClosure: true,
    criteria: [
      {
        id: 'detour_route_exists',
        criterion: 'A suitable alternative detour route exists and is capable of carrying expected traffic volumes and vehicle types',
        autoCheck: () => ({ status: 'check', detail: 'Verify detour route suitability, capacity and surface condition' }),
      },
      {
        id: 'detour_route_signed',
        criterion: 'Detour route can be signed with adequate advance warning and directional signs at all decision points',
        autoCheck: () => ({ status: 'check', detail: 'Confirm signing plan covers all turns and junctions on the detour route' }),
      },
      {
        id: 'full_closure_required',
        criterion: 'Full road closure is required — no access through the work zone is possible or safe',
        autoCheck: () => ({ status: 'pass', detail: 'Design step requires full closure — all lanes closed' }),
      },
      {
        id: 'works_separation',
        criterion: 'Works area ≥6 m from nearest live traffic lane OR permanent rigid barrier in place',
        autoCheck: (inp) => {
          const prox = Math.min(
            inp.workersOnFoot ? inp.workerProximity : 99,
            inp.plantOnSite ? inp.plantProximity : 99,
          );
          if (prox >= 6) return { status: 'pass', detail: `Minimum proximity ${prox} m ≥ 6 m` };
          if (prox < 6) return { status: 'check', detail: `Proximity ${prox} m — verify rigid barrier or ≥6 m clearance at closure boundary` };
          return { status: 'check', detail: 'Confirm works separation at full closure boundary' };
        },
      },
      {
        id: 'ra_approval',
        criterion: 'Road authority approval obtained for full road closure (advance notice typically 10–20 business days)',
        autoCheck: () => ({ status: 'check', detail: 'Full closure requires road authority permit — confirm obtained' }),
      },
    ],
    mandatory: [
      'ROAD CLOSED signs at approach to closure on all affected roads',
      'DETOUR signs with arrows at every decision point along alternative route',
      'Advance public notification — minimum 5 business days for planned closures',
      'Emergency services, local council and road authority notified',
      'Flashing amber lights on barriers during night closure',
      'Access maintained for emergency vehicles (or emergency bypass route provided)',
    ],
  },

  {
    type: 'around_sidetrack',
    name: 'Around — Temporary Sidetrack',
    category: 'static',
    subcategory: 'Around the Worksite',
    agttmRef: 'AGTTM Part 3, Section 3.2.2',
    description: 'A temporary sidetrack or bypass road is constructed to divert traffic around the worksite while the main carriageway is closed.',
    isFullClosure: true,
    criteria: [
      {
        id: 'sidetrack_standard',
        criterion: 'Temporary sidetrack constructed to adequate pavement standard for expected vehicle types and loads',
        autoCheck: () => ({ status: 'check', detail: 'Verify sidetrack pavement, drainage and stability' }),
      },
      {
        id: 'sidetrack_width',
        criterion: 'Sidetrack width ≥3.5 m for two-way operation or ≥3.0 m for one-way operation',
        autoCheck: () => ({ status: 'check', detail: 'Measure and confirm sidetrack width' }),
      },
      {
        id: 'sidetrack_gradient',
        criterion: 'Sidetrack longitudinal gradient ≤10% (desirable ≤8%)',
        autoCheck: () => ({ status: 'check', detail: 'Survey sidetrack grade — confirm ≤10%' }),
      },
      {
        id: 'sidetrack_sight',
        criterion: 'Adequate sight distance at sidetrack entry and exit for expected approach speed',
        autoCheck: () => ({ status: 'check', detail: 'Assess sight lines at both ends of sidetrack' }),
      },
      {
        id: 'full_closure_main',
        criterion: 'Main carriageway fully closed — no through access',
        autoCheck: () => ({ status: 'pass', detail: 'Design step requires full closure of main carriageway' }),
      },
    ],
    mandatory: [
      'ROAD CLOSED signs on main carriageway; DETOUR signs directing to sidetrack',
      'Speed limit sign at sidetrack entry appropriate to geometry (typically 20–40 km/h)',
      'Traffic controllers at each end if one-way sidetrack',
      'Dust suppression on unsealed sidettracks',
      'Adequate lighting at night if sidetrack in use',
      'Sidetrack inspected and maintained daily during use',
    ],
  },

  {
    type: 'around_contraflow',
    name: 'Around — Contraflow (Divided Road)',
    category: 'static',
    subcategory: 'Around the Worksite',
    agttmRef: 'AGTTM Part 3, Section 3.2.3',
    description: 'Traffic from one carriageway is temporarily diverted to run in the opposing direction on the other carriageway. Requires median ≥6 m or permanent rigid barrier.',
    isFullClosure: true,
    criteria: [
      {
        id: 'median_width',
        criterion: 'Median width ≥6 m OR permanent rigid barrier separating carriageways',
        autoCheck: (inp) => {
          if (!inp.medianDivided) return { status: 'fail', detail: 'Road is not divided — contraflow around requires divided carriageways' };
          if (inp.medianWidth === 0) return { status: 'check', detail: 'Median width not entered — verify ≥6 m or confirm rigid barrier present' };
          return inp.medianWidth >= 6
            ? { status: 'pass', detail: `Median ${inp.medianWidth} m ≥ 6 m minimum` }
            : { status: 'fail', detail: `Median ${inp.medianWidth} m < 6 m — use Contraflow Past (past_contraflow) instead, or install rigid barrier` };
        },
      },
      {
        id: 'contraflow_separation',
        criterion: 'Both directions of traffic separated by rigid barrier or median ≥6 m through the contraflow section',
        autoCheck: () => ({ status: 'check', detail: 'Confirm continuous separation between contraflow and oncoming traffic' }),
      },
      {
        id: 'risk_assessment',
        criterion: 'Risk assessment completed for hazards from traffic reversal (wrong-way driving risk, emergency access)',
        autoCheck: () => ({ status: 'check', detail: 'Complete and document formal risk assessment' }),
      },
      {
        id: 'crossover_design',
        criterion: 'Crossover point(s) designed with adequate sight distance and approach geometry',
        autoCheck: (inp) => inp.sightIssue
          ? { status: 'fail', detail: 'Sight distance issue indicated — crossover geometry must be reviewed' }
          : { status: 'check', detail: 'Survey and confirm crossover sight distances' },
      },
    ],
    mandatory: [
      'LOOK BOTH WAYS signs at ALL side road approaches within the contraflow section',
      'Cone spacing 2 m maximum at crossover points',
      'END CONTRAFLOW signing at departure crossover',
      'Speed reduction mandatory — assess and sign accordingly',
      'Advance warning with VMS or flashing lights recommended',
      'Risk assessment documented and approved by road authority',
    ],
  },

  // ── STATIC — THROUGH THE WORKSITE ─────────────────────────────

  {
    type: 'through_alternating',
    name: 'Through — One-Lane Alternating (STOP/SLOW)',
    category: 'static',
    subcategory: 'Through the Worksite',
    agttmRef: 'AGTTM Part 3, Section 3.3.1',
    description: 'Traffic passes through the work zone one direction at a time, using STOP/SLOW bat controllers or portable signals to alternate the flow.',
    isAlternating: true,
    criteria: [
      {
        id: 'single_lane_available',
        criterion: 'At least one usable lane remains available through the work zone for traffic passage',
        autoCheck: (inp) => inp.lanesInDirection >= 1
          ? { status: 'pass', detail: 'Lane available for alternating traffic' }
          : { status: 'fail', detail: 'No lanes available — use Around or full closure' },
      },
      {
        id: 'tc_required',
        criterion: 'Traffic controller(s) required at each end OR portable signals — unless exempt (sight ≥75 m AND length ≤60 m, OR sight ≥150 m AND ≤40 vph AND ≤70 km/h AND ≤60 m)',
        autoCheck: (inp) => {
          const shortZone = inp.worksLength <= 60;
          const lowVol = (inp.peakHourVolume / 2) <= 40;
          const lowSpeed = inp.postedSpeed <= 70;
          const noSightIssue = !inp.sightIssue;
          if (shortZone && noSightIssue && lowVol && lowSpeed) {
            return { status: 'pass', detail: `Zone ${inp.worksLength} m ≤60 m, ${inp.peakHourVolume/2} vph ≤40, ${inp.postedSpeed} km/h ≤70 — TC exemption may apply; confirm sight distance ≥150 m` };
          }
          return { status: 'check', detail: 'TC or portable signals required — confirm deployment at both ends' };
        },
      },
      {
        id: 'queue_acceptable',
        criterion: 'Estimated queue length is within acceptable limits for road environment',
        autoCheck: (inp) => {
          if (inp.peakHourVolume === 0) return { status: 'check', detail: 'Enter peak hour volume for queue estimate' };
          return { status: 'check', detail: 'Review estimated queue length in Key Outputs section' };
        },
      },
      {
        id: 'sight_distance_tc',
        criterion: 'Sight distance to traffic controller meets AGTTM Table 2.3 requirements from approach speed',
        autoCheck: (inp) => inp.sightIssue
          ? { status: 'fail', detail: 'Sight distance restricted — relocate TC position or address obstruction' }
          : { status: 'pass', detail: 'No sight distance issue indicated' },
      },
    ],
    mandatory: [
      'STOP/SLOW bat controllers or portable signals at each end of single-lane section',
      'PREPARE TO STOP signs at sight distance upstream of each controller',
      'Maximum stop time consistent with AGTTM Table 4.3 queue calculations',
      'Radio communication between controllers at each end',
      'If portable signals: interlocked with fail-safe STOP for both heads on loss of communication',
      'TRAFFIC CONTROLLERS AHEAD signs on both approaches',
    ],
  },

  {
    type: 'through_shuttle',
    name: 'Through — Shuttle Flow (Pilot Vehicle)',
    category: 'static',
    subcategory: 'Through the Worksite',
    agttmRef: 'AGTTM Part 3, Section 3.3.2 / Table 5.4',
    description: 'A pilot vehicle leads convoys of traffic through the work zone one direction at a time. Required when zone length or sight distance prevents safe alternating control.',
    isAlternating: true,
    criteria: [
      {
        id: 'shuttle_length',
        criterion: 'Works length within maximum shuttle flow length for site volume (AGTTM Table 5.4)',
        autoCheck: (inp) => {
          const maxLen = maxShuttleFlowLength(inp.peakHourVolume);
          return inp.worksLength <= maxLen
            ? { status: 'pass', detail: `Works ${inp.worksLength} m ≤ max ${maxLen} m for ${inp.peakHourVolume} vph` }
            : { status: 'fail', detail: `Works ${inp.worksLength} m exceeds max ${maxLen} m for ${inp.peakHourVolume} vph — consider detour or sidetrack` };
        },
      },
      {
        id: 'pilot_vehicle_available',
        criterion: 'Pilot vehicle (clearly signed FOLLOW ME / PILOT VEHICLE) available and operated by competent person',
        autoCheck: () => ({ status: 'check', detail: 'Confirm pilot vehicle, driver certification and signage' }),
      },
      {
        id: 'shuttle_sight',
        criterion: 'Sight distance at each end sufficient for pilot vehicle to observe approaching traffic before entering',
        autoCheck: (inp) => inp.sightIssue
          ? { status: 'check', detail: 'Sight distance restricted — pilot vehicle operator must use caution and lookout' }
          : { status: 'pass', detail: 'No sight distance issue indicated' },
      },
    ],
    mandatory: [
      'Pilot vehicle with FOLLOW ME / PILOT VEHICLE sign on front and rear',
      'STOP sign at each end — controlled by TC or pilot vehicle operator',
      'Radio communication between pilot vehicle and controllers at each end',
      'One convoy direction at a time — opposing traffic held until pilot clears',
      'Maximum convoy speed appropriate to road conditions',
      'Night works: additional lighting required in work zone',
    ],
  },

  {
    type: 'through_pilot',
    name: 'Through — Pilot Vehicle (Continuous Lead)',
    category: 'static',
    subcategory: 'Through the Worksite',
    agttmRef: 'AGTTM Part 3, Section 3.3.3',
    description: 'All traffic follows a pilot vehicle through the work zone continuously. Used where work zone geometry or complexity requires traffic to be actively guided.',
    isFullClosure: true,
    criteria: [
      {
        id: 'pilot_justification',
        criterion: 'Pilot vehicle use justified by restricted sight distance, complex geometry or narrow passage through works',
        autoCheck: (inp) => inp.sightIssue
          ? { status: 'pass', detail: 'Sight distance restriction confirms need for pilot vehicle lead' }
          : { status: 'check', detail: 'Document reason for pilot vehicle — complex geometry or narrow passage' },
      },
      {
        id: 'pilot_trained',
        criterion: 'Pilot vehicle operator holds appropriate certification and understands responsibilities',
        autoCheck: () => ({ status: 'check', detail: 'Confirm operator certification and briefing' }),
      },
    ],
    mandatory: [
      'Pilot vehicle with FOLLOW ME signs on front and rear',
      'STOP at each end — pilot vehicle initiates movement of each convoy',
      'One direction at a time — pilot makes round trips',
      'Maximum 10 km/h through narrow sections',
      'TC at each end if volumes or geometry require',
    ],
  },

  // ── STATIC — PAST THE WORKSITE ──────────────────────────────────

  {
    type: 'past_lane_closure',
    name: 'Past — Lane Closure (Multilane)',
    category: 'static',
    subcategory: 'Past the Worksite',
    agttmRef: 'AGTTM Part 3, Section 3.4.1',
    description: 'One or more lanes are closed on a multi-lane road while traffic continues to flow in remaining open lanes. Traffic passes continuously past the work zone.',
    isLaneClosure: true,
    criteria: [
      {
        id: 'multilane_road',
        criterion: 'Multi-lane road — at least one lane remains open for traffic in the affected direction',
        autoCheck: (inp) => inp.lanesInDirection > 1
          ? { status: 'pass', detail: `${inp.lanesInDirection} lanes in direction — closure of one lane leaves ${inp.lanesInDirection - 1} open` }
          : { status: 'fail', detail: 'Only 1 lane in direction — use Through (alternating) or Around instead' },
      },
      {
        id: 'works_proximity',
        criterion: 'Works area closer than 6 m from nearest live lane — "Past" classification applies',
        autoCheck: (inp) => {
          const prox = Math.min(
            inp.workersOnFoot ? inp.workerProximity : 99,
            inp.plantOnSite ? inp.plantProximity : 99,
          );
          if (prox < 6) return { status: 'pass', detail: `Works ${prox} m < 6 m from traffic — Past classification correct` };
          if (prox >= 6) return { status: 'check', detail: `Works ${prox} m ≥ 6 m — verify "Past" is appropriate or consider "Around"` };
          return { status: 'check', detail: 'Confirm works proximity to live traffic' };
        },
      },
      {
        id: 'barrier_required',
        criterion: 'Safety barrier required if works <3 m from traffic at speeds >60 km/h',
        autoCheck: (inp) => {
          const prox = Math.min(
            inp.workersOnFoot ? inp.workerProximity : 99,
            inp.plantOnSite ? inp.plantProximity : 99,
          );
          if (inp.postedSpeed > 60 && prox < 3) {
            return { status: 'fail', detail: `Works ${prox} m from traffic at ${inp.postedSpeed} km/h — safety barrier mandatory` };
          }
          if (prox < 3) return { status: 'check', detail: `Works ${prox} m from traffic — assess barrier requirement` };
          return { status: 'pass', detail: `Works ${prox} m from traffic — barrier may not be required (assess for speed and exposure)` };
        },
      },
      {
        id: 'capacity_adequate',
        criterion: 'Remaining open lane(s) provide adequate capacity for expected traffic volume',
        autoCheck: (inp) => {
          const laneVph = inp.lanesInDirection > 1 ? inp.peakHourVolume / (inp.lanesInDirection - 1) : inp.peakHourVolume;
          if (laneVph > 1200) return { status: 'fail', detail: `Est. ${Math.round(laneVph)} vph/lane in remaining lane(s) — capacity likely exceeded; consider timing or alternating` };
          if (laneVph > 900) return { status: 'check', detail: `Est. ${Math.round(laneVph)} vph/lane — approaching capacity; monitor queuing` };
          return { status: 'pass', detail: `Est. ${Math.round(laneVph)} vph/lane in remaining lane(s) — adequate capacity` };
        },
      },
    ],
    mandatory: [
      'Merge taper per AGTTM Table 5.7 at approach end',
      'Arrow board at taper start pointing toward open lane',
      'Delineation (cones/bollards) at AGTTM Table 4.2 spacing along entire closure length',
      'Safety barriers where works <3 m from traffic and speed >60 km/h',
      'Departure taper per AGTTM Table 5.7 at end of closure',
      'END ROADWORKS sign after departure taper',
    ],
  },

  {
    type: 'past_contraflow',
    name: 'Past — Contraflow (Undivided / Narrow Median)',
    category: 'static',
    subcategory: 'Past the Worksite',
    agttmRef: 'AGTTM Part 3, Section 3.4.2',
    description: 'Traffic from one direction is temporarily diverted to the opposing carriageway where median <6 m or a double barrier line is present. Traffic passes past the works.',
    isLaneClosure: true,
    criteria: [
      {
        id: 'narrow_median',
        criterion: 'Median width <6 m OR double barrier line present — distinguishes from Contraflow Around (which requires ≥6 m)',
        autoCheck: (inp) => {
          if (!inp.medianDivided) return { status: 'check', detail: 'Road appears undivided — confirm contraflow past is appropriate treatment' };
          if (inp.medianWidth === 0) return { status: 'check', detail: 'Median width not entered — verify <6 m (if ≥6 m, use Contraflow Around instead)' };
          return inp.medianWidth < 6
            ? { status: 'pass', detail: `Median ${inp.medianWidth} m < 6 m — Contraflow Past appropriate` }
            : { status: 'fail', detail: `Median ${inp.medianWidth} m ≥ 6 m — use Contraflow Around (around_contraflow) instead` };
        },
      },
      {
        id: 'contraflow_delineation',
        criterion: 'Continuous delineation separating contraflow and oncoming traffic through entire contraflow section',
        autoCheck: () => ({ status: 'check', detail: 'Confirm barrier or continuous cone line between contraflow and oncoming traffic' }),
      },
      {
        id: 'contraflow_sight',
        criterion: 'Adequate sight distance at crossover points for merging vehicles',
        autoCheck: (inp) => inp.sightIssue
          ? { status: 'fail', detail: 'Sight distance restricted — crossover point must be relocated' }
          : { status: 'pass', detail: 'No sight distance issue indicated' },
      },
    ],
    mandatory: [
      'LOOK BOTH WAYS signs at all side road approaches within the contraflow section',
      'Crossover taper at each end with cones at 2 m spacing',
      'Speed reduction mandatory at crossover entry',
      'KEEP LEFT / KEEP RIGHT signs at crossover point',
      'TC may be required at crossover if volumes or geometry warrant',
    ],
  },

  {
    type: 'past_shoulder',
    name: 'Past — Shoulder / Verge Works',
    category: 'static',
    subcategory: 'Past the Worksite',
    agttmRef: 'AGTTM Part 3, Section 3.4.3',
    description: 'Works on the shoulder, verge or median — no lane closure required. Traffic continues to pass without lane changes.',
    isShoulderOnly: true,
    criteria: [
      {
        id: 'shoulder_only',
        criterion: 'Works confined to shoulder, verge or median — no encroachment on traffic lane',
        autoCheck: () => ({ status: 'check', detail: 'Confirm works remain within shoulder/verge — no lane encroachment' }),
      },
      {
        id: 'clearance_minimum',
        criterion: 'Minimum 1.2 m clearance between works/workers and nearest moving traffic lane',
        autoCheck: (inp) => {
          const prox = Math.min(
            inp.workersOnFoot ? inp.workerProximity : 99,
            inp.plantOnSite ? inp.plantProximity : 99,
          );
          if (prox >= 1.2) return { status: 'pass', detail: `${prox} m clearance ≥ 1.2 m minimum` };
          return { status: 'fail', detail: `${prox} m clearance < 1.2 m minimum — increase separation or use lane closure` };
        },
      },
      {
        id: 'speed_appropriate',
        criterion: 'Posted speed appropriate for proximity — max 80 km/h if workers within 1.2–3 m',
        autoCheck: (inp) => {
          if (!inp.workersOnFoot) return { status: 'pass', detail: 'No workers on foot — speed check not required' };
          if (inp.workerProximity < 3 && inp.postedSpeed > 80) {
            return { status: 'fail', detail: `Workers ${inp.workerProximity} m from traffic at ${inp.postedSpeed} km/h — max 80 km/h required` };
          }
          return { status: 'pass', detail: 'Speed appropriate for worker proximity' };
        },
      },
    ],
    mandatory: [
      'WORKS AHEAD sign on approach',
      'Arrow board if works could cause confusion to passing drivers (speed ≥60 km/h)',
      'Shadow vehicle positioned 40 m behind workers if workers within 1.2–3 m of traffic',
      'Speed reduction if workers within 3 m of traffic (max 60 km/h)',
      'Hi-vis PPE (minimum Level 2) for all workers',
    ],
  },

  {
    type: 'past_pavement',
    name: 'Past — Pavement / Surfacing Works',
    category: 'static',
    subcategory: 'Past the Worksite',
    agttmRef: 'AGTTM Part 3, Section 3.4.4',
    description: 'Pavement rehabilitation, resurfacing or line marking within or adjacent to traffic lanes while traffic continues to flow.',
    isLaneClosure: true,
    criteria: [
      {
        id: 'pavement_scope',
        criterion: 'Works involve pavement, surfacing, patching or line marking within or immediately adjacent to travel lanes',
        autoCheck: () => ({ status: 'check', detail: 'Confirm works scope is pavement/surfacing type' }),
      },
      {
        id: 'fresh_bitumen_speed',
        criterion: 'If fresh bitumen/seal present: maximum speed 60 km/h through work zone',
        autoCheck: (inp) => {
          if (!inp.freshBitumen) return { status: 'pass', detail: 'No fresh bitumen indicated' };
          return inp.postedSpeed <= 60 || inp.overrideTemp
            ? { status: 'check', detail: 'Fresh bitumen present — confirm temp speed zone is ≤60 km/h' }
            : { status: 'fail', detail: `Fresh bitumen present — temp speed must be ≤60 km/h (posted is ${inp.postedSpeed} km/h)` };
        },
      },
      {
        id: 'delineation_fresh',
        criterion: 'Fresh pavement surface adequately delineated from live traffic lane',
        autoCheck: () => ({ status: 'check', detail: 'Confirm delineation between fresh surface and live traffic' }),
      },
    ],
    mandatory: [
      'Arrow board mandatory at lane closure taper',
      'Merge taper per AGTTM Table 5.7',
      'Max 60 km/h temp speed zone when fresh bitumen/seal is present',
      'No vehicles allowed on fresh bitumen until rolled and cool (as per mix specification)',
      'END ROADWORKS signs after departure area',
    ],
  },

  {
    type: 'past_bridge',
    name: 'Past — Bridge / Structure Works',
    category: 'static',
    subcategory: 'Past the Worksite',
    agttmRef: 'AGTTM Part 3, Section 3.4.5',
    description: 'Works on or adjacent to a bridge structure (deck, piers, abutments, under-bridge) while traffic uses the bridge.',
    isLaneClosure: true,
    criteria: [
      {
        id: 'bridge_ra_approval',
        criterion: 'Road authority approval and bridge owner approval obtained for works on/under bridge',
        autoCheck: () => ({ status: 'check', detail: 'Confirm all relevant authority approvals in place before works commence' }),
      },
      {
        id: 'bridge_structural',
        criterion: 'Structural engineer assessment confirms bridge can carry proposed plant loads and temporary loading',
        autoCheck: () => ({ status: 'check', detail: 'Obtain structural engineer certification for plant and temporary loads' }),
      },
      {
        id: 'bridge_overhead',
        criterion: 'If working above traffic: safety screens/nets or exclusion zone below work area',
        autoCheck: () => ({ status: 'check', detail: 'Assess risk of falling objects — provide screens, nets or close lane below' }),
      },
      {
        id: 'bridge_load_limit',
        criterion: 'Temporary load restrictions imposed if structural assessment requires',
        autoCheck: () => ({ status: 'check', detail: 'Review structural assessment for any load limit requirements' }),
      },
    ],
    mandatory: [
      'Road authority and bridge owner approval prior to works',
      'Structural engineer assessment and sign-off',
      'Overhead protection for traffic where falling object risk exists',
      'Oversize vehicle management plan if bridge geometry restricted',
      'Emergency response plan for works near water or at height',
    ],
  },

  // ── MOBILE WORKS ──────────────────────────────────────────────

  {
    type: 'mobile_class1',
    name: 'Mobile Works — Class 1 (≤20 km/h differential, no workers)',
    category: 'mobile',
    subcategory: 'Mobile Works',
    agttmRef: 'AGTTM Part 4, Section 4.1',
    description: 'Mobile plant moving at ≤20 km/h below the traffic speed. No workers on foot. Shadow vehicle required behind plant. No advance warning signs needed.',
    isShoulderOnly: true,
    noSignSchedule: true,
    criteria: [
      {
        id: 'speed_differential',
        criterion: 'Speed differential between plant and traffic ≤20 km/h',
        autoCheck: () => ({ status: 'check', detail: 'Confirm plant travel speed — differential with traffic must be ≤20 km/h' }),
      },
      {
        id: 'no_workers_class1',
        criterion: 'No workers on foot in or adjacent to the traffic stream',
        autoCheck: (inp) => !inp.workersOnFoot
          ? { status: 'pass', detail: 'No workers on foot indicated' }
          : { status: 'fail', detail: 'Workers on foot present — use Mobile Class 3 instead' },
      },
      {
        id: 'plant_visible',
        criterion: 'Plant clearly visible to approaching traffic (amber beacon, retro-reflective markings)',
        autoCheck: () => ({ status: 'check', detail: 'Confirm plant amber beacon and hi-vis markings operational' }),
      },
    ],
    mandatory: [
      'Shadow vehicle positioned 40 m minimum behind plant at all times',
      'Amber flashing beacon on all mobile plant',
      'Hi-vis retro-reflective markings on rear of plant',
      'SLOW MOVING PLANT sign on shadow vehicle',
      'Two-way radio communication between plant operator and shadow vehicle driver',
      'No workers on foot in the mobile work zone',
    ],
  },

  {
    type: 'mobile_class2',
    name: 'Mobile Works — Class 2 (>20 km/h differential, no workers)',
    category: 'mobile',
    subcategory: 'Mobile Works',
    agttmRef: 'AGTTM Part 4, Section 4.2',
    description: 'Mobile plant moving at >20 km/h below traffic speed. No workers on foot. Shadow vehicle required. TMA on shadow vehicle for Category 3 roads.',
    isShoulderOnly: true,
    noSignSchedule: true,
    criteria: [
      {
        id: 'speed_differential_class2',
        criterion: 'Speed differential between plant and traffic >20 km/h',
        autoCheck: () => ({ status: 'check', detail: 'Confirm plant travel speed — differential >20 km/h triggers Class 2 requirements' }),
      },
      {
        id: 'no_workers_class2',
        criterion: 'No workers on foot in or adjacent to the traffic stream',
        autoCheck: (inp) => !inp.workersOnFoot
          ? { status: 'pass', detail: 'No workers on foot indicated' }
          : { status: 'fail', detail: 'Workers on foot present — use Mobile Class 3' },
      },
      {
        id: 'tma_required_class2',
        criterion: 'TMA (Truck Mounted Attenuator) required on shadow vehicle for Category 3 roads (highways/freeways)',
        autoCheck: (inp) => ['freeway', 'highway'].includes(inp.classification)
          ? { status: 'fail', detail: `${inp.classification} is Category 3 — TMA mandatory on shadow vehicle` }
          : { status: 'check', detail: 'Assess road category — TMA required on Category 3 roads' },
      },
    ],
    mandatory: [
      'Shadow vehicle with TMA on Category 3 roads',
      'Shadow vehicle 40 m behind plant — increases with speed differential',
      'SLOW MOVING PLANT / arrow board on shadow vehicle',
      'Amber beacon on all plant',
      'Advance warning may be required — assess based on speed differential and geometry',
    ],
  },

  {
    type: 'mobile_class3',
    name: 'Mobile Works — Class 3 (Workers on Foot)',
    category: 'mobile',
    subcategory: 'Mobile Works',
    agttmRef: 'AGTTM Part 4, Section 4.3',
    description: 'Mobile works with workers on foot present in or near the traffic stream. Highest risk mobile class. Shadow vehicle with TMA mandatory.',
    isShoulderOnly: true,
    noSignSchedule: true,
    criteria: [
      {
        id: 'workers_on_foot_class3',
        criterion: 'Workers on foot present in or immediately adjacent to the mobile work zone',
        autoCheck: (inp) => inp.workersOnFoot
          ? { status: 'pass', detail: 'Workers on foot confirmed — Class 3 applies' }
          : { status: 'check', detail: 'Confirm whether workers will be on foot — if not, consider Class 1 or 2' },
      },
      {
        id: 'temp_speed_40',
        criterion: '40 km/h temporary speed zone required when workers within 1.2 m of traffic lane',
        autoCheck: (inp) => {
          if (!inp.workersOnFoot) return { status: 'check', detail: 'Confirm worker proximity' };
          if (inp.workerProximity < 1.2) {
            return { status: 'check', detail: `Workers ${inp.workerProximity} m from traffic — 40 km/h temp zone required; ensure this is included in TMP` };
          }
          return { status: 'pass', detail: `Workers ${inp.workerProximity} m from traffic — verify 40 km/h zone if proximity reduces during works` };
        },
      },
      {
        id: 'tma_mandatory_class3',
        criterion: 'TMA (Truck Mounted Attenuator) mandatory on shadow vehicle',
        autoCheck: () => ({ status: 'check', detail: 'Confirm TMA is fitted and operational on shadow vehicle' }),
      },
    ],
    mandatory: [
      'Shadow vehicle with TMA mandatory — positioned between workers and following traffic',
      '40 km/h temp speed zone when workers within 1.2 m of traffic',
      'Workers must wear Level 2 hi-vis PPE minimum',
      'Clear exclusion zone around workers — traffic must not enter',
      'Two-way radio between all shadow vehicle drivers and work group leader',
      'Risk assessment documented for mobile Class 3 works',
    ],
  },

  // ── STLI — WITHIN TRAFFIC LANE ────────────────────────────────

  {
    type: 'stli_specialist',
    name: 'STLI In-Lane — Work Protected by Specialist Vehicles',
    category: 'stli',
    subcategory: 'Within Traffic Lane',
    agttmRef: 'AGTTM Part 5, Section 3.1',
    description: 'Workers in the traffic lane protected by a specialist vehicle (TMA) positioned between workers and live traffic. No advance warning signs required if TMA used correctly.',
    noSignSchedule: true,
    criteria: [
      {
        id: 'specialist_vehicle_present',
        criterion: 'Specialist vehicle (TMA / crash cushion truck) positioned between workers and live traffic',
        autoCheck: () => ({ status: 'check', detail: 'Confirm TMA vehicle on site and positioned correctly' }),
      },
      {
        id: 'tma_visibility',
        criterion: 'TMA vehicle visible to approaching traffic at adequate distance (sight distance per Table 2.3)',
        autoCheck: (inp) => inp.sightIssue
          ? { status: 'fail', detail: 'Sight distance restricted — TMA may not be visible in time; reassess' }
          : { status: 'pass', detail: 'No sight distance restriction indicated' },
      },
      {
        id: 'positive_separation',
        criterion: 'Workers are behind (protected by) the TMA — no worker forward of TMA into live traffic',
        autoCheck: () => ({ status: 'check', detail: 'Confirm no workers are in front of TMA during works' }),
      },
      {
        id: 'task_duration_stli1',
        criterion: 'Work task duration appropriate for STLI classification — if long duration consider upgrading to static zone',
        autoCheck: () => ({ status: 'check', detail: 'If task will take >1 hr, consider upgrading to static lane closure' }),
      },
    ],
    mandatory: [
      'TMA vehicle with appropriate impact rating for road speed',
      'Arrow board on TMA pointing away from workers',
      'Amber beacon on TMA vehicle',
      'No advance warning signs required when TMA used correctly (per AGTTM)',
      'Workers must remain behind protection of TMA at all times',
      'Supervisor monitoring at all times',
    ],
  },

  {
    type: 'stli_gaps',
    name: 'STLI In-Lane — Works Between Gaps in Traffic',
    category: 'stli',
    subcategory: 'Within Traffic Lane',
    agttmRef: 'AGTTM Part 5, Section 3.2',
    description: 'Short-duration tasks completed during natural gaps in traffic flow. Lookout required. Not recommended on multi-lane roads >100 vph/lane.',
    noSignSchedule: true,
    criteria: [
      {
        id: 'gap_task_duration',
        criterion: 'Each task completable within a single adequate traffic gap (typically <10 seconds for no advance signs)',
        autoCheck: () => ({ status: 'check', detail: 'Confirm individual task duration fits within available traffic gaps' }),
      },
      {
        id: 'gaps_adequate',
        criterion: 'Adequate gaps available in traffic flow — not recommended >100 vph/lane on multi-lane roads',
        autoCheck: (inp) => {
          const vphPerLane = inp.peakHourVolume / Math.max(inp.lanesInDirection, 1);
          if (inp.lanesInDirection > 1 && vphPerLane > 100) {
            return { status: 'fail', detail: `${Math.round(vphPerLane)} vph/lane on ${inp.lanesInDirection}-lane road — not recommended for works between gaps; use static lane closure` };
          }
          return { status: 'pass', detail: `${Math.round(vphPerLane)} vph/lane — gaps method may be suitable; confirm in field` };
        },
      },
      {
        id: 'lookout_required',
        criterion: 'Lookout required unless task <10 sec AND adequate sight distance available',
        autoCheck: (inp) => inp.sightIssue
          ? { status: 'fail', detail: 'Sight distance restricted — lookout mandatory; must have clear view both directions' }
          : { status: 'check', detail: 'Confirm lookout arrangement and sight distance in both directions' },
      },
      {
        id: 'communication_gaps',
        criterion: 'Clear communication system between lookout and workers (hand signals or radio)',
        autoCheck: () => ({ status: 'check', detail: 'Confirm communication method — practise stop/go signals before works' }),
      },
    ],
    mandatory: [
      'Lookout positioned with adequate sight distance in both directions',
      'Clear STOP signal to workers when traffic approaches',
      'Workers cease work immediately on lookout signal',
      'All workers out of lane before traffic arrives',
      'Not to be used on multi-lane roads >100 vph/lane',
      'Advance warning signs required if gaps not clearly predictable',
    ],
  },

  {
    type: 'stli_short_term',
    name: 'STLI In-Lane — Short Term Works in Traffic',
    category: 'stli',
    subcategory: 'Within Traffic Lane',
    agttmRef: 'AGTTM Part 5, Section 3.3',
    description: 'Works of short planned duration in the traffic lane. Time limits apply based on worker proximity to live traffic.',
    noSignSchedule: true,
    criteria: [
      {
        id: 'duration_within_1_2m',
        criterion: 'If workers within 1.2 m of live traffic: task duration ≤5 minutes',
        autoCheck: (inp) => {
          if (!inp.workersOnFoot || inp.workerProximity >= 1.2) return { status: 'pass', detail: 'Not applicable (workers ≥1.2 m from traffic)' };
          return { status: 'check', detail: `Workers ${inp.workerProximity} m from traffic — confirm task completable in ≤5 min` };
        },
      },
      {
        id: 'duration_1_2_to_3m',
        criterion: 'If workers 1.2–3 m from live traffic: task duration ≤20 minutes',
        autoCheck: (inp) => {
          if (!inp.workersOnFoot || inp.workerProximity < 1.2 || inp.workerProximity >= 3) return { status: 'pass', detail: 'Not applicable (proximity outside 1.2–3 m range)' };
          return { status: 'check', detail: `Workers ${inp.workerProximity} m from traffic — confirm task completable in ≤20 min` };
        },
      },
      {
        id: 'sight_distance_stli3',
        criterion: 'Sight distance ≥150 m (≤60 km/h) or ≥250 m (>60 km/h) from approaching traffic',
        autoCheck: (inp) => {
          if (inp.sightIssue) return { status: 'fail', detail: 'Sight distance restricted — minimum not met; upgrade to static lane closure' };
          const minSight = inp.postedSpeed > 60 ? 250 : 150;
          return { status: 'check', detail: `Confirm sight distance ≥${minSight} m for ${inp.postedSpeed} km/h approach speed` };
        },
      },
      {
        id: 'workers_ready_to_clear',
        criterion: 'All workers able to clear lane within 30 seconds if required',
        autoCheck: () => ({ status: 'check', detail: 'Brief all workers on clearing procedure and practise before works' }),
      },
    ],
    mandatory: [
      'Supervisor/lookout present during all works',
      'Workers must be able to clear lane within 30 seconds',
      'At least 5 m from intersections and driveways',
      'Hi-vis PPE (Level 2 minimum) for all workers',
      'Works suspended if sight distance or gap conditions deteriorate',
      'Time limits strictly observed — set timer if required',
    ],
  },

  {
    type: 'stli_freq_lane',
    name: 'STLI In-Lane — Frequently Changing Work Area',
    category: 'stli',
    subcategory: 'Within Traffic Lane',
    agttmRef: 'AGTTM Part 5, Section 3.4',
    description: 'Work area changes frequently within the traffic lane (e.g. line marking, pothole patching moving along road). Time limits per location vary with volume.',
    noSignSchedule: true,
    criteria: [
      {
        id: 'max_time_workers_high_vol',
        criterion: 'With workers AND volume >40 vph: ≤5 minutes per location before moving',
        autoCheck: (inp) => {
          const vph = inp.peakHourVolume / 2;
          if (inp.workersOnFoot && vph > 40) {
            return { status: 'check', detail: `Workers on foot at ${Math.round(vph)} vph (>40) — max 5 min per location` };
          }
          return { status: 'pass', detail: 'Not applicable (no workers or ≤40 vph)' };
        },
      },
      {
        id: 'max_time_no_workers_high_vol',
        criterion: 'Without workers in lane AND volume >40 vph: ≤20 minutes per location',
        autoCheck: (inp) => {
          const vph = inp.peakHourVolume / 2;
          if (!inp.workersOnFoot && vph > 40) {
            return { status: 'check', detail: `Plant only (no workers on foot) at ${Math.round(vph)} vph (>40) — max 20 min per location` };
          }
          return { status: 'pass', detail: 'Not applicable' };
        },
      },
      {
        id: 'max_time_low_vol',
        criterion: 'At ≤40 vph: maximum 1 hour per location before moving',
        autoCheck: (inp) => {
          const vph = inp.peakHourVolume / 2;
          if (vph <= 40) return { status: 'check', detail: `${Math.round(vph)} vph ≤40 — max 1 hr per location` };
          return { status: 'pass', detail: 'Volume >40 vph — tighter time limits apply (see above)' };
        },
      },
      {
        id: 'shadow_vehicle_stli4',
        criterion: 'Shadow vehicle positioned to protect workers at each location',
        autoCheck: () => ({ status: 'check', detail: 'Confirm shadow vehicle follows work group and is repositioned at each location' }),
      },
      {
        id: 'tma_cat3_stli4',
        criterion: 'TMA on shadow vehicle for Category 3 roads',
        autoCheck: (inp) => ['freeway', 'highway'].includes(inp.classification)
          ? { status: 'fail', detail: `${inp.classification} is Category 3 — TMA mandatory on shadow vehicle` }
          : { status: 'check', detail: 'Assess if road is Category 3 — TMA required if so' },
      },
    ],
    mandatory: [
      'Shadow vehicle (with TMA on Category 3 roads) follows work group',
      'Strict adherence to time limits per location based on volume',
      'Workers mobile — able to relocate quickly when time limit reached',
      'Arrow board on shadow vehicle pointing at work area',
      'Advance warning signs may be required — assess per AGTTM Part 5',
    ],
  },

  {
    type: 'stli_moving',
    name: 'STLI In-Lane — Constantly Moving Work Area',
    category: 'stli',
    subcategory: 'Within Traffic Lane',
    agttmRef: 'AGTTM Part 5, Section 3.5',
    description: 'Plant continuously moving in traffic lane (e.g. road grader, sweeper, inspection vehicle). No stopping. Shadow vehicle required.',
    noSignSchedule: true,
    criteria: [
      {
        id: 'continuously_moving',
        criterion: 'Plant is continuously moving — no stopping within traffic lane',
        autoCheck: () => ({ status: 'check', detail: 'Confirm operations plan does not require stopping in traffic lane' }),
      },
      {
        id: 'speed_diff_inspection',
        criterion: 'For inspection/survey operations: speed differential ≤20 km/h between plant and traffic',
        autoCheck: () => ({ status: 'check', detail: 'Confirm plant travel speed — keep differential ≤20 km/h for inspections' }),
      },
      {
        id: 'sight_dist_grading',
        criterion: 'For grading/maintenance: sight distance ≥250 m for following drivers',
        autoCheck: (inp) => inp.sightIssue
          ? { status: 'fail', detail: 'Sight distance restricted — moving works may not be appropriate; assess alternative' }
          : { status: 'check', detail: 'Confirm sight distance ≥250 m for following drivers' },
      },
    ],
    mandatory: [
      'Plant must remain in continuous motion — no stationary periods in lane',
      'Shadow vehicle required behind plant at all times',
      'Amber beacon on all plant',
      'Arrow board on shadow vehicle',
      'If plant must stop: use static lane closure instead',
    ],
  },

  // ── STLI — OUTSIDE TRAFFIC LANE ──────────────────────────────

  {
    type: 'stli_shoulder_foot',
    name: 'STLI Outside-Lane — Workers on Foot / Small Plant (Shoulder)',
    category: 'stli',
    subcategory: 'Outside Traffic Lane',
    agttmRef: 'AGTTM Part 5, Section 4.1',
    description: 'Workers on foot or with small plant items on shoulder, median, verge or footpath. Traffic passes without lane change.',
    isShoulderOnly: true,
    noSignSchedule: true,
    criteria: [
      {
        id: 'clearance_1_2m_foot',
        criterion: 'Clearance ≥1.2 m between workers/small plant and nearest moving lane',
        autoCheck: (inp) => {
          if (!inp.workersOnFoot) return { status: 'check', detail: 'Confirm worker positions and clearance' };
          if (inp.workerProximity >= 1.2) return { status: 'pass', detail: `${inp.workerProximity} m ≥ 1.2 m minimum` };
          return { status: 'fail', detail: `${inp.workerProximity} m < 1.2 m minimum — increase separation or use lane closure` };
        },
      },
      {
        id: 'small_plant_only',
        criterion: 'Small plant items only — no large mobile plant (graders, rollers, trucks) in this zone',
        autoCheck: (inp) => inp.plantOnSite
          ? { status: 'check', detail: 'Plant on site — confirm it is small plant only (not large mobile plant)' }
          : { status: 'pass', detail: 'No plant on site indicated' },
      },
      {
        id: 'speed_limit_foot',
        criterion: 'Posted speed ≤80 km/h when workers within 1.2–3 m; no restriction if >3 m clearance',
        autoCheck: (inp) => {
          if (!inp.workersOnFoot) return { status: 'pass', detail: 'No workers on foot' };
          if (inp.workerProximity >= 1.2 && inp.workerProximity < 3 && inp.postedSpeed > 80) {
            return { status: 'fail', detail: `Workers ${inp.workerProximity} m from traffic at ${inp.postedSpeed} km/h — max 80 km/h required` };
          }
          return { status: 'pass', detail: `Workers ${inp.workerProximity} m — speed ${inp.postedSpeed} km/h acceptable` };
        },
      },
      {
        id: 'shadow_vehicle_foot',
        criterion: 'Shadow vehicle required if workers within 1.2–3 m of traffic',
        autoCheck: (inp) => {
          if (!inp.workersOnFoot) return { status: 'pass', detail: 'No workers on foot' };
          if (inp.workerProximity >= 1.2 && inp.workerProximity < 3) {
            return { status: 'check', detail: `Workers ${inp.workerProximity} m from traffic — shadow vehicle required` };
          }
          return { status: 'pass', detail: `Workers ${inp.workerProximity} m — shadow vehicle not required at this proximity` };
        },
      },
    ],
    mandatory: [
      'Minimum 1.2 m clearance between workers and live traffic lane',
      'Hi-vis PPE (Level 2 minimum) for all workers',
      'Shadow vehicle 40 m behind workers if within 1.2–3 m of traffic',
      'Speed reduction to ≤80 km/h if workers within 3 m of traffic',
      'WORKS AHEAD sign on approach (may be omitted for very brief tasks)',
    ],
  },

  {
    type: 'stli_shoulder_plant',
    name: 'STLI Outside-Lane — Large Plant (Shoulder / Verge)',
    category: 'stli',
    subcategory: 'Outside Traffic Lane',
    agttmRef: 'AGTTM Part 5, Section 4.2',
    description: 'Large plant items (graders, rollers, excavators) operating on shoulder, verge or median. Higher risk due to plant overhang and movement.',
    isShoulderOnly: true,
    noSignSchedule: true,
    criteria: [
      {
        id: 'clearance_1_2m_plant',
        criterion: 'Clearance ≥1.2 m between plant (including any overhang) and nearest moving traffic lane',
        autoCheck: (inp) => {
          if (!inp.plantOnSite) return { status: 'check', detail: 'Confirm plant clearance including any swing/overhang' };
          if (inp.plantProximity >= 1.2) return { status: 'pass', detail: `${inp.plantProximity} m ≥ 1.2 m minimum` };
          return { status: 'fail', detail: `${inp.plantProximity} m < 1.2 m — increase separation or use lane closure` };
        },
      },
      {
        id: 'speed_limit_plant',
        criterion: 'Speed ≤100 km/h — or ≤80 km/h if clearance <1.5 m',
        autoCheck: (inp) => {
          if (!inp.plantOnSite) return { status: 'pass', detail: 'No plant on site' };
          if (inp.plantProximity < 1.5 && inp.postedSpeed > 80) {
            return { status: 'fail', detail: `Plant ${inp.plantProximity} m from traffic at ${inp.postedSpeed} km/h — max 80 km/h required (clearance <1.5 m)` };
          }
          if (inp.postedSpeed > 100) {
            return { status: 'fail', detail: `${inp.postedSpeed} km/h exceeds max 100 km/h for large plant on shoulder` };
          }
          return { status: 'pass', detail: `Speed ${inp.postedSpeed} km/h and clearance ${inp.plantProximity} m — acceptable` };
        },
      },
      {
        id: 'shadow_vehicle_plant',
        criterion: 'Shadow vehicle required if large plant within 1.2–3 m of traffic',
        autoCheck: (inp) => {
          if (!inp.plantOnSite) return { status: 'pass', detail: 'No plant on site' };
          if (inp.plantProximity >= 1.2 && inp.plantProximity < 3) {
            return { status: 'check', detail: `Plant ${inp.plantProximity} m from traffic — shadow vehicle required` };
          }
          return { status: 'pass', detail: `Plant ${inp.plantProximity} m — shadow vehicle required if proximity reduces during operation` };
        },
      },
      {
        id: 'tma_cat3_plant',
        criterion: 'TMA on shadow vehicle for Category 3 roads when plant within 1.2–3 m',
        autoCheck: (inp) => ['freeway', 'highway'].includes(inp.classification) && inp.plantOnSite && inp.plantProximity < 3
          ? { status: 'fail', detail: `${inp.classification} (Category 3) with plant ${inp.plantProximity} m from traffic — TMA required` }
          : { status: 'check', detail: 'Assess Category 3 requirement for TMA' },
      },
    ],
    mandatory: [
      'Minimum 1.2 m clearance between all plant (including overhang) and traffic',
      'Shadow vehicle with TMA (Category 3 roads) if plant within 1.2–3 m',
      'Amber beacon operational on all large plant',
      'Speed reduction to ≤80 km/h if clearance <1.5 m',
      'WORKS AHEAD sign on approach',
      'Plant operator briefed on emergency stopping procedure',
    ],
  },

  {
    type: 'stli_freq_outside',
    name: 'STLI Outside-Lane — Frequently Changing Work Area',
    category: 'stli',
    subcategory: 'Outside Traffic Lane',
    agttmRef: 'AGTTM Part 5, Section 4.3',
    description: 'Works outside the traffic lane that change location frequently (e.g. vegetation clearing, inspection walking along road). Maximum 1 hour per location.',
    noSignSchedule: true,
    criteria: [
      {
        id: 'outside_lane',
        criterion: 'Works entirely outside the traffic lane (shoulder, median, verge or footpath)',
        autoCheck: () => ({ status: 'check', detail: 'Confirm no encroachment on live traffic lane during works' }),
      },
      {
        id: 'clearance_1m',
        criterion: 'Minimum 1.2 m clearance between works/workers and nearest moving lane',
        autoCheck: (inp) => {
          const prox = Math.min(
            inp.workersOnFoot ? inp.workerProximity : 99,
            inp.plantOnSite ? inp.plantProximity : 99,
          );
          if (prox >= 1.2) return { status: 'pass', detail: `${prox} m ≥ 1.2 m minimum` };
          return { status: 'fail', detail: `${prox} m < 1.2 m minimum clearance` };
        },
      },
      {
        id: 'max_1hr_location',
        criterion: 'Maximum 1 hour per location — works must move on after 1 hour',
        autoCheck: () => ({ status: 'check', detail: 'Confirm works plan allows moving location within 1 hour' }),
      },
    ],
    mandatory: [
      'Works area clearly delineated from traffic lane',
      'Maximum 1 hour per location — move on schedule',
      'Hi-vis PPE for all workers',
      'Lookout if workers within 3 m of traffic',
      'Shadow vehicle if extended proximity to traffic',
    ],
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────

export function getDesignStep(type: WorksType): DesignStepDef | undefined {
  return DESIGN_STEPS.find(d => d.type === type);
}

export function getDesignStepsByCategory(category: WorksCategory): DesignStepDef[] {
  return DESIGN_STEPS.filter(d => d.category === category);
}

export function evaluateCriteria(step: DesignStepDef, inp: WizardInputs): CriteriaCheck[] {
  return step.criteria.map(c => {
    if (c.autoCheck) {
      const result = c.autoCheck(inp);
      return { id: c.id, criterion: c.criterion, status: result.status, detail: result.detail };
    }
    return { id: c.id, criterion: c.criterion, status: 'check' as const };
  });
}

// ─── Works type labels ───────────────────────────────────────────

export const WORKS_TYPE_LABELS: Record<WorksType, string> = {
  around_detour:        'Around — Detour Route',
  around_sidetrack:     'Around — Temporary Sidetrack',
  around_contraflow:    'Around — Contraflow (Divided Road)',
  through_alternating:  'Through — One-Lane Alternating (STOP/SLOW)',
  through_shuttle:      'Through — Shuttle Flow (Pilot Vehicle)',
  through_pilot:        'Through — Pilot Vehicle (Continuous Lead)',
  past_lane_closure:    'Past — Lane Closure (Multilane)',
  past_contraflow:      'Past — Contraflow (Narrow Median)',
  past_shoulder:        'Past — Shoulder / Verge Works',
  past_pavement:        'Past — Pavement / Surfacing Works',
  past_bridge:          'Past — Bridge / Structure Works',
  mobile_class1:        'Mobile — Class 1 (≤20 km/h differential)',
  mobile_class2:        'Mobile — Class 2 (>20 km/h differential)',
  mobile_class3:        'Mobile — Class 3 (Workers on Foot)',
  stli_specialist:      'STLI In-Lane — Specialist Vehicle Protection',
  stli_gaps:            'STLI In-Lane — Works Between Gaps',
  stli_short_term:      'STLI In-Lane — Short Term Works',
  stli_freq_lane:       'STLI In-Lane — Frequently Changing Location',
  stli_moving:          'STLI In-Lane — Constantly Moving',
  stli_shoulder_foot:   'STLI Outside-Lane — Workers / Small Plant',
  stli_shoulder_plant:  'STLI Outside-Lane — Large Plant',
  stli_freq_outside:    'STLI Outside-Lane — Frequently Changing',
};
