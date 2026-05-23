import { useState, useRef, useCallback } from 'react';
import type { CalculationResult } from './engine';
import type { WizardInputs } from './types';
import { getDesignStep } from './standards';

// ── Canvas dimensions ──────────────────────────────────────────────
const SVG_W = 1100;
const SVG_H  = 500;

// ── Road strip ─────────────────────────────────────────────────────
const ROAD_Y1    = 150;
const ROAD_Y2    = 230;
const ROAD_MID   = (ROAD_Y1 + ROAD_Y2) / 2;
const LANE_H     = (ROAD_Y2 - ROAD_Y1) / 2;
const SHOULDER_H = 18;                    // shoulder band below road

// ── Sign area (above road) ─────────────────────────────────────────
const SIGN_H = 30;
const SIGN_W = 64;
const SIGN_ROW0 = 48;
const SIGN_ROW1 = 88;

// ── Zone annotation rows ───────────────────────────────────────────
const ZONE_ROW  = 248;
const DIST_ROW  = 266;
const NOTE_ROW  = 284;

// ── Bottom band (legend + title block) ────────────────────────────
const BOT_Y = 310;

// ── Colour palette — matches WA/QLD TGS conventions ───────────────
const C_ROAD_BG  = '#4B5563';   // road surface fill
const C_ROAD_CLR = '#374151';   // closed/work lane darker
const C_EDGE     = 'rgba(255,255,255,0.85)';  // edge lines (solid white)
const C_LANE_DIV = 'rgba(255,255,255,0.55)';  // lane divider (dashed white)
const C_CENTRE   = '#FCD34D';   // yellow centreline (2-way)
const C_CONE     = '#FF6A00';
const C_WORK_FG  = '#FF6A00';
const C_WORK_BG  = 'rgba(255,106,0,0.12)';
const C_NOGO_BG  = 'rgba(220,38,38,0.18)';
const C_NOGO_BD  = '#DC2626';
const C_SHADOW   = '#F59E0B';   // shadow / TMA vehicle
const C_LEAD     = '#3B82F6';   // lead / pilot vehicle
const C_WORK_VEH = '#FF6A00';   // work plant vehicle
const C_SIGNAL_R = '#EF4444';
const C_SIGNAL_G = '#22C55E';
const C_TC_GREEN = '#00A85A';
const C_TEXT     = '#0B1220';
const C_MUTED    = '#5C6677';
const C_ARROW    = '#374151';
const C_SIGN_BDR = '#1F2937';

// ── SVG defs (shared across all templates) ──────────────────────────

function SvgDefs() {
  return (
    <defs>
      {/* Arrowhead markers */}
      <marker id="arr" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
        <path d="M0,0.5 L7,3.5 L0,6.5 Z" fill={C_ARROW} />
      </marker>
      <marker id="arrR" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse">
        <path d="M0,0.5 L7,3.5 L0,6.5 Z" fill={C_ARROW} />
      </marker>
      <marker id="arrWhite" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
        <path d="M0,0.5 L7,3.5 L0,6.5 Z" fill="rgba(255,255,255,0.35)" />
      </marker>
      {/* Hatch pattern — work area */}
      <pattern id="hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke={C_WORK_FG} strokeWidth="1.8" strokeOpacity="0.25" />
      </pattern>
      {/* No-go zone hatch */}
      <pattern id="nogo" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke={C_NOGO_BD} strokeWidth="2" strokeOpacity="0.3" />
      </pattern>
      {/* Road flow arrow */}
      <marker id="flowArr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
        <path d="M0,1 L8,4 L0,7 Z" fill="rgba(255,255,255,0.30)" />
      </marker>
    </defs>
  );
}

// ── Title row ─────────────────────────────────────────────────────

function TitleRow({ inp, r, drawingNo, subtitle }: {
  inp: WizardInputs; r: CalculationResult; drawingNo: string; subtitle: string;
}) {
  return (
    <>
      <text x={SVG_W / 2} y={18} textAnchor="middle" fontSize="11.5" fontWeight="800"
        fill={C_TEXT} fontFamily="sans-serif" style={{ letterSpacing: '0.05em' } as React.CSSProperties}>
        GENERIC TRAFFIC GUIDANCE SCHEME — {inp.state.toUpperCase()}
      </text>
      <text x={SVG_W / 2} y={33} textAnchor="middle" fontSize="9" fill={C_MUTED} fontFamily="sans-serif">
        {subtitle}
      </text>
    </>
  );
}

// ── Title block (bottom-right, engineering-drawing style) ──────────

function TitleBlock({ inp, r, drawingNo }: {
  inp: WizardInputs; r: CalculationResult; drawingNo: string;
}) {
  const x = SVG_W - 340;
  const y = BOT_Y + 8;
  const w = 332;
  const h = BOT_Y + 8 + 172 > SVG_H ? SVG_H - BOT_Y - 20 : 172;
  const row = (i: number) => y + 20 + i * 22;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="var(--paper-50,#F8F8FA)" stroke={C_SIGN_BDR} strokeWidth="1.2" rx="3" />
      {/* Header */}
      <rect x={x} y={y} width={w} height={20} fill={C_SIGN_BDR} rx="3" />
      <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize="9" fontWeight="800"
        fill="white" fontFamily="sans-serif" style={{ letterSpacing: '0.08em' } as React.CSSProperties}>
        MAIN ROADS {inp.state.toUpperCase()} — TRAFFIC GUIDANCE SCHEME
      </text>
      {/* Rows */}
      {[
        ['Project', inp.projectName || '—'],
        ['Ref', inp.projectRef || '—'],
        ['State', inp.state],
        ['Posted Speed', `${inp.postedSpeed} km/h`],
        ['Temp Speed', `${r.recommendedTempSpeed} km/h`],
        ['Design Step', r.designStepName],
        ['AGTTM Ref', (() => { const s = getDesignStep(inp.worksType); return s?.agttmRef || '—'; })()],
        ['Drawing No', drawingNo],
      ].map(([label, val], i) => (
        <g key={i}>
          <line x1={x} y1={row(i) - 6} x2={x + w} y2={row(i) - 6} stroke="#E5E7EB" strokeWidth="0.7" />
          <text x={x + 8} y={row(i) + 7} fontSize="8" fontWeight="700" fill={C_MUTED}
            fontFamily="sans-serif" style={{ letterSpacing: '0.03em' } as React.CSSProperties}>{label}</text>
          <text x={x + 110} y={row(i) + 7} fontSize="8" fill={C_TEXT} fontFamily="sans-serif">{val}</text>
        </g>
      ))}
      <text x={x + w - 8} y={y + h - 6} textAnchor="end" fontSize="7" fill={C_MUTED} fontFamily="sans-serif">
        SCHEMATIC ONLY — NOT TO SCALE
      </text>
    </g>
  );
}

// ── Legend (bottom-left) ───────────────────────────────────────────

function Legend({ extras }: { extras?: Array<[string, string, string?]> }) {
  const x = 30;
  const y = BOT_Y + 8;
  const items: Array<[string, string, string?]> = [
    ['rect', C_ROAD_BG, 'Existing road'],
    ['cone', C_CONE, 'Proposed cones'],
    ['hatch', C_WORK_BG, 'Work area'],
    ['nogo', C_NOGO_BG, 'No-go zone'],
    ...(extras ?? []),
  ];
  const w = 220;
  const h = 20 + items.length * 20;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="var(--paper-50,#F8F8FA)" stroke="#D1D5DB" strokeWidth="1" rx="3" />
      <rect x={x} y={y} width={w} height={20} fill={C_SIGN_BDR} rx="3" />
      <text x={x + w / 2} y={y + 14} textAnchor="middle" fontSize="9" fontWeight="800"
        fill="white" fontFamily="sans-serif" style={{ letterSpacing: '0.08em' } as React.CSSProperties}>LEGEND</text>
      {items.map(([type, color, label], i) => {
        const iy = y + 20 + i * 20 + 4;
        const ix = x + 10;
        const swatch = (() => {
          if (type === 'cone') return (
            <polygon points={`${ix + 6},${iy + 1} ${ix},${iy + 11} ${ix + 12},${iy + 11}`} fill={color} />
          );
          if (type === 'hatch') return (
            <g>
              <rect x={ix} y={iy} width={14} height={12} fill={color} stroke={C_WORK_FG} strokeWidth="1" />
              <rect x={ix} y={iy} width={14} height={12} fill="url(#hatch)" />
            </g>
          );
          if (type === 'nogo') return (
            <g>
              <rect x={ix} y={iy} width={14} height={12} fill={C_NOGO_BG} stroke={C_NOGO_BD} strokeWidth="1" />
              <rect x={ix} y={iy} width={14} height={12} fill="url(#nogo)" />
            </g>
          );
          return <rect x={ix} y={iy} width={14} height={12} fill={color} rx="2" />;
        })();
        return (
          <g key={i}>
            {swatch}
            <text x={ix + 20} y={iy + 9} fontSize="8.5" fill={C_TEXT} fontFamily="sans-serif">{label}</text>
          </g>
        );
      })}
    </g>
  );
}

// ── Sign panel (WA/QLD plan-view style) ───────────────────────────
// Signs sit above the road with a dashed pole line

