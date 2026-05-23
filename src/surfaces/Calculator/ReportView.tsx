import { useState } from 'react';
import { C } from '../../components/tokens';
import { createShare } from './shareApi';
import type { CalculationResult } from './engine';
import type { WizardInputs, Zone } from './types';
import { WORKS_TYPE_LABELS } from './standards';
import { TGSSchematic } from './TGSSchematic';
import { QueueAnalysis } from './QueueAnalysis';
import { FieldView } from './FieldView';
import type { HistoryEntry } from './CalculatorApp';

const PRINT_CSS = `
@media print {
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { background: white !important; margin: 0; padding: 0; font-size: 11pt; }
  .no-print { display: none !important; }
  .report-wrap { max-width: 100% !important; padding: 0 !important; }
  .report-page { box-shadow: none !important; border-radius: 0 !important; padding: 16pt !important; }
  .metric-cards { grid-template-columns: repeat(4, 1fr) !important; }
  .page-break { page-break-before: always; }
  table { page-break-inside: avoid; }
  tr { page-break-inside: avoid; }
  h3 { page-break-after: avoid; }
  .warn-box { background: #fff3cd !important; border-color: #f0ad4e !important; }
  .note-box { background: #f8f9fa !important; }
}
`;

interface Props {
  result: CalculationResult;
  inputs: WizardInputs;
  onBack: () => void;
  onNew?: () => void;
  history?: HistoryEntry[];
  onLoadHistory?: (entry: HistoryEntry) => void;
  zones?: Zone[];
  activeZoneId?: number | null;
  onAddZone?: () => void;
  onSwitchZone?: (zone: Zone) => void;
  onRenameZone?: (id: number, name: string) => void;
  onDeleteZone?: (id: number) => void;
}

function MetricCard({ label, value, unit, color = C.hivis }: {
  label: string; value: string | number; unit?: string; color?: string;
}) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
      borderRadius: 10, padding: '16px 20px',
      borderTop: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--fg-subtle)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--fg-default)', lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg-subtle)', marginLeft: 4 }}>{unit}</span>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{
        margin: '0 0 14px', fontSize: 13, fontWeight: 700,
        color: 'var(--fg-subtle)', letterSpacing: '0.07em', textTransform: 'uppercase',
        paddingBottom: 8, borderBottom: '1.5px solid var(--border-default)',
      }}>{title}</h3>
      {children}
    </div>
  );
}

