import { useState } from 'react';
import { C } from '../../components/tokens';
import type { WizardInputs, AustralianState, RoadClassification, WorksType, ControlMethod, RoadGeometry, WeatherCondition } from './types';
import { WORKS_TYPE_LABELS } from './standards';
import { calculate } from './engine';
import type { CalculationResult } from './engine';
import { ReportView } from './ReportView';

const STEP_LABELS = ['Project', 'Road', 'Works', 'Traffic', 'Control'];
const STATES: AustralianState[] = ['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
const SPEEDS = [40, 50, 60, 70, 80, 90, 100, 110];

const defaultInputs: WizardInputs = {
  userRole: 'planner', state: 'VIC',
  projectName: '', projectRef: '', date: new Date().toISOString().split('T')[0],
  preparedBy: '', location: '',
  roadName: '', classification: 'arterial', postedSpeed: 60,
  lanesInDirection: 1, laneWidth: 3.5, medianDivided: false,
  geometry: 'straight', curveRadius: 0, sightIssue: false,
  worksType: 'lane_closure_2lane', worksDescription: '', worksLength: 50,
  duration: 'day_works', nightWorks: false,
  workersOnFoot: true, numberOfWorkers: 2, workerProximity: 2,
  plantOnSite: false, plantProximity: 3,
  excavations: false, excavationDepth: 0, excavationProximity: 0,
  freshBitumen: false, footpathClosed: false,
  peakHourVolume: 500, heavyVehiclePercent: 10,
  weather: 'clear', visibility: 'good',
  nearIntersection: false, intersectionDistance: 0,
  controlMethod: 'stop_slow_bats', numberOfControllers: 2,
  arrowBoard: false, vms: false, overrideTemp: false, manualTempSpeed: 40,
};

// ── Input helpers ──────────────────────────────────────────────────

const fieldLabel: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 700,
  color: 'var(--ink-500)', letterSpacing: '0.07em', textTransform: 'uppercase',
  marginBottom: 6,
};
const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid var(--border-default)',
  borderRadius: 8, background: 'var(--bg-surface)', color: 'var(--fg-default)',
  fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
};
const hintStyle: React.CSSProperties = {
  fontSize: 12, color: 'var(--fg-subtle)', marginTop: 4,
};

function Field({ label, hint, children, half }: {
  label: string; hint?: string; children: React.ReactNode; half?: boolean;
}) {
  return (
    <div style={{ marginBottom: 20, width: half ? 'calc(50% - 8px)' : '100%' }}>
      <label style={fieldLabel}>{label}</label>
      {children}
      {hint && <div style={hintStyle}>{hint}</div>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <input type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)} style={inputBase} />
  );
}

function NumInput({ value, onChange, min, max, step = 1 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number;
}) {
  return (
    <input type="number" value={value} min={min} max={max} step={step}
      onChange={e => onChange(parseFloat(e.target.value) || 0)} style={inputBase} />
  );
}

function SelectField<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as T)} style={inputBase}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Toggle({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <button type="button" onClick={() => onChange(!checked)} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
    }}>
      <div style={{
        width: 40, height: 22, borderRadius: 11, flexShrink: 0,
        background: checked ? C.hivis : C.steel200,
        position: 'relative', transition: 'background 0.15s',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff', transition: 'left 0.15s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        }}/>
      </div>
      <span style={{ fontSize: 14, color: 'var(--fg-default)', fontWeight: 500 }}>{label}</span>
    </button>
  );
}

function CardPicker<T extends string>({ value, onChange, options, cols = 4 }: {
  value: T; onChange: (v: T) => void;
  options: Array<{ value: T; label: string; sub?: string }>;
  cols?: number;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
      {options.map(o => {
        const active = value === o.value;
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)} style={{
            padding: '10px 8px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
            border: active ? `2px solid ${C.hivis}` : '1.5px solid var(--border-default)',
            background: active ? '#FFF3E9' : 'var(--bg-surface)',
            fontFamily: 'inherit',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: active ? C.hivis : 'var(--fg-default)' }}>{o.label}</div>
            {o.sub && <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 2 }}>{o.sub}</div>}
          </button>
        );
      })}
    </div>
  );
}

function SpeedPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {SPEEDS.map(s => {
        const active = value === s;
        return (
          <button key={s} type="button" onClick={() => onChange(s)} style={{
            width: 56, height: 44, borderRadius: 8, cursor: 'pointer',
            border: active ? `2px solid ${C.hivis}` : '1.5px solid var(--border-default)',
            background: active ? C.hivis : 'var(--bg-surface)',
            color: active ? C.ink900 : 'var(--fg-default)',
            fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
          }}>{s}</button>
        );
      })}
    </div>
  );
}

