import { useState, useRef, useCallback } from 'react';
import type { CalculationResult } from './engine';
import type { WizardInputs } from './types';
import { getDesignStep } from './standards';

// ── Constants ──────────────────────────────────────────────────────
const SVG_W = 960;
const SVG_H = 340;

// Road strip
const ROAD_Y1  = 130;  // top edge of road
const ROAD_Y2  = 200;  // bottom edge of road
const ROAD_MID = (ROAD_Y1 + ROAD_Y2) / 2; // 165
const LANE_H   = (ROAD_Y2 - ROAD_Y1) / 2;  // 35px per lane

// Sign area (above road)
const SIGN_BOX_H = 24;
const SIGN_BOX_W = 52;
const SIGN_Y_TOP = 50;   // top of upper sign row
const SIGN_Y_BOT = 86;   // top of lower sign row (alternating)

// Zone label row
const ZONE_Y = 220;

// Distance arrow row
const DIST_Y = 245;

// Colours
const C_ROAD     = '#374151';
const C_OPEN     = '#4B5563';
const C_LANE_DIV = 'rgba(255,255,255,0.5)';
const C_CENTER   = '#FCD34D';
const C_SIGN_BG  = '#FFFFFF';
const C_SIGN_BRD = '#1F2937';
const C_CONE     = '#FF6A00';
const C_WORK_BG  = 'rgba(255,106,0,0.13)';
const C_WORK_BDR = '#FF6A00';
const C_TC       = '#00A85A';
const C_SPEED_BG = 'rgba(251,191,36,0.14)';
const C_ZONE_LBL = '#5C6677';
const C_ARROW    = '#374151';
const C_TEXT     = '#0B1220';
const C_MUTED    = '#5C6677';

// ── Helpers ────────────────────────────────────────────────────────

function SignBoard({ x, row, code, name, pole = true, color = C_SIGN_BG, textColor = C_TEXT }: {
  x: number; row: 0 | 1; code: string; name: string;
  pole?: boolean; color?: string; textColor?: string;
}) {
  const sy = row === 0 ? SIGN_Y_TOP : SIGN_Y_BOT;
  const mx = x - SIGN_BOX_W / 2;
  const poleY1 = sy + SIGN_BOX_H;
  const poleY2 = ROAD_Y1 - 2;
  return (
    <g>
      {pole && <line x1={x} y1={poleY1} x2={x} y2={poleY2} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3,2" />}
      <rect x={mx} y={sy} width={SIGN_BOX_W} height={SIGN_BOX_H}
        fill={color} stroke={C_SIGN_BRD} strokeWidth="1.2" rx="3" />
      <text x={x} y={sy + 10} textAnchor="middle" dominantBaseline="middle"
        fontSize="8" fontWeight="700" fill={textColor} fontFamily="JetBrains Mono, monospace">{code}</text>
      <text x={x} y={sy + 20} textAnchor="middle" dominantBaseline="middle"
        fontSize="6.5" fill={C_MUTED} fontFamily="sans-serif"
        style={{ letterSpacing: '0.02em' }}>{name}</text>
    </g>
  );
}

function Cone({ x, y, size = 7 }: { x: number; y: number; size?: number }) {
  return (
    <polygon
      points={`${x},${y - size} ${x - size * 0.6},${y + size * 0.4} ${x + size * 0.6},${y + size * 0.4}`}
      fill={C_CONE} stroke="none" />
  );
}

function TCSymbol({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} fill={C_TC} stroke="white" strokeWidth="1.5" />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize="8" fontWeight="700" fill="white" fontFamily="sans-serif">TC</text>
      <text x={x} y={y + 17} textAnchor="middle" fontSize="7" fill={C_TC} fontFamily="sans-serif">{label}</text>
    </g>
  );
}

