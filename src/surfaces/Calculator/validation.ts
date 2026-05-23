import { z } from 'zod';
import type { WizardInputs } from './types';

export type ValidationErrors = Record<string, string>;

const Step2Schema = z.object({
  laneWidth: z.number().min(2.5, 'Minimum 2.5 m').max(6.0, 'Maximum 6.0 m'),
  curveRadius: z.number().optional(),
});

const Step3Schema = z.object({
  worksLength: z.number().min(1, 'Minimum 1 m').max(50000, 'Maximum 50,000 m'),
  workerProximity: z.number().min(0, 'Must be ≥ 0 m').optional(),
  plantProximity: z.number().min(0, 'Must be ≥ 0 m').optional(),
});

const Step4Schema = z.object({
  peakHourVolume: z.number().min(0, 'Min 0').max(10000, 'Max 10,000 vph'),
  heavyVehiclePercent: z.number().min(0, 'Min 0%').max(100, 'Max 100%'),
});

export function validateStep(step: number, inp: WizardInputs): ValidationErrors {
  const errors: ValidationErrors = {};

  const addZodErrors = (schema: z.ZodSchema, data: unknown) => {
    const res = schema.safeParse(data);
    if (!res.success) {
      for (const issue of res.error.issues) {
        const key = String(issue.path[0] ?? '');
        if (key && !(key in errors)) errors[key] = issue.message;
      }
    }
  };

  switch (step) {
    case 2:
      addZodErrors(Step2Schema, {
        laneWidth: inp.laneWidth,
        curveRadius: inp.geometry === 'curve' ? inp.curveRadius : undefined,
      });
      if (inp.geometry === 'curve' && inp.curveRadius <= 0) {
        errors.curveRadius = 'Enter a curve radius greater than 0 m';
      }
      if (inp.postedSpeed < 10 || inp.postedSpeed > 130) {
        errors.postedSpeed = 'Speed must be between 10 and 130 km/h';
      }
      break;

    case 3:
      addZodErrors(Step3Schema, {
        worksLength: inp.worksLength,
        workerProximity: inp.workersOnFoot ? inp.workerProximity : undefined,
        plantProximity: inp.plantOnSite ? inp.plantProximity : undefined,
      });
      if (inp.excavations && inp.excavationDepth <= 0) {
        errors.excavationDepth = 'Enter excavation depth > 0 mm';
      }
      break;

    case 4:
      addZodErrors(Step4Schema, {
        peakHourVolume: inp.peakHourVolume,
        heavyVehiclePercent: inp.heavyVehiclePercent,
      });
      break;

    case 5:
      if (['stop_slow_bats', 'police'].includes(inp.controlMethod) && inp.numberOfControllers < 1) {
        errors.numberOfControllers = 'At least 1 controller required';
      }
      if (inp.overrideTemp && (inp.manualTempSpeed < 10 || inp.manualTempSpeed > 110)) {
        errors.manualTempSpeed = 'Override speed must be 10–110 km/h';
      }
      break;
  }

  return errors;
}
