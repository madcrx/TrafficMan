import React, { useState } from 'react';
import { C } from '../../components/tokens';
import { Pill } from '../../components/Pill';
import { IcChevD, IcDownload, IcSearch } from '../../components/Icons';

const auditRows = [
  ['14:23:08', 'M. Okafor', 'TMP-4468', 'Approved',            'TMP',  'go',      'M2 NB · Pothole repair'],
  ['14:18:42', 'J. Patel',  'INC-229',  'Submitted',           'INC',  'caution', 'Cone struck · M1 NB CH 25.8'],
  ['14:14:11', 'System',    'TMP-4471', 'Variation requested', 'TMP',  'info',    'Crew 12 · weather'],
  ['14:02:55', 'M. Okafor', 'TMP-4471', 'Approved',            'TMP',  'go',      'M1 NB · Lane 2 closure'],
  ['13:48:02', 'M. Okafor', 'TMP-4470', 'Sent for variation',  'TMP',  'info',    'Risk re-assessment needed'],
  ['13:31:55', 'J. Patel',  'INC-228',  'Closed',              'INC',  'go',      'Replaced cone · no injury'],
  ['13:14:08', 'M. Okafor', 'TMP-4464', 'Approved',            'TMP',  'go',      'M5 SB · Median works'],
  ['12:58:21', 'L. Volpi',  'TMP-4469', 'Submitted',           'TMP',  'caution', 'Princes Hwy · Bridge inspection'],
  ['12:55:14', 'M. Okafor', 'TMP-4463', 'Rejected',            'TMP',  'stop',    'Permit number missing'],
  ['12:41:36', 'A. Diallo', 'SH-2026-0520-CR04', 'Signed off prestart', 'CREW', 'go', '8/8 tasks · M. Singh'],
  ['12:33:00', 'System',    'TMP-4458', 'Expired',             'TMP',  'stop',    'Closure window passed'],
  ['12:22:48', 'D. Ng',     'TMP-4470', 'Submitted',           'TMP',  'caution', 'M4 SB · Shoulder works'],
  ['12:10:11', 'M. Okafor', 'TMP-4456', 'Approved',            'TMP',  'go',      'CBD · Castlereagh St'],
  ['11:58:02', 'J. Patel',  'SH-2026-0520-AM', 'Signed on',   'CREW', 'go',      'Crew of 4 · DP-04'],
  ['11:44:55', 'System',    'TMP-4471', 'Pending review',      'TMP',  'caution', 'Routed to Okafor · auto'],
  ['11:14:28', 'J. Patel',  'TMP-4471', 'Submitted',           'TMP',  'caution', 'M1 NB · Lane 2 · 2.4 km'],
  ['10:58:09', 'M. Okafor', 'TMP-4452', 'Approved',            'TMP',  'go',      'Western Distrib · Lane 1'],
  ['10:42:33', 'R. Lin',    'INC-227',  'Submitted',           'INC',  'caution', 'Sign damaged · TC-201 #2'],
  ['10:18:14', 'System',    'AUDIT-Q2', 'Report generated',    'SYS',  'info',    'Q2 compliance · 142 TMPs'],
  ['09:55:48', 'M. Okafor', 'TMP-4448', 'Approved',            'TMP',  'go',      'M7 NB · Sign replacement'],
] as const;

type AuditKind = 'all' | 'TMP' | 'INC' | 'CREW' | 'SYS';

// ─── Components ────────────────────────────────────────────────

function WBtn({
  kind = 'secondary', children, onClick, icon: IconC,
}: {
  kind?: 'primary' | 'secondary' | 'ghost';
  children?: React.ReactNode;
  onClick?: () => void;
  icon?: React.ComponentType<{ size?: number }>;
}) {
  const palette = {
    primary:   { bg: C.hivis,    fg: C.ink900,  bd: C.hivis    },
    secondary: { bg: C.paper0,   fg: C.ink900,  bd: C.steel300 },
    ghost:     { bg: 'transparent', fg: C.ink900, bd: 'transparent' },
  }[kind];
  return (
    <button onClick={onClick} style={{
      height: 36, padding: '0 14px', borderRadius: 6,
      background: palette.bg, color: palette.fg, border: `1.5px solid ${palette.bd}`,
      fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    }}>
      {IconC && <IconC size={15}/>}
      {children}
    </button>
  );
}