function SignPanel({
  x, row, codes, pole = true, bg = 'white', border = C_SIGN_BDR, textColor = C_TEXT,
}: {
  x: number; row: 0 | 1; codes: string[][]; // each entry: [mainCode, subText?]
  pole?: boolean; bg?: string; border?: string; textColor?: string;
}) {
  const sy = row === 0 ? SIGN_ROW0 : SIGN_ROW1;
  const mx = x - SIGN_W / 2;
  const totalH = SIGN_H * codes.length;
  const poleY1 = sy + totalH;
  const poleY2 = ROAD_Y1 - 1;
  return (
    <g>
      {pole && (
        <line x1={x} y1={poleY1} x2={x} y2={poleY2}
          stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3,2" />
      )}
      {codes.map(([code, sub], ci) => (
        <g key={ci}>
          <rect x={mx} y={sy + ci * SIGN_H} width={SIGN_W} height={SIGN_H}
            fill={bg} stroke={border} strokeWidth={ci === 0 ? 1.5 : 0.7} rx={ci === 0 ? 3 : 0} />
          <text x={x} y={sy + ci * SIGN_H + 11} textAnchor="middle" dominantBaseline="middle"
            fontSize="7.5" fontWeight="800" fill={textColor} fontFamily="JetBrains Mono, monospace"
            style={{ letterSpacing: '0.02em' } as React.CSSProperties}>{code}</text>
          {sub && (
            <text x={x} y={sy + ci * SIGN_H + 22} textAnchor="middle" dominantBaseline="middle"
              fontSize="6" fill={C_MUTED} fontFamily="sans-serif">{sub}</text>
          )}
        </g>
      ))}
    </g>
  );
}

// ── Traffic cone ──────────────────────────────────────────────────

function Cone({ x, y, size = 6 }: { x: number; y: number; size?: number }) {
  return (
    <polygon points={`${x},${y - size} ${x - size * 0.55},${y + size * 0.4} ${x + size * 0.55},${y + size * 0.4}`}
      fill={C_CONE} stroke="none" />
  );
}

// ── Vehicle symbol ─────────────────────────────────────────────────

function Vehicle({ x, y, label, sublabel, color, w = 44, h = 22 }: {
  x: number; y: number; label: string; sublabel?: string; color: string; w?: number; h?: number;
}) {
  // Overhead (plan-view) vehicle: rectangle with cab at right end
  const cy = y - h / 2;
  return (
    <g>
      {/* Body */}
      <rect x={x - w / 2} y={cy} width={w} height={h} rx="3" fill={color} stroke="white" strokeWidth="1.2" />
      {/* Cab indicator (right side = forward) */}
      <rect x={x + w / 2 - 8} y={cy + 2} width={6} height={h - 4} rx="1" fill="rgba(0,0,0,0.3)" />
      {/* Label */}
      <text x={x - 2} y={cy + h / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize="7" fontWeight="800" fill="white" fontFamily="sans-serif">{label}</text>
      {sublabel && (
        <text x={x} y={y + h / 2 + 10} textAnchor="middle" fontSize="7" fill={C_MUTED} fontFamily="sans-serif">{sublabel}</text>
      )}
    </g>
  );
}

// ── Arrow board ───────────────────────────────────────────────────

function ArrowBoard({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 18} y={y - 10} width={36} height={18} rx="2" fill="#FCD34D" stroke="#92400E" strokeWidth="1.2" />
      <polygon points={`${x - 10},${y + 5} ${x + 10},${y + 5} ${x},${y - 5}`} fill="#92400E" opacity="0.7" />
      <text x={x} y={y + 18} textAnchor="middle" fontSize="6.5" fill={C_MUTED} fontFamily="sans-serif">ARROW BRD</text>
    </g>
  );
}

// ── Traffic signal ────────────────────────────────────────────────

function TrafficSignal({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect x={x - 7} y={y - 14} width={14} height={28} rx="3" fill="#1F2937" stroke="#9CA3AF" strokeWidth="1" />
      <circle cx={x} cy={y - 7} r={4} fill={C_SIGNAL_R} />
      <circle cx={x} cy={y + 7} r={4} fill={C_SIGNAL_G} />
      <line x1={x} y1={y + 14} x2={x} y2={ROAD_Y1 - 1} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3,2" />
      <text x={x} y={y + 24} textAnchor="middle" fontSize="7" fill={C_TC_GREEN} fontFamily="sans-serif" fontWeight="700">{label}</text>
    </g>
  );
}

// ── TC (Stop/Slow bat) symbol ─────────────────────────────────────

function TCBat({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill={C_TC_GREEN} stroke="white" strokeWidth="1.5" />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize="8" fontWeight="800" fill="white" fontFamily="sans-serif">TC</text>
      <text x={x} y={y + 20} textAnchor="middle" fontSize="7" fill={C_TC_GREEN} fontFamily="sans-serif" fontWeight="600">{label}</text>
    </g>
  );
}

// ── Dimension arrow ───────────────────────────────────────────────

function DimArrow({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  const mid = (x1 + x2) / 2;
  const narrow = (x2 - x1) < 36;
  return (
    <g>
      <line x1={x1 + 2} y1={y} x2={x2 - 2} y2={y}
        stroke={C_ARROW} strokeWidth="1" markerEnd="url(#arr)" markerStart="url(#arrR)" />
      <text x={mid} y={narrow ? y - 7 : y - 5} textAnchor="middle"
        fontSize="8" fontFamily="JetBrains Mono, monospace" fill={C_TEXT} fontWeight="700">{label}</text>
    </g>
  );
}

// ── Zone bracket label ────────────────────────────────────────────

function ZoneLbl({ x1, x2, y, label, color = C_MUTED }: {
  x1: number; x2: number; y: number; label: string; color?: string;
}) {
  const mid = (x1 + x2) / 2;
  return (
    <text x={mid} y={y} textAnchor="middle" fontSize="8" fill={color}
      fontFamily="sans-serif" fontWeight="700"
      style={{ letterSpacing: '0.06em', textTransform: 'uppercase' } as React.CSSProperties}>{label}</text>
  );
}

// ── Two-lane road base ────────────────────────────────────────────
// Draws road from x1 to x2 with edge lines + lane divider

function RoadStrip({ x1, x2, centerLine = false }: { x1: number; x2: number; centerLine?: boolean }) {
  return (
    <g>
      <rect x={x1} y={ROAD_Y1} width={x2 - x1} height={ROAD_Y2 - ROAD_Y1} fill={C_ROAD_BG} />
      {/* Lane divider */}
      {centerLine ? (
        <line x1={x1} y1={ROAD_MID} x2={x2} y2={ROAD_MID}
          stroke={C_CENTRE} strokeWidth="1.5" strokeDasharray="10,6" />
      ) : (
        <line x1={x1} y1={ROAD_MID} x2={x2} y2={ROAD_MID}
          stroke={C_LANE_DIV} strokeWidth="1" strokeDasharray="10,6" />
      )}
      {/* Edge lines */}
      <line x1={x1} y1={ROAD_Y1} x2={x2} y2={ROAD_Y1} stroke={C_EDGE} strokeWidth="1.5" />
      <line x1={x1} y1={ROAD_Y2} x2={x2} y2={ROAD_Y2} stroke={C_EDGE} strokeWidth="1.5" />
    </g>
  );
}

// ── Flow arrows in a lane ─────────────────────────────────────────

function FlowArrows({ x1, x2, laneY, reverse = false }: {
  x1: number; x2: number; laneY: number; reverse?: boolean;
}) {
  const positions = [0.25, 0.55, 0.80];
  return (
    <>
      {positions.map((t, i) => {
        const cx = x1 + t * (x2 - x1);
        const cy = laneY;
        const pts = reverse
          ? `${cx + 10},${cy - 4} ${cx - 10},${cy} ${cx + 10},${cy + 4}`
          : `${cx - 10},${cy - 4} ${cx + 10},${cy} ${cx - 10},${cy + 4}`;
        return <polygon key={i} points={pts} fill="rgba(255,255,255,0.22)" />;
      })}
    </>
  );
}

// ── END ROADWORKS sign ────────────────────────────────────────────

function EndRoadworks({ x, y = ROAD_Y1 - 32 }: { x: number; y?: number }) {
  return (
    <g>
      <rect x={x - 28} y={y} width={56} height={28} fill="#E5F9EE" stroke={C_TC_GREEN} strokeWidth="1.5" rx="3" />
      <text x={x} y={y + 11} textAnchor="middle" dominantBaseline="middle"
        fontSize="7.5" fontWeight="800" fill={C_TC_GREEN} fontFamily="sans-serif">END ROAD</text>
      <text x={x} y={y + 23} textAnchor="middle" dominantBaseline="middle"
        fontSize="7" fill={C_TC_GREEN} fontFamily="sans-serif">WORK</text>
      <line x1={x} y1={y + 28} x2={x} y2={ROAD_Y1} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3,2" />
    </g>
  );
}

function ThankYou({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 24} y={ROAD_Y1 - 28} width={48} height={22} fill="#E5F9EE" stroke={C_TC_GREEN} strokeWidth="1" rx="3" />
      <text x={x} y={ROAD_Y1 - 22} textAnchor="middle" dominantBaseline="middle"
        fontSize="7" fontWeight="700" fill={C_TC_GREEN} fontFamily="sans-serif">THANK YOU</text>
      <text x={x} y={ROAD_Y1 - 10} textAnchor="middle" dominantBaseline="middle"
        fontSize="6.5" fill={C_TC_GREEN} fontFamily="sans-serif">RESUME SPEED</text>
    </g>
  );
}

// ── Speed sign ────────────────────────────────────────────────────

function SpeedSign({ x, speed, label, row }: { x: number; speed: number; label: string; row: 0 | 1 }) {
  const sy = row === 0 ? SIGN_ROW0 : SIGN_ROW1;
  return (
    <g>
      <line x1={x} y1={sy + SIGN_H} x2={x} y2={ROAD_Y1 - 1} stroke="#9CA3AF" strokeWidth="1" strokeDasharray="3,2" />
      <rect x={x - SIGN_W / 2} y={sy} width={SIGN_W} height={SIGN_H} fill="#FEF3C7" stroke="#92400E" strokeWidth="1.5" rx="3" />
      <text x={x} y={sy + 12} textAnchor="middle" dominantBaseline="middle"
        fontSize="11" fontWeight="800" fill="#92400E" fontFamily="JetBrains Mono, monospace">{speed}</text>
      <text x={x} y={sy + 24} textAnchor="middle" dominantBaseline="middle"
        fontSize="6" fill={C_MUTED} fontFamily="sans-serif">{label}</text>
    </g>
  );
}

