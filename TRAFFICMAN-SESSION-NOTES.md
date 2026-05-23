# TrafficMan — Development Session Notes

**Branch:** `claude/traffic-management-app-PJ8UH`
**Repository:** `madcrx/TrafficMan`
**Stack:** React 18 · TypeScript · Vite 6 · No backend

---

## What Was Built

TrafficMan is a browser-based Australian Traffic Management Plan (TMP) calculator. It computes taper lengths, sign schedules, queue estimates, and design step eligibility directly from AS 1742.3:2019, AGTTM, WA COP, and QGTTM — entirely in the browser with no backend required.

---

## Commit History

| Commit | Description |
|--------|-------------|
| `06fb93b` | Initial TMP Calculator — standards-based calculation engine |
| `ab96624` | Fix end-of-queue calculation; add configurable stop time |
| `a82270e` | Add TGS schematic SVG diagram; remove unused surface tabs |
| `adcb445` | Expand AGTTM works classification — full 22-step design hierarchy |
| `204606b` | Fix two queue display issues found by multi-agent audit |
| `d35c5f7` | Comprehensive audit fixes: standards accuracy, performance, accessibility, security |
| `0dcccf1` | Fix two sign code errors found in AS 1742.3:2019 audit |
| `864c44f` | Add history export/import; performance, accessibility, security fixes |
| `e180d05` | Add location geocoding with OSM map preview and coordinate output |
| `4c57474` | Add PTCD type selection: Traffic Controller, Traffic Lights, Boom Gate |
| `655505c` | State-specific compliance docs; New Calculation button |

---

## Features Implemented

### Calculation Engine (`engine.ts`)
- Taper lengths scaled to actual lane width (AS 1742.3 / AGTTM Table 5.7)
- Sign spacing by speed band (AS 1742.3 Table 2.2)
- Sight distance to PTCD (AS 1742.3 Table 2.3) — WA uses different values
- Buffer zone minimum (AGTTM Table 5.7)
- Cone spacing through zone and within taper (AGTTM Table 4.2)
- Distance between tapers (AGTTM Table 5.8)
- Minimum temp speed zone length (AGTTM Table 5.5)
- Queue length estimation (AGTTM Table 4.3) — stop-time based, HV-adjusted
- Speed reduction steps (AGTTM Table 5.6)
- Recommended temp speed (AGTTM Table 5.5) based on worker/plant proximity, night works, weather, visibility
- Lane width clamped to min 2.5 m to prevent zero-length tapers

### Standards Corrections Applied (AS 1742.3:2019 audit)
- `signSpacing`: 45 m → 30 m for 56–65 km/h band (Table 2.2)
- `sightDistance`: breakpoints corrected to 50/60/70 km/h (Table 2.3)
- `minTempZoneLength`: 300 m for ≤80 km/h; 500 m for >80 km/h
- **W6-4** (LANE CLOSED AHEAD) — removed from alternating flow sign schedules; only applies to multilane lane reductions
- **W6-5** (ROAD CLOSED AHEAD) — used for full closures (was incorrectly W6-4)
- **`R4-1(xx)-AHEAD`** — replaced with **W5-1** (SPEED LIMIT AHEAD), the correct advance warning sign
- STLI section references: in-lane → Part 5 §3.x; outside-lane → Part 5 §4.x
- `stli_freq_outside` clearance: 1.0 m → 1.2 m
- VIC agency name: "VicRoads" → "Transport for Victoria / VicRoads"

### AGTTM Design Steps (`standards.ts`)
22 design steps covering the full AGTTM hierarchy:

**Static — Around the Worksite (Part 3, §3.2)**
- Around — Detour Route
- Around — Sidetrack
- Around — Contraflow

**Static — Through the Worksite (Part 3, §3.3)**
- Through — Alternating (STOP/SLOW)
- Through — Shuttle (Pilot Vehicle)
- Through — Pilot Vehicle Convoy

**Static — Past the Worksite (Part 3, §3.4)**
- Past — Lane Closure
- Past — Contraflow Past
- Past — Shoulder Works
- Past — Pavement Works
- Past — Bridge / Narrow Section

