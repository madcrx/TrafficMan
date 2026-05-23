# TrafficMan — Phase 1 & 2 Development Session Notes

**Branch:** `claude/trafficman-phase-1-2-P5XFf`
**Repository:** `madcrx/TrafficMan`
**Stack:** React 18 · TypeScript · Vite 6 · No backend
**Commit:** `f80cf3a`

---

## Session Context

Continuing from the Phase 0 build (branch `claude/traffic-management-app-PJ8UH`), which established the full calculation engine, 5-step wizard, AGTTM design steps, sign schedules, PTCD types, geocoding, history export/import, and state-specific compliance references.

This session implemented all of **Phase 1 (Production-Ready Output)** and **Phase 2 (Smarter Diagram & Validation)** from the product roadmap.

---

## New Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react-leaflet` | `4.2.1` | Interactive map (React 18 compatible — v5 requires React 19) |
| `leaflet` | `1.9.4` | Leaflet core |
| `@types/leaflet` | `1.9.14` | TypeScript types |
| `@react-pdf/renderer` | `4.5.1` | PDF generation in browser |
| `zod` | `4.4.3` | Schema validation |

> **Note:** react-leaflet v5 was installed initially but requires React 19. Pinned to v4 for React 18 compatibility.

---

## New Files

### `src/surfaces/Calculator/LocationMap.tsx`
Leaflet interactive map component replacing the static OSM iframe.

**Key design decisions:**
- Uses a custom SVG `L.divIcon` for the marker to avoid the Leaflet default PNG icon resolution issue in bundled Vite apps
- Inner `MapUpdater` component handles prop-driven position updates (MapContainer `center` is init-only in react-leaflet)
- `onDragEnd` prop enables the draggable marker — updates `lat`/`lng` in WizardInputs when the user repositions the pin
- Overflow hidden with border-radius for clean embedding in the wizard

```tsx
// Usage in Step1
<LocationMap lat={inp.lat} lng={inp.lng} onDragEnd={handleMarkerDrag} />
```

---

### `src/surfaces/Calculator/validation.ts`
Zod-powered per-step validation for the wizard.

**Validates:**
| Step | Fields |
|------|--------|
| 2 — Road | `laneWidth` (2.5–6.0 m), `postedSpeed` (10–130 km/h), `curveRadius` (> 0 if curve geometry) |
| 3 — Works | `worksLength` (≥ 1 m), `workerProximity` (≥ 0), `plantProximity` (≥ 0), `excavationDepth` (> 0 if excavations) |
| 4 — Traffic | `peakHourVolume` (0–10,000 vph), `heavyVehiclePercent` (0–100%) |
| 5 — Control | `numberOfControllers` (≥ 1 for TC/police), `manualTempSpeed` (10–110 km/h if override) |

**Integration:** `validateStep(step, inp)` returns a `ValidationErrors` record. Called in `goNext()` — blocks progression and shows an error list above the footer if non-empty.

---

### `src/surfaces/Calculator/TMPDocument.tsx`
Two-page professional PDF document using `@react-pdf/renderer`.

**Page 1:**
- Header: TrafficMan branding, project title, reference, date, coordinates, state badge, applicable standard
- Meta row: prepared by, road, posted speed, traffic control method
- Warnings (if any)
- Design step card: name, AGTTM reference, pass/check/fail summary badges
- Eligibility criteria rows with colour-coded left borders
- Mandatory requirements (blue callouts)
- Key metrics: Temp Speed, Merge Taper, Buffer Zone, Sight Distance, Queue Length
- Queue repeater warning if > 240 m
- Speed reduction sequence table
- Temp speed justification text

**Page 2:**
- Calculated distances & spacings table
- Approach sign schedule table
- Departure sign schedule table
- Equipment list table
- Notes
- Standard references list
- Disclaimer box

**State-specific references:** `distRef()` maps AGTTM/AS 1742.3 citations to WA COP or QGTTM equivalents in the distances table — consistent with the screen report.

