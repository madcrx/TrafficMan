import { AustralianState } from './types';

// ═══════════════════════════════════════════════════════════════
// Source: AS 1742.3:2019 / AGTTM 2021 / TCAWS v6.1 / QGTTM / WA CoP
// ═══════════════════════════════════════════════════════════════

// ─── Table 2.2 / Sign spacing (advance warning signs) ───────────
// AGTTM03, AS 1742.3
export function signSpacing(speedKmh: number, _state?: AustralianState): number {
  if (speedKmh <= 55) return 15;
  if (speedKmh <= 65) return 45;
  // For speeds ≥66 km/h: spacing = speed value in metres
  // WA CoP confirms this formula too
  return speedKmh;
}

// ─── Table 2.3 / Sight distance to traffic control device ──────
// AGTTM03, AS 1742.3
// WA has slightly different: 50km/h=30m, 60km/h=45m, ≥70km/h=speed
export function sightDistance(speedKmh: number, state?: AustralianState): number {
  if (state === 'WA') {
    if (speedKmh <= 50) return 30;
    if (speedKmh <= 60) return 45;
    return speedKmh; // ≥70 km/h = speed value
  }
  // All other states — AGTTM Table 2.3
  if (speedKmh <= 45) return 50;
  if (speedKmh <= 55) return 70;
  if (speedKmh <= 65) return 90;
  return 2 * speedKmh; // ≥66 km/h
}

