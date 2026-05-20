import { C } from '../../components/tokens';
import type { CalculationResult } from './engine';
import type { WizardInputs } from './types';
import { WORKS_TYPE_LABELS } from './standards';
import { TGSSchematic } from './TGSSchematic';
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
  history?: HistoryEntry[];
  onLoadHistory?: (entry: HistoryEntry) => void;
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

function stateStdSummary(state: string): string {
  const map: Record<string, string> = {
    VIC: 'VIC CoP / AGTTM / AS 1742.3',
    NSW: 'TCAWS v6.1 / AS 1742.3',
    QLD: 'QGTTM / AS 1742.3',
    WA:  'WA COP / AGTTM / AS 1742.3',
    SA: 'AGTTM / AS 1742.3', TAS: 'AGTTM / AS 1742.3',
    NT:  'AGTTM / AS 1742.3', ACT: 'AGTTM / AS 1742.3',
  };
  return map[state] ?? 'AGTTM / AS 1742.3';
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

export function ReportView({ result: r, inputs: inp, onBack, history = [], onLoadHistory }: Props) {
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

  const distRows: (string | number)[][] = [
    ['Approach sign spacing', `${r.approachSignSpacing} m`, 'AS 1742.3 Table 2.2'],
    ['Sight distance to controller', `${r.sightDistanceM} m`, 'AS 1742.3 Table 2.3'],
    ['Merge / approach taper', `${r.mergeTaperLength} m`, 'AGTTM Table 5.7'],
    ['Lateral shift taper', `${r.lateralShiftTaper} m`, 'AGTTM Table 5.7'],
    ['Buffer zone (minimum)', `${r.bufferZoneLength} m`, 'AGTTM Table 5.7'],
    ['Distance between tapers', `${r.distBetweenTapers} m`, 'AGTTM Table 5.8'],
    ['Cone spacing (through zone)', `${r.coneSpacingM} m`, 'AGTTM Table 4.2'],
    ['Cone spacing (within taper)', `${r.coneSpacingTaperM} m`, 'AGTTM Table 4.2'],
    ['Min. temp speed zone length', `${r.minTempZoneLength} m`, 'AGTTM Table 5.5'],
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

        {history.length > 0 && onLoadHistory && (
          <select
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

        <button onClick={handlePrint} style={{
          padding: '9px 24px', borderRadius: 8, border: 'none',
          background: C.hivis, color: C.ink900,
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print / Save PDF
        </button>
      </div>

      {/* Report body */}
      <div className="report-page" style={{
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
                label={`Est. Queue Length — ${r.queueStopTimeUsed} min stop (AGTTM Table 4.3)`}
                value={r.estimatedQueueLength} unit="m"
                color={r.estimatedQueueLength > 240 ? C.stop : C.go}
              />
              <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 6 }}>
                Based on {inp.peakHourVolume / 2} vph one direction · {inp.heavyVehiclePercent}% heavy vehicles · {r.queueStopTimeUsed} min max stop time.
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

        {/* TGS Schematic */}
        {!r.noSignSchedule && (
          <Section title="Traffic Guidance Scheme — Schematic Layout">
            <div style={{
              border: '1px solid var(--border-default)', borderRadius: 8,
              overflow: 'hidden', background: 'var(--paper-50)',
            }}>
              <TGSSchematic result={r} inputs={inp} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 6 }}>
              Schematic representation only — not to scale. All dimensions are calculated values; actual field placement must be verified by a qualified Traffic Management Designer. Refer to sign schedule tables below for precise positions.
            </div>
          </Section>
        )}

        {r.noSignSchedule && (
          <Section title="Traffic Guidance Scheme">
            <WarnBox
              text={`${r.designStepName} does not use a standard advance warning sign schedule. Refer to the Design Step Criteria and Mandatory Requirements above for specific equipment and safety obligations for this design step.`}
              kind="info"
            />
          </Section>
        )}

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

      </div>
    </div>
  );
}