// ── PNG export ────────────────────────────────────────────────────

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

// ── Template dispatcher ───────────────────────────────────────────

type TGSTemplate = 'lane_closure' | 'alternating' | 'shoulder' | 'mobile' | 'stli_inlane' | 'detour';

function getTemplate(worksType: string): TGSTemplate {
  if (['around_detour', 'around_sidetrack', 'around_contraflow'].includes(worksType)) return 'detour';
  if (['through_alternating', 'through_shuttle', 'through_pilot'].includes(worksType)) return 'alternating';
  if (['mobile_class1', 'mobile_class2', 'mobile_class3'].includes(worksType)) return 'mobile';
  if (['past_shoulder', 'stli_shoulder_foot', 'stli_shoulder_plant', 'stli_freq_outside'].includes(worksType)) return 'shoulder';
  if (['stli_specialist', 'stli_gaps', 'stli_short_term', 'stli_freq_lane', 'stli_moving'].includes(worksType)) return 'stli_inlane';
  return 'lane_closure';
}

function getDrawingNo(worksType: string, state: string): string {
  const map: Record<string, string> = {
    past_lane_closure: 'LC-001', past_pavement: 'LC-002', past_bridge: 'LC-002',
    past_contraflow: 'LC-003', past_shoulder: 'WOR-001',
    through_alternating: 'RF-001', through_shuttle: 'RF-002', through_pilot: 'RF-005',
    mobile_class1: 'MOB-001', mobile_class2: 'MOB-002', mobile_class3: 'STLI-001',
    stli_specialist: 'STLI-002', stli_gaps: 'STLI-002', stli_short_term: 'STLI-003',
    stli_freq_lane: 'STLI-003', stli_moving: 'STLI-003',
    stli_shoulder_foot: 'STLI-001', stli_shoulder_plant: 'STLI-002',
    stli_freq_outside: 'STLI-003', around_detour: 'WOR-DTR', around_sidetrack: 'WOR-DTR',
    around_contraflow: 'WOR-CFL',
  };
  const base = map[worksType] ?? 'TGS-001';
  return `${base}`;
}

// ════════════════════════════════════════════════════════════════════
// TEMPLATE 1 — LANE CLOSURE (LC-001/002/003 style)
// Matches WA LC series: advance signs, shadow vehicle, taper, buffer, work area
// ════════════════════════════════════════════════════════════════════