// ─── Table 5.7 / Taper lengths (AGTTM03 / TCAWS Table 7-3) ─────
// Basis: 3.5 m lane width; adjust if actual width differs
// laneClosureTaper = null for high speeds (TC taper not applicable)
export interface TaperLengths {
  laneClosureTaper: number | null; // traffic control taper (≤65 km/h)
  lateralShift: number;            // lateral shift taper
  merge: number;                   // merge/transition taper
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

// Scale taper length for lane widths other than 3.5 m
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

// ─── Table 4.2 / Cone / bollard through-spacing ────────────────
export function coneSpacing(speedKmh: number): number {
  if (speedKmh <= 55) return 4;
  if (speedKmh <= 75) return 12;
  return 18;
}

// Cones within taper: always 4 m max
export const CONE_TAPER_SPACING = 4;

// ─── Table 5.5 / Recommended temp speed ────────────────────────
// Returns {speed, justification}
export function recommendedTempSpeed(
  postedSpeed: number,
  workerProximity: number | null,   // null = no workers on foot
  plantProximity: number | null,    // null = no plant near traffic
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

  // Round down to nearest standard speed step
  const stdSpeeds = [40, 50, 60, 70, 80, 90, 100, 110];
  const rounded = stdSpeeds.filter(s => s <= speed).pop() ?? 40;

  if (reasons.length === 0) reasons.push('No mandatory speed reduction required; posted speed may be maintained subject to risk assessment');
  return { speed: rounded, reason: reasons.join('. ') };
}

// ─── Table 5.5 / Minimum temp speed zone length ────────────────
export function minTempZoneLength(tempSpeed: number): number {
  if (tempSpeed < 40) return 100;
  if (tempSpeed === 40) return 100;
  if (tempSpeed <= 60) return 150;
  return 500; // 80 km/h
}

// ─── Table 5.6 / Speed reduction method ────────────────────────
// Returns array of speed steps from posted down to temp
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
    // May use AHEAD sign or direct
    const mid = postedSpeed - 20;
    steps.push({ from: postedSpeed, to: mid, method: 'Speed limit sign' });
    steps.push({ from: mid, to: tempSpeed, method: 'Speed limit sign' });
  } else {
    // Step down in 20 km/h increments
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
// AGTTM Table 4.3 multipliers convert (5-min one-direction count) directly to
// queue length in METRES — they already embed a 6 m average car spacing.
// To adjust for heavy vehicles we scale by the actual average spacing / 6 m.
//
// vphOneDir  = one-direction peak hour volume (vph)
// stopTimeMin = maximum stop time the controlled queue experiences (minutes)
// heavyPct    = percentage of heavy vehicles (0–100)
export function estimatedQueueLength(
  vphOneDir: number,
  stopTimeMin: number,
  heavyPct: number,
): number {
  // 5-minute count in the stopped direction
  const fiveMinCount = vphOneDir / 12;

  // AGTTM Table 4.3 multipliers (metres of queue per unit of 5-min count, based on 6 m car spacing)
  const multipliers: Record<number, number> = { 2: 2.4, 5: 6, 10: 12, 15: 18, 30: 36 };
  const keys = [2, 5, 10, 15, 30];
  const nearest = keys.reduce((a, b) =>
    Math.abs(b - stopTimeMin) < Math.abs(a - stopTimeMin) ? b : a);
  const multiplier = multipliers[nearest] ?? 6;

  // Base queue length assuming all cars (6 m spacing)
  const baseQueueM = fiveMinCount * multiplier;

  // Scale for actual vehicle mix: cars ≈ 6 m spacing, heavy vehicles ≈ 19 m spacing
  const f = Math.min(Math.max(heavyPct / 100, 0), 1);
  const avgSpacingM = (1 - f) * 6 + f * 19;
  return Math.round(baseQueueM * (avgSpacingM / 6));
}

// ─── Suggest stop time from zone length ────────────────────────
// Returns the nearest AGTTM Table 4.3 standard stop-time value (minutes).
// Used as a default when the user has not specified a manual value.
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

// ─── State-specific standard references ────────────────────────
export function stateStandards(state: AustralianState): {
  primary: string[];
  secondary: string[];
} {
  switch (state) {
    case 'NSW':
      return {
        primary: ['TCAWS v6.1 (TfNSW)', 'AS 1742.3:2019'],
        secondary: ['RMS Guidelines for Temporary Traffic Management'],
      };
    case 'QLD':
      return {
        primary: ['QGTTM (TMR Queensland)', 'AS 1742.3:2019'],
        secondary: ['AGTTM (Austroads) — as supplementary reference'],
      };
    case 'WA':
      return {
        primary: ['Traffic Management for Works on Roads COP (Main Roads WA)', 'AS 1742.3:2019'],
        secondary: ['AGTTM (Austroads)', 'Main Roads WA Specification 601'],
      };
    case 'VIC':
      return {
        primary: ['Code of Practice for Worksite Safety — Traffic Management (VicRoads)', 'AGTTM (Austroads)', 'AS 1742.3:2019'],
        secondary: [],
      };
    default:
      // TAS, ACT, SA, NT use AGTTM as primary
      return {
        primary: ['AGTTM (Austroads)', 'AS 1742.3:2019'],
        secondary: ['State/Territory Road Authority requirements may apply'],
      };
  }
}

// ─── Works type descriptions ────────────────────────────────────
export const WORKS_TYPE_LABELS: Record<string, string> = {
  shoulder_only:        'Shoulder / Verge Works (no lane closure)',
  lane_closure_2lane:   'Lane Closure — 2-lane bidirectional road (one-way alternating)',
  lane_closure_multilane: 'Lane Closure — Multilane road (other lanes remain open)',
  full_road_closure:    'Full Road Closure (all lanes closed)',
  utility_underground:  'Underground Utility Works',
  pavement_resurfacing: 'Pavement Resurfacing / Surfacing',
  bridge_works:         'Bridge / Structure Works',
  tree_trimming:        'Tree Trimming / Vegetation Management',
  other:                'Other / Custom',
};

// ─── Sign descriptions by state ────────────────────────────────
export function signName(generic: string, state: AustralianState): string {
  // Most states use same names; NSW TCAWS has some differences
  const nswNames: Record<string, string> = {
    'WORKS AHEAD': 'ROADWORK AHEAD',
    'TRAFFIC CONTROLLERS AHEAD': 'TRAFFIC CONTROL AHEAD',
  };
  if (state === 'NSW' && nswNames[generic]) return nswNames[generic];
  return generic;
}
