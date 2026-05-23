import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CalculationResult } from './engine';
import type { WizardInputs } from './types';

// ── Palette ──────────────────────────────────────────────────────────
const ORANGE = '#FF6A00';
const DARK   = '#0B1220';
const MUTED  = '#5C6677';
const BORDER = '#E5E7EB';
const PAPER  = '#F6F7F9';
const GREEN  = '#00A85A';
const RED    = '#E11D2A';
const BLUE   = '#0A84FF';

// ── Stylesheet ───────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: { padding: 36, fontSize: 8.5, fontFamily: 'Helvetica', color: DARK, backgroundColor: '#fff' },

  // Header
  headerRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: BORDER },
  brand:       { fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: ORANGE, letterSpacing: 1, marginBottom: 4 },
  title:       { fontSize: 16, fontFamily: 'Helvetica-Bold', color: DARK, marginBottom: 3 },
  subLine:     { fontSize: 8, color: MUTED },
  stateBadge:  { backgroundColor: ORANGE, color: '#fff', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, fontSize: 9, fontFamily: 'Helvetica-Bold' },
  stdLabel:    { fontSize: 7, color: MUTED, marginTop: 4, textAlign: 'right' },

  // Meta row
  metaRow:     { flexDirection: 'row', backgroundColor: PAPER, padding: 8, borderRadius: 4, marginBottom: 14, gap: 4 },
  metaCell:    { flex: 1 },
  metaLabel:   { fontSize: 7, color: MUTED },
  metaVal:     { fontSize: 7.5, fontFamily: 'Helvetica-Bold', marginTop: 1 },

  // Section headings
  secTitle:    { fontSize: 7, fontFamily: 'Helvetica-Bold', color: MUTED, letterSpacing: 1, marginTop: 14, marginBottom: 5, paddingBottom: 3, borderBottomWidth: 1, borderBottomColor: BORDER },

  // Criteria
  critRow:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 2, borderLeftWidth: 3 },
  critBadge:   { fontSize: 7, fontFamily: 'Helvetica-Bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginRight: 8, flexShrink: 0 },
  critText:    { fontSize: 7.5, flex: 1, lineHeight: 1.4 },
  critDetail:  { fontSize: 7, color: MUTED, marginTop: 2 },

  // Mandatory requirements
  reqRow:      { flexDirection: 'row', backgroundColor: '#E5F1FF', borderLeftWidth: 3, borderLeftColor: BLUE, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 2, marginBottom: 4 },
  reqArrow:    { fontSize: 8, color: BLUE, fontFamily: 'Helvetica-Bold', marginRight: 6 },
  reqText:     { fontSize: 7.5, flex: 1, lineHeight: 1.5, color: DARK },

  // Metrics
  metricsRow:  { flexDirection: 'row', gap: 8, marginBottom: 8 },
  metricCard:  { flex: 1, borderWidth: 1, borderColor: BORDER, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, borderTopWidth: 2 },
  metricLbl:   { fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: MUTED, letterSpacing: 0.7, marginBottom: 4 },
  metricVal:   { fontSize: 18, fontFamily: 'Helvetica-Bold', color: DARK },
  metricUnit:  { fontSize: 9, color: MUTED },

  // Tables
  tblWrap:     { borderWidth: 1, borderColor: BORDER, borderRadius: 4, marginBottom: 8 },
  tblHead:     { flexDirection: 'row', backgroundColor: PAPER, paddingHorizontal: 8, paddingVertical: 5, borderBottomWidth: 1.5, borderBottomColor: BORDER },
  tblHCell:    { fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: MUTED, letterSpacing: 0.7 },
  tblRow:      { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: BORDER },
  tblRowAlt:   { backgroundColor: PAPER },
  tblCell:     { fontSize: 7.5, color: DARK, lineHeight: 1.3 },

  // Warn / note boxes
  warnRow:     { flexDirection: 'row', marginBottom: 5, borderLeftWidth: 3, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 2 },
  warnDot:     { width: 6, height: 6, borderRadius: 3, marginTop: 4, marginRight: 8, flexShrink: 0 },
  warnTxt:     { fontSize: 7.5, flex: 1, lineHeight: 1.5 },

  // Footer
  footer:      { position: 'absolute', bottom: 24, left: 36, right: 36, borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 5, flexDirection: 'row', justifyContent: 'space-between' },
  footerTxt:   { fontSize: 6.5, color: MUTED },
});