**Mobile Works (Part 4)**
- Mobile Class 1 (≤40 km/h)
- Mobile Class 2 (41–60 km/h)
- Mobile Class 3 (>60 km/h)

**STLI — Within Traffic Lane (Part 5, §3.x)**
- Specialist Works — In-Lane
- Works in Gaps (Short Duration)
- Short-Term In-Lane
- Frequent / Regular In-Lane
- Moving Works

**STLI — Outside Traffic Lane (Part 5, §4.x)**
- Shoulder / Footway (Foot Workers)
- Shoulder / Footway (Plant)
- Frequent Outside-Lane Works

Each step has:
- Auto-evaluated eligibility criteria (pass / fail / check badges)
- Mandatory requirements list
- Engine behaviour flags (`isAlternating`, `isFullClosure`, `isLaneClosure`, `isShoulderOnly`, `noSignSchedule`)

### Sign Schedule
Approach and departure sign schedules with codes, descriptions, distances, and notes:

| Code | Description |
|------|-------------|
| `W6-1` | WORKS AHEAD (NSW: ROADWORK AHEAD) |
| `W5-1` | SPEED LIMIT AHEAD (advance warning of speed change) |
| `R4-1(xx)` | Temporary speed limit sign |
| `TM1-18B` | PREPARE TO STOP |
| `TM1-18B-R` | PREPARE TO STOP (repeater, queue >240 m) |
| `W5-2` | TRAFFIC CONTROLLERS AHEAD (human controllers only — not PTL or boom gate) |
| `W6-4` | LANE CLOSED AHEAD (multilane reductions only) |
| `W6-5` | ROAD CLOSED AHEAD (full closures) |
| `TC` / `PTL` / `BG` / `PC` | PTCD position markers |
| `AB` | Arrow board |
| `RW6-2` | END ROADWORKS |

State sign name variants handled (e.g. NSW: W5-2 → TRAFFIC CONTROL AHEAD).

### PTCD Type Selection
Three PTCD types, each affecting sign schedule, equipment list, notes, and warnings:

| Type | Code | Signs Added | W5-2? |
|------|------|-------------|-------|
| Traffic Controller (STOP/SLOW bat) | `TC` | TM1-18B + W5-2 | ✅ |
| Portable Traffic Lights | `PTL` | TM1-18B only | ❌ |
| Boom Gate | `BG` | TM1-18B only; interlock note | ❌ |

Boom gate equipment includes: 2 units (approach + departure), interlocked, backup power, min 5.5 m clearance, attendant.

### State-Specific Compliance References

| State | Primary References |
|-------|--------------------|
| **WA** | Main Roads WA — Traffic Management for **Works** on Roads COP + Specification 601. Note: separate COP exists for **Events** on roads. |
| **QLD** | QGTTM — Queensland Guide to Traffic Management for Works on Roads (TMR) |
| **All others** | AGTTM (Austroads) + AS 1742.3:2019 |

A `docRef()` helper rewrites AGTTM/AS 1742.3 citations to WA COP or QGTTM equivalents in inline warnings and the Calculated Distances table.

State-specific QLD note: QGTTM mandatory 60 km/h when PTCD deployed on roads >60 km/h.
State-specific WA warnings: PTCD mandatory on MRWA roads (July 2022); shadow vehicle required ≥80 km/h.

### Location Geocoding & Map
- Nominatim (OpenStreetMap) geocoding — Australian results only, 700 ms debounce
- `AbortController` cleanup on re-type
- OSM iframe map preview (220 px) with pin at resolved location
- Coordinates displayed to 5 decimal places
- Lat/lng stored in `WizardInputs` and persisted in history
- Report header shows coordinates + "View on map ↗" link to OSM
- CSP updated to allow `connect-src nominatim.openstreetmap.org` and `frame-src openstreetmap.org`

### Calculation History
- Persisted to `localStorage` (`tm-calc-history`, capped at 50 entries)
- History panel (slide-out drawer) with focus trap, `role="dialog"`, Escape to close
- **Export JSON** — downloads history as `trafficman-history-YYYY-MM-DD.json`
- **Import JSON** — validates and merges entries from file (deduplicates by ID)
- History entries include all inputs, result, timestamp, project name