function TmTable({ heads, rows, small }: { heads: string[]; rows: (string | number)[][]; small?: boolean }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: small ? 13 : 14 }}>
        <thead>
          <tr>
            {heads.map((h, i) => (
              <th key={i} style={{
                textAlign: 'left', padding: '8px 12px', background: 'var(--paper-50)',
                fontSize: 11, fontWeight: 700, color: 'var(--fg-subtle)',
                letterSpacing: '0.07em', textTransform: 'uppercase',
                borderBottom: '1.5px solid var(--border-default)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 1 ? 'var(--paper-50)' : 'transparent' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: '9px 12px', borderBottom: '1px solid var(--border-default)',
                  color: 'var(--fg-default)', verticalAlign: 'top',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WarnBox({ text, kind = 'warn' }: { text: string; kind?: 'warn' | 'note' | 'info' }) {
  const colors = {
    warn:  { bg: '#FFF7D6', border: '#D9A600', dot: C.caution },
    note:  { bg: 'var(--paper-50)', border: 'var(--border-default)', dot: C.info },
    info:  { bg: '#E5F1FF', border: '#0A84FF', dot: C.info },
  }[kind];
  return (
    <div className={kind === 'warn' ? 'warn-box' : 'note-box'} style={{
      background: colors.bg, borderLeft: `3px solid ${colors.border}`,
      borderRadius: '0 6px 6px 0', padding: '10px 14px', marginBottom: 8,
      display: 'flex', gap: 10, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%', background: colors.dot,
        flexShrink: 0, marginTop: 5,
      }}/>
      <span style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: '1.5' }}>{text}</span>
    </div>
  );
}

function controlMethodLabel(method: string, n: number): string {
  switch (method) {
    case 'stop_slow_bats': return `Traffic Controller — STOP/SLOW bat${n > 1 ? ` (${n} operators)` : ''}`;
    case 'portable_signals': return 'Portable Traffic Lights (PTL)';
    case 'boom_gate': return 'Boom Gate (automated barrier)';
    case 'pilot_vehicle': return 'Pilot Vehicle';
    case 'police': return `Police Control${n > 1 ? ` (${n} officers)` : ''}`;
    default: return 'Signs only (no PTCD)';
  }
}

function stateStdSummary(state: string): string {
  if (state === 'WA') return 'Main Roads WA COP';
  if (state === 'QLD') return 'QGTTM (TMR)';
  return 'AGTTM / AS 1742.3';
}

function distRef(ref: string, state: string): string {
  const waMap: Record<string, string> = {
    'AS 1742.3 Table 2.2': 'WA COP (Sign spacing)',
    'AS 1742.3 Table 2.3': 'WA COP (Sight distance)',
    'AGTTM Table 5.7': 'WA COP (Taper lengths)',
    'AGTTM Table 5.8': 'WA COP (Taper separation)',
    'AGTTM Table 4.2': 'WA COP (Cone spacing)',
    'AGTTM Table 5.5': 'WA COP (Temp speed zone length)',
  };
  const qldMap: Record<string, string> = {
    'AS 1742.3 Table 2.2': 'QGTTM (Sign spacing)',
    'AS 1742.3 Table 2.3': 'QGTTM (Sight distance)',
    'AGTTM Table 5.7': 'QGTTM (Taper lengths)',
    'AGTTM Table 5.8': 'QGTTM (Taper separation)',
    'AGTTM Table 4.2': 'QGTTM (Cone spacing)',
    'AGTTM Table 5.5': 'QGTTM (Temp speed zone length)',
  };
  if (state === 'WA') return waMap[ref] ?? ref;
  if (state === 'QLD') return qldMap[ref] ?? ref;
  return ref;
}

// Criteria status badge
function CriteriaBadge({ status }: { status: 'pass' | 'fail' | 'check' }) {
  const config = {
    pass:  { bg: '#D4EDDA', color: '#155724', label: '✓ Pass' },
    fail:  { bg: '#F8D7DA', color: '#721C24', label: '✗ Fail' },
    check: { bg: '#FFF3CD', color: '#856404', label: '? Check' },
  }[status];
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 20,
      background: config.bg, color: config.color,
      fontSize: 11, fontWeight: 700, flexShrink: 0,
    }}>{config.label}</span>
  );
}

type ShareState = 'idle' | 'sharing' | 'copied' | 'error';