// ── Helpers ──────────────────────────────────────────────────────────

function stateStd(state: string) {
  if (state === 'WA') return 'Main Roads WA COP';
  if (state === 'QLD') return 'QGTTM (TMR)';
  return 'AGTTM / AS 1742.3:2019';
}

function ctrlLabel(m: string, n: number) {
  switch (m) {
    case 'stop_slow_bats':   return `Traffic Controller — STOP/SLOW bat${n > 1 ? ` (${n})` : ''}`;
    case 'portable_signals': return 'Portable Traffic Lights (PTL)';
    case 'boom_gate':        return 'Boom Gate';
    case 'pilot_vehicle':    return 'Pilot Vehicle';
    case 'police':           return `Police Control${n > 1 ? ` (${n})` : ''}`;
    default: return 'Signs only (no PTCD)';
  }
}

function distRef(ref: string, state: string) {
  const wa: Record<string, string> = {
    'AS 1742.3 Table 2.2': 'WA COP', 'AS 1742.3 Table 2.3': 'WA COP',
    'AGTTM Table 5.7': 'WA COP',     'AGTTM Table 5.8': 'WA COP',
    'AGTTM Table 4.2': 'WA COP',     'AGTTM Table 5.5': 'WA COP',
  };
  const qld: Record<string, string> = {
    'AS 1742.3 Table 2.2': 'QGTTM', 'AS 1742.3 Table 2.3': 'QGTTM',
    'AGTTM Table 5.7': 'QGTTM',     'AGTTM Table 5.8': 'QGTTM',
    'AGTTM Table 4.2': 'QGTTM',     'AGTTM Table 5.5': 'QGTTM',
  };
  if (state === 'WA') return wa[ref] ?? ref;
  if (state === 'QLD') return qld[ref] ?? ref;
  return ref;
}

// ── Sub-components ───────────────────────────────────────────────────

function SecTitle({ title }: { title: string }) {
  return <Text style={S.secTitle}>{title.toUpperCase()}</Text>;
}

function WarnBox({ text, kind = 'warn' }: { text: string; kind?: 'warn' | 'note' | 'info' }) {
  const c = {
    warn: { bg: '#FFF7D6', border: '#D9A600', dot: '#D9A600' },
    note: { bg: PAPER,     border: BORDER,    dot: MUTED },
    info: { bg: '#E5F1FF', border: BLUE,      dot: BLUE },
  }[kind];
  return (
    <View style={[S.warnRow, { backgroundColor: c.bg, borderLeftColor: c.border }]}>
      <View style={[S.warnDot, { backgroundColor: c.dot }]} />
      <Text style={S.warnTxt}>{text}</Text>
    </View>
  );
}

function MetricCard({ label, value, unit, top }: { label: string; value: string | number; unit?: string; top: string }) {
  return (
    <View style={[S.metricCard, { borderTopColor: top }]}>
      <Text style={S.metricLbl}>{label}</Text>
      <Text style={S.metricVal}>
        {String(value)}<Text style={S.metricUnit}>{unit ? ` ${unit}` : ''}</Text>
      </Text>
    </View>
  );
}

function TblRow({ row, widths, alt }: { row: (string | number)[]; widths: number[]; alt: boolean }) {
  return (
    <View style={[S.tblRow, alt ? S.tblRowAlt : {}]}>
      {row.map((cell, i) => (
        <Text key={i} style={[S.tblCell, { flex: widths[i] }]}>{String(cell)}</Text>
      ))}
    </View>
  );
}

function Table({ heads, rows, widths }: { heads: string[]; rows: (string | number)[][]; widths: number[] }) {
  return (
    <View style={S.tblWrap}>
      <View style={S.tblHead}>
        {heads.map((h, i) => <Text key={i} style={[S.tblHCell, { flex: widths[i] }]}>{h}</Text>)}
      </View>
      {rows.map((row, ri) => <TblRow key={ri} row={row} widths={widths} alt={ri % 2 === 1} />)}
    </View>
  );
}

// ── Document ─────────────────────────────────────────────────────────

interface Props { result: CalculationResult; inputs: WizardInputs }