### Report Output (`ReportView.tsx`)
- Project header with state badge and standards subtitle
- Design step with eligibility criteria (pass/fail/check badges)
- Mandatory requirements section (blue callouts)
- Key metric cards (temp speed, merge taper, buffer zone, sight distance)
- Queue length estimate with repeater sign warning if >240 m
- TGS schematic (SVG, static)
- Speed reduction sequence table
- Calculated distances table with state-appropriate references
- Approach and departure sign schedules
- Equipment list
- Notes and warnings
- Standard references list (state-scoped)
- Print / Save PDF via browser print (Phase 1 will replace with proper PDF)
- "← Edit Inputs" and "+ New Calculation" buttons in action bar
- "Load previous" dropdown in action bar

### New Calculation Button
- **＋ New** in wizard header (steps 1–5)
- **+ New Calculation** in report action bar
- Prompts confirmation if project name, road, or location has been entered
- Resets to `defaultInputs` with today's date

### Performance & Security
- `React.lazy` + `Suspense` for `ReportView` code splitting
- `React.memo` + `useCallback` for step components (prevent cross-step re-renders)
- `useId()` + `FieldIdCtx` context for label–input association
- Vite `manualChunks` — vendor chunk split (main bundle: 232 kB → 90 kB)
- `sourcemap: false` in production builds
- Content-Security-Policy meta tag in `index.html`

### Accessibility
- ARIA combobox pattern (`role=combobox`, `listbox`, `option`), keyboard nav (↑↓ Enter Escape)
- All interactive elements have `aria-pressed` or `aria-label`
- History dialog: `role=dialog`, `aria-modal`, focus trap, Tab cycling, Escape to close
- Print SVG: `aria-hidden=true`
- History select: `aria-label="Load previous calculation"`
- Step breadcrumbs: `aria-current="step"`, clickable to jump to any visited step
- `aria-busy` on Calculate button during calculation
- `aria-live="polite"` on step counter

---

## Key Files

| File | Purpose |
|------|---------|
| `src/surfaces/Calculator/types.ts` | All TypeScript interfaces — `WizardInputs`, `CalculationResult`, `WorksType` (22 values), `ControlMethod` (6 values) |
| `src/surfaces/Calculator/standards.ts` | All formula functions, `DESIGN_STEPS` array (22 steps), `stateStandards()`, `docRef()`, `signName()`, `evaluateCriteria()` |
| `src/surfaces/Calculator/engine.ts` | `calculate()` — assembles full result from inputs; sign schedule, equipment, warnings, references |
| `src/surfaces/Calculator/CalculatorApp.tsx` | 5-step wizard UI, history panel, geocoding, `HistoryEntry` type, export/import |
| `src/surfaces/Calculator/ReportView.tsx` | Full report layout, `distRef()`, `stateStdSummary()`, print handler |
| `src/surfaces/Calculator/TGSSchematic.tsx` | SVG TGS diagram — taper geometry, sign markers, work zone |
| `vite.config.ts` | Vendor chunk split, sourcemap off |
| `index.html` | CSP meta tag, Vite entry |

---

## Running Locally (Windows PowerShell)

```powershell
# One-time setup
git clone https://github.com/madcrx/TrafficMan.git
cd TrafficMan
git checkout claude/traffic-management-app-PJ8UH
npm install

# Each session — pull latest then run
git pull origin claude/traffic-management-app-PJ8UH
npm run dev
# Open http://localhost:5173
```

Press `Ctrl+C` to stop the dev server.

---

## Ecosystem Research Findings

### Competitive Landscape

