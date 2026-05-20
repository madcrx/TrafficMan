import {
  useState, useRef, useEffect, useCallback, memo, lazy, Suspense,
  createContext, useContext, useId,
} from 'react';
import { C } from '../../components/tokens';
import type {
  WizardInputs, AustralianState, RoadClassification, WorksType, WorksCategory,
  ControlMethod, RoadGeometry, WeatherCondition,
} from './types';
import { WORKS_TYPE_LABELS, DESIGN_STEPS, suggestStopTime } from './standards';
import { calculate } from './engine';
import type { CalculationResult } from './engine';

const ReportView = lazy(() => import('./ReportView').then(m => ({ default: m.ReportView })));

const STEP_LABELS = ['Project', 'Road', 'Works', 'Traffic', 'Control'];
const STATES: AustralianState[] = ['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
const SPEEDS = [40, 50, 60, 70, 80, 90, 100, 110];
const HISTORY_KEY = 'tm-calc-history';
const HISTORY_MAX = 50;

const defaultInputs: WizardInputs = {
  userRole: 'planner', state: 'VIC',
  projectName: '', projectRef: '', date: new Date().toISOString().split('T')[0],
  preparedBy: '', location: '', lat: undefined, lng: undefined,
  roadName: '', classification: 'arterial', postedSpeed: 60,
  lanesInDirection: 1, laneWidth: 3.5, medianDivided: false, medianWidth: 0,
  geometry: 'straight', curveRadius: 0, sightIssue: false,
  worksCategory: 'static', worksType: 'past_lane_closure',
  worksDescription: '', worksLength: 50,
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
  maxStopTime: 0,
};

export interface HistoryEntry {
  id: number;
  timestamp: string;
  inputs: WizardInputs;
  result: CalculationResult;
}

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch { return []; }
}

function saveHistory(entries: HistoryEntry[]): void {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(entries)); } catch { /* quota */ }
}

function exportHistory(history: HistoryEntry[]): void {
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trafficman-history-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function isValidHistoryEntry(e: unknown): e is HistoryEntry {
  if (!e || typeof e !== 'object') return false;
  const entry = e as Record<string, unknown>;
  return (
    typeof entry.id === 'number' &&
    typeof entry.timestamp === 'string' &&
    entry.inputs !== null && typeof entry.inputs === 'object' &&
    entry.result !== null && typeof entry.result === 'object'
  );
}

// ── Field id context — associates label with first input inside Field ──
const FieldIdCtx = createContext<string>('');

// ── Styles ────────────────────────────────────────────────────────

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

// ── Input helpers ─────────────────────────────────────────────────

function Field({ label, hint, children, half }: {
  label: string; hint?: string; children: React.ReactNode; half?: boolean;
}) {
  const id = useId();
  return (
    <FieldIdCtx.Provider value={id}>
      <div style={{ marginBottom: 20, width: half ? 'calc(50% - 8px)' : '100%' }}>
        <label htmlFor={id} style={fieldLabel}>{label}</label>
        {children}
        {hint && <div style={hintStyle}>{hint}</div>}
      </div>
    </FieldIdCtx.Provider>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  const id = useContext(FieldIdCtx);
  return (
    <input id={id} type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)} style={inputBase} />
  );
}

function NumInput({ value, onChange, min, max, step = 1 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number;
}) {
  const id = useContext(FieldIdCtx);
  return (
    <input id={id} type="number" value={value} min={min} max={max} step={step}
      onChange={e => {
        const parsed = parseFloat(e.target.value);
        onChange(Number.isFinite(parsed) ? parsed : 0);
      }} style={inputBase} />
  );
}

