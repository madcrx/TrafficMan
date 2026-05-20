import React, { useState } from 'react';
import { C } from '../../components/tokens';
import { Pill } from '../../components/Pill';
import { Card } from '../../components/Card';
import { IcCheck, IcAlert, IcSearch, IcRadio, IcHome, IcBox } from '../../components/Icons';

// ─── Custom tablet icon ─────────────────────────────────────────
function IcCone(p: { size?: number; style?: React.CSSProperties }) {
  const { size = 26 } = p;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" style={p.style}>
      <path d="M12 3 L17 19 L7 19 Z"/><path d="M9.5 11 L14.5 11"/>
      <path d="M8.25 15 L15.75 15"/><path d="M4 21 L20 21"/>
    </svg>
  );
}

// ─── Shared components ─────────────────────────────────────────

function TopBar({ crumbs, right }: { crumbs: string[]; right?: React.ReactNode }) {
  return (
    <div style={{
      height: 72, background: C.paper0, borderBottom: `1.5px solid ${C.steel200}`,
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 18, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <span style={{
              fontSize: i === crumbs.length - 1 ? 22 : 15,
              fontWeight: i === crumbs.length - 1 ? 700 : 500,
              color: i === crumbs.length - 1 ? C.ink900 : C.ink500,
            }}>{c}</span>
            {i < crumbs.length - 1 && <span style={{ color: C.steel300, fontSize: 16 }}>/</span>}
          </React.Fragment>
        ))}
      </div>
      {right}
    </div>
  );
}

function TButton({
  kind = 'primary', children, onClick, size = 'lg', icon: IconC, disabled,
}: {
  kind?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children?: React.ReactNode;
  onClick?: () => void;
  size?: 'md' | 'lg' | 'xl';
  icon?: React.ComponentType<{ size?: number }>;
  disabled?: boolean;
}) {
  const palette = {
    primary:   { bg: C.hivis,    fg: C.ink900,  bd: C.hivis    },
    secondary: { bg: C.paper0,   fg: C.ink900,  bd: C.steel300 },
    danger:    { bg: C.stop,     fg: '#fff',    bd: C.stop     },
    ghost:     { bg: 'transparent', fg: C.ink900, bd: 'transparent' },
  }[kind];
  const h = size === 'xl' ? 64 : size === 'lg' ? 56 : 40;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      height: h, padding: size === 'xl' ? '0 28px' : '0 22px',
      borderRadius: 8, background: palette.bg, color: palette.fg,
      border: `1.5px solid ${palette.bd}`,
      fontFamily: 'inherit', fontSize: size === 'xl' ? 18 : 16, fontWeight: 700,
      letterSpacing: '0.01em', cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    }}>
      {IconC && <IconC size={22}/>}
      {children}
    </button>
  );
}

function Counter({ value, total, label, color = C.hivis }: {
  value: number | string; total?: number; label: string; color?: string;
}) {
  return (
    <div>
      <div style={{
        fontSize: 56, fontWeight: 700, letterSpacing: '-0.02em',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1, color,
      }}>
        {value}{total !== undefined && <span style={{ color: C.steel300 }}>/{total}</span>}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.ink500,
                    letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 6 }}>{label}</div>
    </div>
  );
}

// ─── Map placeholder ────────────────────────────────────────────
function FakeMap() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice"
         style={{ display: 'block', background: '#E7EAEF' }}>
      <defs>
        <pattern id="g2" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D2D7E0" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="600" height="360" fill="url(#g2)"/>
      <path d="M 40 60 L 560 60" stroke="#A8B0BB" strokeWidth="14" fill="none"/>
      <path d="M 40 220 L 560 220" stroke="#A8B0BB" strokeWidth="44" fill="none"/>
      <path d="M 40 220 L 560 220" stroke="#FFFFFF" strokeWidth="1" fill="none" strokeDasharray="14 10"/>
      <rect x="120" y="200" width="380" height="14" fill="#FF6A00" opacity="0.85"/>
      {[140, 220, 280, 340, 400, 460].map((x, i) => (
        <circle key={i} cx={x} cy={240} r={9} fill={i < 4 ? '#FF6A00' : '#FFC400'} stroke="#0B1220" strokeWidth="1.5"/>
      ))}
      <text x="60"  y="180" fontFamily="Sansation, sans-serif" fontSize="11" fontWeight="700" fill="#5C6677" letterSpacing="0.06em">CH 24.6</text>
      <text x="500" y="180" fontFamily="Sansation, sans-serif" fontSize="11" fontWeight="700" fill="#5C6677" letterSpacing="0.06em">CH 27.0</text>
    </svg>
  );
}