function DistArrow({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  const mid = (x1 + x2) / 2;
  const tooNarrow = (x2 - x1) < 28;
  return (
    <g>
      <line x1={x1 + 3} y1={y} x2={x2 - 3} y2={y} stroke={C_ARROW} strokeWidth="1" markerEnd="url(#arr)" markerStart="url(#arrR)" />
      <text x={mid} y={tooNarrow ? y - 6 : y - 4} textAnchor="middle" fontSize="8"
        fontFamily="JetBrains Mono, monospace" fill={C_TEXT} fontWeight="600">{label}</text>
    </g>
  );
}

function ZoneLabel({ x1, x2, y, label, color = C_ZONE_LBL }: {
  x1: number; x2: number; y: number; label: string; color?: string;
}) {
  const mid = (x1 + x2) / 2;
  return (
    <text x={mid} y={y} textAnchor="middle" fontSize="8.5" fill={color}
      fontFamily="sans-serif" fontWeight="600" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' } as React.CSSProperties}>
      {label}
    </text>
  );
}

// ── PNG export helper ────────────────────────────────────────────────

async function exportSvgAsPng(svgEl: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgEl);
  const canvas = document.createElement('canvas');
  const scale = 2;
  canvas.width  = SVG_W * scale;
  canvas.height = SVG_H * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const img = new Image();
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(b => {
        if (!b) { reject(new Error('canvas.toBlob failed')); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        resolve();
      }, 'image/png');
    };
    img.onerror = reject;
    img.src = url;
  });
}

// ── Main component ──────────────────────────────────────────────────

interface Props { result: CalculationResult; inputs: WizardInputs }