// Accessible combobox with keyboard navigation
function Combobox<T extends string>({ value, onChange, options }: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  const id = useContext(FieldIdCtx);
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = options.find(o => o.value === value);
  const filtered = query.trim()
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => { if (!open) { setQuery(''); setActiveIdx(-1); } }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectItem = (v: T) => { onChange(v); setOpen(false); inputRef.current?.focus(); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        setOpen(true); setActiveIdx(0); e.preventDefault();
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); e.preventDefault(); break;
      case 'ArrowUp':
        setActiveIdx(i => Math.max(i - 1, 0)); e.preventDefault(); break;
      case 'Enter':
        if (activeIdx >= 0 && filtered[activeIdx]) selectItem(filtered[activeIdx].value);
        e.preventDefault(); break;
      case 'Escape':
        setOpen(false); e.preventDefault(); break;
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && activeIdx >= 0 ? `${listId}-${activeIdx}` : undefined}
        value={open ? query : (current?.label ?? '')}
        placeholder="Type to search…"
        onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); setActiveIdx(0); setOpen(true); }}
        onKeyDown={handleKeyDown}
        style={{ ...inputBase, cursor: 'pointer', paddingRight: 36 }}
      />
      <div aria-hidden="true" style={{
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        pointerEvents: 'none', color: 'var(--fg-subtle)', fontSize: 12,
      }}>▼</div>
      {open && filtered.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Options"
          style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
            background: 'var(--bg-surface)', border: '1.5px solid var(--border-default)',
            borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            maxHeight: 240, overflowY: 'auto', marginTop: 4, listStyle: 'none',
            padding: 0,
          }}>
          {filtered.map((o, idx) => {
            const selected = o.value === value;
            const focused = idx === activeIdx;
            return (
              <li
                key={o.value}
                id={`${listId}-${idx}`}
                role="option"
                aria-selected={selected}
                onMouseDown={() => selectItem(o.value)}
                onMouseEnter={() => setActiveIdx(idx)}
                style={{
                  padding: '10px 14px', cursor: 'pointer', fontSize: 14,
                  background: focused ? '#FFF3E9' : selected ? '#FFF3E9' : 'transparent',
                  color: selected ? C.hivis : 'var(--fg-default)',
                  fontWeight: selected ? 700 : 400,
                  outline: focused ? `2px solid ${C.hivis}` : 'none',
                  outlineOffset: -2,
                }}
              >
                {o.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, label }: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      aria-pressed={checked}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
      }}>
      <div aria-hidden="true" style={{
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
    <div role="group" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
      {options.map(o => {
        const active = value === o.value;
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            aria-pressed={active}
            style={{
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
    <div role="group" aria-label="Speed options" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {SPEEDS.map(s => {
        const active = value === s;
        return (
          <button key={s} type="button" onClick={() => onChange(s)}
            aria-pressed={active}
            style={{
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
      <div aria-hidden="true" style={{ flex: 1, height: 1, background: 'var(--border-default)' }}/>
    </div>
  );
}

// ── Steps (memoized to prevent cross-step re-renders) ─────────────

type SetFn = <K extends keyof WizardInputs>(k: K, v: WizardInputs[K]) => void;

const Step1 = memo(function Step1({ inp, set }: { inp: WizardInputs; set: SetFn }) {
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [geoDisplay, setGeoDisplay] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    const q = inp.location.trim();
    if (q.length < 3) {
      setGeoStatus('idle');
      setGeoDisplay(null);
      setGeoError(null);
      return;
    }
    const controller = new AbortController();
    setGeoStatus('loading');
    const timer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=au`;
        const resp = await fetch(url, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        });
        const data = await resp.json() as Array<{ lat: string; lon: string; display_name: string }>;
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          set('lat', lat);
          set('lng', lng);
          setGeoDisplay(data[0].display_name);
          setGeoStatus('ok');
          setGeoError(null);
        } else {
          set('lat', undefined);
          set('lng', undefined);
          setGeoStatus('error');
          setGeoError('Location not found — try a more specific address or suburb');
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setGeoStatus('error');
        setGeoError('Could not reach geocoding service — check network connection');
      }
    }, 700);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [inp.location, set]);

  const mapUrl = inp.lat != null && inp.lng != null
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${inp.lng - 0.012},${inp.lat - 0.008},${inp.lng + 0.012},${inp.lat + 0.008}&layer=mapnik&marker=${inp.lat},${inp.lng}`
    : null;

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
        <div role="group" aria-label="State or Territory" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATES.map(s => {
            const active = inp.state === s;
            return (
              <button key={s} type="button" onClick={() => set('state', s)}
                aria-pressed={active}
                style={{
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

      <Field label="Location / Address" hint="Australian address or suburb — geocoded automatically">
        <div style={{ position: 'relative' }}>
          <TextInput value={inp.location} onChange={v => set('location', v)} placeholder="e.g. 123 Smith Street, Melbourne VIC" />
          {geoStatus === 'loading' && (
            <div aria-hidden="true" style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 12, color: 'var(--fg-subtle)',
            }}>⏳</div>
          )}
          {geoStatus === 'ok' && (
            <div aria-hidden="true" style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              fontSize: 14, color: '#28A745',
            }}>✓</div>
          )}
        </div>
      </Field>

      {geoStatus === 'error' && geoError && (
        <div role="alert" style={{
          marginTop: -12, marginBottom: 16, padding: '6px 12px', borderRadius: 6,
          background: '#FFF5F5', border: '1px solid #F5C6CB',
          fontSize: 12, color: '#721C24',
        }}>{geoError}</div>
      )}

      {geoStatus === 'ok' && inp.lat != null && inp.lng != null && (
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 12, color: 'var(--fg-subtle)', flex: 1, lineHeight: 1.4 }}>
              {geoDisplay}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
              color: C.hivis, flexShrink: 0,
              background: '#FFF3E9', padding: '3px 10px', borderRadius: 6,
            }}>
              {inp.lat.toFixed(5)}°, {inp.lng.toFixed(5)}°
            </span>
          </div>
          <iframe
            src={mapUrl!}
            title="Location map preview"
            width="100%"
            height="220"
            loading="lazy"
            style={{
              border: '1.5px solid var(--border-default)', borderRadius: 10,
              display: 'block',
            }}
          />
          <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 5 }}>
            Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>OpenStreetMap</a> contributors
          </div>
        </div>
      )}
    </>
  );
});

const Step2 = memo(function Step2({ inp, set }: { inp: WizardInputs; set: SetFn }) {
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
          <Combobox<RoadClassification>
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

      <Field label="Posted Speed Limit (km/h)" hint="The current permanent speed limit on this road">
        <SpeedPicker value={inp.postedSpeed} onChange={v => set('postedSpeed', v)} />
      </Field>

      <Divider label="Lane configuration" />
      <RowPair>
        <Field label="Lanes in direction of travel" half hint="Through the work zone — typically 1 for 2-lane roads">
          <div role="group" aria-label="Number of lanes" style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4].map(n => {
              const active = inp.lanesInDirection === n;
              return (
                <button key={n} type="button" onClick={() => set('lanesInDirection', n)}
                  aria-pressed={active}
                  style={{
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

      <div style={{ marginBottom: 12 }}>
        <Toggle checked={inp.medianDivided} onChange={v => set('medianDivided', v)} label="Median / divided road (central median or barrier)" />
      </div>
      {inp.medianDivided && (
        <Field label="Median Width (m)" half hint="Physical width of median — used for contraflow eligibility (≥6 m required for Contraflow Around)">
          <NumInput value={inp.medianWidth} onChange={v => set('medianWidth', v)} min={0} max={50} step={0.5} />
        </Field>
      )}

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
          <NumInput value={inp.curveRadius} onChange={v => set('curveRadius', v)} min={0} max={5000} />
        </Field>
      )}

      <Toggle checked={inp.sightIssue} onChange={v => set('sightIssue', v)}
        label="Sight distance is restricted (crest, bend, obstruction or parking)" />
    </>
  );
});

const CATEGORY_INFO: Record<WorksCategory, { label: string; sub: string; ref: string }> = {
  static:  { label: 'Static Worksite', sub: 'Fixed location — Around, Through or Past', ref: 'AGTTM Part 3' },
  mobile:  { label: 'Mobile Works', sub: 'Plant/workers moving along road', ref: 'AGTTM Part 4' },
  stli:    { label: 'Short Term Low Impact', sub: 'In-lane or outside-lane, brief duration', ref: 'AGTTM Part 5' },
};

const Step3 = memo(function Step3({ inp, set }: { inp: WizardInputs; set: SetFn }) {
  const [search, setSearch] = useState('');

  const categorySteps = DESIGN_STEPS.filter(s => s.category === inp.worksCategory);
  const filteredSteps = search.trim()
    ? DESIGN_STEPS.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.subcategory.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
      )
    : categorySteps;

  const subcategories = [...new Set(filteredSteps.map(s => s.subcategory))];

  return (
    <>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>Works Details</h2>
      <p style={{ margin: '0 0 28px', color: 'var(--fg-subtle)', fontSize: 14 }}>
        Select the AGTTM design step that best matches your worksite.
      </p>

      <Field label="Works Category">
        <div role="group" aria-label="Works category" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {(Object.entries(CATEGORY_INFO) as Array<[WorksCategory, typeof CATEGORY_INFO[WorksCategory]]>).map(([cat, info]) => {
            const active = inp.worksCategory === cat;
            return (
              <button key={cat} type="button"
                aria-pressed={active}
                onClick={() => {
                  set('worksCategory', cat);
                  setSearch('');
                  const first = DESIGN_STEPS.find(s => s.category === cat);
                  if (first) set('worksType', first.type);
                }} style={{
                  padding: '14px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  border: active ? `2px solid ${C.hivis}` : '1.5px solid var(--border-default)',
                  background: active ? '#FFF3E9' : 'var(--bg-surface)',
                  fontFamily: 'inherit',
                }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: active ? C.hivis : 'var(--fg-default)' }}>{info.label}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 3 }}>{info.sub}</div>
                <div style={{ fontSize: 10, color: C.hivis, marginTop: 4, fontWeight: 700 }}>{info.ref}</div>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Design Step">
        <div style={{ marginBottom: 10, position: 'relative' }}>
          <label htmlFor="design-step-search" style={{ ...fieldLabel, position: 'absolute', left: -9999 }}>
            Search design steps
          </label>
          <input
            id="design-step-search"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search all design steps…"
            aria-label="Search design steps"
            style={{ ...inputBase, paddingLeft: 40 }}
          />
          <span aria-hidden="true" style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--fg-subtle)', fontSize: 16, pointerEvents: 'none',
          }}>🔍</span>
        </div>

        {subcategories.map(subcat => (
          <div key={subcat} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-subtle)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, marginTop: 4 }}>
              {subcat}
            </div>
            <div role="group" aria-label={subcat} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {filteredSteps.filter(s => s.subcategory === subcat).map(step => {
                const active = inp.worksType === step.type;
                return (
                  <button key={step.type} type="button"
                    aria-pressed={active}
                    onClick={() => {
                      set('worksType', step.type as WorksType);
                      set('worksCategory', step.category as WorksCategory);
                    }} style={{
                      padding: '12px 14px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                      border: active ? `2px solid ${C.hivis}` : '1.5px solid var(--border-default)',
                      background: active ? '#FFF3E9' : 'var(--bg-surface)',
                      fontFamily: 'inherit',
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: active ? C.hivis : 'var(--fg-default)' }}>
                        {step.name}
                      </div>
                      <div style={{ fontSize: 10, color: C.hivis, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
                        {step.agttmRef.split(',')[0]}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 4, lineHeight: 1.4 }}>
                      {step.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {filteredSteps.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--fg-subtle)', fontSize: 14 }}>
            No design steps match "{search}"
          </div>
        )}
      </Field>

      <Divider label="Works details" />
      <RowPair>
        <Field label="Works Length (m)" half hint="Total length of the work zone">
          <NumInput value={inp.worksLength} onChange={v => set('worksLength', v)} min={1} max={50000} />
        </Field>
        <Field label="Duration" half>
          <Combobox<'short_term' | 'day_works' | 'night_works' | 'multi_day'>
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
            <NumInput value={inp.numberOfWorkers} onChange={v => set('numberOfWorkers', v)} min={0} max={500} />
          </Field>
          <Field label="Closest Worker to Live Traffic (m)" half hint="Perpendicular distance from nearest moving lane">
            <NumInput value={inp.workerProximity} onChange={v => set('workerProximity', v)} min={0} max={100} step={0.1} />
          </Field>
        </RowPair>
      )}

      <div style={{ marginBottom: 12 }}>
        <Toggle checked={inp.plantOnSite} onChange={v => set('plantOnSite', v)} label="Plant / machinery operating near live traffic" />
      </div>
      {inp.plantOnSite && (
        <Field label="Closest Plant to Live Traffic (m)" half hint="Perpendicular distance from nearest moving lane edge">
          <NumInput value={inp.plantProximity} onChange={v => set('plantProximity', v)} min={0} max={100} step={0.1} />
        </Field>
      )}

      <div style={{ marginBottom: 12 }}>
        <Toggle checked={inp.excavations} onChange={v => set('excavations', v)} label="Excavations within the work zone" />
      </div>
      {inp.excavations && (
        <RowPair>
          <Field label="Excavation Depth (mm)" half>
            <NumInput value={inp.excavationDepth} onChange={v => set('excavationDepth', v)} min={0} max={20000} />
          </Field>
          <Field label="Excavation Distance from Traffic (m)" half>
            <NumInput value={inp.excavationProximity} onChange={v => set('excavationProximity', v)} min={0} max={100} step={0.1} />
          </Field>
        </RowPair>
      )}
    </>
  );
});

const Step4 = memo(function Step4({ inp, set }: { inp: WizardInputs; set: SetFn }) {
  return (
    <>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>Traffic &amp; Environment</h2>
      <p style={{ margin: '0 0 28px', color: 'var(--fg-subtle)', fontSize: 14 }}>
        Traffic volumes and environmental conditions affect speed zone requirements and queue calculations.
      </p>

      <RowPair>
        <Field label="Peak Hour Volume (vph)" half hint="Total vehicles per hour, both directions combined">
          <NumInput value={inp.peakHourVolume} onChange={v => set('peakHourVolume', v)} min={0} max={10000} />
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
          <NumInput value={inp.intersectionDistance} onChange={v => set('intersectionDistance', v)} min={0} max={5000} />
        </Field>
      )}

      <Divider label="Queue calculation" />
      <Field
        label="Maximum Stop Time (minutes)"
        hint={`How long is one direction held before traffic is released? Set to Auto to estimate from zone length (suggested: ${suggestStopTime(inp.worksLength)} min for a ${inp.worksLength} m zone). Applies to alternating control (STOP/SLOW bats), full closures, and lane closures controlled by portable signals.`}
      >
        <div role="group" aria-label="Maximum stop time" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {([0, 2, 5, 10, 15, 30] as const).map(t => {
            const active = inp.maxStopTime === t;
            return (
              <button key={t} type="button" onClick={() => set('maxStopTime', t)}
                aria-pressed={active}
                style={{
                  padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
                  border: active ? `2px solid ${C.hivis}` : '1.5px solid var(--border-default)',
                  background: active ? C.hivis : 'var(--bg-surface)',
                  color: active ? C.ink900 : 'var(--fg-default)',
                  fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
                }}>{t === 0 ? 'Auto' : `${t} min`}</button>
            );
          })}
        </div>
      </Field>
    </>
  );
});

const Step5 = memo(function Step5({ inp, set }: { inp: WizardInputs; set: SetFn }) {
  return (
    <>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700 }}>Traffic Control Method</h2>
      <p style={{ margin: '0 0 28px', color: 'var(--fg-subtle)', fontSize: 14 }}>
        How will traffic be managed through or around the work zone?
      </p>

      <Field label="PTCD / Control Method" hint="Select the type of traffic control device or method to be used">
        <CardPicker<ControlMethod>
          value={inp.controlMethod} onChange={v => set('controlMethod', v)} cols={3}
          options={[
            { value: 'stop_slow_bats', label: 'Traffic Controller', sub: 'STOP/SLOW bat operator' },
            { value: 'portable_signals', label: 'Traffic Lights', sub: 'Portable signals (PTL)' },
            { value: 'boom_gate', label: 'Boom Gate', sub: 'Automated barrier' },
            { value: 'none', label: 'Signs Only', sub: 'No active PTCD' },
            { value: 'pilot_vehicle', label: 'Pilot Vehicle', sub: 'Lead vehicle convoy' },
            { value: 'police', label: 'Police Control', sub: 'Sworn officer direction' },
          ]}
        />
      </Field>

      {(inp.controlMethod === 'stop_slow_bats' || inp.controlMethod === 'police') && (
        <Field label={inp.controlMethod === 'police' ? 'Number of Officers' : 'Number of Traffic Controllers'} half>
          <NumInput value={inp.numberOfControllers} onChange={v => set('numberOfControllers', v)} min={1} max={20} />
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
});

// ── History panel with focus trap ─────────────────────────────────

function HistoryPanel({ history, onLoad, onClose, onExport, onImport }: {
  history: HistoryEntry[];
  onLoad: (entry: HistoryEntry) => void;
  onClose: () => void;
  onExport: () => void;
  onImport: (entries: HistoryEntry[]) => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (!Array.isArray(parsed)) throw new Error('Expected an array of history entries');
        const valid = parsed.filter(isValidHistoryEntry);
        if (valid.length === 0) throw new Error('No valid history entries found in file');
        onImport(valid);
        setImportError(null);
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Invalid file format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Focus trap + Escape key
  useEffect(() => {
    firstFocusRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        last.focus(); e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus(); e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
      {/* Backdrop */}
      <div onClick={onClose} aria-hidden="true" style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} />
      {/* Drawer */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-panel-title"
        style={{
          width: 380, background: 'var(--bg-surface)', boxShadow: '-4px 0 24px rgba(0,0,0,0.2)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border-default)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div id="history-panel-title" style={{ fontSize: 16, fontWeight: 700 }}>Calculation History</div>
              <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 2 }}>
                {history.length} saved calculation{history.length !== 1 ? 's' : ''}
              </div>
            </div>
            <button ref={firstFocusRef} onClick={onClose}
              aria-label="Close history panel"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 20,
                color: 'var(--fg-subtle)', padding: '4px 8px',
              }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onExport}
              disabled={history.length === 0}
              aria-label="Export history as JSON file"
              style={{
                flex: 1, padding: '7px 0', borderRadius: 7,
                border: '1.5px solid var(--border-default)',
                background: 'var(--bg-surface)', color: 'var(--fg-default)',
                fontSize: 12, fontWeight: 700, cursor: history.length === 0 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', opacity: history.length === 0 ? 0.5 : 1,
              }}>⬇ Export JSON</button>
            <button
              onClick={() => importRef.current?.click()}
              aria-label="Import history from JSON file"
              style={{
                flex: 1, padding: '7px 0', borderRadius: 7,
                border: '1.5px solid var(--border-default)',
                background: 'var(--bg-surface)', color: 'var(--fg-default)',
                fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}>⬆ Import JSON</button>
            <input
              ref={importRef}
              type="file"
              accept="application/json,.json"
              aria-hidden="true"
              tabIndex={-1}
              style={{ display: 'none' }}
              onChange={handleImportFile}
            />
          </div>
          {importError && (
            <div role="alert" style={{
              marginTop: 8, padding: '6px 10px', borderRadius: 6,
              background: '#F8D7DA', color: '#721C24', fontSize: 12,
            }}>{importError}</div>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {history.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--fg-subtle)', padding: '40px 0', fontSize: 14 }}>
              No calculations saved yet. Complete the wizard and click Calculate to save.
            </div>
          )}
          {[...history].reverse().map(entry => (
            <div key={entry.id} style={{
              border: '1px solid var(--border-default)', borderRadius: 10,
              padding: '14px 16px', marginBottom: 12, background: 'var(--bg-app)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{entry.inputs.projectName || 'Unnamed Project'}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-subtle)', flexShrink: 0, marginLeft: 8 }}>{entry.timestamp}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginBottom: 4 }}>
                {WORKS_TYPE_LABELS[entry.inputs.worksType]}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, background: '#FFF3E9', color: C.hivis, padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                  {entry.result.recommendedTempSpeed} km/h
                </span>
                <span style={{ fontSize: 12, background: 'var(--paper-50)', color: 'var(--fg-default)', padding: '2px 8px', borderRadius: 20 }}>
                  {entry.inputs.state} · {entry.inputs.postedSpeed} km/h posted
                </span>
                {entry.result.estimatedQueueLength != null && (
                  <span style={{ fontSize: 12, background: 'var(--paper-50)', color: 'var(--fg-default)', padding: '2px 8px', borderRadius: 20 }}>
                    Queue: {entry.result.estimatedQueueLength} m
                  </span>
                )}
              </div>
              <button onClick={() => { onLoad(entry); onClose(); }} style={{
                width: '100%', padding: '8px', borderRadius: 6, border: 'none',
                background: C.hivis, color: C.ink900, fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>View Report →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

export function CalculatorApp() {
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [inp, setInp] = useState<WizardInputs>(defaultInputs);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const historyIdRef = useRef(history.length > 0 ? Math.max(...history.map(h => h.id)) : 0);

  // Persist history to localStorage whenever it changes
  useEffect(() => { saveHistory(history); }, [history]);

  const set = useCallback(<K extends keyof WizardInputs>(k: K, v: WizardInputs[K]) =>
    setInp(prev => ({ ...prev, [k]: v })), []);

  const handleCalculate = useCallback(() => {
    setCalculating(true);
    // requestAnimationFrame flush ensures the disabled state renders before the sync calculation
    requestAnimationFrame(() => {
      const r = calculate(inp);
      const entry: HistoryEntry = {
        id: ++historyIdRef.current,
        timestamp: new Date().toLocaleString('en-AU', { dateStyle: 'short', timeStyle: 'short' }),
        inputs: { ...inp },
        result: r,
      };
      setHistory(prev => [...prev, entry].slice(-HISTORY_MAX));
      setResult(r);
      setCalculating(false);
    });
  }, [inp]);

  if (result) {
    return (
      <>
        <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading report…</div>}>
          <ReportView
            result={result}
            inputs={inp}
            onBack={() => setResult(null)}
            history={history}
            onLoadHistory={(entry) => { setInp(entry.inputs); setResult(entry.result); }}
          />
        </Suspense>
        {showHistory && (
          <HistoryPanel
            history={history}
            onLoad={(entry) => { setInp(entry.inputs); setResult(entry.result); }}
            onClose={() => setShowHistory(false)}
            onExport={() => exportHistory(history)}
            onImport={imported => {
              setHistory(prev => {
                const existingIds = new Set(prev.map(h => h.id));
                const newEntries = imported.filter(e => !existingIds.has(e.id));
                return [...prev, ...newEntries].slice(-HISTORY_MAX);
              });
            }}
          />
        )}
      </>
    );
  }

  const goNext = () => {
    if (step < 5) {
      const next = step + 1;
      setStep(next);
      setMaxStep(m => Math.max(m, next));
    } else {
      handleCalculate();
    }
  };
  const goBack = () => { if (step > 1) setStep(s => s - 1); };
  const jumpTo = (n: number) => { if (n <= maxStep) setStep(n); };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 inp={inp} set={set} />;
      case 2: return <Step2 inp={inp} set={set} />;
      case 3: return <Step3 inp={inp} set={set} />;
      case 4: return <Step4 inp={inp} set={set} />;
      case 5: return <Step5 inp={inp} set={set} />;
      default: return null;
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--bg-app)', fontFamily: 'var(--font-ui)',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)',
        padding: '16px 24px', flexShrink: 0,
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <nav aria-label="Form steps" style={{ flex: 1, display: 'flex', gap: 0, minWidth: 0 }}>
            {STEP_LABELS.map((label, i) => {
              const n = i + 1;
              const done = n < step;
              const active = n === step;
              const clickable = n <= maxStep;
              return (
                <div key={n} style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                  <button
                    type="button"
                    onClick={() => jumpTo(n)}
                    disabled={!clickable}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`Step ${n}: ${label}${done ? ' (complete)' : ''}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                      background: 'none', border: 'none', cursor: clickable ? 'pointer' : 'default',
                      padding: '4px 2px', fontFamily: 'inherit',
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? C.go : active ? C.hivis : 'var(--border-default)',
                      color: done || active ? '#fff' : 'var(--fg-subtle)',
                      fontSize: 13, fontWeight: 700, transition: 'background 0.2s',
                    }}>
                      {done ? '✓' : n}
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: active ? 700 : 500,
                      color: active ? C.hivis : done ? 'var(--fg-default)' : 'var(--fg-subtle)',
                      display: 'none',
                    }} className="step-label">{label}</span>
                  </button>
                  {n < STEP_LABELS.length && (
                    <div aria-hidden="true" style={{
                      flex: 1, height: 2, margin: '0 2px',
                      background: done ? C.go : 'var(--border-default)',
                      transition: 'background 0.2s', minWidth: 4,
                    }}/>
                  )}
                </div>
              );
            })}
          </nav>

          <button onClick={() => setShowHistory(true)}
            aria-label={`Calculation history — ${history.length} saved`}
            style={{
              padding: '8px 14px', borderRadius: 8, border: '1.5px solid var(--border-default)',
              background: 'var(--bg-surface)', color: 'var(--fg-default)',
              fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            }}>
            <span aria-hidden="true">📋</span>
            <span>History</span>
            {history.length > 0 && (
              <span aria-hidden="true" style={{
                background: C.hivis, color: C.ink900, borderRadius: 10,
                padding: '1px 6px', fontSize: 11, fontWeight: 700,
              }}>{history.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Form content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '32px 24px 16px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {renderStep()}
        </div>
      </div>

      {/* Navigation footer */}
      <div style={{
        background: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)',
        padding: '16px 24px', flexShrink: 0,
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={goBack}
            disabled={step === 1}
            style={{
              padding: '10px 24px', borderRadius: 8, border: '1.5px solid var(--border-default)',
              background: 'var(--bg-surface)', color: 'var(--fg-default)',
              fontSize: 14, fontWeight: 700, cursor: step === 1 ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: step === 1 ? 0.4 : 1,
            }}>← Back</button>

          <span aria-live="polite" style={{ fontSize: 13, color: 'var(--fg-subtle)' }}>
            Step {step} of {STEP_LABELS.length}
          </span>

          <button type="button" onClick={goNext}
            disabled={calculating}
            aria-busy={calculating}
            style={{
              padding: '10px 28px', borderRadius: 8, border: 'none',
              background: step === 5 ? C.go : C.hivis,
              color: step === 5 ? '#fff' : C.ink900,
              fontSize: 14, fontWeight: 700, cursor: calculating ? 'wait' : 'pointer',
              fontFamily: 'inherit', opacity: calculating ? 0.7 : 1,
            }}>
            {calculating ? 'Calculating…' : step === 5 ? '⚡ Calculate' : 'Next →'}
          </button>
        </div>
      </div>

      {showHistory && (
        <HistoryPanel
          history={history}
          onLoad={(entry) => { setInp(entry.inputs); setResult(entry.result); setShowHistory(false); }}
          onClose={() => setShowHistory(false)}
          onExport={() => exportHistory(history)}
          onImport={imported => {
            setHistory(prev => {
              const existingIds = new Set(prev.map(h => h.id));
              const newEntries = imported.filter(e => !existingIds.has(e.id));
              return [...prev, ...newEntries].slice(-HISTORY_MAX);
            });
          }}
        />
      )}
    </div>
  );
}
