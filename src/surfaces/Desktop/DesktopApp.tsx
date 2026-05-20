import React, { useState } from 'react';
import { C } from '../../components/tokens';
import { Pill } from '../../components/Pill';
import { Card } from '../../components/Card';
import {
  IcInbox, IcDoc, IcMap, IcBox, IcShield, IcSettings,
  IcFilter, IcSearch, IcDownload, IcCheck, IcX, IcChevR,
} from '../../components/Icons';

// ─── Design tokens shorthand ───────────────────────────────────

const tmpQueue = [
  { code: 'TMP-4471', title: 'M1 NB · Lane 2 closure',          submitter: 'J. Patel',   crew: 4, depot: 'DP-04', status: 'pending',   age: '3h 12m',  risk: 'medium' },
  { code: 'TMP-4470', title: 'M4 SB · Shoulder works',          submitter: 'D. Ng',      crew: 3, depot: 'DP-02', status: 'pending',   age: '5h 41m',  risk: 'low'    },
  { code: 'TMP-4469', title: 'Princes Hwy · Bridge inspection', submitter: 'L. Volpi',   crew: 6, depot: 'DP-07', status: 'pending',   age: '8h 06m',  risk: 'high'   },
  { code: 'TMP-4468', title: 'M2 NB · Pothole repair',          submitter: 'J. Patel',   crew: 2, depot: 'DP-04', status: 'pending',   age: '12h 32m', risk: 'low'    },
  { code: 'TMP-4467', title: 'CBD · Pitt St · Crane lift',      submitter: 'A. Diallo',  crew: 8, depot: 'DP-01', status: 'variation', age: '1d 02h',  risk: 'high'   },
  { code: 'TMP-4466', title: 'Western Distrib · Lane closure',  submitter: 'M. Singh',   crew: 4, depot: 'DP-02', status: 'pending',   age: '1d 05h',  risk: 'medium' },
  { code: 'TMP-4465', title: 'M5 SB · Median works',            submitter: 'R. Lin',     crew: 5, depot: 'DP-04', status: 'pending',   age: '1d 18h',  risk: 'medium' },
];

type NavId = 'queue' | 'tmps' | 'map' | 'stock' | 'audit';

function StatusCell({ status }: { status: string }) {
  if (status === 'pending')   return <Pill kind="caution">PENDING</Pill>;
  if (status === 'variation') return <Pill kind="info">VARIATION</Pill>;
  if (status === 'approved')  return <Pill kind="go">APPROVED</Pill>;
  if (status === 'rejected')  return <Pill kind="stop">REJECTED</Pill>;
  return <Pill kind="neutral">{status}</Pill>;
}

function RiskDot({ risk }: { risk: string }) {
  const color = ({ low: C.go, medium: C.caution, high: C.stop } as Record<string, string>)[risk];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }}/>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.ink700,
                     letterSpacing: '0.06em', textTransform: 'uppercase' }}>{risk}</span>
    </span>
  );
}