function RowPair({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>{children}</div>;
}

function Divider({ label }: { label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 20px' }}>
      {label && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }}/>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────────

function Step1({ inp, set }: { inp: WizardInputs; set: <K extends keyof WizardInputs>(k: K, v: WizardInputs[K]) => void }) {
  return (
    <>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>Project &amp; Role</h2>
      <p style={{ margin: '0 0 28px', color: 'var(--fg-subtle)', fontSize: 14 }}>
        Tell us who is using this tool and basic project details.
      </p>

      <Field label="I am a…">
        <CardPicker<'planner' | 'controller'>
          value={inp.userRole} onChange={v => set('userRole', v)} cols={2}
          options={[
            { value: 'planner', label: 'Traffic Management Planner', sub: 'Office — designing a TMP' },
            { value: 'controller', label: 'Traffic Controller', sub: 'On site — setting up TC' },
          ]}
        />
      </Field>

      <Field label="State / Territory">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATES.map(s => {
            const active = inp.state === s;
            return (
              <button key={s} type="button" onClick={() => set('state', s)} style={{
                padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                border: active ? `2px solid ${C.hivis}` : '1.5px solid var(--border-default)',
                background: active ? C.hivis : 'var(--bg-surface)',
                color: active ? C.ink900 : 'var(--fg-default)',
                fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              }}>{s}</button>
            );
          })}
        </div>
      </Field>

      <Divider label="Project details" />
      <RowPair>
        <Field label="Project Name" half>
          <TextInput value={inp.projectName} onChange={v => set('projectName', v)} placeholder="e.g. Smith St Resurfacing" />
        </Field>
        <Field label="Project Reference" half>
          <TextInput value={inp.projectRef} onChange={v => set('projectRef', v)} placeholder="e.g. TMP-2025-042" />
        </Field>
      </RowPair>
      <RowPair>
        <Field label="Date" half>
          <TextInput value={inp.date} onChange={v => set('date', v)} type="date" />
        </Field>
        <Field label="Prepared By" half>
          <TextInput value={inp.preparedBy} onChange={v => set('preparedBy', v)} placeholder="Full name" />
        </Field>
      </RowPair>
      <Field label="Location / Address">
        <TextInput value={inp.location} onChange={v => set('location', v)} placeholder="Street address or locality" />
      </Field>
    </>
  );
}

function Step2({ inp, set }: { inp: WizardInputs; set: <K extends keyof WizardInputs>(k: K, v: WizardInputs[K]) => void }) {
  return (
    <>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>Road Details</h2>
      <p style={{ margin: '0 0 28px', color: 'var(--fg-subtle)', fontSize: 14 }}>
        Describe the road where works will take place.
      </p>

      <RowPair>
        <Field label="Road Name" half>
          <TextInput value={inp.roadName} onChange={v => set('roadName', v)} placeholder="e.g. Smith Street" />
        </Field>
        <Field label="Road Classification" half>
          <SelectField<RoadClassification>
            value={inp.classification} onChange={v => set('classification', v)}
            options={[
              { value: 'freeway', label: 'Freeway / Motorway' },
              { value: 'highway', label: 'Highway' },
              { value: 'arterial', label: 'Arterial Road' },
              { value: 'collector', label: 'Collector Road' },
              { value: 'local', label: 'Local Street' },
            ]}
          />
        </Field>
      </RowPair>

      <Field label="Posted Speed Limit (km/h)"
        hint="The current permanent speed limit on this road">
        <SpeedPicker value={inp.postedSpeed} onChange={v => set('postedSpeed', v)} />
      </Field>

      <Divider label="Lane configuration" />
      <RowPair>
        <Field label="Lanes in direction of travel" half
          hint="Through the work zone — typically 1 for 2-lane roads">
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4].map(n => {
              const active = inp.lanesInDirection === n;
              return (
                <button key={n} type="button" onClick={() => set('lanesInDirection', n)} style={{
                  width: 48, height: 40, borderRadius: 8, cursor: 'pointer',
                  border: active ? `2px solid ${C.hivis}` : '1.5px solid var(--border-default)',
                  background: active ? C.hivis : 'var(--bg-surface)',
                  color: active ? C.ink900 : 'var(--fg-default)',
                  fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
                }}>{n}</button>
              );
            })}
          </div>
        </Field>
        <Field label="Lane Width (m)" half hint="Default is 3.5 m — adjust if actual width differs">
          <NumInput value={inp.laneWidth} onChange={v => set('laneWidth', v)} min={2.5} max={5} step={0.1} />
        </Field>
      </RowPair>

      <div style={{ marginBottom: 20 }}>
        <Toggle checked={inp.medianDivided} onChange={v => set('medianDivided', v)} label="Median / divided road (central median or barrier)" />
      </div>

      <Divider label="Geometry &amp; sight distance" />
      <Field label="Road Geometry">
        <CardPicker<RoadGeometry>
          value={inp.geometry} onChange={v => set('geometry', v)} cols={3}
          options={[
            { value: 'straight', label: 'Straight', sub: 'No geometry issues' },
            { value: 'curve', label: 'Curve / Bend', sub: 'Horizontal curve' },
            { value: 'crest', label: 'Crest', sub: 'Vertical crest' },
          ]}
        />
      </Field>

      {inp.geometry === 'curve' && (
        <Field label="Curve Radius (m)" hint="Minimum radius of horizontal curve through or near the site">
          <NumInput value={inp.curveRadius} onChange={v => set('curveRadius', v)} min={0} />
        </Field>
      )}

      <Toggle checked={inp.sightIssue} onChange={v => set('sightIssue', v)}
        label="Sight distance is restricted (crest, bend, obstruction or parking)" />
    </>
  );
}