export function TGSSchematic({ result: r, inputs: inp }: Props) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan]   = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const clampZoom = (z: number) => Math.min(3, Math.max(0.5, z));

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => clampZoom(z - e.deltaY * 0.001));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const { mx, my, px, py } = dragOrigin.current;
    setPan({ x: px + (e.clientX - mx), y: py + (e.clientY - my) });
  };
  const stopDrag = () => setDragging(false);

  const handleExportPng = async () => {
    if (!svgRef.current) return;
    const name = `TGS-${inp.projectName || 'schematic'}-${inp.date}.png`.replace(/[^a-z0-9.\-_]/gi, '_');
    await exportSvgAsPng(svgRef.current, name);
  };

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const stepDef = getDesignStep(inp.worksType);
  const isAlternating = stepDef?.isAlternating ?? false;
  const isFullClosure = stepDef?.isFullClosure ?? false;
  const isShoulderOnly = stepDef?.isShoulderOnly ?? false;
  const hasTCPD = ['stop_slow_bats', 'portable_signals', 'police'].includes(inp.controlMethod);

  // Collect all approach signs sorted by position (already sorted in engine output)
  const aSigns = r.approachSigns.filter(s => s.code !== 'AB'); // exclude arrow board from sign list for layout
  const hasArrowBoard = r.approachSigns.some(s => s.code === 'AB') || inp.arrowBoard;

  // Key real-world positions (in metres from taper start, negative = upstream)
  const firstSignPos = aSigns.length > 0 ? aSigns[0].distanceFromTaperStart : -r.approachSignSpacing * 2;
  const approachLen  = Math.abs(firstSignPos); // metres

  // ── Pixel layout ────────────────────────────────────────────────
  // Reserve fixed pixels for taper, buffer+work, departure then scale approach
  const LEFT_PAD    = 30;
  const TAPER_PX    = Math.max(60, Math.min(100, r.mergeTaperLength * 0.5)); // 60–100px
  const WORK_PX     = 90;   // compressed work zone (labeled with actual length)
  const BUFFER_PX   = 36;
  const DEP_PX      = 130;
  const RIGHT_PAD   = 20;

  const approachPX  = SVG_W - LEFT_PAD - TAPER_PX - BUFFER_PX - WORK_PX - DEP_PX - RIGHT_PAD;
  const scale       = approachPX / Math.max(approachLen, 1); // px per metre

  // Reference point: taper start
  const taperStartX = LEFT_PAD + approachPX;
  const toX = (posM: number) => taperStartX + posM * scale;

  const taperEndX   = taperStartX + TAPER_PX;
  const bufferEndX  = taperEndX + BUFFER_PX;
  const workEndX    = bufferEndX + WORK_PX;
  const depEndX     = workEndX + DEP_PX;

  // (departure TC drawn inline at workEndX + 14)

  // ── Signs pixel X positions ──────────────────────────────────────
  // Assign alternating rows to avoid overlap
  const signLayout = aSigns.map((s, i) => ({
    ...s,
    px: toX(s.distanceFromTaperStart),
    row: (i % 2) as 0 | 1,
  }));

  // Short sign names for the diagram
  const shortName = (code: string, description: string): string => {
    if (code.startsWith('R4-1')) {
      const m = code.match(/\((\d+)\)/);
      return m ? `${m[1]} km/h` : 'SPEED';
    }
    if (code.includes('AHEAD') && code.startsWith('R4-1')) return 'SPD AHEAD';
    if (description.includes('WORKS AHEAD') || description.includes('ROADWORK AHEAD')) return 'WORKS AHD';
    if (description.includes('LANE CLOSED')) return 'LN CLOSED';
    if (description.includes('ROAD CLOSED')) return 'RD CLOSED';
    if (description.includes('MERGE')) return 'MERGE';
    if (description.includes('PREPARE TO STOP')) return code.includes('R') ? 'PTS RPT' : 'PREP STOP';
    if (description.includes('TRAFFIC CONTROL')) return 'TC AHEAD';
    if (description.includes('Police')) return 'POLICE';
    if (code === 'TC' || code === 'PTL') return '';
    return description.slice(0, 9);
  };

  // ── Find key positions for distance annotations ──────────────────
  const ptsSign = aSigns.find(s => s.code === 'TM1-18B');

  // ── SVG ──────────────────────────────────────────────────────────
  // Road lane topology for the work zone
  // Top lane:    OPEN (traffic through)
  // Bottom lane: CLOSED (work zone + taper)
  const openLaneY1   = ROAD_Y1;
  const closedLaneY1 = ROAD_MID;
  const closedLaneY2 = ROAD_Y2;

  // How many cones to draw schematically in taper and buffer
  const taperCones = Math.min(8, Math.ceil(TAPER_PX / 12));
  const bufferCones = Math.min(6, Math.ceil(BUFFER_PX / 10));

  const btnStyle: React.CSSProperties = {
    padding: '5px 12px', borderRadius: 6, border: '1.5px solid var(--border-default)',
    background: 'var(--bg-surface)', color: 'var(--fg-default)',
    fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', gap: 5,
  };

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      {/* Control bar */}
      <div className="no-print" style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
        borderBottom: '1px solid var(--border-default)', background: 'var(--paper-50)',
        flexWrap: 'wrap',
      }}>
        <button style={btnStyle} onClick={() => setZoom(z => clampZoom(z + 0.2))} aria-label="Zoom in">＋ Zoom In</button>
        <button style={btnStyle} onClick={() => setZoom(z => clampZoom(z - 0.2))} aria-label="Zoom out">－ Zoom Out</button>
        <button style={btnStyle} onClick={resetView} aria-label="Reset view">↺ Reset</button>
        <span style={{ fontSize: 11, color: 'var(--fg-subtle)', marginLeft: 2 }}>{Math.round(zoom * 100)}% · Drag to pan · Scroll to zoom</span>
        <div style={{ flex: 1 }} />
        <button style={{ ...btnStyle, borderColor: '#0A84FF', color: '#0A84FF' }}
          onClick={handleExportPng} aria-label="Export PNG">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export PNG
        </button>
      </div>

      {/* Zoomable/pannable canvas */}
      <div
        style={{ overflow: 'hidden', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none', background: 'var(--paper-50)' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <div style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0', transition: dragging ? 'none' : 'transform 0.1s' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        style={{ display: 'block', maxWidth: SVG_W, minWidth: 600 }}
        aria-label="Traffic Guidance Scheme schematic"
      >
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={C_ARROW} />
          </marker>
          <marker id="arrR" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 Z" fill={C_ARROW} />
          </marker>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke={C_WORK_BDR} strokeWidth="2" strokeOpacity="0.3" />
          </pattern>
        </defs>

        {/* ── Title ── */}
        <text x={SVG_W / 2} y={20} textAnchor="middle" fontSize="11" fontWeight="700"
          fill={C_TEXT} fontFamily="sans-serif" style={{ letterSpacing: '0.04em' } as React.CSSProperties}>
          TRAFFIC GUIDANCE SCHEME — {inp.worksType.replace(/_/g, ' ').toUpperCase()} — {inp.state} — {inp.postedSpeed} km/h ZONE
        </text>
        <text x={SVG_W / 2} y={34} textAnchor="middle" fontSize="8.5" fill={C_MUTED} fontFamily="sans-serif">
          Schematic only — not to scale — based on {inp.postedSpeed} km/h posted / {r.recommendedTempSpeed} km/h temp speed
        </text>

        {/* ── Zone background fills ── */}
        {/* Advance warning zone */}
        <rect x={LEFT_PAD} y={ROAD_Y1 - 2} width={approachPX} height={ROAD_Y2 - ROAD_Y1 + 4}
          fill="rgba(59,130,246,0.06)" />
        {/* Temp speed zone (from first speed sign to taper) */}
        {(() => {
          const firstSpeedSign = aSigns.find(s => s.code.startsWith('R4-1'));
          if (!firstSpeedSign) return null;
          const sx = toX(firstSpeedSign.distanceFromTaperStart);
          return <rect x={sx} y={ROAD_Y1 - 2} width={taperStartX - sx} height={ROAD_Y2 - ROAD_Y1 + 4}
            fill={C_SPEED_BG} />;
        })()}
        {/* Work zone */}
        <rect x={taperEndX} y={closedLaneY1} width={WORK_PX + BUFFER_PX - 4} height={closedLaneY2 - closedLaneY1}
          fill={C_WORK_BG} />
        <rect x={taperEndX} y={closedLaneY1} width={WORK_PX + BUFFER_PX - 4} height={closedLaneY2 - closedLaneY1}
          fill="url(#hatch)" />

        {/* ── Road surface ── */}
        {/* Full road background */}
        <rect x={LEFT_PAD} y={ROAD_Y1} width={depEndX - LEFT_PAD} height={ROAD_Y2 - ROAD_Y1}
          fill={C_ROAD} rx="2" />

        {/* Open lane (always open, top) */}
        <rect x={LEFT_PAD} y={openLaneY1} width={depEndX - LEFT_PAD} height={LANE_H}
          fill={C_OPEN} />

        {/* Center / lane divider */}
        {isAlternating ? (
          /* Yellow center line for 2-lane bidirectional */
          <line x1={LEFT_PAD} y1={ROAD_MID} x2={taperStartX} y2={ROAD_MID}
            stroke={C_CENTER} strokeWidth="1.5" strokeDasharray="8,4" />
        ) : (
          <line x1={LEFT_PAD} y1={ROAD_MID} x2={depEndX} y2={ROAD_MID}
            stroke={C_LANE_DIV} strokeWidth="1" strokeDasharray="8,4" />
        )}

        {/* Road direction arrow in open lane */}
        <polygon
          points={`${LEFT_PAD + 25},${openLaneY1 + LANE_H / 2 - 5} ${LEFT_PAD + 35},${openLaneY1 + LANE_H / 2} ${LEFT_PAD + 25},${openLaneY1 + LANE_H / 2 + 5}`}
          fill="rgba(255,255,255,0.3)" />

        {/* Taper polygon (closed lane merges into open lane) */}
        <polygon
          points={`${taperStartX},${ROAD_MID} ${taperStartX},${ROAD_Y2} ${taperEndX},${ROAD_MID}`}
          fill={C_ROAD} stroke={C_CONE} strokeWidth="1.5" />

        {/* Cones in taper */}
        {Array.from({ length: taperCones }).map((_, i) => {
          const t = (i + 0.5) / taperCones;
          const cx = taperStartX + t * (taperEndX - taperStartX);
          return <Cone key={i} x={cx} y={ROAD_MID + 2} size={6} />;
        })}

        {/* Cones along work zone edge (buffer) */}
        {Array.from({ length: bufferCones }).map((_, i) => {
          const cx = taperEndX + (i + 0.5) * (BUFFER_PX / bufferCones);
          return <Cone key={i} x={cx} y={ROAD_MID + 2} size={5} />;
        })}

        {/* Work zone edge line */}
        <line x1={taperEndX} y1={ROAD_MID} x2={workEndX} y2={ROAD_MID}
          stroke={C_CONE} strokeWidth="1.5" strokeDasharray="4,3" />

        {/* Works area label */}
        <text x={(taperEndX + workEndX) / 2} y={closedLaneY1 + LANE_H / 2 + 4}
          textAnchor="middle" fontSize="8" fill="rgba(255,106,0,0.7)" fontWeight="700"
          fontFamily="sans-serif">WORK AREA</text>
        <text x={(taperEndX + workEndX) / 2} y={closedLaneY1 + LANE_H / 2 + 14}
          textAnchor="middle" fontSize="7.5" fill="rgba(255,106,0,0.6)"
          fontFamily="JetBrains Mono, monospace">≈ {inp.worksLength} m</text>

        {/* Arrow board at taper start */}
        {hasArrowBoard && (
          <g transform={`translate(${taperStartX - 14}, ${ROAD_Y1 - 22})`}>
            <rect width="28" height="14" rx="2" fill="#FCD34D" stroke="#92400E" strokeWidth="1" />
            <polygon points="4,11 14,3 24,11" fill="#92400E" opacity="0.7" />
            <text x="14" y="24" textAnchor="middle" fontSize="6.5" fill={C_MUTED} fontFamily="sans-serif">ARROW BRD</text>
          </g>
        )}

        {/* Open lane after work area (continues) */}
        <rect x={workEndX} y={openLaneY1} width={depEndX - workEndX} height={ROAD_Y2 - ROAD_Y1}
          fill={C_OPEN} />

        {/* TC at approach end (taper start) */}
        {hasTCPD && (isAlternating || isFullClosure) && (
          <TCSymbol x={taperStartX} y={ROAD_MID + LANE_H / 2} label="STOP/SLOW" />
        )}

        {/* TC at departure end */}
        {hasTCPD && (isAlternating || isFullClosure) && (
          <TCSymbol x={workEndX + 14} y={ROAD_MID + LANE_H / 2} label="GO/SLOW" />
        )}

        {/* END ROADWORKS sign at departure */}
        <g>
          <rect x={workEndX + 30} y={ROAD_Y1 - 30} width={52} height={24}
            fill="#E5F9EE" stroke="#00A85A" strokeWidth="1.5" rx="3" />
          <text x={workEndX + 56} y={ROAD_Y1 - 22} textAnchor="middle" dominantBaseline="middle"
            fontSize="7" fontWeight="700" fill="#00A85A" fontFamily="sans-serif">END</text>
          <text x={workEndX + 56} y={ROAD_Y1 - 12} textAnchor="middle" dominantBaseline="middle"
            fontSize="6.5" fill="#00A85A" fontFamily="sans-serif">ROADWORKS</text>
          <line x1={workEndX + 56} y1={ROAD_Y1 - 6} x2={workEndX + 56} y2={ROAD_Y1}
            stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3,2" />
        </g>

        {/* Posted speed restored (departure) */}
        {r.speedReductionSteps.length > 0 && (
          <g>
            <rect x={workEndX + 88} y={ROAD_Y1 - 30} width={40} height={24}
              fill={C_SIGN_BG} stroke={C_SIGN_BRD} strokeWidth="1.5" rx="3" />
            <text x={workEndX + 108} y={ROAD_Y1 - 18} textAnchor="middle" dominantBaseline="middle"
              fontSize="8" fontWeight="700" fill={C_TEXT} fontFamily="JetBrains Mono, monospace">
              {inp.postedSpeed}
            </text>
            <line x1={workEndX + 108} y1={ROAD_Y1 - 6} x2={workEndX + 108} y2={ROAD_Y1}
              stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3,2" />
          </g>
        )}

        {/* ── Approach sign symbols ── */}
        {signLayout.map((s, i) => {
          if (s.code === 'TC' || s.code === 'PTL') return null; // drawn as TC symbol
          const isSpeed = s.code.startsWith('R4-1');
          const isPTS   = s.code === 'TM1-18B' || s.code === 'TM1-18B-R';
          const bg = isSpeed ? '#FEF3C7' : isPTS ? '#FEE2E2' : C_SIGN_BG;
          const tc = isSpeed ? '#92400E' : isPTS ? '#991B1B' : C_TEXT;
          // Extract short code for display
          let displayCode = s.code;
          if (isSpeed) {
            const m = s.code.match(/\((\d+)\)/);
            displayCode = m ? `${m[1]}` : s.code;
          } else if (s.code.length > 8) {
            displayCode = s.code.slice(0, 7) + '…';
          }
          return (
            <SignBoard
              key={i}
              x={s.px}
              row={s.row}
              code={displayCode}
              name={shortName(s.code, s.description)}
              color={bg}
              textColor={tc}
            />
          );
        })}

        {/* ── Distance annotations ── */}
        {/* Between consecutive approach signs */}
        {signLayout.slice(0, -1).map((s, i) => {
          const next = signLayout[i + 1];
          if (next.code === 'TC' || next.code === 'PTL') return null;
          if (s.code === 'TC' || s.code === 'PTL') return null;
          const dx = next.px - s.px;
          const distM = Math.round(Math.abs(next.distanceFromTaperStart - s.distanceFromTaperStart));
          if (dx < 10 || distM === 0) return null;
          return (
            <DistArrow key={i} x1={s.px + SIGN_BOX_W / 2} x2={next.px - SIGN_BOX_W / 2}
              y={DIST_Y} label={`${distM} m`} />
          );
        })}

        {/* Last sign to taper start */}
        {(() => {
          const lastSign = signLayout.filter(s => s.code !== 'TC' && s.code !== 'PTL').slice(-1)[0];
          if (!lastSign) return null;
          const dx = taperStartX - (lastSign.px + SIGN_BOX_W / 2);
          const distM = Math.abs(lastSign.distanceFromTaperStart);
          if (dx < 10) return null;
          return <DistArrow x1={lastSign.px + SIGN_BOX_W / 2} x2={taperStartX - 2}
            y={DIST_Y} label={`${distM} m`} />;
        })()}

        {/* Taper length label */}
        <DistArrow x1={taperStartX + 2} x2={taperEndX - 2} y={DIST_Y}
          label={`${r.mergeTaperLength} m`} />

        {/* Buffer label */}
        <DistArrow x1={taperEndX + 2} x2={bufferEndX - 2} y={DIST_Y}
          label={`${r.bufferZoneLength} m`} />

        {/* ── Zone labels ── */}
        <ZoneLabel x1={LEFT_PAD} x2={taperStartX * 0.5} y={ZONE_Y}
          label="Advance Warning Zone" color="#3B82F6" />
        {(() => {
          const fs = aSigns.find(s => s.code.startsWith('R4-1'));
          if (!fs) return null;
          const sx = toX(fs.distanceFromTaperStart);
          return <ZoneLabel x1={sx} x2={taperStartX} y={ZONE_Y}
            label="Temp Speed Zone" color="#B45309" />;
        })()}
        <ZoneLabel x1={taperStartX} x2={taperEndX} y={ZONE_Y}
          label={isShoulderOnly ? 'DELINEATION' : 'TAPER'} color={C_CONE} />
        <ZoneLabel x1={taperEndX} x2={bufferEndX} y={ZONE_Y} label="BUFFER" color={C_MUTED} />
        <ZoneLabel x1={bufferEndX} x2={workEndX} y={ZONE_Y} label="Work Zone" color="#92400E" />
        <ZoneLabel x1={workEndX} x2={depEndX} y={ZONE_Y} label="Termination" color="#065F46" />

        {/* ── Vertical tick marks at key positions ── */}
        {[taperStartX, taperEndX, bufferEndX, workEndX].map((x, i) => (
          <line key={i} x1={x} y1={ROAD_Y2} x2={x} y2={ROAD_Y2 + 8}
            stroke={C_MUTED} strokeWidth="1" />
        ))}

        {/* ── Road edge lines ── */}
        <line x1={LEFT_PAD} y1={ROAD_Y1} x2={depEndX} y2={ROAD_Y1}
          stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
        <line x1={LEFT_PAD} y1={ROAD_Y2} x2={depEndX} y2={ROAD_Y2}
          stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />

        {/* ── Traffic flow arrows in open lane ── */}
        {[0.2, 0.5, 0.75].map((t, i) => {
          const x = LEFT_PAD + t * (depEndX - LEFT_PAD);
          const y = openLaneY1 + LANE_H / 2;
          return (
            <polygon key={i}
              points={`${x - 8},${y - 4} ${x + 8},${y} ${x - 8},${y + 4}`}
              fill="rgba(255,255,255,0.18)" />
          );
        })}

        {/* ── Sight distance bracket (if PTCD) ── */}
        {hasTCPD && ptsSign && (
          <g>
            <line x1={toX(ptsSign.distanceFromTaperStart)} y1={ROAD_Y1 + 4}
              x2={taperStartX} y2={ROAD_Y1 + 4}
              stroke="#3B82F6" strokeWidth="1" strokeDasharray="5,3" />
            <line x1={toX(ptsSign.distanceFromTaperStart)} y1={ROAD_Y1}
              x2={toX(ptsSign.distanceFromTaperStart)} y2={ROAD_Y1 + 10}
              stroke="#3B82F6" strokeWidth="1.5" />
            <line x1={taperStartX} y1={ROAD_Y1} x2={taperStartX} y2={ROAD_Y1 + 10}
              stroke="#3B82F6" strokeWidth="1.5" />
            <text x={(toX(ptsSign.distanceFromTaperStart) + taperStartX) / 2} y={ROAD_Y1 + 16}
              textAnchor="middle" fontSize="7.5" fill="#3B82F6" fontFamily="sans-serif" fontWeight="600">
              Sight dist {r.sightDistanceM} m
            </text>
          </g>
        )}

        {/* ── Cone spacing legend ── */}
        <g transform={`translate(${SVG_W - 180}, ${SVG_H - 55})`}>
          <rect width={170} height={50} fill="var(--paper-50,#F6F7F9)" stroke="#D1D5DB" strokeWidth="1" rx="4" />
          <text x={85} y={13} textAnchor="middle" fontSize="8" fontWeight="700" fill={C_TEXT} fontFamily="sans-serif"
            style={{ letterSpacing: '0.05em', textTransform: 'uppercase' } as React.CSSProperties}>Legend</text>
          <Cone x={14} y={28} size={5} />
          <text x={24} y={32} fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
            Cone @ taper: {r.coneSpacingTaperM} m
          </text>
          <Cone x={14} y={44} size={5} />
          <text x={24} y={48} fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
            Cone @ buffer: {r.coneSpacingM} m
          </text>
        </g>

        {/* ── Notes row ── */}
        <text x={LEFT_PAD} y={SVG_H - 8} fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
          {inp.projectName || 'Project'} · {inp.state} · Temp speed {r.recommendedTempSpeed} km/h · Sign spacing: {r.approachSignSpacing} m ·
          Taper: {r.mergeTaperLength} m · Buffer: {r.bufferZoneLength} m · Ref: {inp.projectRef || '—'}
        </text>

      </svg>
        </div>
      </div>
    </div>
  );
}