export function ReportView({ result: r, inputs: inp, onBack, onNew, history = [], onLoadHistory, zones = [], activeZoneId, onAddZone, onSwitchZone, onRenameZone, onDeleteZone }: Props) {
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [shareState, setShareState] = useState<ShareState>('idle');
  const [showSummary, setShowSummary] = useState(false);
  const [showFieldView, setShowFieldView] = useState(false);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleShare = async () => {
    setShareState('sharing');
    try {
      const url = await createShare(inp, zones);
      await navigator.clipboard.writeText(url);
      setShareState('copied');
    } catch {
      setShareState('error');
    }
    setTimeout(() => setShareState('idle'), 3000);
  };

  const handlePrint = () => {
    const existing = document.getElementById('tm-print-css');
    if (!existing) {
      const style = document.createElement('style');
      style.id = 'tm-print-css';
      style.textContent = PRINT_CSS;
      document.head.appendChild(style);
    }
    window.print();
  };

  const handleDownloadPDF = async () => {
    setPdfGenerating(true);
    try {
      const [{ pdf }, { TMPDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./TMPDocument'),
      ]);
      const element = TMPDocument({ result: r, inputs: inp });
      const blob = await pdf(element as Parameters<typeof pdf>[0]).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(inp.projectName || 'TMP').replace(/[^a-z0-9]/gi, '_')}-${inp.date}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed — try Print / Save PDF instead.');
    } finally {
      setPdfGenerating(false);
    }
  };

  const dr = (ref: string) => distRef(ref, inp.state);
  const distRows: (string | number)[][] = [
    ['Approach sign spacing', `${r.approachSignSpacing} m`, dr('AS 1742.3 Table 2.2')],
    ['Sight distance to controller', `${r.sightDistanceM} m`, dr('AS 1742.3 Table 2.3')],
    ['Merge / approach taper', `${r.mergeTaperLength} m`, dr('AGTTM Table 5.7')],
    ['Lateral shift taper', `${r.lateralShiftTaper} m`, dr('AGTTM Table 5.7')],
    ['Buffer zone (minimum)', `${r.bufferZoneLength} m`, dr('AGTTM Table 5.7')],
    ['Distance between tapers', `${r.distBetweenTapers} m`, dr('AGTTM Table 5.8')],
    ['Cone spacing (through zone)', `${r.coneSpacingM} m`, dr('AGTTM Table 4.2')],
    ['Cone spacing (within taper)', `${r.coneSpacingTaperM} m`, dr('AGTTM Table 4.2')],
    ['Min. temp speed zone length', `${r.minTempZoneLength} m`, dr('AGTTM Table 5.5')],
  ];

  const approachRows = r.approachSigns.map(s => [
    s.sequence, s.code, s.description,
    s.distanceFromTaperStart < 0 ? `${Math.abs(s.distanceFromTaperStart)} m upstream` : s.distanceFromTaperStart === 0 ? 'At taper start' : `${s.distanceFromTaperStart} m downstream`,
    s.notes,
  ]);

  const departureRows = r.departureSigns.map(s => [
    s.sequence, s.code, s.description,
    `${s.distanceFromTaperStart} m from approach taper start`,
    s.notes,
  ]);

  const eqRows = r.equipment.map(e => [e.item, e.quantity, e.specification]);
  const speedStepRows = r.speedReductionSteps.map(s => [
    `${s.from} km/h → ${s.to} km/h`, s.method,
    `${s.from - s.to} km/h reduction`,
  ]);

  const failCount = r.criteriaChecks.filter(c => c.status === 'fail').length;
  const checkCount = r.criteriaChecks.filter(c => c.status === 'check').length;
  const passCount = r.criteriaChecks.filter(c => c.status === 'pass').length;

  return (
    <div className="report-wrap" style={{
      flex: 1, overflow: 'auto', background: 'var(--bg-app)',
      padding: '32px 32px', fontFamily: 'var(--font-ui)',
    }}>

      {/* Action bar */}
      <div className="no-print" style={{
        maxWidth: 900, margin: '0 auto 24px', display: 'flex', gap: 12, alignItems: 'center',
      }}>
        <button onClick={onBack} style={{
          padding: '9px 20px', borderRadius: 8, border: '1.5px solid var(--border-default)',
          background: 'var(--bg-surface)', color: 'var(--fg-default)',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}>← Edit Inputs</button>

        {onNew && (
          <button onClick={onNew} style={{
            padding: '9px 20px', borderRadius: 8, border: '1.5px solid var(--border-default)',
            background: 'var(--bg-surface)', color: 'var(--fg-default)',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>+ New Project</button>
        )}

        {onAddZone && (
          <button onClick={onAddZone} style={{
            padding: '9px 20px', borderRadius: 8, border: '1.5px solid var(--border-default)',
            background: 'var(--bg-surface)', color: 'var(--fg-default)',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>+ Add Zone</button>
        )}

        {history.length > 0 && onLoadHistory && (
          <select
            aria-label="Load previous calculation"
            onChange={e => {
              const entry = history.find(h => h.id === parseInt(e.target.value));
              if (entry) onLoadHistory(entry);
              e.target.value = '';
            }}
            defaultValue=""
            style={{
              padding: '9px 14px', borderRadius: 8, border: '1.5px solid var(--border-default)',
              background: 'var(--bg-surface)', color: 'var(--fg-default)',
              fontSize: 14, fontFamily: 'inherit', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="" disabled>📋 Load previous ({history.length})</option>
            {[...history].reverse().map(h => (
              <option key={h.id} value={h.id}>
                {h.timestamp} — {h.inputs.projectName || 'Unnamed'} ({WORKS_TYPE_LABELS[h.inputs.worksType]?.split('—')[0].trim()})
              </option>
            ))}
          </select>
        )}

        <div style={{ flex: 1 }}/>

        <button
          onClick={handleShare}
          disabled={shareState === 'sharing'}
          style={{
            padding: '9px 20px', borderRadius: 8,
            border: `1.5px solid ${shareState === 'copied' ? '#28A745' : shareState === 'error' ? '#DC3545' : 'var(--border-default)'}`,
            background: shareState === 'copied' ? '#D4EDDA' : shareState === 'error' ? '#F8D7DA' : 'var(--bg-surface)',
            color: shareState === 'copied' ? '#155724' : shareState === 'error' ? '#721C24' : 'var(--fg-default)',
            fontSize: 14, fontWeight: 700, cursor: shareState === 'sharing' ? 'wait' : 'pointer',
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          {shareState === 'sharing' ? (
            '…'
          ) : shareState === 'copied' ? (
            '✓ Link copied'
          ) : shareState === 'error' ? (
            '✗ Share failed'
          ) : (
            <>
              <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              Share
            </>
          )}
        </button>

        <button onClick={handleDownloadPDF} disabled={pdfGenerating} style={{
          padding: '9px 20px', borderRadius: 8, border: 'none',
          background: C.hivis, color: C.ink900,
          fontSize: 14, fontWeight: 700, cursor: pdfGenerating ? 'wait' : 'pointer',
          fontFamily: 'inherit', opacity: pdfGenerating ? 0.7 : 1,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {pdfGenerating ? 'Generating…' : 'Download PDF'}
        </button>

        <button onClick={handlePrint} style={{
          padding: '9px 16px', borderRadius: 8, border: '1.5px solid var(--border-default)',
          background: 'var(--bg-surface)', color: 'var(--fg-default)',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print
        </button>

        <button onClick={() => setShowFieldView(true)} style={{
          padding: '9px 16px', borderRadius: 8, border: '1.5px solid var(--border-default)',
          background: 'var(--bg-surface)', color: 'var(--fg-default)',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          📱 Field View
        </button>
      </div>

      {/* Zone strip — shown when 2+ zones exist */}
      {zones.length > 1 && (
        <div className="no-print" style={{
          maxWidth: 900, margin: '0 auto 16px',
          display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap',
        }}>
          {zones.map(zone => {
            const active = zone.id === activeZoneId && !showSummary;
            return renamingId === zone.id ? (
              <form key={zone.id} onSubmit={e => { e.preventDefault(); onRenameZone?.(zone.id, renameValue || zone.name); setRenamingId(null); }} style={{ display: 'flex', gap: 4 }}>
                <input
                  autoFocus
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  onBlur={() => { onRenameZone?.(zone.id, renameValue || zone.name); setRenamingId(null); }}
                  style={{ padding: '5px 10px', borderRadius: 6, border: `1.5px solid ${C.hivis}`, fontSize: 13, fontFamily: 'inherit', width: 130 }}
                />
              </form>
            ) : (
              <div key={zone.id} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <button
                  onClick={() => { setShowSummary(false); onSwitchZone?.(zone); }}
                  style={{
                    padding: '6px 14px', borderRadius: '6px 0 0 6px',
                    border: `1.5px solid ${active ? C.hivis : 'var(--border-default)'}`,
                    borderRight: 'none',
                    background: active ? C.hivis : 'var(--bg-surface)',
                    color: active ? C.ink900 : 'var(--fg-default)',
                    fontSize: 13, fontWeight: active ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >{zone.name}</button>
                <button
                  onClick={() => { setRenamingId(zone.id); setRenameValue(zone.name); }}
                  title="Rename zone"
                  style={{
                    padding: '6px 7px', borderRadius: 0,
                    border: `1.5px solid ${active ? C.hivis : 'var(--border-default)'}`,
                    borderRight: 'none', borderLeft: 'none',
                    background: active ? C.hivis : 'var(--bg-surface)',
                    color: active ? C.ink900 : 'var(--fg-subtle)',
                    fontSize: 11, cursor: 'pointer', lineHeight: 1,
                  }}
                >✎</button>
                {zones.length > 1 && (
                  <button
                    onClick={() => onDeleteZone?.(zone.id)}
                    title="Delete zone"
                    style={{
                      padding: '6px 7px', borderRadius: '0 6px 6px 0',
                      border: `1.5px solid ${active ? C.hivis : 'var(--border-default)'}`,
                      background: active ? C.hivis : 'var(--bg-surface)',
                      color: active ? C.ink900 : 'var(--fg-subtle)',
                      fontSize: 11, cursor: 'pointer', lineHeight: 1,
                    }}
                  >✕</button>
                )}
              </div>
            );
          })}
          <button
            onClick={() => { setShowSummary(true); }}
            style={{
              padding: '6px 14px', borderRadius: 6,
              border: `1.5px solid ${showSummary ? C.info : 'var(--border-default)'}`,
              background: showSummary ? '#E5F1FF' : 'var(--bg-surface)',
              color: showSummary ? C.info : 'var(--fg-subtle)',
              fontSize: 13, fontWeight: showSummary ? 700 : 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >⊞ Summary</button>
          {onAddZone && (
            <button
              onClick={onAddZone}
              style={{
                padding: '6px 14px', borderRadius: 6,
                border: '1.5px dashed var(--border-default)',
                background: 'transparent', color: 'var(--fg-subtle)',
                fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >+ Add Zone</button>
          )}
        </div>
      )}

      {/* Project summary view */}
      {showSummary && zones.length > 1 && (
        <ProjectSummary zones={zones} onSwitchZone={z => { setShowSummary(false); onSwitchZone?.(z); }} />
      )}

      {/* Report body */}
      {!showSummary && <div className="report-page" style={{
        maxWidth: 900, margin: '0 auto', background: 'var(--bg-surface)',
        borderRadius: 12, boxShadow: 'var(--elev-2)', padding: '32px 40px',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C.hivis, marginBottom: 6,
            }}>Traffic Management Calculator Report</div>
            <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: 'var(--fg-default)' }}>
              {inp.projectName || 'Unnamed Project'}
            </h1>
            <div style={{ color: 'var(--fg-muted)', fontSize: 14 }}>
              {inp.projectRef && <span style={{ marginRight: 16 }}>Ref: {inp.projectRef}</span>}
              {inp.location && <span style={{ marginRight: 16 }}>{inp.location}</span>}
              {inp.date && <span>{inp.date}</span>}
            </div>
            {inp.lat != null && inp.lng != null && (
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>Coordinates:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: C.hivis }}>
                  {inp.lat.toFixed(5)}°, {inp.lng.toFixed(5)}°
                </span>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${inp.lat}&mlon=${inp.lng}&zoom=16`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 11, color: C.info }}
                >View on map ↗</a>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              display: 'inline-block', padding: '6px 14px', borderRadius: 20,
              background: C.hivis, color: C.ink900,
              fontSize: 13, fontWeight: 700,
            }}>{inp.state}</div>
            <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 6, maxWidth: 200, lineHeight: 1.4 }}>
              {stateStdSummary(inp.state)}
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
          marginBottom: 4, padding: '12px 16px',
          background: 'var(--paper-50)', borderRadius: 8, fontSize: 13,
        }}>
          <div><span style={{ color: 'var(--fg-subtle)' }}>Prepared by: </span><strong>{inp.preparedBy || '—'}</strong></div>
          <div><span style={{ color: 'var(--fg-subtle)' }}>Road: </span><strong>{inp.roadName || '—'} ({inp.classification})</strong></div>
          <div><span style={{ color: 'var(--fg-subtle)' }}>Design step: </span><strong>{r.designStepName}</strong></div>
          <div><span style={{ color: 'var(--fg-subtle)' }}>Posted speed: </span><strong>{inp.postedSpeed} km/h</strong></div>
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-default)', paddingTop: 8, marginTop: 4 }}>
            <span style={{ color: 'var(--fg-subtle)' }}>Traffic control: </span>
            <strong style={{ color: inp.controlMethod === 'none' ? 'var(--fg-default)' : C.hivis }}>
              {controlMethodLabel(inp.controlMethod, inp.numberOfControllers)}
            </strong>
            {inp.controlMethod !== 'none' && inp.controlMethod !== 'pilot_vehicle' && (
              <span style={{
                marginLeft: 10, fontSize: 11, fontWeight: 700,
                padding: '2px 8px', borderRadius: 10,
                background: '#FFF3E9', color: C.hivis,
              }}>PTCD</span>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 32 }} />

        {/* Warnings */}
        {r.warnings.length > 0 && (
          <Section title="⚠ Warnings — Review Before Proceeding">
            {r.warnings.map((w, i) => <WarnBox key={i} text={w} kind="warn" />)}
          </Section>
        )}

        {/* Design Step & Eligibility Criteria */}
        <Section title={`Design Step — ${r.designStepName}`}>
          <div style={{
            background: 'var(--paper-50)', borderRadius: 8, padding: '14px 16px', marginBottom: 16,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-default)' }}>{r.designStepName}</div>
                <div style={{ fontSize: 12, color: C.hivis, fontWeight: 700, marginTop: 2 }}>{r.designStepRef}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginLeft: 12 }}>
                {passCount > 0 && <span style={{ padding: '3px 10px', borderRadius: 20, background: '#D4EDDA', color: '#155724', fontSize: 12, fontWeight: 700 }}>✓ {passCount} pass</span>}
                {checkCount > 0 && <span style={{ padding: '3px 10px', borderRadius: 20, background: '#FFF3CD', color: '#856404', fontSize: 12, fontWeight: 700 }}>? {checkCount} check</span>}
                {failCount > 0 && <span style={{ padding: '3px 10px', borderRadius: 20, background: '#F8D7DA', color: '#721C24', fontSize: 12, fontWeight: 700 }}>✗ {failCount} fail</span>}
              </div>
            </div>
            {r.designStepDescription && (
              <div style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5, marginTop: 4 }}>
                {r.designStepDescription}
              </div>
            )}
          </div>

          {/* Eligibility criteria */}
          {r.criteriaChecks.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                Eligibility Criteria
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {r.criteriaChecks.map(c => (
                  <div key={c.id} style={{
                    border: `1px solid ${c.status === 'fail' ? '#F5C6CB' : c.status === 'pass' ? '#C3E6CB' : 'var(--border-default)'}`,
                    borderLeft: `4px solid ${c.status === 'fail' ? '#DC3545' : c.status === 'pass' ? '#28A745' : '#FFC107'}`,
                    borderRadius: '0 8px 8px 0', padding: '10px 14px',
                    background: c.status === 'fail' ? '#FFF5F5' : c.status === 'pass' ? '#F8FFF9' : 'var(--paper-50)',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}>
                    <div style={{ flexShrink: 0, marginTop: 1 }}>
                      <CriteriaBadge status={c.status} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.5 }}>{c.criterion}</div>
                      {c.detail && (
                        <div style={{ fontSize: 12, color: c.status === 'fail' ? '#721C24' : 'var(--fg-subtle)', marginTop: 4 }}>
                          {c.detail}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mandatory requirements */}
          {r.mandatoryRequirements.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                Mandatory Requirements
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {r.mandatoryRequirements.map((req, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, padding: '8px 12px',
                    background: '#E5F1FF', borderLeft: '3px solid #0A84FF',
                    borderRadius: '0 6px 6px 0',
                  }}>
                    <span style={{ color: '#0A84FF', fontWeight: 700, flexShrink: 0, fontSize: 12 }}>▸</span>
                    <span style={{ fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.5 }}>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Key metrics */}
        <Section title="Key Outputs">
          <div className="metric-cards" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16,
          }}>
            <MetricCard label="Temp Speed Zone" value={r.recommendedTempSpeed} unit="km/h" color={C.caution} />
            <MetricCard label="Merge Taper" value={r.mergeTaperLength} unit="m" color={C.hivis} />
            <MetricCard label="Buffer Zone" value={r.bufferZoneLength} unit="m" color={C.hivis} />
            <MetricCard label="Sight Distance" value={r.sightDistanceM} unit="m" color={C.info} />
          </div>
          {r.estimatedQueueLength !== null && (
            <div style={{ marginTop: 8 }}>
              <MetricCard
                label={`Est. Queue Length — ${r.queueStopTimeUsed ?? '?'} min stop (AGTTM Table 4.3)`}
                value={r.estimatedQueueLength} unit="m"
                color={r.estimatedQueueLength > 240 ? C.stop : C.go}
              />
              <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 6 }}>
                Based on {inp.peakHourVolume / 2} vph one direction · {inp.heavyVehiclePercent}% heavy vehicles · {r.queueStopTimeUsed ?? '?'} min max stop time.
                VPH entered as both-directions total ({inp.peakHourVolume} vph) divided by 2 for balanced directional split.
              </div>
              {r.prepareToStopRepeater && (
                <div style={{ marginTop: 8 }}>
                  <WarnBox text="Queue exceeds 240 m — PREPARE TO STOP repeater sign required per AGTTM Table 4.4(a). Place 120 m upstream of the first PREPARE TO STOP sign." kind="warn" />
                </div>
              )}
            </div>
          )}
        </Section>

        {/* TGS Schematic — always shown, template varies by works type */}
        <Section title="Traffic Guidance Scheme — Schematic Layout">
          <div style={{
            border: '1px solid var(--border-default)', borderRadius: 8,
            overflow: 'hidden', background: 'var(--paper-50)',
          }}>
            <TGSSchematic result={r} inputs={inp} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 6 }}>
            Schematic representation only — not to scale. All dimensions are calculated values; actual field placement must be verified by a qualified Traffic Management Designer.{!r.noSignSchedule && ' Refer to sign schedule tables below for precise positions.'}
          </div>
        </Section>

        {/* Advanced queue analysis */}
        <Section title="Queue Analysis">
          <QueueAnalysis result={r} inputs={inp} />
        </Section>

        {/* Temp speed justification */}
        <Section title="Recommended Temp Speed — Justification">
          <div style={{
            background: 'var(--paper-50)', borderRadius: 8, padding: '14px 16px',
            fontSize: 14, color: 'var(--fg-default)', lineHeight: 1.6,
          }}>
            {r.tempSpeedJustification.split('. ').map((s, i) => (
              <div key={i} style={{ marginBottom: s ? 4 : 0 }}>{s && `• ${s}`}</div>
            ))}
          </div>
          {r.speedReductionSteps.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-subtle)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Speed Reduction Sequence (Table 5.6)
              </div>
              <TmTable
                heads={['Speed Change', 'Method', 'Reduction']}
                rows={speedStepRows} small
              />
            </div>
          )}
        </Section>

        {/* Key distances */}
        {!r.noSignSchedule && (
          <Section title="Calculated Distances &amp; Spacings">
            <div style={{ columns: 1 }}>
              {distRows.map(([label, value, ref], i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '8px 0', borderBottom: '1px solid var(--border-default)',
                }}>
                  <div>
                    <span style={{ fontSize: 14, color: 'var(--fg-default)' }}>{label as string}</span>
                    <span style={{ fontSize: 11, color: 'var(--fg-subtle)', marginLeft: 8 }}>{ref as string}</span>
                  </div>
                  <span style={{
                    fontSize: 16, fontWeight: 700, color: 'var(--fg-default)',
                    fontFamily: 'var(--font-mono)',
                  }}>{value as string}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Sign schedule — only for full-zone types */}
        {!r.noSignSchedule && approachRows.length > 0 && (
          <Section title="Sign Schedule — Approach End (upstream to taper)">
            <TmTable
              heads={['#', 'Code', 'Description', 'Position', 'Notes']}
              rows={approachRows}
            />
            <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 8 }}>
              Positions measured from approach taper start (0 m). Negative = upstream of taper start.
              Actual field measurements should be confirmed by a qualified TMP designer.
            </div>
          </Section>
        )}

        {!r.noSignSchedule && departureRows.length > 0 && (
          <Section title="Sign Schedule — Departure End (downstream of work zone)">
            <TmTable
              heads={['#', 'Code', 'Description', 'Position', 'Notes']}
              rows={departureRows}
            />
          </Section>
        )}

        {/* Equipment */}
        <Section title="Equipment List">
          <TmTable
            heads={['Item', 'Quantity', 'Specification']}
            rows={eqRows}
          />
          <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 8 }}>
            Quantities are calculated minimums based on the distances above. Site-specific requirements may exceed these estimates. Review with a qualified Traffic Management Coordinator.
          </div>
        </Section>

        {/* Notes */}
        {r.notes.length > 0 && (
          <Section title="Notes">
            {r.notes.map((n, i) => <WarnBox key={i} text={n} kind="note" />)}
          </Section>
        )}

        {/* References */}
        <Section title="Standard References">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {r.references.map((ref, i) => (
              <div key={i} style={{
                fontSize: 13, color: 'var(--fg-muted)', padding: '4px 0',
                borderBottom: '1px solid var(--border-default)',
                display: 'flex', gap: 8,
              }}>
                <span style={{ color: C.hivis, fontWeight: 700, flexShrink: 0 }}>▸</span>
                {ref}
              </div>
            ))}
          </div>
        </Section>

        {/* Footer */}
        <div style={{
          marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--border-default)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 11, color: 'var(--fg-subtle)',
        }}>
          <div>Generated by TrafficMan Calculator · {inp.date}</div>
          <div style={{ textAlign: 'right' }}>
            This output is for guidance only. All traffic management plans must be prepared, reviewed and authorised by appropriately qualified and experienced Traffic Management Designers in accordance with the applicable state/territory standards.
          </div>
        </div>

      </div>}

      {showFieldView && (
        <FieldView
          result={r}
          inputs={inp}
          zoneName={zones.find(z => z.id === activeZoneId)?.name}
          onClose={() => setShowFieldView(false)}
        />
      )}
    </div>
  );
}

// ── ProjectSummary ──────────────────────────────────────────────

function ProjectSummary({ zones, onSwitchZone }: { zones: Zone[]; onSwitchZone: (z: Zone) => void }) {
  const combined = new Map<string, { item: string; quantity: number; specification: string; zones: string[] }>();
  for (const zone of zones) {
    for (const eq of zone.result.equipment) {
      const qty = parseInt(eq.quantity, 10) || 1;
      const key = `${eq.item}||${eq.specification}`;
      if (combined.has(key)) {
        const existing = combined.get(key)!;
        existing.quantity += qty;
        existing.zones.push(zone.name);
      } else {
        combined.set(key, { item: eq.item, quantity: qty, specification: eq.specification, zones: [zone.name] });
      }
    }
  }

  const projectName = zones[0]?.inputs.projectName || 'Project';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', fontFamily: 'var(--font-ui)' }}>
      <div style={{ background: 'var(--bg-surface)', borderRadius: 12, boxShadow: 'var(--elev-2)', padding: '28px 36px', marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: 'var(--fg-default)' }}>
          {projectName} — Project Summary
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 28 }}>
          {zones.map(zone => (
            <button
              key={zone.id}
              onClick={() => onSwitchZone(zone)}
              style={{
                textAlign: 'left', padding: '14px 16px', borderRadius: 10,
                border: '1.5px solid var(--border-default)',
                background: 'var(--bg-surface)', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: C.hivis, marginBottom: 4 }}>{zone.name}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginBottom: 8 }}>
                {zone.inputs.location || zone.inputs.roadName || '—'}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#FFF3E9', color: C.hivis }}>{zone.result.designStepName}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'var(--paper-50)', color: 'var(--fg-subtle)' }}>{zone.result.recommendedTempSpeed} km/h</span>
                {zone.result.warnings.length > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#FFF7D6', color: '#856404' }}>{zone.result.warnings.length} warning{zone.result.warnings.length > 1 ? 's' : ''}</span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                {[['Taper', `${zone.result.mergeTaperLength} m`], ['Buffer', `${zone.result.bufferZoneLength} m`], ['Sight dist.', `${zone.result.sightDistanceM} m`], ['Sign spacing', `${zone.result.approachSignSpacing} m`]].map(([l, v]) => (
                  <div key={l} style={{ fontSize: 12 }}>
                    <span style={{ color: 'var(--fg-subtle)' }}>{l}: </span><strong>{v}</strong>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Combined Equipment List
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr>{['Item', 'Total Qty', 'Specification', 'Zones'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', background: 'var(--paper-50)', fontSize: 11, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: '1.5px solid var(--border-default)' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {[...combined.values()].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 1 ? 'var(--paper-50)' : 'transparent' }}>
                  <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-default)' }}>{row.item}</td>
                  <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-default)', fontWeight: 700, color: C.hivis }}>{row.quantity}</td>
                  <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-default)', color: 'var(--fg-muted)' }}>{row.specification}</td>
                  <td style={{ padding: '9px 12px', borderBottom: '1px solid var(--border-default)', fontSize: 12, color: 'var(--fg-subtle)' }}>{[...new Set(row.zones)].join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-subtle)' }}>
          Quantities summed across all zones. Verify site-specific requirements with a qualified Traffic Management Coordinator.
        </div>
      </div>
    </div>
  );
}