function Step3({ inp, set }: { inp: WizardInputs; set: <K extends keyof WizardInputs>(k: K, v: WizardInputs[K]) => void }) {
  return (
    <>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>Works Details</h2>
      <p style={{ margin: '0 0 28px', color: 'var(--fg-subtle)', fontSize: 14 }}>
        Describe the scope of works and site hazards.
      </p>

      <Field label="Type of Works">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {(Object.entries(WORKS_TYPE_LABELS) as Array<[WorksType, string]>).map(([v, label]) => {
            const active = inp.worksType === v;
            return (
              <button key={v} type="button" onClick={() => set('worksType', v)} style={{
                padding: '10px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                border: active ? `2px solid ${C.hivis}` : '1.5px solid var(--border-default)',
                background: active ? '#FFF3E9' : 'var(--bg-surface)',
                fontFamily: 'inherit', fontSize: 13, fontWeight: active ? 700 : 500,
                color: active ? C.hivis : 'var(--fg-default)',
              }}>{label}</button>
            );
          })}
        </div>
      </Field>

      <RowPair>
        <Field label="Works Length (m)" half hint="Total length of the work zone">
          <NumInput value={inp.worksLength} onChange={v => set('worksLength', v)} min={1} />
        </Field>
        <Field label="Duration" half>
          <SelectField<'short_term' | 'day_works' | 'night_works' | 'multi_day'>
            value={inp.duration} onChange={v => set('duration', v)}
            options={[
              { value: 'short_term', label: 'Short term (<1 hour)' },
              { value: 'day_works', label: 'Day works' },
              { value: 'night_works', label: 'Night works' },
              { value: 'multi_day', label: 'Multi-day / ongoing' },
            ]}
          />
        </Field>
      </RowPair>

      <Field label="Works Description" hint="Brief description for the report">
        <textarea value={inp.worksDescription} onChange={e => set('worksDescription', e.target.value)}
          placeholder="e.g. Pavement rehabilitation, lane 1 closed, kerb replacement..." rows={3}
          style={{ ...inputBase, resize: 'vertical' as const }} />
      </Field>

      <Divider label="Site hazards &amp; conditions" />

      <div style={{ marginBottom: 16 }}>
        <Toggle checked={inp.nightWorks} onChange={v => set('nightWorks', v)} label="Night works (between sunset and sunrise)" />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Toggle checked={inp.freshBitumen} onChange={v => set('freshBitumen', v)} label="Fresh bitumen / seal coat present" />
      </div>
      <div style={{ marginBottom: 20 }}>
        <Toggle checked={inp.footpathClosed} onChange={v => set('footpathClosed', v)} label="Footpath / shared path will be closed" />
      </div>

      <Divider label="Workers &amp; plant" />

      <div style={{ marginBottom: 12 }}>
        <Toggle checked={inp.workersOnFoot} onChange={v => set('workersOnFoot', v)} label="Workers on foot within or adjacent to the work zone" />
      </div>
      {inp.workersOnFoot && (
        <RowPair>
          <Field label="Number of Workers" half>
            <NumInput value={inp.numberOfWorkers} onChange={v => set('numberOfWorkers', v)} min={0} />
          </Field>
          <Field label="Closest Worker to Live Traffic (m)" half
            hint="Perpendicular distance from nearest moving lane">
            <NumInput value={inp.workerProximity} onChange={v => set('workerProximity', v)} min={0} step={0.1} />
          </Field>
        </RowPair>
      )}

      <div style={{ marginBottom: 12 }}>
        <Toggle checked={inp.plantOnSite} onChange={v => set('plantOnSite', v)} label="Plant / machinery operating near live traffic" />
      </div>
      {inp.plantOnSite && (
        <Field label="Closest Plant to Live Traffic (m)" half
          hint="Perpendicular distance from nearest moving lane edge">
          <NumInput value={inp.plantProximity} onChange={v => set('plantProximity', v)} min={0} step={0.1} />
        </Field>
      )}

      <div style={{ marginBottom: 12 }}>
        <Toggle checked={inp.excavations} onChange={v => set('excavations', v)} label="Excavations within the work zone" />
      </div>
      {inp.excavations && (
        <RowPair>
          <Field label="Excavation Depth (mm)" half>
            <NumInput value={inp.excavationDepth} onChange={v => set('excavationDepth', v)} min={0} />
          </Field>
          <Field label="Excavation Distance from Traffic (m)" half>
            <NumInput value={inp.excavationProximity} onChange={v => set('excavationProximity', v)} min={0} step={0.1} />
          </Field>
        </RowPair>
      )}
    </>
  );
}