**Fonts:** Helvetica (built-in to react-pdf — no custom font loading required).

**Loading strategy:** Lazy-loaded via dynamic `import()` on "Download PDF" click — keeps the main bundle from growing. The `pdf` chunk is ~492 KB gzipped and only downloaded when needed.

---

## Modified Files

### `src/surfaces/Calculator/CalculatorApp.tsx`

#### Imports added
```tsx
import { LocationMap } from './LocationMap';
import { validateStep } from './validation';
import type { ValidationErrors } from './validation';
```

#### Template system
Three built-in templates hard-coded in `BUILT_IN_TEMPLATES`:
- **2-Lane Road Lane Closure** — 60 km/h arterial, STOP/SLOW bat, arrow board
- **Shoulder / Footway Works** — 80 km/h highway, signs only, workers on foot
- **Mobile Works — Class 1** — 60 km/h collector, mobile_class1, no PTCD

User-saved templates stored in `localStorage` under key `tm-templates`. `TemplatesPanel` component mirrors the existing `HistoryPanel` UX — slide-out drawer, focus trap, Escape to close.

"Save Current Inputs as Template" inline form within the panel (name + optional description).

#### Overpass road auto-fill
Triggered automatically when lat/lng resolve from Nominatim. Queries `overpass-api.de/api/interpreter` (POST) for the highest-priority named road within 120 m. Results sorted by OSM highway class priority (`motorway` → `trunk` → `primary` → ... → `residential`).

Mapping:
```ts
// highway → RoadClassification
motorway/motorway_link → 'freeway'
trunk/primary          → 'highway'
secondary              → 'arterial'
tertiary               → 'collector'
*                      → 'local'

// maxspeed → number
"60"         → 60
"AU:urban"   → 50
"AU:rural"   → 100

// lanes → lanesInDirection
Uses lanes:forward if present, else lanes tag
```

Shows a blue card in Step 1: "Road data found from OpenStreetMap — Apply to Road Details →". Clicking updates `roadName`, `classification`, `postedSpeed`, `lanesInDirection`.

#### Validation integration
```tsx
const goNext = () => {
  const errors = validateStep(step, inp);
  setValidationErrors(errors);
  if (Object.keys(errors).length > 0) return;  // block
  // ... proceed
};
```
Errors cleared on Back, jump-to-step, and New Calculation. Red error box shown above the navigation footer when errors are present.

#### Header buttons
Three buttons in wizard header: **＋ New**, **📐 Templates**, **📋 History**

---

### `src/surfaces/Calculator/ReportView.tsx`

**PDF download handler** (lazy dynamic import):
```tsx
const handleDownloadPDF = async () => {
  const [{ pdf }, { TMPDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./TMPDocument'),
  ]);
  const element = TMPDocument({ result: r, inputs: inp });
  const blob = await pdf(element as Parameters<typeof pdf>[0]).toBlob();
  // ... trigger download
};
```

**Action bar changes:**
- Primary: **"Download PDF"** button (orange, with download icon, `pdfGenerating` loading state)
- Secondary: **"Print"** button (outline, preserves browser print as fallback)

---

### `src/surfaces/Calculator/TGSSchematic.tsx`

**Added imports:** `useState`, `useRef`, `useCallback` from React.

**PNG export function** (`exportSvgAsPng`):
- `XMLSerializer` converts the live SVG DOM to a string
- Renders to an offscreen `<canvas>` at 2× resolution (1920×680 px)
- White background fill before drawing
- `canvas.toBlob()` → `URL.createObjectURL` → anchor click → download

**Interactive controls:**
| Control | Behaviour |
|---------|-----------|
| Scroll wheel | Zoom in/out (0.5× – 3×, 0.001 per delta unit) |
| Click + drag | Pan the diagram |
| ＋ Zoom In button | +20% |
| － Zoom Out button | −20% |
| ↺ Reset button | Zoom 1×, pan 0,0 |
| Export PNG button | Downloads `TGS-{projectName}-{date}.png` |

