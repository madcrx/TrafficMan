import React, { useState } from 'react';
import { C } from '../../components/tokens';
import { Pill } from '../../components/Pill';
import { Card } from '../../components/Card';
import {
  IcChevL, IcChevR, IcCheck, IcPlus, IcMinus, IcCamera, IcCloud, IcCone,
} from '../../components/Icons';

// ─── Local components ──────────────────────────────────────────

function HazardBanner() {
  return (
    <div style={{
      height: 8,
      background: 'repeating-linear-gradient(135deg, #FFC400 0 12px, #0B1220 12px 24px)',
    }}/>
  );
}

function TopBar({ onBack, title, sub, right }: {
  onBack?: () => void;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div style={{
      height: 72, padding: '12px 8px 12px 12px',
      background: C.paper0, borderBottom: `1.5px solid ${C.steel200}`,
      display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          width: 44, height: 44, borderRadius: 8, border: 'none',
          background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.ink900, cursor: 'pointer',
        }}><IcChevL size={26}/></button>
      ) : (
        <img src="/assets/logo-mark.svg" width="36" height="36" style={{ marginLeft: 4 }} alt="TrafficMan"/>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {sub && <div style={{
          fontSize: 11, fontWeight: 700, color: C.ink500,
          letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1,
        }}>{sub}</div>}
        <div style={{
          fontSize: 17, fontWeight: 700, color: C.ink900, lineHeight: '22px', marginTop: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

type BtnKind = 'primary' | 'danger' | 'secondary';
function btnStyle(kind: BtnKind): React.CSSProperties {
  const bg = { primary: C.hivis, danger: C.stop, secondary: C.paper0 }[kind];
  const fg = { primary: C.ink900, danger: '#fff', secondary: C.ink900 }[kind];
  return {
    height: 56, padding: '0 22px', borderRadius: 8,
    background: bg, color: fg,
    border: kind === 'secondary' ? `1.5px solid ${C.steel300}` : '1.5px solid transparent',
    fontFamily: 'inherit', fontSize: 17, fontWeight: 700,
    letterSpacing: '0.01em', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  };
}

function BottomBar({ primary, secondary }: {
  primary?: { label: string; onClick: () => void; kind?: BtnKind; disabled?: boolean };
  secondary?: { label: string; onClick: () => void };
}) {
  return (
    <div style={{
      padding: '12px 16px 24px',
      background: C.paper0, borderTop: `1.5px solid ${C.steel200}`,
      display: 'flex', gap: 10, flexShrink: 0,
    }}>
      {secondary && (
        <button onClick={secondary.onClick} style={btnStyle('secondary')}>{secondary.label}</button>
      )}
      {primary && (
        <button onClick={primary.onClick} disabled={primary.disabled}
                style={{ ...btnStyle(primary.kind ?? 'primary'), flex: 1 }}>
          {primary.label}
        </button>
      )}
    </div>
  );
}

function Stepper({ value, max, onChange }: { value: number; max: number; onChange: (v: number) => void }) {
  const stepBtn = (disabled: boolean): React.CSSProperties => ({
    width: 44, height: 44, borderRadius: 8,
    background: C.paper0, color: C.ink900,
    border: `1.5px solid ${C.steel300}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button onClick={(e) => { e.stopPropagation(); onChange(Math.max(0, value - 1)); }}
              disabled={value === 0} style={stepBtn(value === 0)}>
        <IcMinus size={20} sw={2.4}/>
      </button>
      <div style={{
        minWidth: 56, textAlign: 'center',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 17, fontWeight: 700, color: C.ink900,
      }}>
        {value}<span style={{ color: C.ink500 }}>/{max}</span>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onChange(Math.min(max, value + 1)); }}
              disabled={value === max} style={stepBtn(value === max)}>
        <IcPlus size={20} sw={2.4}/>
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontSize: 12, fontWeight: 700, color: C.ink700,
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, mono }: {
  value: string; onChange?: (v: string) => void; placeholder?: string; mono?: boolean;
}) {
  return (
    <input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder}
           style={{
             height: 56, padding: '0 14px',
             borderRadius: 8, border: `1.5px solid ${C.steel200}`,
             background: C.paper0, color: C.ink900,
             fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
             fontSize: 17, fontWeight: 500, outline: 'none',
           }}/>
  );
}

function Segmented({ options, value, onChange }: {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (v: string) => void;
}) {
  const palette: Record<string, { bg: string; fg: string }> = {
    low:    { bg: C.go,      fg: '#fff'     },
    medium: { bg: C.caution, fg: C.ink900  },
    high:   { bg: C.stop,    fg: '#fff'     },
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 8 }}>
      {options.map((opt) => {
        const active = opt.value === value;
        const p = palette[opt.value] ?? { bg: C.hivis, fg: C.ink900 };
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            height: 56, borderRadius: 8,
            background: active ? p.bg : C.paper0,
            color: active ? p.fg : C.ink700,
            border: `1.5px solid ${active ? p.bg : C.steel300}`,
            fontFamily: 'inherit', fontSize: 15, fontWeight: 700,
            letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
          }}>{opt.label}</button>
        );
      })}
    </div>
  );
}

// ─── Screens ───────────────────────────────────────────────────

function SignOnScreen({ onSignOn }: { onSignOn: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.paper50 }}>
      <TopBar
        sub="TrafficMan · v3.2"
        title="Sign on for shift"
        right={<Pill kind="neutral" style={{ marginRight: 12 }}>OFFLINE READY</Pill>}
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card padding={20}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                        letterSpacing: '0.06em', textTransform: 'uppercase' }}>Today · Wed 20 May</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
            <span style={{
              fontSize: 56, fontWeight: 700, letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums', lineHeight: 1, color: C.ink900,
            }}>06:00</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: C.ink500 }}>→ 14:30</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 15, color: C.ink700 }}>
            Shift <code style={{ fontFamily: 'JetBrains Mono, monospace' }}>SH-2026-0520-AM</code>
          </div>
        </Card>

        <Card padding={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <IcCloud size={32}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 17 }}>Heavy rain forecast 09:00</div>
              <div style={{ fontSize: 13, color: C.ink500, marginTop: 2 }}>12°C · wind 38 km/h SSW · visibility 4 km</div>
            </div>
            <Pill kind="caution">CAUTION</Pill>
          </div>
        </Card>

        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink500,
                      letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 4px 0' }}>Crew</div>
        <Card padding={0}>
          {([
            ['J. Patel',  'Lead controller · TC-3'],
            ['M. Singh',  'Controller · TC-2'],
            ['R. Lin',    'Controller · TC-2'],
            ['A. Diallo', 'Trainee · TC-1'],
          ] as const).map(([name, role], i, a) => (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: i < a.length - 1 ? `1px solid ${C.paper100}` : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: C.paper100, color: C.ink700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
              }}>{name.split(' ').map(x => x[0]).join('')}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{name}</div>
                <div style={{ fontSize: 13, color: C.ink500 }}>{role}</div>
              </div>
              <Pill kind="go">READY</Pill>
            </div>
          ))}
        </Card>
      </div>
      <BottomBar primary={{ label: 'Sign on · 4 of 4', onClick: onSignOn }}/>
    </div>
  );
}

function JobSheetScreen({ onBack, onOpenSignage, onReport }: {
  onBack: () => void; onOpenSignage: () => void; onReport: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.paper50 }}>
      <TopBar onBack={onBack} sub="Active job" title="TMP-4471"
              right={<Pill kind="active" style={{ marginRight: 12 }}>ACTIVE</Pill>}/>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card status="active" padding={16}>
          <div style={{ fontWeight: 700, fontSize: 20, lineHeight: '26px' }}>M1 NB · Lane 2 closure</div>
          <div style={{ fontSize: 14, color: C.ink700, marginTop: 4 }}>
            CH 24.6 → CH 27.0 · 2.4 km · permit M1-NB-2026-118
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14,
            padding: 12, background: C.paper50, borderRadius: 6,
          }}>
            <div>
              <div style={{ fontSize: 11, color: C.ink500, fontWeight: 700,
                            letterSpacing: '0.06em', textTransform: 'uppercase' }}>Approved by</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>M. Okafor</div>
              <div style={{ fontSize: 12, color: C.ink500 }}>Snr Planner · 14:02 (yesterday)</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.ink500, fontWeight: 700,
                            letterSpacing: '0.06em', textTransform: 'uppercase' }}>Variation</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>None</div>
              <div style={{ fontSize: 12, color: C.ink500 }}>Request variation →</div>
            </div>
          </div>
        </Card>

        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink500,
                      letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 4px 0' }}>
          Prestart · 5 of 7 done
        </div>
        <Card padding={0}>
          {([
            ['SWMS reviewed with crew', true],
            ['PPE check (hi-vis, hard hat, gloves)', true],
            ['Radio check on Ch. 14', true],
            ['Vehicle inspection · TX-118', true],
            ['Signage manifest verified', true],
            ['First aid kit on site', false],
            ['Spotter briefed on lane geometry', false],
          ] as const).map(([label, done], i, a) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
              borderBottom: i < a.length - 1 ? `1px solid ${C.paper100}` : 'none',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 5,
                background: done ? C.go : 'transparent',
                border: done ? 'none' : `2px solid ${C.steel300}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', flexShrink: 0,
              }}>{done && <IcCheck size={16} sw={2.5}/>}</div>
              <div style={{
                flex: 1, fontSize: 15, fontWeight: 500,
                color: done ? C.ink500 : C.ink900,
                textDecoration: done ? 'line-through' : 'none',
              }}>{label}</div>
            </div>
          ))}
        </Card>

        <Card status="info" padding={16} onClick={onOpenSignage}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IcCone size={28}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Signage · 8 of 12 deployed</div>
              <div style={{ fontSize: 13, color: C.ink500, marginTop: 2 }}>Tap to update deployment</div>
            </div>
            <IcChevR size={22}/>
          </div>
        </Card>
      </div>
      <BottomBar
        secondary={{ label: 'Report incident', onClick: onReport }}
        primary={{ label: 'Continue prestart', onClick: onOpenSignage }}
      />
    </div>
  );
}