function Step4({ inp, set }: { inp: WizardInputs; set: <K extends keyof WizardInputs>(k: K, v: WizardInputs[K]) => void }) {
  return (
    <>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>Traffic &amp; Environment</h2>
      <p style={{ margin: '0 0 28px', color: 'var(--fg-subtle)', fontSize: 14 }}>
        Traffic volumes and environmental conditions affect speed zone requirements and queue calculations.
      </p>

      <RowPair>
        <Field label="Peak Hour Volume (vph)" half hint="Total vehicles per hour, both directions combined">
          <NumInput value={inp.peakHourVolume} onChange={v => set('peakHourVolume', v)} min={0} />
        </Field>
        <Field label="Heavy Vehicle %" half hint="Trucks, buses and semi-trailers">
          <NumInput value={inp.heavyVehiclePercent} onChange={v => set('heavyVehiclePercent', v)} min={0} max={100} />
        </Field>
      </RowPair>

      <Divider label="Weather conditions" />

      <Field label="Weather">
        <CardPicker<WeatherCondition>
          value={inp.weather} onChange={v => set('weather', v)} cols={4}
          options={[
            { value: 'clear', label: 'Clear' },
            { value: 'rain', label: 'Rain' },
            { value: 'fog', label: 'Fog' },
            { value: 'high_wind', label: 'High Wind' },
          ]}
        />
      </Field>

      <Field label="Visibility">
        <CardPicker<'good' | 'reduced' | 'poor'>
          value={inp.visibility} onChange={v => set('visibility', v)} cols={3}
          options={[
            { value: 'good', label: 'Good', sub: '>200 m clear' },
            { value: 'reduced', label: 'Reduced', sub: '100–200 m' },
            { value: 'poor', label: 'Poor', sub: '<100 m' },
          ]}
        />
      </Field>

      <Divider label="Surrounding environment" />

      <div style={{ marginBottom: 12 }}>
        <Toggle checked={inp.nearIntersection} onChange={v => set('nearIntersection', v)} label="Works are near an intersection" />
      </div>
      {inp.nearIntersection && (
        <Field label="Distance to Intersection (m)" half>
          <NumInput value={inp.intersectionDistance} onChange={v => set('intersectionDistance', v)} min={0} />
        </Field>
      )}
    </>
  );
}