export function TMPDocument({ result: r, inputs: inp }: Props) {
  const dr = (ref: string) => distRef(ref, inp.state);
  const passN  = r.criteriaChecks.filter(c => c.status === 'pass').length;
  const checkN = r.criteriaChecks.filter(c => c.status === 'check').length;
  const failN  = r.criteriaChecks.filter(c => c.status === 'fail').length;

  const critColor = (s: 'pass' | 'fail' | 'check') =>
    ({ pass: GREEN, fail: RED, check: '#FFC107' }[s]);
  const critBg = (s: 'pass' | 'fail' | 'check') =>
    ({ pass: '#F8FFF9', fail: '#FFF5F5', check: PAPER }[s]);
  const critBadgeBg = (s: 'pass' | 'fail' | 'check') =>
    ({ pass: '#D4EDDA', fail: '#F8D7DA', check: '#FFF3CD' }[s]);
  const critBadgeFg = (s: 'pass' | 'fail' | 'check') =>
    ({ pass: '#155724', fail: '#721C24', check: '#856404' }[s]);
  const critLabel = (s: 'pass' | 'fail' | 'check') =>
    ({ pass: '✓ Pass', fail: '✗ Fail', check: '? Check' }[s]);

  const distRows: (string | number)[][] = [
    ['Approach sign spacing',     `${r.approachSignSpacing} m`,    dr('AS 1742.3 Table 2.2')],
    ['Sight distance to PTCD',    `${r.sightDistanceM} m`,         dr('AS 1742.3 Table 2.3')],
    ['Merge / approach taper',    `${r.mergeTaperLength} m`,       dr('AGTTM Table 5.7')],
    ['Lateral shift taper',       `${r.lateralShiftTaper} m`,      dr('AGTTM Table 5.7')],
    ['Buffer zone (minimum)',      `${r.bufferZoneLength} m`,       dr('AGTTM Table 5.7')],
    ['Distance between tapers',   `${r.distBetweenTapers} m`,      dr('AGTTM Table 5.8')],
    ['Cone spacing (zone)',        `${r.coneSpacingM} m`,           dr('AGTTM Table 4.2')],
    ['Cone spacing (taper)',       `${r.coneSpacingTaperM} m`,      dr('AGTTM Table 4.2')],
    ['Min. temp zone length',      `${r.minTempZoneLength} m`,      dr('AGTTM Table 5.5')],
  ];

  const appRows = r.approachSigns.map(s => [
    s.code, s.description,
    s.distanceFromTaperStart < 0
      ? `${Math.abs(s.distanceFromTaperStart)} m upstream`
      : s.distanceFromTaperStart === 0 ? 'At taper start' : `${s.distanceFromTaperStart} m downstream`,
    s.notes,
  ]);

  const depRows = r.departureSigns.map(s => [
    s.code, s.description,
    `${s.distanceFromTaperStart} m from approach taper`,
    s.notes,
  ]);

  const eqRows  = r.equipment.map(e => [e.item, e.quantity, e.specification]);
  const spdRows = r.speedReductionSteps.map(s => [
    `${s.from} → ${s.to} km/h`, s.method, `${s.from - s.to} km/h`,
  ]);

  const Footer = () => (
    <View style={S.footer} fixed>
      <Text style={S.footerTxt}>TrafficMan Calculator · {inp.date} · {inp.projectRef || ''}</Text>
      <Text style={S.footerTxt} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );

  return (
    <Document title={`TMP — ${inp.projectName || 'Report'}`} author="TrafficMan Calculator">

      {/* ── Page 1: Header, Design Step, Criteria, Outputs ── */}
      <Page size="A4" style={S.page}>

        {/* Header */}
        <View style={S.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={S.brand}>TRAFFIC MANAGEMENT CALCULATOR REPORT</Text>
            <Text style={S.title}>{inp.projectName || 'Unnamed Project'}</Text>
            <Text style={S.subLine}>
              {[inp.projectRef && `Ref: ${inp.projectRef}`, inp.location, inp.date].filter(Boolean).join('  ·  ')}
            </Text>
            {inp.lat != null && inp.lng != null && (
              <Text style={[S.subLine, { marginTop: 3, fontFamily: 'Helvetica-Oblique' }]}>
                {`Coordinates: ${inp.lat.toFixed(5)}°, ${inp.lng.toFixed(5)}°`}
              </Text>
            )}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={S.stateBadge}>{inp.state}</Text>
            <Text style={S.stdLabel}>{stateStd(inp.state)}</Text>
          </View>
        </View>

        {/* Meta grid */}
        <View style={S.metaRow}>
          <View style={S.metaCell}>
            <Text style={S.metaLabel}>Prepared by</Text>
            <Text style={S.metaVal}>{inp.preparedBy || '—'}</Text>
          </View>
          <View style={S.metaCell}>
            <Text style={S.metaLabel}>Road</Text>
            <Text style={S.metaVal}>{inp.roadName || '—'} ({inp.classification})</Text>
          </View>
          <View style={S.metaCell}>
            <Text style={S.metaLabel}>Posted speed</Text>
            <Text style={S.metaVal}>{inp.postedSpeed} km/h</Text>
          </View>
          <View style={S.metaCell}>
            <Text style={S.metaLabel}>Traffic control</Text>
            <Text style={S.metaVal}>{ctrlLabel(inp.controlMethod, inp.numberOfControllers)}</Text>
          </View>
        </View>

        {/* Warnings */}
        {r.warnings.length > 0 && (
          <>
            <SecTitle title="⚠ Warnings — Review Before Proceeding" />
            {r.warnings.map((w, i) => <WarnBox key={i} text={w} kind="warn" />)}
          </>
        )}

        {/* Design step */}
        <SecTitle title={`Design Step — ${r.designStepName}`} />
        <View style={{ backgroundColor: PAPER, borderRadius: 4, padding: 8, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>{r.designStepName}</Text>
              <Text style={{ fontSize: 7.5, color: ORANGE, fontFamily: 'Helvetica-Bold', marginTop: 2 }}>{r.designStepRef}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 4, flexShrink: 0, marginLeft: 8 }}>
              {passN  > 0 && <Text style={{ fontSize: 7, backgroundColor: '#D4EDDA', color: '#155724', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, fontFamily: 'Helvetica-Bold' }}>{`✓ ${passN} pass`}</Text>}
              {checkN > 0 && <Text style={{ fontSize: 7, backgroundColor: '#FFF3CD', color: '#856404', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, fontFamily: 'Helvetica-Bold' }}>{`? ${checkN} check`}</Text>}
              {failN  > 0 && <Text style={{ fontSize: 7, backgroundColor: '#F8D7DA', color: '#721C24', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, fontFamily: 'Helvetica-Bold' }}>{`✗ ${failN} fail`}</Text>}
            </View>
          </View>
          {r.designStepDescription ? (
            <Text style={{ fontSize: 7.5, color: MUTED, lineHeight: 1.5 }}>{r.designStepDescription}</Text>
          ) : null}
        </View>

        {/* Eligibility criteria */}
        {r.criteriaChecks.map((c, i) => (
          <View key={i} style={[S.critRow, { backgroundColor: critBg(c.status), borderLeftColor: critColor(c.status) }]}>
            <Text style={[S.critBadge, { backgroundColor: critBadgeBg(c.status), color: critBadgeFg(c.status) }]}>
              {critLabel(c.status)}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={S.critText}>{c.criterion}</Text>
              {c.detail ? <Text style={S.critDetail}>{c.detail}</Text> : null}
            </View>
          </View>
        ))}

        {/* Mandatory requirements */}
        {r.mandatoryRequirements.length > 0 && (
          <>
            <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: MUTED, marginTop: 8, marginBottom: 5 }}>MANDATORY REQUIREMENTS</Text>
            {r.mandatoryRequirements.map((req, i) => (
              <View key={i} style={S.reqRow}>
                <Text style={S.reqArrow}>▸</Text>
                <Text style={S.reqText}>{req}</Text>
              </View>
            ))}
          </>
        )}

        {/* Key outputs */}
        <SecTitle title="Key Outputs" />
        <View style={S.metricsRow}>
          <MetricCard label="Temp Speed Zone" value={r.recommendedTempSpeed} unit="km/h" top="#FFC400" />
          <MetricCard label="Merge Taper"     value={r.mergeTaperLength}     unit="m"    top={ORANGE} />
          <MetricCard label="Buffer Zone"     value={r.bufferZoneLength}     unit="m"    top={ORANGE} />
          <MetricCard label="Sight Distance"  value={r.sightDistanceM}       unit="m"    top={BLUE}   />
        </View>
        {r.estimatedQueueLength !== null && (
          <MetricCard
            label={`Est. Queue Length — ${r.queueStopTimeUsed ?? '?'} min stop (AGTTM Table 4.3)`}
            value={r.estimatedQueueLength}
            unit="m"
            top={r.estimatedQueueLength > 240 ? RED : GREEN}
          />
        )}
        {r.prepareToStopRepeater && (
          <WarnBox text="Queue exceeds 240 m — PREPARE TO STOP repeater sign required (AGTTM Table 4.4(a))." kind="warn" />
        )}

        {/* Speed reduction */}
        {spdRows.length > 0 && (
          <>
            <SecTitle title="Speed Reduction Sequence (AGTTM Table 5.6)" />
            <Table heads={['Change', 'Method', 'Reduction']} rows={spdRows} widths={[2, 5, 1.5]} />
          </>
        )}

        {/* Temp speed justification */}
        <SecTitle title="Temp Speed Justification" />
        <View style={{ backgroundColor: PAPER, borderRadius: 4, padding: 8, marginBottom: 8 }}>
          <Text style={{ fontSize: 7.5, color: DARK, lineHeight: 1.6 }}>{r.tempSpeedJustification}</Text>
        </View>

        <Footer />
      </Page>

      {/* ── Page 2: Distances, Sign Schedules, Equipment, References ── */}
      <Page size="A4" style={S.page}>

        {!r.noSignSchedule && (
          <>
            <SecTitle title="Calculated Distances &amp; Spacings" />
            <Table heads={['Distance', 'Value', 'Reference']} rows={distRows} widths={[3.5, 1.5, 2]} />
          </>
        )}

        {!r.noSignSchedule && appRows.length > 0 && (
          <>
            <SecTitle title="Sign Schedule — Approach End (upstream to taper)" />
            <Table heads={['Code', 'Description', 'Position', 'Notes']} rows={appRows} widths={[1.5, 3, 2, 3]} />
            <Text style={{ fontSize: 7, color: MUTED, marginBottom: 6 }}>
              Positions measured from approach taper start (0 m). Negative = upstream of taper.
            </Text>
          </>
        )}

        {!r.noSignSchedule && depRows.length > 0 && (
          <>
            <SecTitle title="Sign Schedule — Departure End" />
            <Table heads={['Code', 'Description', 'Position', 'Notes']} rows={depRows} widths={[1.5, 3, 2, 3]} />
          </>
        )}

        {r.noSignSchedule && (
          <WarnBox
            text={`${r.designStepName} does not use a standard advance warning sign schedule. Refer to the Design Step Criteria and Mandatory Requirements for specific equipment and safety obligations.`}
            kind="info"
          />
        )}

        <SecTitle title="Equipment List" />
        <Table heads={['Item', 'Quantity', 'Specification']} rows={eqRows} widths={[3, 1.5, 4]} />
        <Text style={{ fontSize: 7, color: MUTED, marginBottom: 6 }}>
          Quantities are calculated minimums. Site requirements may exceed these estimates.
        </Text>

        {r.notes.length > 0 && (
          <>
            <SecTitle title="Notes" />
            {r.notes.map((n, i) => <WarnBox key={i} text={n} kind="note" />)}
          </>
        )}

        <SecTitle title="Standard References" />
        {r.references.map((ref, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 6, paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: BORDER }}>
            <Text style={{ color: ORANGE, fontFamily: 'Helvetica-Bold', fontSize: 8 }}>▸</Text>
            <Text style={{ fontSize: 7.5, color: MUTED, flex: 1 }}>{ref}</Text>
          </View>
        ))}

        <View style={{ marginTop: 14, backgroundColor: PAPER, borderRadius: 4, padding: 8 }}>
          <Text style={{ fontSize: 7, color: MUTED, lineHeight: 1.6 }}>
            DISCLAIMER: This output is for guidance only. All traffic management plans must be prepared, reviewed and authorised by appropriately qualified and experienced Traffic Management Designers in accordance with the applicable state/territory standards and road authority requirements.
          </Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}