interface SignageItem { code: string; name: string; max: number; deployed: number; }

function SignageScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [items, setItems] = useState<SignageItem[]>([
    { code: 'AW-001', name: 'Roadwork ahead · 1.5 km', max: 2,  deployed: 2  },
    { code: 'AW-002', name: 'Lane closed · symbolic',  max: 4,  deployed: 3  },
    { code: 'AW-003', name: 'Speed limit 60',          max: 2,  deployed: 2  },
    { code: 'TC-118', name: 'Traffic cone · 750 mm',   max: 24, deployed: 16 },
    { code: 'TC-201', name: 'Bollard · flashing',      max: 6,  deployed: 4  },
    { code: 'AR-004', name: 'End roadworks',           max: 2,  deployed: 0  },
  ]);

  const setDeployed = (i: number, deployed: number) =>
    setItems(prev => prev.map((it, j) => j === i ? { ...it, deployed } : it));

  const total = items.reduce((a, x) => a + x.max, 0);
  const out   = items.reduce((a, x) => a + x.deployed, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.paper50 }}>
      <TopBar onBack={onBack} sub="TMP-4471 · signage" title="Deployment manifest"/>
      <div style={{
        padding: '14px 16px', background: C.paper0, borderBottom: `1.5px solid ${C.steel200}`,
        display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
      }}>
        <span style={{
          fontSize: 40, fontWeight: 700, letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums', color: C.hivis, lineHeight: 1,
        }}>{out}<span style={{ color: C.steel300 }}>/{total}</span></span>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                        letterSpacing: '0.06em', textTransform: 'uppercase' }}>Deployed</div>
          <div style={{ fontSize: 14, color: C.ink700, marginTop: 2 }}>
            Tap +/− to update as you place each sign
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((it, i) => (
          <Card key={it.code} padding={14}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <IcCone size={28}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, lineHeight: '20px' }}>{it.name}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: C.ink500, marginTop: 2 }}>{it.code}</div>
              </div>
              <Stepper value={it.deployed} max={it.max} onChange={(v) => setDeployed(i, v)}/>
            </div>
          </Card>
        ))}
      </div>
      <BottomBar primary={{
        label: out === total ? 'Mark deployment complete' : `Complete · ${out}/${total}`,
        onClick: onDone,
      }}/>
    </div>
  );
}