function Step5({ inp, set }: { inp: WizardInputs; set: <K extends keyof WizardInputs>(k: K, v: WizardInputs[K]) => void }) {
  return (
    <>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>Traffic Control Method</h2>
      <p style={{ margin: '0 0 28px', color: 'var(--fg-subtle)', fontSize: 14 }}>
        How will traffic be managed through or around the work zone?
      </p>

      <Field label="Control Method">
        <CardPicker<ControlMethod>
          value={inp.controlMethod} onChange={v => set('controlMethod', v)} cols={2}
          options={[
            { value: 'none', label: 'No Control', sub: 'Signs only (shoulder/verge)' },
            { value: 'stop_slow_bats', label: 'STOP/SLOW Bats', sub: 'Traffic controllers with paddle' },
            { value: 'portable_signals', label: 'Portable Signals', sub: 'Temporary traffic lights' },
            { value: 'pilot_vehicle', label: 'Pilot Vehicle', sub: 'Lead vehicle convoy' },
            { value: 'police', label: 'Police Control', sub: 'Sworn officer direction' },
          ]}
        />
      </Field>

      {(inp.controlMethod === 'stop_slow_bats' || inp.controlMethod === 'portable_signals' || inp.controlMethod === 'police') && (
        <Field label="Number of Traffic Controllers" half>
          <NumInput value={inp.numberOfControllers} onChange={v => set('numberOfControllers', v)} min={1} />
        </Field>
      )}

      <Divider label="Equipment" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Toggle checked={inp.arrowBoard} onChange={v => set('arrowBoard', v)} label="Arrow board deployed at taper" />
        <Toggle checked={inp.vms} onChange={v => set('vms', v)} label="Variable Message Sign (VMS) in advance" />
      </div>

      <Divider label="Speed zone override" />
      <div style={{ marginBottom: 12 }}>
        <Toggle checked={inp.overrideTemp} onChange={v => set('overrideTemp', v)}
          label="Override recommended temp speed (manual entry)" />
      </div>
      {inp.overrideTemp && (
        <Field label="Manual Temp Speed (km/h)"
          hint="Override only if you have completed a risk assessment justifying a different speed">
          <SpeedPicker value={inp.manualTempSpeed} onChange={v => set('manualTempSpeed', v)} />
        </Field>
      )}
    </>
  );
}

// ── Main component ──────────────────────────────────────────────

export function CalculatorApp() {
  const [step, setStep] = useState(1);
  const [inp, setInp] = useState<WizardInputs>(defaultInputs);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const set = <K extends keyof WizardInputs>(k: K, v: WizardInputs[K]) =>
    setInp(prev => ({ ...prev, [k]: v }));

  if (result) {
    return <ReportView result={result} inputs={inp} onBack={() => setResult(null)} />;
  }

  const goNext = () => {
    if (step < 5) setStep(s => s + 1);
    else setResult(calculate(inp));
  };
  const goBack = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 inp={inp} set={set} />;
      case 2: return <Step2 inp={inp} set={set} />;
      case 3: return <Step3 inp={inp} set={set} />;
      case 4: return <Step4 inp={inp} set={set} />;
      case 5: return <Step5 inp={inp} set={set} />;
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--bg-app)', fontFamily: 'var(--font-ui)',
    }}>

      {/* Step progress bar */}
      <div style={{
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)',
        padding: '16px 32px', flexShrink: 0,
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const done = n < step;
              const active = n === step;
              return (
                <div key={n} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? C.go : active ? C.hivis : 'var(--border-default)',
                      color: done || active ? '#fff' : 'var(--fg-subtle)',
                      fontSize: 13, fontWeight: 700,
                      transition: 'background 0.2s',
                    }}>
                      {done ? '✓' : n}
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: active ? 700 : 500,
                      color: active ? C.hivis : done ? 'var(--fg-default)' : 'var(--fg-subtle)',
                      display: 'none',
                      ['@media (min-width: 600px)' as string]: { display: 'inline' },
                    }}>{label}</span>
                    <span style={{
                      fontSize: 13, fontWeight: active ? 700 : 500,
                      color: active ? C.hivis : done ? 'var(--fg-default)' : 'var(--fg-subtle)',
                    }}>{label}</span>
                  </div>
                  {n < STEP_LABELS.length && (
                    <div style={{
                      flex: 1, height: 2, margin: '0 8px',
                      background: done ? C.go : 'var(--border-default)',
                      transition: 'background 0.2s',
                    }}/>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable form content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '32px 32px 16px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {renderStep()}
        </div>
      </div>

      {/* Navigation footer */}
      <div style={{
        background: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)',
        padding: '16px 32px', flexShrink: 0,
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={goBack} style={{
            padding: '10px 24px', borderRadius: 8, border: '1.5px solid var(--border-default)',
            background: 'var(--bg-surface)', color: 'var(--fg-default)',
            fontSize: 14, fontWeight: 700, cursor: step === 1 ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', opacity: step === 1 ? 0.4 : 1,
          }} disabled={step === 1}>← Back</button>

          <span style={{ fontSize: 13, color: 'var(--fg-subtle)' }}>
            Step {step} of {STEP_LABELS.length}
          </span>

          <button type="button" onClick={goNext} style={{
            padding: '10px 28px', borderRadius: 8, border: 'none',
            background: step === 5 ? C.go : C.hivis,
            color: step === 5 ? '#fff' : C.ink900,
            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {step === 5 ? '⚡ Calculate' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