function LaneClosureBody({ r, inp }: { r: CalculationResult; inp: WizardInputs }) {
  const stepDef = getDesignStep(inp.worksType);
  const isFullClosure = stepDef?.isFullClosure ?? false;
  const hasTCPD = ['stop_slow_bats', 'portable_signals', 'police'].includes(inp.controlMethod);
  const hasArrowBoard = r.approachSigns.some(s => s.code === 'AB') || inp.arrowBoard;
  const hasPortSig = inp.controlMethod === 'portable_signals';

  const aSigns = r.approachSigns.filter(s => s.code !== 'AB');
  const firstSignPos = aSigns.length > 0 ? aSigns[0].distanceFromTaperStart : -r.approachSignSpacing * 2;
  const approachLen  = Math.abs(firstSignPos);

  const LEFT_PAD  = 28;
  const TAPER_PX  = Math.max(65, Math.min(110, r.mergeTaperLength * 0.55));
  const BUF_PX    = 40;
  const WORK_PX   = 100;
  const DEP_PX    = 150;
  const RIGHT_PAD = 18;

  const apprPX = SVG_W - LEFT_PAD - TAPER_PX - BUF_PX - WORK_PX - DEP_PX - RIGHT_PAD;
  const scale  = apprPX / Math.max(approachLen, 1);
  const tapX   = LEFT_PAD + apprPX;
  const toX = (m: number) => tapX + m * scale;
  const tapEndX  = tapX + TAPER_PX;
  const bufEndX  = tapEndX + BUF_PX;
  const workEndX = bufEndX + WORK_PX;
  const depEndX  = workEndX + DEP_PX;

  // Pixel sign layout (alternating rows)
  const signLayout = aSigns.map((s, i) => ({
    ...s, px: toX(s.distanceFromTaperStart), row: (i % 2) as 0 | 1,
  }));

  // Short sign display code
  const dispCode = (code: string) => {
    if (code.startsWith('R4-1')) { const m = code.match(/\((\d+)\)/); return m ? m[1] : code; }
    if (code.length > 9) return code.slice(0, 8) + '…';
    return code;
  };

  const openY  = ROAD_Y1 + LANE_H / 2;
  const closedY = ROAD_MID + LANE_H / 2;
  const tapCones  = Math.min(9, Math.ceil(TAPER_PX / 11));
  const bufCones  = Math.min(6, Math.ceil(BUF_PX / 9));

  return (
    <>
      {/* ── Zone background fills ── */}
      <rect x={LEFT_PAD} y={ROAD_Y1 - 3} width={apprPX} height={ROAD_Y2 - ROAD_Y1 + 6} fill="rgba(59,130,246,0.06)" />
      {/* Temp speed zone */}
      {(() => { const fs = aSigns.find(s => s.code.startsWith('R4-1'));
        if (!fs) return null;
        const sx = toX(fs.distanceFromTaperStart);
        return <rect x={sx} y={ROAD_Y1 - 3} width={tapX - sx} height={ROAD_Y2 - ROAD_Y1 + 6} fill="rgba(251,191,36,0.10)" />;
      })()}
      {/* Work area fill (closed lane) */}
      <rect x={tapEndX - 4} y={ROAD_MID} width={WORK_PX + BUF_PX + 8} height={LANE_H} fill={C_WORK_BG} />
      <rect x={tapEndX - 4} y={ROAD_MID} width={WORK_PX + BUF_PX + 8} height={LANE_H} fill="url(#hatch)" />

      {/* ── Road surface ── */}
      <RoadStrip x1={LEFT_PAD} x2={tapX} />
      {/* Open lane continues through work zone */}
      <rect x={tapX} y={ROAD_Y1} width={depEndX - tapX} height={LANE_H} fill={C_ROAD_BG} />
      <line x1={tapX} y1={ROAD_Y1} x2={depEndX} y2={ROAD_Y1} stroke={C_EDGE} strokeWidth="1.5" />
      <line x1={workEndX} y1={ROAD_MID} x2={depEndX} y2={ROAD_MID} stroke={C_LANE_DIV} strokeWidth="1" strokeDasharray="10,6" />
      <line x1={LEFT_PAD} y1={ROAD_Y2} x2={tapX} y2={ROAD_Y2} stroke={C_EDGE} strokeWidth="1.5" />
      {/* Road after work zone (both lanes restored) */}
      <rect x={workEndX} y={ROAD_Y1} width={depEndX - workEndX} height={ROAD_Y2 - ROAD_Y1} fill={C_ROAD_BG} />
      <line x1={workEndX} y1={ROAD_Y1} x2={depEndX} y2={ROAD_Y1} stroke={C_EDGE} strokeWidth="1.5" />
      <line x1={workEndX} y1={ROAD_Y2} x2={depEndX} y2={ROAD_Y2} stroke={C_EDGE} strokeWidth="1.5" />

      {/* ── Taper polygon (closed lane narrows) ── */}
      <polygon points={`${tapX},${ROAD_MID} ${tapX},${ROAD_Y2} ${tapEndX},${ROAD_MID}`}
        fill={C_ROAD_CLR} stroke={C_CONE} strokeWidth="1.5" />

      {/* ── Cones in taper ── */}
      {Array.from({ length: tapCones }).map((_, i) => {
        const t = (i + 0.5) / tapCones;
        return <Cone key={i} x={tapX + t * (tapEndX - tapX)} y={ROAD_MID + 2} />;
      })}
      {/* Cones along buffer */}
      {Array.from({ length: bufCones }).map((_, i) => (
        <Cone key={i} x={tapEndX + (i + 0.5) * (BUF_PX / bufCones)} y={ROAD_MID + 2} />
      ))}
      {/* Work zone boundary */}
      <line x1={tapEndX} y1={ROAD_MID} x2={workEndX} y2={ROAD_MID}
        stroke={C_CONE} strokeWidth="1.5" strokeDasharray="5,3" />

      {/* ── Shadow vehicle (before taper) ── */}
      <Vehicle x={tapX - 50} y={closedY} label="SHADOW" sublabel="20–40 m" color={C_SHADOW} />

      {/* ── Arrow board ── */}
      {hasArrowBoard && <ArrowBoard x={tapX - 10} y={ROAD_Y1 - 18} />}

      {/* ── TC or portable signals ── */}
      {hasTCPD && isFullClosure && (
        <>
          {hasPortSig
            ? <TrafficSignal x={tapX} y={ROAD_Y1 - 38} label="TEMP SIG" />
            : <TCBat x={tapX} y={closedY} label="STOP/SLOW" />}
          {hasPortSig
            ? <TrafficSignal x={workEndX + 16} y={ROAD_Y1 - 38} label="TEMP SIG" />
            : <TCBat x={workEndX + 16} y={closedY} label="STOP/SLOW" />}
        </>
      )}

      {/* ── Work zone labels ── */}
      <text x={(tapEndX + tapEndX + BUF_PX) / 2} y={ROAD_MID + LANE_H / 2 + 2}
        textAnchor="middle" fontSize="7" fill="rgba(255,106,0,0.6)" fontFamily="sans-serif" fontWeight="700">BUFFER</text>
      <text x={(bufEndX + workEndX) / 2} y={ROAD_MID + LANE_H / 2 + 2}
        textAnchor="middle" fontSize="7.5" fill="rgba(255,106,0,0.75)" fontWeight="700" fontFamily="sans-serif">WORK AREA</text>
      <text x={(bufEndX + workEndX) / 2} y={ROAD_MID + LANE_H / 2 + 13}
        textAnchor="middle" fontSize="7" fill="rgba(255,106,0,0.55)" fontFamily="JetBrains Mono, monospace">≈ {inp.worksLength} m</text>

      {/* ── END ROADWORKS + THANK YOU ── */}
      <EndRoadworks x={workEndX + 40} />
      <ThankYou x={workEndX + 100} />

      {/* ── Posted speed restored ── */}
      {r.speedReductionSteps.length > 0 && (
        <SpeedSign x={workEndX + DEP_PX - 16} speed={inp.postedSpeed} label="RESUME" row={0} />
      )}

      {/* ── Flow arrows ── */}
      <FlowArrows x1={LEFT_PAD} x2={tapX} laneY={openY} />
      <FlowArrows x1={tapEndX} x2={workEndX} laneY={openY} />

      {/* ── Approach signs ── */}
      {signLayout.map((s, i) => {
        if (s.code === 'TC' || s.code === 'PTL') return null;
        const isSpeed = s.code.startsWith('R4-1');
        const isPTS   = s.code === 'TM1-18B' || s.code === 'TM1-18B-R';
        if (isSpeed) {
          const m = s.code.match(/\((\d+)\)/);
          return <SpeedSign key={i} x={s.px} speed={m ? Number(m[1]) : inp.postedSpeed} label="km/h" row={s.row} />;
        }
        const bg  = isPTS ? '#FEE2E2' : 'white';
        const bdr = isPTS ? '#DC2626' : C_SIGN_BDR;
        return (
          <SignPanel key={i} x={s.px} row={s.row}
            codes={[[dispCode(s.code), s.description.slice(0, 14)]]}
            bg={bg} border={bdr} textColor={isPTS ? '#DC2626' : C_TEXT} />
        );
      })}

      {/* ── Dimension arrows ── */}
      {signLayout.slice(0, -1).map((s, i) => {
        const next = signLayout[i + 1];
        if (next.code === 'TC' || s.code === 'TC') return null;
        const distM = Math.round(Math.abs(next.distanceFromTaperStart - s.distanceFromTaperStart));
        const dx = next.px - s.px;
        if (dx < 12 || distM === 0) return null;
        return <DimArrow key={i} x1={s.px + SIGN_W / 2} x2={next.px - SIGN_W / 2} y={DIST_ROW} label={`${distM} m`} />;
      })}
      {(() => {
        const last = signLayout.filter(s => s.code !== 'TC').slice(-1)[0];
        if (!last) return null;
        const dx = tapX - (last.px + SIGN_W / 2);
        if (dx < 12) return null;
        return <DimArrow x1={last.px + SIGN_W / 2} x2={tapX - 2} y={DIST_ROW} label={`${Math.abs(last.distanceFromTaperStart)} m`} />;
      })()}
      <DimArrow x1={tapX + 2} x2={tapEndX - 2} y={DIST_ROW} label={`${r.mergeTaperLength} m`} />
      <DimArrow x1={tapEndX + 2} x2={bufEndX - 2} y={DIST_ROW} label={`${r.bufferZoneLength} m`} />
      <DimArrow x1={bufEndX + 2} x2={workEndX - 2} y={DIST_ROW} label={`≈ ${inp.worksLength} m`} />

      {/* ── Zone labels ── */}
      <ZoneLbl x1={LEFT_PAD} x2={tapX * 0.6} y={ZONE_ROW} label="Advance Warning Zone" color="#3B82F6" />
      {(() => {
        const fs = aSigns.find(s => s.code.startsWith('R4-1'));
        if (!fs) return null;
        const sx = toX(fs.distanceFromTaperStart);
        return <ZoneLbl x1={sx} x2={tapX} y={ZONE_ROW} label="Temp Speed Zone" color="#B45309" />;
      })()}
      <ZoneLbl x1={tapX} x2={tapEndX} y={ZONE_ROW} label="Taper" color={C_CONE} />
      <ZoneLbl x1={tapEndX} x2={bufEndX} y={ZONE_ROW} label="Buffer" color={C_MUTED} />
      <ZoneLbl x1={bufEndX} x2={workEndX} y={ZONE_ROW} label="Work Zone" color="#92400E" />
      <ZoneLbl x1={workEndX} x2={depEndX} y={ZONE_ROW} label="Termination" color="#065F46" />

      {/* ── Tick marks at zone boundaries ── */}
      {[tapX, tapEndX, bufEndX, workEndX].map((x, i) => (
        <line key={i} x1={x} y1={ROAD_Y2} x2={x} y2={ROAD_Y2 + 6} stroke={C_MUTED} strokeWidth="1" />
      ))}

      {/* ── Tables note ── */}
      <text x={SVG_W - 340 - 12} y={BOT_Y + 24} textAnchor="end" fontSize="8" fill={C_MUTED} fontFamily="sans-serif">
        Sign spacing: {r.approachSignSpacing} m · Taper: {r.mergeTaperLength} m · Buffer: {r.bufferZoneLength} m
      </text>
      <text x={SVG_W - 340 - 12} y={BOT_Y + 38} textAnchor="end" fontSize="8" fill={C_MUTED} fontFamily="sans-serif">
        Cone spacing (taper): {r.coneSpacingTaperM} m · Cone spacing (buffer): {r.coneSpacingM} m
      </text>
      <text x={SVG_W - 340 - 12} y={BOT_Y + 52} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        AGTTM Part 3 — Table 2.2 (sign spacing) · Table 5.3 (cone spacing) · Table 5.7 (taper)
      </text>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// TEMPLATE 2 — REVERSIBLE FLOW / ALTERNATING (RF-001/002/005 style)
// Matches WA RF series: approach from BOTH ends, TC or pilot vehicle
// ════════════════════════════════════════════════════════════════════

function AlternatingBody({ r, inp }: { r: CalculationResult; inp: WizardInputs }) {
  const isPilot    = inp.worksType === 'through_pilot' || inp.worksType === 'through_shuttle';
  const hasPortSig = inp.controlMethod === 'portable_signals';
  const hasTCPD    = ['stop_slow_bats', 'portable_signals', 'police'].includes(inp.controlMethod);

  // Layout: approach signs on left → TC → throat → single-lane work zone → throat → TC ← approach signs on right
  const APPR_L = 240;
  const APPR_R = 240;
  const THROAT = 28;
  const BUF_PX = 36;
  const WORK_PX = 110;
  const LEFT_PAD = 28;
  const workMidX  = (SVG_W - 340) / 2;  // centre of work zone (left of title block)
  const workStartX = workMidX - WORK_PX / 2;
  const workEndX   = workMidX + WORK_PX / 2;
  const tcLX = workStartX - BUF_PX - THROAT;
  const tcRX = workEndX   + BUF_PX + THROAT;
  const throatLend = tcLX + THROAT;
  const throatRstart = tcRX - THROAT;
  const lApprStart = LEFT_PAD;
  const lApprEnd   = tcLX;
  const rApprStart = tcRX;
  const rApprEnd   = rApprStart + APPR_R;

  const slY1 = ROAD_MID - LANE_H / 2;  // single-lane top
  const slY2 = ROAD_MID + LANE_H / 2;  // single-lane bottom

  // Build sign layout for approach end (left signs mirrored on right)
  const aSigns = r.approachSigns.filter(s => s.code !== 'AB' && s.code !== 'TC' && s.code !== 'PTL');
  const signCount = Math.min(aSigns.length, 4);
  const signSpacing = APPR_L / (signCount + 1);

  const dispCode = (code: string) => {
    if (code.startsWith('R4-1')) { const m = code.match(/\((\d+)\)/); return m ? m[1] : code; }
    return code.slice(0, 8);
  };

  return (
    <>
      {/* ── Approach roads (two-way, yellow centreline) ── */}
      <RoadStrip x1={lApprStart} x2={lApprEnd} centerLine />
      <RoadStrip x1={rApprStart} x2={rApprEnd} centerLine />

      {/* ── Throat narrowing (left) ── */}
      <polygon points={`${tcLX},${ROAD_Y1} ${throatLend},${slY1} ${throatLend},${slY2} ${tcLX},${ROAD_Y2}`}
        fill={C_ROAD_BG} />
      {[0.25, 0.6].map((t, i) => <Cone key={i} x={tcLX + t * THROAT} y={ROAD_Y1 + 2} />)}
      {[0.25, 0.6].map((t, i) => <Cone key={i} x={tcLX + t * THROAT} y={ROAD_Y2 - 2} />)}

      {/* ── Single-lane work zone ── */}
      <rect x={throatLend} y={slY1} width={workEndX - throatLend} height={slY2 - slY1} fill={C_ROAD_BG} />
      {/* Buffer zones on each side of work */}
      <rect x={throatLend} y={slY1} width={BUF_PX} height={slY2 - slY1} fill="rgba(251,191,36,0.12)" />
      <rect x={workEndX} y={slY1} width={BUF_PX} height={slY2 - slY1} fill="rgba(251,191,36,0.12)" />
      {/* Work area */}
      <rect x={workStartX} y={slY1} width={WORK_PX} height={slY2 - slY1} fill={C_WORK_BG} />
      <rect x={workStartX} y={slY1} width={WORK_PX} height={slY2 - slY1} fill="url(#hatch)" />
      {/* Edge lines on single lane */}
      <line x1={throatLend} y1={slY1} x2={workEndX + BUF_PX} y2={slY1} stroke={C_EDGE} strokeWidth="1.5" />
      <line x1={throatLend} y1={slY2} x2={workEndX + BUF_PX} y2={slY2} stroke={C_EDGE} strokeWidth="1.5" />
      {/* Cones along both edges of single lane */}
      {Array.from({ length: 7 }).map((_, i) => {
        const cx = throatLend + BUF_PX + i * ((WORK_PX - 4) / 7);
        return <g key={i}><Cone x={cx} y={slY1 - 2} /><Cone x={cx} y={slY2 + 2} /></g>;
      })}

      {/* ── Throat widening (right) ── */}
      <polygon points={`${throatRstart},${slY1} ${tcRX},${ROAD_Y1} ${tcRX},${ROAD_Y2} ${throatRstart},${slY2}`}
        fill={C_ROAD_BG} />
      {[0.4, 0.75].map((t, i) => <Cone key={i} x={throatRstart + t * THROAT} y={ROAD_Y1 + 2} />)}
      {[0.4, 0.75].map((t, i) => <Cone key={i} x={throatRstart + t * THROAT} y={ROAD_Y2 - 2} />)}

      {/* ── TC / Signals / Pilot at both throats ── */}
      {isPilot ? (
        <>
          <Vehicle x={tcLX + THROAT / 2} y={ROAD_MID} label="PILOT" color={C_LEAD} w={40} h={20} />
          <Vehicle x={tcRX - THROAT / 2} y={ROAD_MID} label="PILOT" color={C_LEAD} w={40} h={20} />
          <text x={tcLX} y={ROAD_Y2 + 18} textAnchor="middle" fontSize="7" fill={C_LEAD} fontFamily="sans-serif" fontWeight="700">PILOT VEHICLE</text>
          <text x={tcRX} y={ROAD_Y2 + 18} textAnchor="middle" fontSize="7" fill={C_LEAD} fontFamily="sans-serif" fontWeight="700">PILOT VEHICLE</text>
        </>
      ) : hasTCPD ? (
        hasPortSig ? (
          <>
            <TrafficSignal x={tcLX} y={ROAD_Y1 - 40} label="TEMP SIG" />
            <TrafficSignal x={tcRX} y={ROAD_Y1 - 40} label="TEMP SIG" />
          </>
        ) : (
          <>
            <TCBat x={tcLX} y={ROAD_MID} label="STOP/SLOW" />
            <TCBat x={tcRX} y={ROAD_MID} label="STOP/SLOW" />
          </>
        )
      ) : null}

      {/* ── Work area labels ── */}
      <text x={workMidX} y={ROAD_MID + 4} textAnchor="middle" fontSize="8" fill="rgba(255,106,0,0.8)" fontWeight="700" fontFamily="sans-serif">WORK AREA</text>
      <text x={workMidX} y={ROAD_MID + 15} textAnchor="middle" fontSize="7.5" fill="rgba(255,106,0,0.6)" fontFamily="JetBrains Mono, monospace">≈ {inp.worksLength} m</text>

      {/* ── Approach signs (LEFT end) ── */}
      {Array.from({ length: signCount }).map((_, i) => {
        const s = aSigns[i];
        const px = lApprStart + signSpacing * (i + 1);
        const isSpeed = s.code.startsWith('R4-1');
        if (isSpeed) {
          const m = s.code.match(/\((\d+)\)/);
          return <SpeedSign key={i} x={px} speed={m ? Number(m[1]) : inp.postedSpeed} label="km/h" row={(i % 2) as 0 | 1} />;
        }
        return <SignPanel key={i} x={px} row={(i % 2) as 0 | 1}
          codes={[[dispCode(s.code), s.description.slice(0, 14)]]} />;
      })}

      {/* ── Mirror signs on RIGHT end ── */}
      {Array.from({ length: signCount }).map((_, i) => {
        const s = aSigns[signCount - 1 - i]; // reversed order
        const px = rApprEnd - signSpacing * (i + 1);
        const isSpeed = s.code.startsWith('R4-1');
        if (isSpeed) {
          const m = s.code.match(/\((\d+)\)/);
          return <SpeedSign key={i} x={px} speed={m ? Number(m[1]) : inp.postedSpeed} label="km/h" row={(i % 2) as 0 | 1} />;
        }
        return <SignPanel key={i} x={px} row={(i % 2) as 0 | 1}
          codes={[[dispCode(s.code), s.description.slice(0, 14)]]} />;
      })}

      {/* ── PILOT VEHICLE IN USE sign (if pilot) ── */}
      {isPilot && (
        <>
          <SignPanel x={lApprStart + 30} row={0} codes={[['T6-6', 'PILOT VEH IN USE']]}
            bg="#DBEAFE" border="#3B82F6" textColor="#1D4ED8" />
          <SignPanel x={rApprEnd - 30} row={0} codes={[['T6-6', 'PILOT VEH IN USE']]}
            bg="#DBEAFE" border="#3B82F6" textColor="#1D4ED8" />
        </>
      )}

      {/* ── END ROADWORKS both ends ── */}
      <EndRoadworks x={lApprStart + 20} y={ROAD_Y1 - 32} />
      <EndRoadworks x={rApprEnd - 20} y={ROAD_Y1 - 32} />

      {/* ── Flow arrows (approach, both ends) ── */}
      <FlowArrows x1={lApprStart} x2={lApprEnd - 10} laneY={ROAD_Y1 + LANE_H / 2} />
      <FlowArrows x1={rApprStart + 10} x2={rApprEnd} laneY={ROAD_Y1 + LANE_H / 2} reverse />
      {/* Opposing arrows */}
      <FlowArrows x1={lApprStart} x2={lApprEnd - 10} laneY={ROAD_MID + LANE_H / 2} reverse />
      <FlowArrows x1={rApprStart + 10} x2={rApprEnd} laneY={ROAD_MID + LANE_H / 2} />

      {/* ── Flow arrow through single lane ── */}
      <polygon points={`${workMidX - 12},${ROAD_MID - 4} ${workMidX + 12},${ROAD_MID} ${workMidX - 12},${ROAD_MID + 4}`}
        fill="rgba(255,255,255,0.3)" />

      {/* ── Dimension arrows ── */}
      <DimArrow x1={throatLend + 2} x2={workStartX - 2} y={DIST_ROW} label={`${r.bufferZoneLength} m buf`} />
      <DimArrow x1={workStartX + 2} x2={workEndX - 2} y={DIST_ROW} label={`≈ ${inp.worksLength} m`} />
      <DimArrow x1={workEndX + 2} x2={throatRstart - 2} y={DIST_ROW} label={`${r.bufferZoneLength} m buf`} />

      {/* ── Zone labels ── */}
      <ZoneLbl x1={lApprStart} x2={lApprEnd} y={ZONE_ROW} label="← Advance Warning (Both Ends)" color="#3B82F6" />
      <ZoneLbl x1={throatLend} x2={workStartX} y={ZONE_ROW} label="Buffer" color={C_MUTED} />
      <ZoneLbl x1={workStartX} x2={workEndX} y={ZONE_ROW} label="Work Zone" color="#92400E" />
      <ZoneLbl x1={workEndX} x2={throatRstart} y={ZONE_ROW} label="Buffer" color={C_MUTED} />

      {/* ── Opposing traffic label ── */}
      <text x={(lApprStart + lApprEnd) / 2} y={ROAD_MID + LANE_H / 2 + 12}
        textAnchor="middle" fontSize="7.5" fill={C_CENTRE} fontFamily="sans-serif" fontWeight="600">
        ← Opposing traffic (held at {isPilot ? 'Pilot' : 'TC/Signals'})
      </text>

      {/* ── Note: max reversible flow length ── */}
      <text x={SVG_W - 340 - 12} y={BOT_Y + 24} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        Maximum length of reversible flow — refer AGTTM Part 3 Table 5.4 (based on volume)
      </text>
      <text x={SVG_W - 340 - 12} y={BOT_Y + 38} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        Min lane width 3.0 m (shuttle) / 3.5 m (other) · Delineation at max 60 m spacing
      </text>
      <text x={SVG_W - 340 - 12} y={BOT_Y + 52} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        AGTTM Part 3 Sections 5.3–5.6 · Signs required on BOTH approaches
      </text>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// TEMPLATE 3 — SHOULDER / VERGE WORKS (WOR-001/002/003 style)
// Full road open, work area on shoulder below carriageway
// ════════════════════════════════════════════════════════════════════

function ShoulderBody({ r, inp }: { r: CalculationResult; inp: WizardInputs }) {
  const LEFT_PAD  = 28;
  const APPR_PX   = 330;
  const WORK_PX   = 200;
  const DEP_PX    = 160;
  const workStartX = LEFT_PAD + APPR_PX;
  const workEndX   = workStartX + WORK_PX;
  const roadEndX   = workEndX + DEP_PX;

  const SHL_Y1 = ROAD_Y2;
  const SHL_Y2 = ROAD_Y2 + SHOULDER_H;

  const aSigns = r.approachSigns.filter(s => s.code !== 'AB' && s.code !== 'TC');
  const n = Math.min(aSigns.length, 5);
  const sp = APPR_PX / (n + 1);
  const dispCode = (code: string) => {
    if (code.startsWith('R4-1')) { const m = code.match(/\((\d+)\)/); return m ? m[1] : code; }
    return code.slice(0, 8);
  };

  return (
    <>
      {/* ── Advance warning zone bg ── */}
      <rect x={LEFT_PAD} y={ROAD_Y1 - 3} width={APPR_PX} height={ROAD_Y2 - ROAD_Y1 + 6} fill="rgba(59,130,246,0.06)" />

      {/* ── Full road (all lanes open) ── */}
      <RoadStrip x1={LEFT_PAD} x2={roadEndX} />

      {/* ── Shoulder surface ── */}
      <rect x={LEFT_PAD} y={SHL_Y1} width={roadEndX - LEFT_PAD} height={SHOULDER_H}
        fill="#374151" opacity="0.45" />
      {/* Work area on shoulder */}
      <rect x={workStartX - 10} y={SHL_Y1} width={WORK_PX + 20} height={SHOULDER_H}
        fill={C_WORK_BG} />
      <rect x={workStartX - 10} y={SHL_Y1} width={WORK_PX + 20} height={SHOULDER_H}
        fill="url(#hatch)" />

      {/* Shadow vehicle on shoulder */}
      <Vehicle x={workStartX - 50} y={SHL_Y1 + SHOULDER_H / 2} label="SHADOW" color={C_SHADOW} w={40} h={14} />

      {/* Work vehicle on shoulder */}
      <Vehicle x={workStartX + WORK_PX / 2} y={SHL_Y1 + SHOULDER_H / 2} label="WORK VEH" color={C_WORK_VEH} w={42} h={14} />

      {/* Cones along shoulder-road boundary in work area */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Cone key={i} x={workStartX - 5 + i * ((WORK_PX + 10) / 8)} y={ROAD_Y2 - 2} size={5} />
      ))}
      {/* Edge delineator posts */}
      {Array.from({ length: 6 }).map((_, i) => {
        const cx = workStartX + 10 + i * ((WORK_PX - 20) / 6);
        return (
          <rect key={i} x={cx - 2} y={ROAD_Y2 - 8} width={4} height={8}
            fill="#FCD34D" stroke="#92400E" strokeWidth="0.5" rx="1" />
        );
      })}

      {/* ── Traffic flow (all lanes) ── */}
      <FlowArrows x1={LEFT_PAD} x2={roadEndX} laneY={ROAD_Y1 + LANE_H / 2} />
      <FlowArrows x1={LEFT_PAD} x2={roadEndX} laneY={ROAD_MID + LANE_H / 2} />

      {/* ── Approach signs ── */}
      {Array.from({ length: n }).map((_, i) => {
        const s = aSigns[i];
        const px = LEFT_PAD + sp * (i + 1);
        const isSpeed = s.code.startsWith('R4-1');
        if (isSpeed) {
          const m = s.code.match(/\((\d+)\)/);
          return <SpeedSign key={i} x={px} speed={m ? Number(m[1]) : inp.postedSpeed} label="km/h" row={(i % 2) as 0 | 1} />;
        }
        return <SignPanel key={i} x={px} row={(i % 2) as 0 | 1}
          codes={[[dispCode(s.code), s.description.slice(0, 14)]]} />;
      })}

      {/* ── END ROADWORKS ── */}
      <EndRoadworks x={workEndX + 30} />
      <ThankYou x={workEndX + 90} />

      {/* ── Dimension arrows ── */}
      <DimArrow x1={workStartX + 2} x2={workEndX - 2} y={DIST_ROW} label={`≈ ${inp.worksLength} m`} />

      {/* ── Zone labels ── */}
      <ZoneLbl x1={LEFT_PAD} x2={workStartX} y={ZONE_ROW} label="Advance Warning Zone" color="#3B82F6" />
      <ZoneLbl x1={workStartX} x2={workEndX} y={ZONE_ROW} label="Shoulder Work Zone" color="#92400E" />
      <ZoneLbl x1={workEndX} x2={roadEndX} y={ZONE_ROW} label="Termination" color="#065F46" />

      {/* ── Road and shoulder labels ── */}
      <text x={(LEFT_PAD + roadEndX) / 2} y={ROAD_MID + 4} textAnchor="middle"
        fontSize="7.5" fill="rgba(255,255,255,0.3)" fontFamily="sans-serif">ALL LANES OPEN</text>
      <text x={(workStartX + workEndX) / 2} y={SHL_Y1 + 12} textAnchor="middle"
        fontSize="7" fill="rgba(255,106,0,0.7)" fontWeight="700" fontFamily="sans-serif">SHOULDER / VERGE WORK AREA</text>

      {/* ── Shoulder boundary note ── */}
      <text x={(LEFT_PAD + roadEndX) / 2} y={NOTE_ROW} textAnchor="middle"
        fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        All traffic lanes remain open — shoulder/verge delineated with cones and edge posts
      </text>

      {/* ── Tables notes ── */}
      <text x={SVG_W - 340 - 12} y={BOT_Y + 24} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        Sign spacing: {r.approachSignSpacing} m · Cone spacing: {r.coneSpacingM} m
      </text>
      <text x={SVG_W - 340 - 12} y={BOT_Y + 38} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        AGTTM Part 3 — Table 2.2 (sign spacing) · Table 5.3 (cone spacing)
      </text>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// TEMPLATE 4 — MOBILE WORKS (MOB-001/002/STLI-001 style)
// Moving convoy: shadow/TMA → plant/workers → lead vehicle
// ════════════════════════════════════════════════════════════════════

function MobileBody({ r, inp }: { r: CalculationResult; inp: WizardInputs }) {
  const isClass3 = inp.worksType === 'mobile_class3';
  const isClass2 = inp.worksType === 'mobile_class2';

  const LEFT_PAD = 40;
  const ROAD_W   = SVG_W - 340 - LEFT_PAD - 20;
  const roadEndX = LEFT_PAD + ROAD_W;

  const CONV_START = LEFT_PAD + 120;
  const CONV_LEN   = Math.min(350, ROAD_W - 200);
  const shadowX    = CONV_START;
  const leadX      = CONV_START + CONV_LEN;
  const plantX     = CONV_START + CONV_LEN * 0.5;

  const workLaneY = ROAD_Y1 + LANE_H / 2;   // top lane (convoy lane)
  const freeLaneY = ROAD_MID + LANE_H / 2;  // bottom lane (free flow)

  return (
    <>
      {/* ── Road ── */}
      <RoadStrip x1={LEFT_PAD} x2={roadEndX} />

      {/* ── Convoy work zone highlight (top lane only) ── */}
      <rect x={shadowX - 20} y={ROAD_Y1} width={CONV_LEN + 40} height={LANE_H} fill={C_WORK_BG} />
      <rect x={shadowX - 20} y={ROAD_Y1} width={CONV_LEN + 40} height={LANE_H} fill="url(#hatch)" />

      {/* ── Shadow / TMA vehicle (rear) ── */}
      <Vehicle x={shadowX} y={workLaneY} label={isClass2 ? 'TMA' : 'SHADOW'} sublabel="Rear protection" color={C_SHADOW} />

      {/* ── Plant or workers ── */}
      {isClass3 ? (
        <>
          {[0.3, 0.5, 0.7].map((t, i) => {
            const wx = CONV_START + t * CONV_LEN * 0.7;
            return (
              <g key={i} transform={`translate(${wx - 6}, ${workLaneY - 12})`}>
                <circle cx={6} cy={4} r={4} fill="#FCD34D" stroke="#92400E" strokeWidth="1" />
                <line x1={6} y1={8} x2={6} y2={18} stroke="#FCD34D" strokeWidth="2" />
                <line x1={2} y1={13} x2={10} y2={13} stroke="#FCD34D" strokeWidth="2" />
              </g>
            );
          })}
          <text x={CONV_START + CONV_LEN * 0.35} y={ROAD_Y2 + 14} textAnchor="middle"
            fontSize="7" fill="#FCD34D" fontFamily="sans-serif">Workers on foot</text>
        </>
      ) : (
        <Vehicle x={plantX} y={workLaneY} label="PLANT" sublabel="Work vehicle" color={C_WORK_VEH} />
      )}

      {/* ── Lead vehicle (front) ── */}
      <Vehicle x={leadX} y={workLaneY} label="LEAD" sublabel="Lead sign veh" color={C_LEAD} />

      {/* ── Direction of travel ── */}
      <polygon points={`${roadEndX - 20},${workLaneY - 5} ${roadEndX - 4},${workLaneY} ${roadEndX - 20},${workLaneY + 5}`}
        fill="rgba(255,255,255,0.5)" />
      <text x={roadEndX - 40} y={ROAD_Y1 - 12} textAnchor="middle"
        fontSize="7.5" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">Direction of travel →</text>

      {/* ── Free flow traffic (lower lane) ── */}
      <FlowArrows x1={LEFT_PAD} x2={roadEndX} laneY={freeLaneY} />
      <text x={LEFT_PAD + ROAD_W * 0.4} y={freeLaneY + 3} textAnchor="middle"
        fontSize="7" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">Other traffic — free flow</text>

      {/* ── Temporary speed sign ── */}
      {r.recommendedTempSpeed < inp.postedSpeed && (
        <SpeedSign x={LEFT_PAD + 30} speed={r.recommendedTempSpeed} label="TEMP SPD" row={0} />
      )}

      {/* ── MMS-ADV-52B NEXT 2km sign (mobile advisory) ── */}
      <SignPanel x={LEFT_PAD + 110} row={1}
        codes={[['MMS-ADV-52B', 'NEXT 2 km'], ['MMS-ADV-1', 'ROAD PLANT AHEAD']]}
        bg="white" border={C_SIGN_BDR} />

      {/* ── Dimension: convoy length ── */}
      <DimArrow x1={shadowX} x2={leadX} y={ROAD_Y1 - 14} label={`Convoy ≈ ${inp.worksLength} m`} />
      {/* ── Shadow to work area spacing ── */}
      <DimArrow x1={shadowX + 25} x2={shadowX + 60} y={DIST_ROW} label="20–40 m" />
      <text x={shadowX + 42} y={DIST_ROW + 14} textAnchor="middle" fontSize="7" fill={C_MUTED} fontFamily="sans-serif">Shadow gap</text>

      {/* ── Zone label ── */}
      <ZoneLbl x1={shadowX - 20} x2={leadX + 20} y={ZONE_ROW}
        label={`Mobile Work Zone — ${inp.worksType.replace('mobile_', 'Class ').replace('class', '')}`} color="#92400E" />

      {/* ── Sight distance note ── */}
      <text x={(LEFT_PAD + roadEndX) / 2} y={NOTE_ROW} textAnchor="middle"
        fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        Sight distance for lookout — refer AGTTM Part 5 Table 4.3 · Sign spacing 'D' m — refer AGTTM Part 5 Table 2.3
      </text>

      {/* ── Tables notes ── */}
      <text x={SVG_W - 340 - 12} y={BOT_Y + 24} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        Sign spacing 'D' = {r.approachSignSpacing} m (AGTTM Part 5 Table 2.3)
      </text>
      <text x={SVG_W - 340 - 12} y={BOT_Y + 38} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        Shadow vehicle gap: 20–40 m · TMA required for Class 2/3
      </text>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// TEMPLATE 5 — STLI IN-LANE (STLI-002/003 style)
// In-lane short-term work: TMA protection + specialist/work vehicle
// ════════════════════════════════════════════════════════════════════

function STLIInLaneBody({ r, inp }: { r: CalculationResult; inp: WizardInputs }) {
  const isMoving  = inp.worksType === 'stli_moving';
  const isSpec    = inp.worksType === 'stli_specialist';

  const LEFT_PAD   = 40;
  const ROAD_W     = SVG_W - 340 - LEFT_PAD - 20;
  const roadEndX   = LEFT_PAD + ROAD_W;
  const protStart  = LEFT_PAD + ROAD_W * 0.42;
  const PROT_LEN   = 140;
  const protEnd    = protStart + PROT_LEN;
  const tmaX       = protStart - 40;

  const workLaneY = ROAD_Y1 + LANE_H / 2;
  const freeLaneY = ROAD_MID + LANE_H / 2;

  return (
    <>
      {/* ── Road ── */}
      <RoadStrip x1={LEFT_PAD} x2={roadEndX} />

      {/* ── Protection / work zone (top lane) ── */}
      <rect x={protStart} y={ROAD_Y1} width={PROT_LEN} height={LANE_H} fill={C_WORK_BG} />
      <rect x={protStart} y={ROAD_Y1} width={PROT_LEN} height={LANE_H} fill="url(#hatch)" />
      {/* No-go zone behind TMA */}
      <rect x={tmaX - 40} y={ROAD_Y1} width={40} height={LANE_H} fill={C_NOGO_BG} />
      <rect x={tmaX - 40} y={ROAD_Y1} width={40} height={LANE_H} fill="url(#nogo)" />

      {/* ── TMA vehicle ── */}
      <Vehicle x={tmaX} y={workLaneY} label="TMA" sublabel="Cat A/B" color={C_SHADOW} />

      {/* ── Cones around protection zone ── */}
      {Array.from({ length: 5 }).map((_, i) => {
        const cx = protStart + 8 + i * ((PROT_LEN - 8) / 5);
        return <g key={i}><Cone x={cx} y={ROAD_Y1 + 2} /><Cone x={cx} y={ROAD_MID - 2} /></g>;
      })}
      {/* Cones upstream of TMA */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Cone key={i} x={tmaX - 20 - i * 18} y={ROAD_MID - 2} />
      ))}

      {/* ── Specialist / work vehicle ── */}
      <Vehicle x={protStart + PROT_LEN / 2} y={workLaneY - 16}
        label={isSpec ? 'SPEC VEH' : 'WORK VEH'} color={isSpec ? '#8B5CF6' : C_WORK_VEH} w={44} h={20} />

      {/* ── Moving banner ── */}
      {isMoving && (
        <text x={(protStart + protEnd) / 2} y={ROAD_Y1 - 8} textAnchor="middle"
          fontSize="9" fontWeight="700" fill={C_WORK_FG} fontFamily="sans-serif">
          ↔ MOVING / TRAVELLING WORK
        </text>
      )}

      {/* ── Free flow (lower lane) ── */}
      <FlowArrows x1={LEFT_PAD} x2={roadEndX} laneY={freeLaneY} />

      {/* ── Approach / slow in top lane ── */}
      <polygon points={`${LEFT_PAD + 50},${workLaneY - 4} ${LEFT_PAD + 62},${workLaneY} ${LEFT_PAD + 50},${workLaneY + 4}`}
        fill="rgba(255,255,255,0.2)" />
      <text x={LEFT_PAD + 100} y={workLaneY + 3} fontSize="7" fill="rgba(255,255,255,0.45)" fontFamily="sans-serif">Slow / merge →</text>

      {/* ── Temp speed sign ── */}
      {r.recommendedTempSpeed < inp.postedSpeed && (
        <SpeedSign x={LEFT_PAD + 30} speed={r.recommendedTempSpeed} label="TEMP SPD" row={0} />
      )}

      {/* ── Approach signs ── */}
      {r.approachSigns.filter(s => !['AB','TC','PTL'].includes(s.code)).slice(0, 3).map((s, i) => {
        const px = LEFT_PAD + 80 + i * 80;
        const isSpeed = s.code.startsWith('R4-1');
        if (isSpeed) { const m = s.code.match(/\((\d+)\)/); return <SpeedSign key={i} x={px} speed={m ? Number(m[1]) : inp.postedSpeed} label="km/h" row={0} />; }
        return <SignPanel key={i} x={px} row={(i % 2) as 0 | 1}
          codes={[[s.code.slice(0, 9), s.description.slice(0, 14)]]} />;
      })}

      {/* ── Dimension arrows ── */}
      <DimArrow x1={protStart + 2} x2={protEnd - 2} y={DIST_ROW} label={`≈ ${inp.worksLength} m`} />

      {/* ── Zone labels ── */}
      <ZoneLbl x1={LEFT_PAD} x2={tmaX - 40} y={ZONE_ROW} label="Approach" color="#3B82F6" />
      <ZoneLbl x1={tmaX - 40} x2={protStart} y={ZONE_ROW} label="Protection Zone" color={C_CONE} />
      <ZoneLbl x1={protStart} x2={protEnd} y={ZONE_ROW} label="STLI Work Zone" color="#92400E" />

      {/* ── Note ── */}
      <text x={(LEFT_PAD + roadEndX) / 2} y={NOTE_ROW} textAnchor="middle"
        fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        Short-term in-lane operation · TMA mandatory · Cones protect work zone · Adjacent lane remains open
      </text>

      {/* ── Tables notes ── */}
      <text x={SVG_W - 340 - 12} y={BOT_Y + 24} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        Sight dist to TMA: {r.sightDistanceM} m · Temp speed: {r.recommendedTempSpeed} km/h
      </text>
      <text x={SVG_W - 340 - 12} y={BOT_Y + 38} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        AGTTM Part 5 Sections 4.3–4.5 · TMA category per design step
      </text>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// TEMPLATE 6 — DETOUR / AROUND (WOR-DTR style)
// Full road closure with detour route schematic
// ════════════════════════════════════════════════════════════════════

function DetourBody({ r, inp }: { r: CalculationResult; inp: WizardInputs }) {
  const isSidetrack  = inp.worksType === 'around_sidetrack';
  const isContraflow = inp.worksType === 'around_contraflow';

  const LEFT_PAD  = 28;
  const closeStart = 280;
  const closeEnd   = 620;
  const roadEnd    = SVG_W - 340 - 20;
  const arcCX      = (closeStart + closeEnd) / 2;
  const ARC_Y      = 65;

  return (
    <>
      {/* ── Approach road ── */}
      <RoadStrip x1={LEFT_PAD} x2={closeStart} />
      {/* ── Closed section (hatched) ── */}
      <rect x={closeStart} y={ROAD_Y1} width={closeEnd - closeStart} height={ROAD_Y2 - ROAD_Y1} fill="#1F2937" opacity="0.55" />
      <rect x={closeStart} y={ROAD_Y1} width={closeEnd - closeStart} height={ROAD_Y2 - ROAD_Y1} fill="url(#nogo)" />
      {/* ── Departure road ── */}
      <RoadStrip x1={closeEnd} x2={roadEnd} />

      {/* ── Barricades at closure point ── */}
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(${closeStart - 18 + i * 18}, ${ROAD_MID - 10})`}>
          <rect width={14} height={20} rx="2" fill="#DC2626" opacity="0.8" />
          <line x1={0} y1={5} x2={14} y2={15} stroke="white" strokeWidth="1.5" />
          <line x1={0} y1={10} x2={14} y2={20} stroke="white" strokeWidth="1.5" />
        </g>
      ))}
      {/* ── ROAD CLOSED sign ── */}
      <SignPanel x={closeStart - 10} row={0}
        codes={[['ROAD CLOSED', '']]}
        bg="#FEE2E2" border="#DC2626" textColor="#DC2626" pole={false} />

      {/* ── Closed road label ── */}
      <text x={arcCX} y={ROAD_MID + 5} textAnchor="middle" fontSize="9" fontWeight="700"
        fill="rgba(220,38,38,0.65)" fontFamily="sans-serif">ROAD CLOSED</text>
      <text x={arcCX} y={ROAD_MID + 18} textAnchor="middle" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">≈ {inp.worksLength} m</text>

      {/* ── Detour arc ── */}
      <path d={`M ${closeStart + 10} ${ROAD_Y1 - 4} Q ${closeStart} ${ARC_Y} ${arcCX} ${ARC_Y} Q ${closeEnd} ${ARC_Y} ${closeEnd - 10} ${ROAD_Y1 - 4}`}
        fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="10,5" />
      {/* Arrow at end of detour arc */}
      <polygon points={`${closeEnd - 14},${ROAD_Y1 - 4} ${closeEnd - 10},${ROAD_Y1 + 6} ${closeEnd - 6},${ROAD_Y1 - 4}`}
        fill="#F59E0B" />

      {/* ── Detour label ── */}
      <text x={arcCX} y={ARC_Y - 10} textAnchor="middle" fontSize="10" fontWeight="800"
        fill="#F59E0B" fontFamily="sans-serif">
        {isSidetrack ? 'TEMPORARY SIDETRACK' : isContraflow ? 'CONTRAFLOW DETOUR' : 'DETOUR ROUTE'}
      </text>
      <text x={arcCX} y={ARC_Y + 2} textAnchor="middle" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        Via approved alternate route — distances and signing as per TMP
      </text>

      {/* ── Approach signs ── */}
      {r.approachSigns.filter(s => !['AB','TC'].includes(s.code)).slice(0, 3).map((s, i) => {
        const px = LEFT_PAD + 60 + i * 65;
        const isSpeed = s.code.startsWith('R4-1');
        if (isSpeed) { const m = s.code.match(/\((\d+)\)/); return <SpeedSign key={i} x={px} speed={m ? Number(m[1]) : inp.postedSpeed} label="km/h" row={(i%2) as 0|1} />; }
        return <SignPanel key={i} x={px} row={(i % 2) as 0 | 1}
          codes={[[s.code.slice(0, 9), s.description.slice(0, 14)]]}
          bg={s.code.includes('CLOSE') ? '#FEE2E2' : 'white'}
          border={s.code.includes('CLOSE') ? '#DC2626' : C_SIGN_BDR} />;
      })}

      {/* ── DETOUR signs ── */}
      <SignPanel x={closeStart - 10} row={1}
        codes={[['DETOUR →', 'Follow detour']]}
        bg="#FEF3C7" border="#F59E0B" textColor="#B45309" pole={false} />
      <SignPanel x={closeEnd + 10} row={0}
        codes={[['END DETOUR', '']]}
        bg="#E5F9EE" border={C_TC_GREEN} textColor={C_TC_GREEN} pole={false} />

      {/* ── Traffic flow ── */}
      <FlowArrows x1={LEFT_PAD} x2={closeStart - 10} laneY={ROAD_Y1 + LANE_H / 2} />
      <FlowArrows x1={closeEnd + 10} x2={roadEnd} laneY={ROAD_Y1 + LANE_H / 2} />

      {/* ── Zone labels ── */}
      <ZoneLbl x1={LEFT_PAD} x2={closeStart} y={ZONE_ROW} label="Advance Warning Zone" color="#3B82F6" />
      <ZoneLbl x1={closeStart} x2={closeEnd} y={ZONE_ROW} label="Closed Section" color="#DC2626" />
      <ZoneLbl x1={closeEnd} x2={roadEnd} y={ZONE_ROW} label="End Detour / Resume" color="#065F46" />

      {/* ── Notes ── */}
      <text x={(LEFT_PAD + roadEnd) / 2} y={NOTE_ROW} textAnchor="middle"
        fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        Refer to Traffic Management Plan for approved detour route, sign positions, and advance warning distances
      </text>

      {/* ── Tables notes ── */}
      <text x={SVG_W - 340 - 12} y={BOT_Y + 24} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        Site-specific TMP required for all detour / full closure works
      </text>
      <text x={SVG_W - 340 - 12} y={BOT_Y + 38} textAnchor="end" fontSize="7.5" fill={C_MUTED} fontFamily="sans-serif">
        AGTTM Part 3 Sections 3.2–3.4 · Sign spacing per Table 2.2
      </text>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════

interface Props { result: CalculationResult; inputs: WizardInputs }

const TEMPLATE_LABELS: Record<TGSTemplate, string> = {
  lane_closure: 'Lane Closure',
  alternating:  'Reversible Flow / Alternating',
  shoulder:     'Shoulder / Verge Works',
  mobile:       'Mobile Works',
  stli_inlane:  'Short-Term Lane Intrusion',
  detour:       'Road Closure / Detour',
};

const TEMPLATE_SUBTITLES: Record<TGSTemplate, string> = {
  lane_closure: 'Midblock Single Lane Closure',
  alternating:  'Midblock Reversible Flow — Single Lane Alternating',
  shoulder:     'Works Off Road / Shoulder & Verge — Static Worksite Signage',
  mobile:       'Frequently Changing Work Area — In Lane / Mobile Convoy',
  stli_inlane:  'Short Term Low Impact — In-Lane Works with TMA Protection',
  detour:       'Works Around Worksite — Road Closure / Detour Route',
};

export function TGSSchematic({ result: r, inputs: inp }: Props) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan]   = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const svgRef  = useRef<SVGSVGElement>(null);

  const clamp = (z: number) => Math.min(3, Math.max(0.4, z));

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => clamp(z - e.deltaY * 0.001));
  }, []);

  const onDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragRef.current = { mx: e.clientX, my: e.clientY, px: pan.x, py: pan.y };
  };
  const onMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const { mx, my, px, py } = dragRef.current;
    setPan({ x: px + (e.clientX - mx), y: py + (e.clientY - my) });
  };

  const template   = getTemplate(inp.worksType);
  const drawingNo  = getDrawingNo(inp.worksType, inp.state);
  const subtitle   = TEMPLATE_SUBTITLES[template];

  const exportPng = async () => {
    if (!svgRef.current) return;
    const name = `TGS-${drawingNo}-${inp.projectName || 'project'}-${inp.date}.png`.replace(/[^a-z0-9.\-_]/gi, '_');
    await exportSvgAsPng(svgRef.current, name);
  };

  const btnStyle: React.CSSProperties = {
    padding: '4px 10px', borderRadius: 5, border: '1.5px solid var(--border-default)',
    background: 'var(--bg-surface)', color: 'var(--fg-default)',
    fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
    display: 'flex', alignItems: 'center', gap: 4,
  };

  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      {/* ── Control bar ── */}
      <div className="no-print" style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px',
        borderBottom: '1px solid var(--border-default)', background: 'var(--paper-50)', flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4,
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          color: 'var(--fg-subtle)', letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>{TEMPLATE_LABELS[template]}</span>
        <span style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>Drawing {drawingNo}</span>
        <button style={btnStyle} onClick={() => setZoom(z => clamp(z + 0.2))}>＋</button>
        <button style={btnStyle} onClick={() => setZoom(z => clamp(z - 0.2))}>－</button>
        <button style={btnStyle} onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}>↺ Reset</button>
        <span style={{ fontSize: 10, color: 'var(--fg-subtle)' }}>{Math.round(zoom * 100)}%</span>
        <div style={{ flex: 1 }} />
        <button style={{ ...btnStyle, borderColor: '#0A84FF', color: '#0A84FF' }} onClick={exportPng}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export PNG
        </button>
      </div>

      {/* ── Pan / zoom canvas ── */}
      <div
        style={{ overflow: 'hidden', cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none', background: 'var(--paper-50)' }}
        onWheel={handleWheel}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        <div style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: dragging ? 'none' : 'transform 0.1s',
        }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            width="100%"
            style={{ display: 'block', maxWidth: SVG_W, minWidth: 680 }}
            aria-label="Traffic Guidance Scheme schematic"
          >
            <SvgDefs />

            {/* White background */}
            <rect width={SVG_W} height={SVG_H} fill="white" />

            {/* Outer border (engineering drawing style) */}
            <rect x={4} y={4} width={SVG_W - 8} height={SVG_H - 8}
              fill="none" stroke="#CBD5E1" strokeWidth="1" />

            {/* Title */}
            <TitleRow inp={inp} r={r} drawingNo={drawingNo} subtitle={subtitle} />

            {/* Template body */}
            {template === 'lane_closure' && <LaneClosureBody r={r} inp={inp} />}
            {template === 'alternating'  && <AlternatingBody r={r} inp={inp} />}
            {template === 'shoulder'     && <ShoulderBody r={r} inp={inp} />}
            {template === 'mobile'       && <MobileBody r={r} inp={inp} />}
            {template === 'stli_inlane'  && <STLIInLaneBody r={r} inp={inp} />}
            {template === 'detour'       && <DetourBody r={r} inp={inp} />}

            {/* Bottom divider */}
            <line x1={8} y1={BOT_Y} x2={SVG_W - 8} y2={BOT_Y} stroke="#CBD5E1" strokeWidth="0.8" />

            {/* Legend */}
            <Legend extras={
              template === 'mobile' || template === 'stli_inlane'
                ? [['rect', C_SHADOW, 'Shadow / TMA vehicle'], ['rect', C_LEAD, 'Lead / Pilot vehicle']]
                : template === 'alternating' ? [['rect', C_TC_GREEN, 'TC / Traffic signals']]
                : []
            } />

            {/* Title block */}
            <TitleBlock inp={inp} r={r} drawingNo={drawingNo} />

            {/* "EXAMPLE ONLY" watermark */}
            <text
              x={SVG_W / 2 - 200} y={SVG_H / 2 + 30}
              fontSize="52" fontWeight="900" fill="rgba(0,0,0,0.04)"
              fontFamily="sans-serif"
              style={{ letterSpacing: '0.15em', textTransform: 'uppercase', userSelect: 'none' } as React.CSSProperties}
              transform={`rotate(-25, ${SVG_W / 2 - 200}, ${SVG_H / 2 + 30})`}
            >
              EXAMPLE ONLY
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