function AppBar() {
  return (
    <div style={{
      height: 56, background: C.ink900,
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 24, color: '#fff', flexShrink: 0,
    }}>
      <img src="/assets/logo-wordmark-onDark.svg" height="26" alt="TrafficMan"/>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                     textTransform: 'uppercase', color: '#A8B0BB' }}>SUPERVISE</span>
      <span style={{ width: 1, height: 24, background: '#2A3344' }}/>
      <button style={{
        background: 'transparent', border: '1px solid #2A3344',
        height: 32, padding: '0 12px', borderRadius: 6,
        display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
        color: '#fff', fontFamily: 'inherit', fontSize: 13, fontWeight: 700,
      }}>
        Eastern region <IcChevD size={14}/>
      </button>
      <div style={{ flex: 1, display: 'flex', gap: 4 }}>
        {(['Overview', 'Compliance & audit', 'TMPs', 'Incidents', 'Reports'] as const).map((t) => (
          <button key={t} style={{
            background: 'transparent', border: 'none',
            height: 56, padding: '0 16px', cursor: 'pointer',
            color: t === 'Compliance & audit' ? '#fff' : '#A8B0BB',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 700, position: 'relative',
          }}>
            {t}
            {t === 'Compliance & audit' && (
              <span style={{
                position: 'absolute', left: 16, right: 16, bottom: 0, height: 3,
                background: C.hivis, borderRadius: '2px 2px 0 0',
              }}/>
            )}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#A8B0BB' }}>
          ▲ SYNC 14:23:08
        </span>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: C.hivis, color: C.ink900,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12,
        }}>MO</div>
      </div>
    </div>
  );
}

function KPI({ value, unit, label, trend, color = C.ink900, status }: {
  value: string; unit?: string; label: string; trend?: string; color?: string; status?: string;
}) {
  const up = trend?.startsWith('+') ?? false;
  return (
    <div style={{
      background: C.paper0, border: `1.5px solid ${C.steel200}`, borderRadius: 8,
      padding: 18, position: 'relative', overflow: 'hidden', minHeight: 116,
    }}>
      {status && <div style={{ position: 'absolute', inset: 0, height: 4, background: status }}/>}
      <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                    letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 6 }}>{label}</div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontSize: 38, fontWeight: 700, color,
          fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1,
        }}>{value}</span>
        {unit && <span style={{ fontSize: 16, fontWeight: 700, color: C.ink500 }}>{unit}</span>}
      </div>
      {trend && (
        <div style={{ marginTop: 8, fontSize: 12, color: C.ink500, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            display: 'inline-block', width: 0, height: 0,
            borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
            borderBottom: up ? `5px solid ${C.go}` : `5px solid ${C.stop}`,
            transform: up ? 'none' : 'rotate(180deg)',
          }}/>
          {trend} <span style={{ color: C.ink500 }}>vs last week</span>
        </div>
      )}
    </div>
  );
}