function IncidentScreen({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const [severity, setSeverity] = useState('medium');
  const [type,     setType]     = useState('Cone struck');
  const [location, setLocation] = useState('M1 NB · CH 25.8');
  const [notes,    setNotes]    = useState('Cone TC-118 #4 displaced into shoulder by light vehicle. No injury. Replaced from spare. Vehicle did not stop.');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.paper50 }}>
      <HazardBanner/>
      <TopBar onBack={onBack} sub="TMP-4471" title="Report incident"/>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="Severity">
          <Segmented value={severity} onChange={setSeverity}
            options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]}/>
        </Field>
        <Field label="Incident type">
          <TextInput value={type} onChange={setType}/>
        </Field>
        <Field label="Location">
          <TextInput value={location} onChange={setLocation} mono/>
        </Field>
        <Field label="Photo">
          <div style={{
            height: 140, borderRadius: 8, background: C.paper100,
            border: `1.5px dashed ${C.steel300}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, color: C.ink700,
          }}>
            <IcCamera size={28}/>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Tap to capture</div>
              <div style={{ fontSize: 12, color: C.ink500 }}>Up to 4 photos · GPS tagged</div>
            </div>
          </div>
        </Field>
        <Field label="Notes">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5}
                    style={{
                      padding: 14, borderRadius: 8,
                      border: `1.5px solid ${C.steel200}`, background: C.paper0, color: C.ink900,
                      fontFamily: 'inherit', fontSize: 15, fontWeight: 500,
                      resize: 'none', outline: 'none', lineHeight: '22px',
                    }}/>
        </Field>
      </div>
      <BottomBar
        secondary={{ label: 'Save draft', onClick: onBack }}
        primary={{ label: 'Submit · INC-229', onClick: onSubmit, kind: severity === 'high' ? 'danger' : 'primary' }}
      />
    </div>
  );
}

function SubmittedScreen({ onHome }: { onHome: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.paper50 }}>
      <TopBar sub="TrafficMan" title="Submitted"/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%', background: C.go, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><IcCheck size={48} sw={3}/></div>
        <div style={{ fontSize: 24, fontWeight: 700, textAlign: 'center' }}>INC-229 submitted</div>
        <div style={{ fontSize: 15, color: C.ink700, textAlign: 'center' }}>
          Supervisor notified · variation requested for TMP-4471
        </div>
        <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: C.ink500 }}>
          SYNC 14:23:08 · OK
        </code>
      </div>
      <BottomBar primary={{ label: 'Back to job', onClick: onHome }}/>
    </div>
  );
}

// ─── Router ────────────────────────────────────────────────────

type MobileScreen = 'signon' | 'job' | 'signage' | 'incident' | 'submitted';

export function MobileApp() {
  const [screen, setScreen] = useState<MobileScreen>('signon');
  switch (screen) {
    case 'signon':    return <SignOnScreen   onSignOn={() => setScreen('job')}/>;
    case 'job':       return <JobSheetScreen onBack={() => setScreen('signon')}
                                              onOpenSignage={() => setScreen('signage')}
                                              onReport={() => setScreen('incident')}/>;
    case 'signage':   return <SignageScreen  onBack={() => setScreen('job')} onDone={() => setScreen('job')}/>;
    case 'incident':  return <IncidentScreen onBack={() => setScreen('job')} onSubmit={() => setScreen('submitted')}/>;
    case 'submitted': return <SubmittedScreen onHome={() => setScreen('job')}/>;
  }
}