| Tool | Type | What it Does | Gap vs TrafficMan |
|------|------|--------------|-------------------|
| Road Manager | SaaS | Draw signs on Google Maps | No calculations at all |
| eBoard (Road Direct) | SaaS | Job booking, scheduling, invoicing | Operational only |
| HCM-CALC | Open source (C#) | US HCM queue/capacity calcs | US standards, no sign schedules |
| HCS (McTrans) | Commercial | Full HCM work zone analysis | US only, desktop, paid |
| Sitemate | SaaS | Digital form/checklist templates | No calculation engine |

**Finding:** No tool combines standards-native geometry, an Australian sign schedule generator, AGTTM eligibility checking, and PTCD-aware output in a single application.

### Useful APIs
- **Overpass API** — fetch road speed, lanes, classification from OSM at a geocoded point (no key, free) → auto-fill Step 2 inputs
- **TfNSW Open Data Hub** — real AADT counts for NSW roads
- **QLD Traffic GeoJSON** — live TMR QLD roadworks/hazards
- **Nominatim** — already integrated for geocoding

### Key Libraries for Future Phases
- `@react-pdf/renderer` — proper PDF from React state (Phase 1)
- `react-leaflet` + `leaflet` — interactive map, pin drag, road click (Phase 1)
- `react-konva` — interactive TGS canvas with zoom/export (Phase 2)
- `zod` — schema validation tied to AGTTM eligibility rules (Phase 2)
- `lz-string` — compressed shareable URL encoding (Phase 3)
- `UXsim` (Python) — kinematic wave queue modelling, needs backend (Phase 4)

### Available MCP Servers
- `mapbox/mcp-server` — geocoding, routing, isochrones (API key required)
- `jagan-shanmugam/open-streetmap-mcp` — Nominatim, free
- `OpenCageData/opencage-geocoding-mcp` — AU geocoding, free tier
- **No TMP or AGTTM MCP server exists** — this is a future opportunity

---

## Product Roadmap (PRD Summary)

### Phase 1 — Production-Ready Output *(Next)*
**Goal:** Output professional enough to hand to a client or auditor.

| Feature | Detail | Library |
|---------|--------|---------|
| Proper PDF export | Replace `window.print()` with React-rendered PDF | `@react-pdf/renderer` |
| Interactive map | Replace OSM iframe with Leaflet — drag pin, click road | `react-leaflet` |
| Road attribute auto-fill | Overpass API → auto-populate speed, lanes, classification | Overpass REST API |

**Success:** Planner completes calculation + downloads PDF in <5 minutes.

### Phase 2 — Smarter Diagram & Validation
| Feature | Detail | Library |
|---------|--------|---------|
| Interactive TGS schematic | Zoomable canvas, PNG/SVG export | `react-konva` |
| Input validation | Real-time field validation tied to AGTTM criteria | `zod` |
| Plan templates | Save/load common configurations | localStorage |
| Traffic volume suggestions | AADT from TfNSW / QLD open data | Open data APIs |

### Phase 3 — Multi-Zone Projects & Sharing
| Feature | Detail |
|---------|--------|
| Multiple work zones per project | Shared map, combined equipment list, corridor warnings |
| Shareable calculation URL | Compressed URL encoding of inputs (`lz-string`) |
| Cloud-synced history (optional) | Supabase anonymous sessions — cross-device sync |

### Phase 4 — Intelligence & Platform
| Feature | Detail |
|---------|--------|
| AI Design Assistant | Claude API — natural language → suggested design step |
| Advanced queue modelling | Kinematic wave model via Python backend (`UXsim`) |
| Mobile field view | Responsive "field card" layout, offline via service worker |
| AGTTM MCP Server | Expose calculation engine as MCP — first-to-market opportunity |

---

## White Space — What TrafficMan Is Uniquely Doing

1. **Standards-native geometry calculations** — No tool executes AS 1742.3:2019 or AGTTM formulas as code
2. **Australian sign schedule generation** — No open-source library models W6-1, TM1-18B, R4-1, W5-1 codes or produces a distanced, ordered schedule
3. **AGTTM 22-step eligibility compliance checker** — Entirely manual in current practice
4. **State-jurisdiction rules engine** — No tool differentiates WA COP, QGTTM, and AGTTM computationally
5. **PTCD-aware sign schedule** — The TC/PTL/boom gate interaction with sign schedule is not modelled anywhere
6. **Browser-based, zero-install TMP calculator** — All existing tools are desktop apps, operational SaaS, or drawing tools

---

*Generated from TrafficMan development session · Branch `claude/traffic-management-app-PJ8UH`*