function StatTile({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div style={{
      background: C.paper0, border: `1.5px solid ${C.steel200}`, borderRadius: 8,
      padding: 16, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, height: 4, background: color }}/>
      <div style={{
        fontSize: 36, fontWeight: 700, color: C.ink900,
        fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1,
        marginTop: 6,
      }}>{value}</div>
      <div style={{
        fontSize: 12, fontWeight: 700, color: C.ink500,
        letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 6,
      }}>{label}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: C.paper50, border: `1px solid ${C.steel200}`, borderRadius: 6, padding: '10px 12px' }}>
      <div style={{ fontSize: 24, fontWeight: 700, color: C.ink900,
                    fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                    letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function DBtn({
  kind = 'secondary', children, onClick, icon: IconC, size = 'md', disabled,
}: {
  kind?: 'primary' | 'secondary' | 'danger' | 'go' | 'ghost';
  children?: React.ReactNode;
  onClick?: () => void;
  icon?: React.ComponentType<{ size?: number }>;
  size?: 'md' | 'lg';
  disabled?: boolean;
}) {
  const palette = {
    primary:   { bg: C.hivis,    fg: C.ink900,  bd: C.hivis    },
    secondary: { bg: C.paper0,   fg: C.ink900,  bd: C.steel300 },
    danger:    { bg: C.stop,     fg: '#fff',    bd: C.stop     },
    go:        { bg: C.go,       fg: '#fff',    bd: C.go       },
    ghost:     { bg: 'transparent', fg: C.ink900, bd: 'transparent' },
  }[kind];
  const h = size === 'lg' ? 48 : 40;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      height: h, padding: size === 'lg' ? '0 22px' : '0 16px',
      borderRadius: 8, background: palette.bg, color: palette.fg,
      border: `1.5px solid ${palette.bd}`,
      fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
      letterSpacing: '0.01em', cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      {IconC && <IconC size={16}/>}
      {children}
    </button>
  );
}

function Topbar({ title, sub, right }: {
  title: string;
  sub?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div style={{
      height: 64, padding: '0 24px',
      background: C.paper0, borderBottom: `1.5px solid ${C.steel200}`,
      display: 'flex', alignItems: 'center', gap: 18, flexShrink: 0,
    }}>
      <div style={{ flex: 1 }}>
        {sub && <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                              letterSpacing: '0.06em', textTransform: 'uppercase' }}>{sub}</div>}
        <div style={{ fontSize: 20, fontWeight: 700, color: C.ink900, lineHeight: '24px' }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

function TMPSchematic() {
  return (
    <svg width="100%" viewBox="0 0 800 360" style={{ display: 'block', background: C.paper50, borderRadius: 6 }}>
      <defs>
        <pattern id="dg" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#DDE2E9" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="800" height="360" fill="url(#dg)"/>
      <rect x="60" y="150" width="680" height="80" fill="#A8B0BB"/>
      <line x1="60"  y1="190" x2="740" y2="190" stroke="#fff" strokeWidth="1.5" strokeDasharray="14 10"/>
      <line x1="60"  y1="150" x2="740" y2="150" stroke="#0B1220" strokeWidth="1.5"/>
      <line x1="60"  y1="230" x2="740" y2="230" stroke="#0B1220" strokeWidth="1.5"/>
      <rect x="180" y="150" width="500" height="40" fill="#FF6A00" opacity="0.55"/>
      <line x1="180" y1="150" x2="680" y2="190" stroke="#FF6A00" strokeWidth="1.5"/>
      <line x1="180" y1="190" x2="680" y2="150" stroke="#FF6A00" strokeWidth="1.5"/>
      {[120, 160, 200, 240, 280].map((x, i) => (
        <g key={i}>
          <polygon points={`${x},182 ${x+8},168 ${x+16},182`} fill="#FFC400" stroke="#0B1220" strokeWidth="1"/>
          <line x1={x+8} y1="182" x2={x+8} y2="192" stroke="#0B1220" strokeWidth="1"/>
        </g>
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 220 + i * 40;
        return <polygon key={i} points={`${x},195 ${x+5},182 ${x+10},195`} fill="#FF6A00" stroke="#0B1220" strokeWidth="0.8"/>;
      })}
      <rect x="690" y="170" width="22" height="14" fill="#fff" stroke="#0B1220" strokeWidth="1"/>
      <text x="701" y="180" textAnchor="middle" fontSize="6" fontWeight="700" fontFamily="Sansation, sans-serif">END</text>
      <line x1="180" y1="120" x2="680" y2="120" stroke="#0B1220" strokeWidth="0.8"/>
      <text x="430" y="114" textAnchor="middle" fontSize="11" fontWeight="700"
            fontFamily="Sansation, sans-serif" fill="#0B1220">2.40 km closure (Lane 2)</text>
      <text x="60"  y="270" fontSize="10" fontWeight="700" fontFamily="Sansation, sans-serif" fill="#5C6677" letterSpacing="0.06em">CH 22.6</text>
      <text x="170" y="270" fontSize="10" fontWeight="700" fontFamily="Sansation, sans-serif" fill="#5C6677" letterSpacing="0.06em">CH 24.6</text>
      <text x="670" y="270" fontSize="10" fontWeight="700" fontFamily="Sansation, sans-serif" fill="#5C6677" letterSpacing="0.06em">CH 27.0</text>
      <text x="720" y="270" fontSize="10" fontWeight="700" fontFamily="Sansation, sans-serif" fill="#5C6677" letterSpacing="0.06em">CH 28.0</text>
      <text x="40"  y="195" fontSize="10" fontWeight="700" fontFamily="Sansation, sans-serif" fill="#0B1220">NB →</text>
      <text x="40"  y="220" fontSize="10" fontFamily="Sansation, sans-serif" fill="#5C6677">M1</text>
    </svg>
  );
}

function QueueScreen({ onOpen }: { onOpen: (code: string) => void }) {
  return (
    <>
      <Topbar
        sub="Eastern region · 7 pending"
        title="Approval queue"
        right={
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px',
              height: 40, width: 280,
              background: C.paper0, border: `1.5px solid ${C.steel200}`, borderRadius: 8,
            }}>
              <IcSearch size={16} style={{ color: C.ink500 }}/>
              <input placeholder="Search TMP, submitter, depot…"
                     style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent',
                              fontFamily: 'inherit', fontSize: 13, color: C.ink900 }}/>
            </div>
            <DBtn icon={IcFilter}>Filters · 2</DBtn>
            <DBtn icon={IcDownload}>Export</DBtn>
            <DBtn kind="primary">New TMP</DBtn>
          </div>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ padding: 24, overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
            <StatTile value="7"  label="Pending review" color={C.caution}/>
            <StatTile value="2"  label="Variations"     color={C.info}/>
            <StatTile value="38" label="Active today"   color={C.hivis}/>
            <StatTile value="1"  label="Overdue · 24h+" color={C.stop}/>
          </div>
          <Card style={{ overflow: 'hidden' }} padding={0}>
            <div style={{
              padding: '14px 16px', borderBottom: `1px solid ${C.paper100}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['All · 142', 'Pending · 7', 'Variations · 2', 'My queue · 4', 'Rejected · 1'].map((t, i) => (
                  <button key={t} style={{
                    height: 32, padding: '0 12px', borderRadius: 6, border: 'none',
                    background: i === 1 ? C.paper100 : 'transparent',
                    color: i === 1 ? C.ink900 : C.ink500,
                    fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  }}>{t}</button>
                ))}
              </div>
              <span style={{ fontSize: 12, color: C.ink500, fontFamily: 'JetBrains Mono, monospace' }}>
                sort: oldest first
              </span>
            </div>
            <table className="tm-table">
              <thead>
                <tr>
                  <th style={{ width: 110 }}>TMP code</th>
                  <th>Title</th>
                  <th style={{ width: 120 }}>Submitter</th>
                  <th style={{ width: 80 }}>Crew</th>
                  <th style={{ width: 80 }}>Depot</th>
                  <th style={{ width: 110 }}>Risk</th>
                  <th style={{ width: 100 }}>Age</th>
                  <th style={{ width: 110 }}>Status</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {tmpQueue.map((t) => (
                  <tr key={t.code} onClick={() => onOpen(t.code)}>
                    <td><code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{t.code}</code></td>
                    <td style={{ fontWeight: 700 }}>{t.title}</td>
                    <td>{t.submitter}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{t.crew}</td>
                    <td><code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{t.depot}</code></td>
                    <td><RiskDot risk={t.risk}/></td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: C.ink700 }}>{t.age}</td>
                    <td><StatusCell status={t.status}/></td>
                    <td><IcChevR size={18} style={{ color: C.ink500 }}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right panel */}
        <div style={{
          borderLeft: `1.5px solid ${C.steel200}`, background: C.paper0,
          padding: 20, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                          letterSpacing: '0.06em', textTransform: 'uppercase' }}>Today · Wed 20 May</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>Your shift</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <MiniStat label="Approved"   value="14"/>
            <MiniStat label="Rejected"   value="1"/>
            <MiniStat label="Avg review" value="22m"/>
            <MiniStat label="In queue"   value="4"/>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                          letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Recent activity</div>
            {([
              ['14:02', 'TMP-4468', 'Approved', 'go'],
              ['13:48', 'TMP-4470', 'Sent for variation', 'info'],
              ['13:31', 'INC-228',  'Incident on TMP-4471', 'stop'],
              ['13:14', 'TMP-4464', 'Approved', 'go'],
              ['12:55', 'TMP-4463', 'Rejected · permit missing', 'stop'],
            ] as const).map(([t, code, msg, k], i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '46px auto 1fr', alignItems: 'center',
                gap: 10, padding: '8px 0', borderTop: i === 0 ? 'none' : `1px solid ${C.paper100}`,
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: C.ink500 }}>{t}</span>
                <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: C.ink900 }}>{code}</code>
                <span style={{ fontSize: 13, color: C.ink700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{
                    display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                    background: ({ go: C.go, stop: C.stop, info: C.info } as Record<string, string>)[k],
                    marginRight: 8, verticalAlign: 'middle',
                  }}/>
                  {msg}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function KV({ label, value, sub, mono }: { label: string; value: React.ReactNode; sub?: string; mono?: boolean }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                    letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink900, marginTop: 4,
                    fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.ink500, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function DetailScreen({ code, onBack, onAction }: {
  code: string;
  onBack: () => void;
  onAction: (action: string) => void;
}) {
  const t = tmpQueue.find(x => x.code === code) ?? tmpQueue[0];
  return (
    <>
      <Topbar
        sub={<span><span onClick={onBack} style={{ color: C.ink500, cursor: 'pointer' }}>Approval queue</span>&nbsp;/&nbsp;<code style={{ fontFamily: 'JetBrains Mono, monospace' }}>{t.code}</code></span>}
        title={t.title}
        right={
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Pill kind="caution">PENDING REVIEW</Pill>
            <DBtn icon={IcDownload}>Print TMP</DBtn>
            <DBtn icon={IcX} onClick={onBack}>Close</DBtn>
          </div>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ padding: 24, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={0} status="caution">
            <div style={{ padding: 18 }}>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <KV label="Submitted by" value={t.submitter} sub="J. Patel · Lead controller · DP-04"/>
                <KV label="Submitted" value="11:14" sub="3 h 12 m ago"/>
                <KV label="Permit" value="M1-NB-2026-118" mono/>
                <KV label="Risk" value={<RiskDot risk={t.risk}/>}/>
                <KV label="Crew" value={`${t.crew}`}/>
                <KV label="SWMS" value="V3 · current"/>
              </div>
            </div>
          </Card>

          <Card padding={0}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.paper100}`,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                             letterSpacing: '0.06em', textTransform: 'uppercase' }}>Schematic · Lane 2 closure</span>
              <DBtn>Open in editor</DBtn>
            </div>
            <div style={{ padding: 16 }}>
              <TMPSchematic/>
            </div>
          </Card>

          <Card title="Attached documents" padding={0}>
            {([
              ['SWMS_v3_2026-05-18.pdf',    '442 KB',  'caution'],
              ['Permit_M1-NB-2026-118.pdf', '128 KB',  'go'],
              ['Site_inspection_05-19.pdf', '1.2 MB',  'go'],
              ['Variation_request.docx',    '38 KB',   'info'],
            ] as const).map(([name, size, kind], i, a) => (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px',
                borderBottom: i < a.length - 1 ? `1px solid ${C.paper100}` : 'none',
              }}>
                <IcDoc size={20} style={{ color: C.ink500 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
                  <div style={{ fontSize: 12, color: C.ink500, fontFamily: 'JetBrains Mono, monospace' }}>{size}</div>
                </div>
                <Pill kind={kind}>{kind === 'go' ? 'CURRENT' : kind === 'caution' ? 'REVIEW' : 'INFO'}</Pill>
                <IcDownload size={16} style={{ color: C.ink500, cursor: 'pointer' }}/>
              </div>
            ))}
          </Card>
        </div>

        {/* Decision panel */}
        <div style={{
          borderLeft: `1.5px solid ${C.steel200}`, background: C.paper0,
          padding: 22, display: 'flex', flexDirection: 'column', gap: 18, overflow: 'auto',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                          letterSpacing: '0.06em', textTransform: 'uppercase' }}>Decision</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>Review and act</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <DBtn kind="go" size="lg" icon={IcCheck} onClick={() => onAction('approved')}>
              Approve {t.code}
            </DBtn>
            <DBtn kind="secondary" size="lg" onClick={() => onAction('variation')}>Request variation</DBtn>
            <DBtn kind="danger" size="lg" icon={IcX} onClick={() => onAction('rejected')}>Reject</DBtn>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                          letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Reviewer notes</div>
            <textarea rows={5} placeholder="Optional notes attached to decision…"
                      style={{
                        width: '100%', padding: 12, borderRadius: 6,
                        border: `1.5px solid ${C.steel200}`, background: C.paper50,
                        fontFamily: 'inherit', fontSize: 13, color: C.ink900,
                        resize: 'none', outline: 'none', lineHeight: '20px',
                      }}/>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                          letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Compliance check</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {([
                ['Permit valid for closure type', true],
                ['SWMS dated within 30 days',     true],
                ['Risk assessment complete',       true],
                ['Crew on roster for shift',       true],
                ['Conflicting TMP within 500 m',  false],
              ] as const).map(([label, ok], i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0',
                  fontSize: 13, color: C.ink700,
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: 4,
                    background: ok ? C.go : C.stop, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {ok ? <IcCheck size={14} sw={3}/> : <IcX size={14} sw={3}/>}
                  </span>
                  <span style={{ flex: 1 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Rail({ value, onChange }: { value: NavId; onChange: (id: NavId) => void }) {
  const items: Array<{ id: NavId; label: string; Icon: React.ComponentType<{ size?: number }>; count?: number }> = [
    { id: 'queue', label: 'Approval queue', Icon: IcInbox,  count: 7  },
    { id: 'tmps',  label: 'All TMPs',       Icon: IcDoc,    count: 142 },
    { id: 'map',   label: 'Network map',    Icon: IcMap },
    { id: 'stock', label: 'Inventory',      Icon: IcBox },
    { id: 'audit', label: 'Audit log',      Icon: IcShield },
  ];
  return (
    <div style={{
      width: 240, background: C.ink900, color: '#fff',
      display: 'flex', flexDirection: 'column', padding: '20px 0', flexShrink: 0,
    }}>
      <div style={{ padding: '0 18px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <img src="/assets/logo-wordmark-onDark.svg" height="32" alt="TrafficMan"/>
      </div>
      <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(({ id, label, Icon, count }) => {
          const active = value === id;
          return (
            <button key={id} onClick={() => onChange(id)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 8,
              background: active ? '#FFFFFF14' : 'transparent',
              color: active ? '#fff' : '#A8B0BB',
              border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 14, fontWeight: 700, textAlign: 'left',
              position: 'relative',
            }}>
              <Icon size={18}/>
              <span style={{ flex: 1 }}>{label}</span>
              {count != null && (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                  background: active ? C.hivis : '#2A3344',
                  color: active ? C.ink900 : '#D2D7E0',
                }}>{count}</span>
              )}
              {active && <div style={{
                position: 'absolute', left: -12, top: 8, bottom: 8, width: 3,
                background: C.hivis, borderRadius: 2,
              }}/>}
            </button>
          );
        })}
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{
        margin: '0 12px', padding: '12px 14px', borderRadius: 8,
        background: '#2A3344', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%', background: C.hivis, color: C.ink900,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13,
        }}>MO</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>M. Okafor</div>
          <div style={{ fontSize: 11, color: '#A8B0BB' }}>Snr Planner · Eastern</div>
        </div>
        <IcSettings size={18} style={{ color: '#A8B0BB' }}/>
      </div>
    </div>
  );
}

function PlaceholderScreen({ label }: { label: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.ink500, fontSize: 18, fontWeight: 700 }}>
      {label}
    </div>
  );
}

export function DesktopApp() {
  const [nav, setNav] = useState<NavId>('queue');
  const [openTmp, setOpenTmp] = useState<string | null>(null);

  const renderContent = () => {
    if (nav === 'queue') {
      if (openTmp) {
        return <DetailScreen code={openTmp} onBack={() => setOpenTmp(null)} onAction={() => setOpenTmp(null)}/>;
      }
      return <QueueScreen onOpen={setOpenTmp}/>;
    }
    return <PlaceholderScreen label={nav === 'tmps' ? 'All TMPs' : nav === 'map' ? 'Network map' : nav === 'stock' ? 'Inventory' : 'Audit log'}/>;
  };

  return (
    <div style={{
      width: '100%', height: '100%', background: C.paper50,
      display: 'grid', gridTemplateColumns: '240px 1fr',
      fontFamily: 'var(--font-ui)', color: C.ink900,
      overflow: 'hidden',
    }}>
      <Rail value={nav} onChange={setNav}/>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {renderContent()}
      </div>
    </div>
  );
}