function StackedBar({ data }: { data: Array<{ label: string; value: number; color: string }> }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <div>
      <div style={{ display: 'flex', height: 16, borderRadius: 6, overflow: 'hidden', border: `1px solid ${C.steel200}` }}>
        {data.map((d, i) => (
          <div key={i} style={{ width: `${(d.value / total) * 100}%`, background: d.color }} title={`${d.label} · ${d.value}`}/>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: d.color }}/>
            <span style={{ fontSize: 13, color: C.ink700 }}>
              <b style={{ color: C.ink900, fontWeight: 700 }}>{d.value}</b> {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main dashboard ─────────────────────────────────────────────

export function DashboardApp() {
  const [q,    setQ]    = useState('');
  const [kind, setKind] = useState<AuditKind>('all');

  const rows = auditRows.filter(r => {
    if (kind !== 'all' && r[4] !== kind) return false;
    if (!q) return true;
    return r.some(x => String(x).toLowerCase().includes(q.toLowerCase()));
  });

  return (
    <div style={{ background: C.paper50, minHeight: '100%', fontFamily: 'var(--font-ui)', color: C.ink900, display: 'flex', flexDirection: 'column' }}>
      <AppBar/>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                          letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Compliance & audit · Eastern region
            </div>
            <h1 style={{ margin: '4px 0 0', fontSize: 28, fontWeight: 700, color: C.ink900, letterSpacing: '-0.005em' }}>
              Last 24 hours
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <WBtn icon={IcDownload}>Export CSV</WBtn>
            <WBtn icon={IcDownload}>Audit pack (PDF)</WBtn>
            <WBtn kind="primary">Generate Q2 report</WBtn>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          <KPI value="98.4" unit="%" label="Compliance · 24 h" trend="+0.6%" color={C.go}   status={C.go}/>
          <KPI value="38"          label="Active TMPs"          trend="+4"   color={C.hivis} status={C.hivis}/>
          <KPI value="3"           label="Incidents · 24 h"     trend="−1"   color={C.caution} status={C.caution}/>
          <KPI value="1"           label="Overdue · 24 h+"      trend="0"    color={C.stop}  status={C.stop}/>
          <KPI value="100" unit="%" label="Prestart sign-on"   trend="+2.1%" color={C.go}   status={C.go}/>
        </div>

        <div style={{ background: C.paper0, border: `1.5px solid ${C.steel200}`, borderRadius: 8, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.ink500,
                            letterSpacing: '0.06em', textTransform: 'uppercase' }}>TMPs by status</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>142 total · this region</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <WBtn>This week</WBtn>
              <WBtn icon={IcChevD}>Group: depot</WBtn>
            </div>
          </div>
          <StackedBar data={[
            { label: 'Active',    value: 38, color: C.hivis   },
            { label: 'Approved',  value: 78, color: C.go      },
            { label: 'Pending',   value: 14, color: C.caution },
            { label: 'Variation', value: 8,  color: C.info    },
            { label: 'Rejected',  value: 4,  color: C.stop    },
          ]}/>
        </div>

        <div style={{ background: C.paper0, border: `1.5px solid ${C.steel200}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 18px', borderBottom: `1px solid ${C.paper100}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Audit log · {rows.length} events</h2>
              <Pill kind="neutral">IMMUTABLE</Pill>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0 12px', height: 36, width: 260,
                background: C.paper50, border: `1.5px solid ${C.steel200}`, borderRadius: 6,
              }}>
                <IcSearch size={15} style={{ color: C.ink500 }}/>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actor, code, action…"
                       style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent',
                                fontFamily: 'inherit', fontSize: 13, color: C.ink900 }}/>
              </div>
              {(['all', 'TMP', 'INC', 'CREW', 'SYS'] as const).map(k => (
                <button key={k} onClick={() => setKind(k)} style={{
                  height: 36, padding: '0 12px', borderRadius: 6,
                  background: kind === k ? C.ink900 : 'transparent',
                  color: kind === k ? '#fff' : C.ink700,
                  border: `1.5px solid ${kind === k ? C.ink900 : C.steel200}`,
                  fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer',
                }}>{k}</button>
              ))}
            </div>
          </div>
          <table className="audit">
            <thead>
              <tr>
                <th style={{ width: 96 }}>Time</th>
                <th style={{ width: 140 }}>Actor</th>
                <th style={{ width: 70 }}>Kind</th>
                <th style={{ width: 180 }}>Entity</th>
                <th style={{ width: 130 }}>Action</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const dotColor = ({ go: C.go, stop: C.stop, caution: C.caution, info: C.info } as Record<string, string>)[r[5]];
                return (
                  <tr key={i}>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: C.ink500 }}>{r[0]}</td>
                    <td>{r[1]}</td>
                    <td><Pill kind="neutral">{r[4]}</Pill></td>
                    <td><code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{r[2]}</code></td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor }}/>
                        <span style={{ fontWeight: 700 }}>{r[3]}</span>
                      </span>
                    </td>
                    <td style={{ color: C.ink700 }}>{r[6]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