// ─── Screens ───────────────────────────────────────────────────

function DeployScreen() {
  return (
    <>
      <TopBar
        crumbs={['Shift SH-2026-0520-AM', 'TMP-4471', 'Active deployment']}
        right={
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: C.ink500 }}>▲ SYNC 14:02</span>
            <Pill kind="go">ONLINE</Pill>
            <TButton kind="danger" icon={IcAlert}>Report incident</TButton>
          </div>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 18, padding: 24, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
          <Card status="active" padding={22}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: C.ink500 }}>TMP-4471</code>
                <div style={{ fontSize: 28, fontWeight: 700, lineHeight: '34px', marginTop: 4 }}>
                  M1 NB · Lane 2 closure
                </div>
                <div style={{ fontSize: 15, color: C.ink700, marginTop: 4 }}>
                  CH 24.6 → CH 27.0 · 2.4 km · permit M1-NB-2026-118
                </div>
              </div>
              <Pill kind="active">ACTIVE</Pill>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18,
                          marginTop: 22, paddingTop: 18, borderTop: `1px solid ${C.paper100}` }}>
              <Counter value={8}  total={12} label="Signs deployed" color={C.hivis}/>
              <Counter value="06:42"         label="Shift elapsed"  color={C.ink900}/>
              <Counter value={0}             label="Open incidents" color={C.go}/>
            </div>
          </Card>

          <Card padding={0} style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.paper100}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.ink500,
                             letterSpacing: '0.06em', textTransform: 'uppercase' }}>Crew on Ch. 14</span>
              <Pill kind="go">4 ON SITE</Pill>
            </div>
            {([
              ['JP', 'J. Patel',  'Lead controller', 'go'],
              ['MS', 'M. Singh',  'Controller',      'go'],
              ['RL', 'R. Lin',    'Spotter',         'go'],
              ['AD', 'A. Diallo', 'Trainee',         'caution'],
            ] as const).map(([avi, name, role, status], i, a) => (
              <div key={avi} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                                     borderBottom: i < a.length - 1 ? `1px solid ${C.paper100}` : 'none' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: C.paper100, color: C.ink700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
                }}>{avi}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{name}</div>
                  <div style={{ fontSize: 13, color: C.ink500 }}>{role}</div>
                </div>
                <IcRadio size={20} style={{ color: C.ink500 }}/>
                <Pill kind={status}>{status === 'go' ? 'CLEAR' : 'BRIEFING'}</Pill>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
          <Card padding={0} style={{ flex: '1 1 200px', overflow: 'hidden', position: 'relative' }}>
            <FakeMap/>
            <div style={{
              position: 'absolute', left: 16, top: 16,
              background: 'rgba(255,255,255,0.95)', padding: '8px 14px',
              borderRadius: 6, border: `1.5px solid ${C.steel200}`,
              fontSize: 13, fontWeight: 700, color: C.ink700, letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>M1 NB · CH 24.6 → CH 27.0</div>
            <div style={{ position: 'absolute', right: 16, bottom: 16, display: 'flex', gap: 8 }}>
              <Pill kind="active">8 DEPLOYED</Pill>
              <Pill kind="caution">4 PENDING</Pill>
            </div>
          </Card>

          <Card padding={0} style={{ flex: '0 0 auto', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.paper100}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.ink500,
                             letterSpacing: '0.06em', textTransform: 'uppercase' }}>Deployed signs · log</span>
              <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: C.ink500 }}>last 30 min</span>
            </div>
            <div style={{ maxHeight: 200, overflow: 'auto' }}>
              {([
                ['06:48:22', 'AW-001', 'Roadwork ahead · 1.5 km', 'CH 23.1'],
                ['06:51:09', 'AW-002', 'Lane closed · symbolic',  'CH 24.4'],
                ['06:54:51', 'AW-003', 'Speed limit 60',          'CH 24.6'],
                ['06:58:04', 'TC-118', 'Cone · 750 mm × 16',      'CH 24.6 → 27.0'],
                ['07:02:33', 'TC-201', 'Bollard flashing × 4',    'CH 25.2'],
              ] as const).map(([t, code, name, loc]) => (
                <div key={t} style={{
                  display: 'grid', gridTemplateColumns: '90px 80px 1fr 130px',
                  alignItems: 'center', gap: 12, padding: '12px 20px',
                  borderBottom: `1px solid ${C.paper100}`,
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: C.ink700,
                }}>
                  <span style={{ color: C.ink500 }}>{t}</span>
                  <code style={{ color: C.ink900 }}>{code}</code>
                  <span style={{ fontFamily: 'Sansation, sans-serif', fontSize: 14, color: C.ink900 }}>{name}</span>
                  <span style={{ color: C.ink500 }}>{loc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

const stockSeed = [
  { code: 'AW-001', name: 'Roadwork ahead · 1.5 km',  total: 4,  deployed: 2  },
  { code: 'AW-002', name: 'Lane closed · symbolic',   total: 6,  deployed: 3  },
  { code: 'AW-003', name: 'Speed limit 60',           total: 4,  deployed: 2  },
  { code: 'AW-004', name: 'Speed limit 40',           total: 4,  deployed: 0  },
  { code: 'AR-004', name: 'End roadworks',            total: 4,  deployed: 0  },
  { code: 'AR-008', name: 'Workers ahead',            total: 2,  deployed: 0  },
  { code: 'TC-118', name: 'Traffic cone · 750 mm',    total: 32, deployed: 16 },
  { code: 'TC-202', name: 'Traffic cone · 450 mm',    total: 16, deployed: 0  },
  { code: 'TC-201', name: 'Bollard · flashing',       total: 8,  deployed: 4  },
  { code: 'BR-101', name: 'Plastic barrier · 2 m',    total: 12, deployed: 6  },
  { code: 'LT-330', name: 'Arrow board · trailer',    total: 2,  deployed: 1  },
  { code: 'LT-410', name: 'Variable message sign',    total: 2,  deployed: 1  },
];

function StatCell({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div style={{
        fontVariantNumeric: 'tabular-nums', fontSize: 28, fontWeight: 700,
        color, letterSpacing: '-0.02em', lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                    letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function InventoryScreen() {
  const [q, setQ] = useState('');
  const filtered = stockSeed.filter(s =>
    s.name.toLowerCase().includes(q.toLowerCase()) || s.code.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <TopBar
        crumbs={['Depot DP-04', 'Inventory']}
        right={
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', height: 48, width: 320,
              background: C.paper0, border: `1.5px solid ${C.steel200}`, borderRadius: 8,
            }}>
              <IcSearch size={20} sw={2} style={{ color: C.ink500 }}/>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search code or name"
                     style={{ border: 'none', outline: 'none', flex: 1, background: 'transparent',
                              fontFamily: 'inherit', fontSize: 15, color: C.ink900 }}/>
            </div>
            <TButton kind="primary" size="lg">Issue manifest</TButton>
          </div>
        }
      />
      <div style={{ padding: 24, flex: 1, minHeight: 0, overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {filtered.map(s => {
            const avail   = s.total - s.deployed;
            const lowStock = avail <= 1;
            return (
              <Card key={s.code} padding={16} status={lowStock ? 'caution' : s.deployed > 0 ? 'active' : undefined}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: C.ink500 }}>{s.code}</code>
                    <div style={{ fontSize: 18, fontWeight: 700, lineHeight: '22px', marginTop: 4 }}>{s.name}</div>
                  </div>
                  <IcCone size={32} style={{ color: C.ink700, opacity: 0.6 }}/>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14,
                              padding: '10px 0', borderTop: `1px solid ${C.paper100}` }}>
                  <StatCell label="Depot"    value={avail}       color={lowStock ? C.caution : C.ink900}/>
                  <StatCell label="Deployed" value={s.deployed}  color={C.hivis}/>
                  <StatCell label="Total"    value={s.total}     color={C.ink500}/>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

function PrestartScreen() {
  const crew = [
    { initials: 'JP', name: 'J. Patel',  role: 'Lead' },
    { initials: 'MS', name: 'M. Singh',  role: 'Controller' },
    { initials: 'RL', name: 'R. Lin',    role: 'Spotter' },
    { initials: 'AD', name: 'A. Diallo', role: 'Trainee' },
  ];
  const tasks = [
    'SWMS reviewed with full crew',
    'PPE check · hi-vis, hard hat, gloves, eye protection',
    'Radio comms check on Channel 14',
    'Vehicle TX-118 daily inspection complete',
    'Signage manifest matches deployment plan',
    'First aid kit on site · contents verified',
    'Spotter briefed on lane geometry and exclusion zone',
    'Weather assessment · acceptable for shift',
  ];
  const [done, setDone] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setDone(d => ({ ...d, [i]: !d[i] }));
  const completed = Object.values(done).filter(Boolean).length;

  return (
    <>
      <TopBar
        crumbs={['Shift SH-2026-0520-AM', 'Prestart checklist']}
        right={
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Counter value={completed} total={tasks.length} label=""
                     color={completed === tasks.length ? C.go : C.hivis}/>
            <TButton kind="primary" size="lg" disabled={completed !== tasks.length}>
              Sign off prestart
            </TButton>
          </div>
        }
      />
      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18,
                    flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>
          {tasks.map((t, i) => {
            const checked = !!done[i];
            return (
              <div key={i} onClick={() => toggle(i)} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '18px 22px',
                background: C.paper0,
                border: `1.5px solid ${checked ? C.go : C.steel200}`,
                borderRadius: 8, cursor: 'pointer', minHeight: 72,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: checked ? C.go : 'transparent',
                  border: checked ? 'none' : `2.5px solid ${C.steel300}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', flexShrink: 0,
                }}>
                  {checked && <IcCheck size={24} sw={3}/>}
                </div>
                <div style={{
                  flex: 1, fontSize: 18, fontWeight: 700,
                  color: checked ? C.ink500 : C.ink900,
                  textDecoration: checked ? 'line-through' : 'none',
                }}>{t}</div>
                <span style={{ fontSize: 12, color: C.ink500, fontFamily: 'JetBrains Mono, monospace' }}>
                  {checked ? `JP · 05:${42 + i}` : '—'}
                </span>
              </div>
            );
          })}
        </div>
        <Card padding={0} style={{ overflow: 'hidden', alignSelf: 'flex-start' }}>
          <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.paper100}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.ink500,
                           letterSpacing: '0.06em', textTransform: 'uppercase' }}>Crew sign-off</span>
            <Pill kind="caution">4 PENDING</Pill>
          </div>
          {crew.map((c, i, a) => (
            <div key={c.initials} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px',
                                          borderBottom: i < a.length - 1 ? `1px solid ${C.paper100}` : 'none' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', background: C.paper100, color: C.ink700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16,
              }}>{c.initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: C.ink500 }}>{c.role}</div>
              </div>
              <TButton kind="secondary" size="md">Tap to sign</TButton>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}

// ─── Left icon rail ─────────────────────────────────────────────
type TabletNav = 'deploy' | 'stock' | 'crew';

function Rail({ value, onChange }: { value: TabletNav; onChange: (id: TabletNav) => void }) {
  const items: Array<{ id: TabletNav; label: string; Icon: React.ComponentType<{ size?: number; sw?: number }> }> = [
    { id: 'deploy', label: 'Deploy',    Icon: IcHome  },
    { id: 'stock',  label: 'Inventory', Icon: IcBox   },
    { id: 'crew',   label: 'Prestart',  Icon: IcCheck },
  ];
  return (
    <div style={{
      width: 96, background: C.ink900, color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: 16, gap: 8, flexShrink: 0,
    }}>
      <img src="/assets/logo-mark.svg" width="44" height="44" alt="TrafficMan" style={{ marginBottom: 16 }}/>
      {items.map(({ id, label, Icon }) => {
        const active = value === id;
        return (
          <button key={id} onClick={() => onChange(id)} style={{
            width: 80, height: 76, borderRadius: 10, border: 'none',
            background: active ? C.hivis : 'transparent',
            color: active ? C.ink900 : '#A8B0BB',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, cursor: 'pointer',
          }}>
            <Icon size={28} sw={1.8}/>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
          </button>
        );
      })}
      <div style={{ flex: 1 }}/>
      <div style={{
        width: 56, height: 56, borderRadius: '50%', background: '#2A3344', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 16, marginBottom: 16,
      }}>JP</div>
    </div>
  );
}

export function TabletApp() {
  const [screen, setScreen] = useState<TabletNav>('deploy');
  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: '96px 1fr',
      background: C.paper50, fontFamily: 'var(--font-ui)', color: C.ink900,
      overflow: 'hidden',
    }}>
      <Rail value={screen} onChange={setScreen}/>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {screen === 'deploy' && <DeployScreen/>}
        {screen === 'stock'  && <InventoryScreen/>}
        {screen === 'crew'   && <PrestartScreen/>}
      </div>
    </div>
  );
}