Zoom/pan implemented via CSS `transform: translate() scale()` on a wrapper `<div>` — no canvas rendering, no extra libraries. The SVG remains as the source of truth.

Control bar has `className="no-print"` — excluded from browser print.

---

### `index.html` — CSP update

```
connect-src: added https://overpass-api.de
script-src:  added blob:
worker-src:  added blob:
img-src:     added blob:
```

The `blob:` entries are required by `@react-pdf/renderer` which spawns a web worker for PDF rendering.

---

### `vite.config.ts` — Chunk splitting

Changed from static `manualChunks` object to function form for fine-grained control:

```ts
manualChunks(id) {
  if (id.includes('@react-pdf')) return 'pdf';
  if (id.includes('leaflet') || id.includes('react-leaflet')) return 'leaflet';
  if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor';
}
```

**Build output:**

| Chunk | Size (gzip) | Load |
|-------|-------------|------|
| `vendor` (react, react-dom) | 45.98 kB | Always |
| `leaflet` | 44.80 kB | Always (map shown after geocode) |
| `index` (app) | 44.63 kB | Always |
| `ReportView` | 10.84 kB | Lazy (report step) |
| `TMPDocument` | 4.28 kB | Lazy (PDF click) |
| `pdf` (@react-pdf) | 492.71 kB | Lazy (PDF click) |
| Leaflet CSS | 6.46 kB | Always |

---

## Architecture Notes

### Why direct component call for PDF
`TMPDocument({ result, inputs })` is called as a plain function rather than `<TMPDocument ... />` JSX. This returns the `<Document>` React element tree directly, which is what `pdf()` from react-pdf needs. Calling via JSX would create a React element of type `TMPDocument` (a wrapper), whereas calling directly produces the `Document` element — the root react-pdf component.

### Why no react-konva
The interactive TGS was implemented with CSS transforms + canvas PNG export instead of `react-konva`. This delivers:
- Zoom/pan ✅
- PNG export ✅
- Remains SVG (print-friendly, accessible, no extra 200 KB dependency) ✅

The SVG TGS geometry is already well-established at 500 lines — porting it to Konva shapes would have been a large rewrite with no user-visible improvement over the CSS transform approach.

### react-leaflet version pinning
react-leaflet v5 was released requiring React 19. We have React 18. Pinned to v4.2.1 which declares `react ^18.0.0` as a peer dependency. This was discovered via the peer dep check after the initial `npm install --legacy-peer-deps`.

---

## Running Locally

```powershell
git checkout claude/trafficman-phase-1-2-P5XFf
git pull origin claude/trafficman-phase-1-2-P5XFf
npm install
npm run dev
# Open http://localhost:5173
```

---

## What Was Not Built (Phase 2 Item)

**Traffic volume suggestions (AADT)** — deferred. TfNSW Open Data Hub requires API keys; QLD TMR GeoJSON data for AADT has CORS constraints. Risk of broken integration outweighs the value for a no-backend app. Can be added when a backend proxy is introduced in Phase 3/4.

---

## Remaining Roadmap

### Phase 3 — Multi-Zone Projects & Sharing
- Multiple work zones per project (shared map, combined equipment list)
- Shareable URL via `lz-string` compressed encoding
- Cloud-synced history via Supabase anonymous sessions

### Phase 4 — Intelligence & Platform
- AI Design Assistant (Claude API → suggested design step)
- Advanced queue modelling (`UXsim` kinematic wave, needs Python backend)
- Mobile field view (responsive "field card", offline via service worker)
- AGTTM MCP Server (expose calculation engine as MCP)

---

*Generated from TrafficMan Phase 1 & 2 development session · Branch `claude/trafficman-phase-1-2-P5XFf` · Commit `f80cf3a`*
