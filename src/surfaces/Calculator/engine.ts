import {
  WizardInputs, CalculationResult, SignItem, EquipmentItem, SpeedStep,
} from './types';
import {
  signSpacing, sightDistance, taperLengths, scaleTaper, distBetweenTapers,
  coneSpacing, CONE_TAPER_SPACING, recommendedTempSpeed, minTempZoneLength,
  speedReductionSteps, estimatedQueueLength, suggestStopTime, bufferZoneMin,
  stateStandards, signName, getDesignStep, evaluateCriteria,
} from './standards';

export function calculate(inp: WizardInputs): CalculationResult {
  const state = inp.state;
  const posted = inp.postedSpeed;

  // ── Resolve design step ─────────────────────────────────────────
  const stepDef = getDesignStep(inp.worksType);
  const designStepName = stepDef?.name ?? inp.worksType;
  const designStepRef = stepDef?.agttmRef ?? 'AGTTM';
  const designStepDescription = stepDef?.description ?? '';
  const criteriaChecks = stepDef ? evaluateCriteria(stepDef, inp) : [];
  const mandatoryRequirements = stepDef?.mandatory ?? [];
  const noSignSchedule = stepDef?.noSignSchedule ?? false;

  // ── Behaviour flags from design step def ───────────────────────
  const isAlternating = stepDef?.isAlternating ?? false;
  const isFullClosure = stepDef?.isFullClosure ?? false;
  const isLaneClosure = stepDef?.isLaneClosure ?? false;
  const isShoulderOnly = stepDef?.isShoulderOnly ?? false;
  const isMultilane = inp.lanesInDirection > 1;
  const hasTCPD = ['stop_slow_bats', 'portable_signals', 'police'].includes(inp.controlMethod);

  // ── 1. Recommended temp speed ──────────────────────────────────
  const workerProx = inp.workersOnFoot ? inp.workerProximity : null;
  const plantProx  = inp.plantOnSite   ? inp.plantProximity  : null;

  const tempRec = inp.overrideTemp
    ? { speed: inp.manualTempSpeed, reason: 'Manually overridden by user — conduct risk assessment' }
    : recommendedTempSpeed(posted, workerProx, plantProx, inp.nightWorks, inp.freshBitumen, inp.weather, inp.visibility);

  const temp = tempRec.speed;

  // QLD mandatory 60 km/h when PTCD deployed on roads >60 km/h
  let qldNote = '';
  if (state === 'QLD' && hasTCPD && posted > 60 && temp > 60) {
    qldNote = 'QLD: QGTTM requires a mandatory 60 km/h temp speed zone when traffic controllers are deployed on roads >60 km/h.';
  }

  // ── 2. Speed reduction steps ────────────────────────────────────
  const reductionSteps: SpeedStep[] = speedReductionSteps(posted, temp);

  // ── 3. Sign spacing & sight distance ───────────────────────────
  const approachSpacing = signSpacing(posted, state);
  const sightDist       = sightDistance(temp, state);
  const minTempLen      = minTempZoneLength(temp);

  // ── 4. Taper lengths ────────────────────────────────────────────
  const tapers = taperLengths(temp);
  const scaledMerge    = scaleTaper(tapers.merge, inp.laneWidth);
  const scaledLatShift = scaleTaper(tapers.lateralShift, inp.laneWidth);

  const primaryTaper = isShoulderOnly
    ? scaledLatShift
    : (isLaneClosure || isAlternating || isFullClosure ? scaledMerge : scaledLatShift);

  // ── 5. Buffer zone ──────────────────────────────────────────────
  const bufferMin    = bufferZoneMin(temp, isMultilane);
  const bufferLength = inp.sightIssue ? Math.max(bufferMin, 50) : bufferMin;

  // ── 6. Cone spacing ─────────────────────────────────────────────
  const coneThru   = coneSpacing(temp);
  const distTapers = distBetweenTapers(temp);

  // ── 7. Queue length estimate ────────────────────────────────────
  const queueScenario =
    isAlternating ||
    isFullClosure ||
    (isLaneClosure && inp.controlMethod === 'portable_signals');

  let queueLength: number | null = null;
  let queueStopTime: number | null = null;

  if (queueScenario && inp.peakHourVolume > 0) {
    queueStopTime = (inp.maxStopTime > 0)
      ? inp.maxStopTime
      : suggestStopTime(inp.worksLength);
    const vphOneDir = inp.peakHourVolume / 2;
    queueLength = estimatedQueueLength(vphOneDir, queueStopTime, inp.heavyVehiclePercent);
  }
  const needsRepeaterSign = queueLength !== null && queueLength > 240;

  // ── 8. Sign schedule (only for static/full-zone types) ─────────
  const approachSigns: SignItem[] = [];
  const departureSigns: SignItem[] = [];

  if (!noSignSchedule) {
    let seq = 1;
    let curPos = 0;

    if (hasTCPD && (isAlternating || isFullClosure)) {
      approachSigns.push({
        sequence: seq++,
        code: inp.controlMethod === 'stop_slow_bats' ? 'TC' : 'PTL',
        description: inp.controlMethod === 'stop_slow_bats'
          ? `Traffic controller position — STOP/SLOW bat (${Math.max(inp.numberOfControllers, 1)} operator${inp.numberOfControllers > 1 ? 's' : ''})`
          : inp.controlMethod === 'portable_signals'
          ? 'Portable traffic light (STOP signal) — approach head'
          : 'Police control point',
        distanceFromTaperStart: 0,
        notes: 'Position at start of taper; maintain 2 m minimum clearance from traffic',
      });

      curPos = -sightDist;
      approachSigns.push({
        sequence: seq++,
        code: 'TM1-18B',
        description: signName('PREPARE TO STOP', state),
        distanceFromTaperStart: curPos,
        notes: `Placed ${sightDist} m upstream of traffic controller (sight distance Table 2.3 — ${temp} km/h)`,
      });

      if (needsRepeaterSign) {
        approachSigns.push({
          sequence: seq++,
          code: 'TM1-18B-R',
          description: 'PREPARE TO STOP (repeater)',
          distanceFromTaperStart: curPos - 120,
          notes: `Queue estimated at ${queueLength} m — repeater required per Table 4.4(a); place 120 m upstream of first PREPARE TO STOP`,
        });
        curPos -= 120;
      }

      curPos -= approachSpacing;
      approachSigns.push({
        sequence: seq++,
        code: 'W5-2',
        description: signName('TRAFFIC CONTROLLERS AHEAD', state),
        distanceFromTaperStart: curPos,
        notes: `Spaced ${approachSpacing} m from PREPARE TO STOP sign`,
      });
    }

    if (reductionSteps.length > 0) {
      [...reductionSteps].reverse().forEach((step, idx) => {
        curPos -= approachSpacing;
        approachSigns.push({
          sequence: seq++,
          code: `R4-1(${step.to})`,
          description: idx === 0 && reductionSteps.length > 1
            ? `SPEED ${step.to} — temporary speed limit sign`
            : `SPEED ${step.to} — temporary speed limit`,
          distanceFromTaperStart: curPos,
          notes: `Speed reduced from ${step.from} to ${step.to} km/h (${step.method})`,
        });
      });

      if (reductionSteps.length > 0) {
        const firstStep = reductionSteps[0];
        curPos -= approachSpacing;
        approachSigns.push({
          sequence: seq++,
          code: `R4-1(${firstStep.to})-AHEAD`,
          description: `SPEED ${firstStep.to} AHEAD — advance warning of speed change`,
          distanceFromTaperStart: curPos,
          notes: `Placed ${approachSpacing} m before speed change sign`,
        });
      }
    }

    if (!isShoulderOnly) {
      curPos -= approachSpacing;
      const laneClosed = isAlternating
        ? 'LANE CLOSED AHEAD'
        : isFullClosure
        ? 'ROAD CLOSED AHEAD'
        : 'MERGE (arrow towards open lane)';
      approachSigns.push({
        sequence: seq++,
        code: 'W6-4',
        description: laneClosed,
        distanceFromTaperStart: curPos,
        notes: 'Direct drivers to merge into the open lane',
      });
    }

    curPos -= approachSpacing * 2;
    approachSigns.push({
      sequence: seq++,
      code: 'W6-1',
      description: signName('WORKS AHEAD', state),
      distanceFromTaperStart: curPos,
      notes: `First sign the driver encounters — placed at double sign spacing (${approachSpacing * 2} m) from next sign`,
    });

    if (inp.arrowBoard || (isLaneClosure && temp >= 60)) {
      approachSigns.push({
        sequence: seq++,
        code: 'AB',
        description: 'Arrow board — flashing directional arrow',
        distanceFromTaperStart: 0,
        notes: 'Position at start of taper, pointing toward open lane; face toward approaching traffic',
      });
    }

    approachSigns.sort((a, b) => a.distanceFromTaperStart - b.distanceFromTaperStart);
    approachSigns.forEach((s, i) => { s.sequence = i + 1; });

    // Departure signs
    seq = 1;
    let depPos = primaryTaper + bufferLength + inp.worksLength;

    if (hasTCPD && (isAlternating || isFullClosure)) {
      departureSigns.push({
        sequence: seq++,
        code: inp.controlMethod === 'stop_slow_bats' ? 'TC' : 'PTL',
        description: inp.controlMethod === 'stop_slow_bats'
          ? 'Traffic controller position — SLOW/GO bat (departure end)'
          : 'Portable traffic light — departure head',
        distanceFromTaperStart: primaryTaper + bufferLength,
        notes: 'Controls traffic exiting work zone; departs when safe to go',
      });
      depPos = primaryTaper + bufferLength + inp.worksLength + distTapers;
    }

    departureSigns.push({
      sequence: seq++,
      code: 'RW6-2',
      description: 'END ROADWORKS',
      distanceFromTaperStart: depPos,
      notes: 'Signals end of works; placed after departure taper',
    });

    if (reductionSteps.length > 0) {
      departureSigns.push({
        sequence: seq++,
        code: `R4-1(${posted})`,
        description: `SPEED ${posted} — end of temporary speed restriction`,
        distanceFromTaperStart: depPos + approachSpacing,
        notes: 'Restore posted speed limit at end of works',
      });
    }
  }

  // ── 9. Equipment list ───────────────────────────────────────────
  const equipment: EquipmentItem[] = [];

  if (!noSignSchedule) {
    const taperConeCount  = Math.ceil(primaryTaper / CONE_TAPER_SPACING) + 1;
    const bufferConeCount = Math.ceil(bufferLength / coneThru) + 1;
    const totalCones = (taperConeCount + bufferConeCount) * (isAlternating ? 2 : 1);
    equipment.push({
      item: 'Traffic cones / bollards',
      quantity: `${totalCones} minimum`,
      specification: `Min 700 mm height for temp speed ≥60 km/h; 500 mm for <60 km/h. Taper spacing: ${CONE_TAPER_SPACING} m. Buffer spacing: ${coneThru} m`,
    });

    const signCount = approachSigns.length + departureSigns.length;
    equipment.push({
      item: 'Advance warning / regulatory signs',
      quantity: `${signCount} boards`,
      specification: 'Min 900 × 900 mm for freeways/highways; 750 × 750 mm for other roads. Retro-reflective sheeting (Class 1 minimum)',
    });
  }

  if (noSignSchedule) {
    // Minimal equipment for STLI/mobile
    equipment.push({
      item: 'Shadow vehicle',
      quantity: '1 minimum',
      specification: 'Arrow board on rear; SLOW MOVING PLANT / ROAD WORKS sign; amber beacon; two-way radio',
    });
    if (['mobile_class2', 'mobile_class3', 'stli_freq_lane', 'stli_specialist'].includes(inp.worksType) ||
        ['freeway', 'highway'].includes(inp.classification)) {
      equipment.push({
        item: 'Truck Mounted Attenuator (TMA)',
        quantity: '1',
        specification: 'NCHRP 350 or MASH tested; fitted to shadow vehicle; rated for site speed',
      });
    }
    equipment.push({
      item: 'Hi-vis PPE',
      quantity: `${Math.max(inp.numberOfWorkers, 1)} sets minimum`,
      specification: 'Level 2 retroreflective vest/shirt (AS/NZS 4602.1) — all workers',
    });
  }

  if (inp.arrowBoard) {
    equipment.push({
      item: 'Arrow board',
      quantity: '1',
      specification: 'Min 1.5 m wide, 100% duty cycle; trailer-mounted for high-speed roads',
    });
  }

  if (inp.vms) {
    equipment.push({
      item: 'Variable Message Sign (VMS)',
      quantity: '1',
      specification: 'Full-matrix display; place at 2× approach sign spacing before first warning sign',
    });
  }

  if (hasTCPD && inp.controlMethod === 'stop_slow_bats' && !noSignSchedule) {
    equipment.push({
      item: 'STOP/SLOW bat (paddle)',
      quantity: `${Math.max(inp.numberOfControllers, isAlternating ? 2 : 1)}`,
      specification: 'Lollipop design, min 600 mm diameter; hi-vis vest, radio communication between controllers',
    });
  }

  if (hasTCPD && inp.controlMethod === 'portable_signals' && !noSignSchedule) {
    equipment.push({
      item: 'Portable traffic lights (PTL)',
      quantity: '2 (minimum)',
      specification: 'Interlocked pair; backup manual override; tested before deployment',
    });
  }

  if (!noSignSchedule && inp.worksLength > 200) {
    const delineatorSpacing = 60;
    const delineatorCount = Math.ceil(inp.worksLength / delineatorSpacing);
    equipment.push({
      item: 'Post-mounted delineators',
      quantity: `${delineatorCount} (at ${delineatorSpacing} m spacing)`,
      specification: 'Retro-reflective, min 1.5 m height; supplement cones for closure lengths >200 m',
    });
  }

  // ── 10. References & warnings ───────────────────────────────────
  const refs = stateStandards(state);
  const references = [
    ...refs.primary.map(r => `[Primary] ${r}`),
    ...refs.secondary.map(r => `[Supplementary] ${r}`),
    `[Design Step] ${designStepRef}`,
    'AS 1742.3:2019 — Table 2.2 (Sign spacing)',
    'AS 1742.3:2019 — Table 2.3 (Sight distances)',
    'AGTTM03-21 — Table 5.7 (Taper lengths)',
    'AGTTM03-21 — Table 5.5 (Temporary speed zones)',
  ];

  const warnings: string[] = [];
  const notes: string[] = [];

  if (qldNote) warnings.push(qldNote);

  if (state === 'WA') {
    warnings.push('WA: Portable Traffic Control Device (PTCD) mandatory on MRWA roads (July 2022). Speed Feedback Signs mandatory (Feb 2024).');
    if (inp.controlMethod === 'stop_slow_bats') {
      warnings.push('WA: Shadow vehicle required when traffic controllers deployed on roads ≥80 km/h (June 2024).');
    }
  }

  if (inp.excavations && inp.excavationDepth > 250 && inp.excavationProximity < 5) {
    warnings.push(`Excavation depth ${inp.excavationDepth} mm within ${inp.excavationProximity} m of traffic — road safety barrier required per AGTTM03 Section 3.6.`);
  }

  if (inp.geometry === 'crest' || inp.sightIssue) {
    warnings.push('Reduced sight distance due to crest/curve. Additional PREPARE TO STOP signs or pilot vehicle may be required. Consider moving worksite further from crest.');
  }

  if (inp.nearIntersection && inp.intersectionDistance < sightDist * 2) {
    warnings.push(`Worksite within ${inp.intersectionDistance} m of intersection — consult relevant road authority. Additional signs and traffic control may be required.`);
  }

  // Criteria fail warnings
  criteriaChecks.filter(c => c.status === 'fail').forEach(c => {
    warnings.push(`CRITERIA FAIL: ${c.criterion}${c.detail ? ` — ${c.detail}` : ''}`);
  });

  if (inp.footpathClosed) {
    notes.push('Footpath / shared path closed — provide pedestrian / cyclist diversion signs and suitable alternative route or temporary pathway.');
  }

  if (!noSignSchedule && temp < 60 && inp.worksLength > 500) {
    notes.push(`Temp speed zone ${temp} km/h for ${inp.worksLength} m may require risk assessment and consultation with road authority.`);
  }

  if (inp.classification === 'freeway') {
    notes.push('Freeway works require approval from road authority (RMS/VicRoads/TMR/MRWA etc.) and typically require a formal TMP sign-off prior to works commencing.');
  }

  if (inp.nightWorks) {
    notes.push('Night works: all signs and delineators must be retro-reflective Class 1 minimum. Consider additional lighting for workers.');
  }

  notes.push('All calculations are based on standard road conditions and standard lane width. A qualified Traffic Management Designer/Coordinator should review the final TMP.');

  if (!noSignSchedule) {
    notes.push(`Minimum temp speed zone length: ${minTempLen} m (Table 5.5 — ${temp} km/h).`);
  }

  if (noSignSchedule) {
    notes.push(`${designStepName}: This design step does not require a standard advance warning sign schedule. Refer to the Design Step Criteria and Mandatory Requirements sections for specific obligations.`);
  }

  return {
    designStepName,
    designStepRef,
    designStepDescription,
    criteriaChecks,
    mandatoryRequirements,
    recommendedTempSpeed: temp,
    speedReductionSteps: reductionSteps,
    tempSpeedJustification: tempRec.reason,
    approachSignSpacing:  approachSpacing,
    sightDistanceM:       sightDist,
    mergeTaperLength:     scaledMerge,
    lateralShiftTaper:    scaledLatShift,
    bufferZoneLength:     bufferLength,
    distBetweenTapers:    distTapers,
    coneSpacingM:         coneThru,
    coneSpacingTaperM:    CONE_TAPER_SPACING,
    estimatedQueueLength: queueLength,
    queueStopTimeUsed:    queueStopTime,
    prepareToStopRepeater: needsRepeaterSign,
    approachSigns,
    departureSigns,
    noSignSchedule,
    equipment,
    references,
    warnings,
    notes,
    minTempZoneLength: minTempLen,
  };
}

export type { WizardInputs, CalculationResult };
