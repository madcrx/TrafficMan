"""
TrafficMan Queue Engine — kinematic wave queue model
Based on AGTTM methodology, LWR triangular fundamental diagram, D/D/1 deterministic extension.
"""

from __future__ import annotations
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI(title="TrafficMan Queue Engine", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── Constants ─────────────────────────────────────────────────────────

JAM_DENSITY_VEH_KM = 130.0   # veh/km (~7.7 m avg spacing in queue)
PCE_HEAVY = 2.0               # passenger car equivalents for HVs in work zones
DT_MIN = 1                    # simulation time step (minutes)

CONTROL_CAPACITY_FACTORS: dict[str, float] = {
    "stop_slow_bats":   0.75,
    "portable_signals": 0.72,
    "pilot_vehicle":    0.65,
    "boom_gate":        0.72,
    "police":           0.80,
    "none":             0.92,
}


def _lane_width_factor(width_m: float) -> float:
    if width_m >= 3.6: return 1.00
    if width_m >= 3.3: return 0.95
    if width_m >= 3.0: return 0.88
    return 0.77


def work_zone_capacity(
    posted_speed: float,
    temp_speed: float,
    lanes_blocked: int,
    lanes_total: int,
    lane_width: float,
    heavy_veh_pct: float,
    control_method: str,
) -> float:
    """Returns work zone capacity in veh/h for the constrained direction."""
    lanes_remaining = max(1, lanes_total - lanes_blocked)
    base = 1750.0 * lanes_remaining
    base *= _lane_width_factor(lane_width)
    # Speed reduction — capacity scales with temp/posted speed ratio
    speed_factor = 0.85 + 0.15 * (temp_speed / max(posted_speed, 1))
    base *= speed_factor
    base *= CONTROL_CAPACITY_FACTORS.get(control_method, 0.85)
    # Heavy vehicle PCE adjustment
    fhv = 1.0 / (1.0 + (heavy_veh_pct / 100.0) * (PCE_HEAVY - 1.0))
    base *= fhv
    return max(base, 100.0)


# ── Models ────────────────────────────────────────────────────────────

class QueueRequest(BaseModel):
    approach_flow_vph: float     = Field(..., description="Two-way peak hour volume (vph)")
    directional_split: float     = Field(0.55, ge=0.5, le=0.7, description="Heavy-direction fraction")
    posted_speed:      float     = Field(..., description="Posted speed (km/h)")
    temp_speed:        float     = Field(..., description="Work zone temp speed (km/h)")
    lanes_total:       int       = Field(2, ge=1, description="Total lanes in carriageway")
    lanes_blocked:     int       = Field(1, ge=0, description="Lanes blocked")
    lane_width:        float     = Field(3.5, description="Lane width (m)")
    heavy_veh_pct:     float     = Field(10.0, ge=0, le=100, description="Heavy vehicle %")
    control_method:    str       = Field("stop_slow_bats", description="Traffic control method")
    duration_min:      float     = Field(60.0, gt=0, description="Works duration (minutes)")
    override_capacity: Optional[float] = Field(None, description="Override capacity (veh/h)")


class TimeSeries(BaseModel):
    time_min:  list[float]
    queue_m:   list[float]
    queue_veh: list[float]


class QueueResponse(BaseModel):
    forms_queue:             bool
    approach_flow_dir:       float
    work_zone_capacity_vph:  float
    volume_capacity_ratio:   float
    max_queue_m:             float
    max_queue_veh:           float
    max_queue_time_min:      float
    dissipation_time_min:    float
    total_delay_veh_h:       float
    backward_wave_speed_kmh: float
    time_series:             TimeSeries
    warning:                 Optional[str] = None


# ── Routes ────────────────────────────────────────────────────────────

@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/analyse", response_model=QueueResponse)
def analyse_queue(req: QueueRequest) -> QueueResponse:
    q_in = req.approach_flow_vph * req.directional_split

    q_cap = (
        req.override_capacity
        if req.override_capacity is not None
        else work_zone_capacity(
            req.posted_speed, req.temp_speed,
            req.lanes_blocked, req.lanes_total,
            req.lane_width, req.heavy_veh_pct, req.control_method,
        )
    )

    v_c = q_in / q_cap

    # Kinematic wave parameters — triangular fundamental diagram
    k_j = JAM_DENSITY_VEH_KM
    k_c = q_cap / req.posted_speed          # critical density (veh/km)
    w_kmh = -q_cap / max(k_j - k_c, 1)     # backward wave speed (negative = upstream)

    dt_h = DT_MIN / 60.0
    queue_veh = 0.0
    max_q_veh = 0.0
    max_q_time_min = 0.0
    total_delay = 0.0
    time_pts: list[float] = []
    q_m_pts:  list[float] = []
    q_v_pts:  list[float] = []

    # Phase 1: works active
    for i in range(int(req.duration_min / DT_MIN) + 1):
        t = float(i * DT_MIN)
        queue_veh = max(0.0, queue_veh + (q_in - q_cap) * dt_h)
        q_m = queue_veh / k_j * 1000.0
        if queue_veh > max_q_veh:
            max_q_veh = queue_veh
            max_q_time_min = t
        total_delay += queue_veh * dt_h
        time_pts.append(t)
        q_m_pts.append(round(q_m, 1))
        q_v_pts.append(round(queue_veh, 1))

    # Phase 2: works end — capacity partially restores, queue drains
    q_cap_post = q_cap / CONTROL_CAPACITY_FACTORS.get(req.control_method, 0.85)
    drain_rate = max(q_cap_post - q_in, 50.0)   # minimum drain of 50 veh/h
    diss_steps = 0
    while queue_veh > 1.0 and diss_steps < int(120 / DT_MIN):
        queue_veh = max(0.0, queue_veh - drain_rate * dt_h)
        q_m = queue_veh / k_j * 1000.0
        total_delay += queue_veh * dt_h
        t = req.duration_min + diss_steps * DT_MIN
        time_pts.append(float(t))
        q_m_pts.append(round(q_m, 1))
        q_v_pts.append(round(queue_veh, 1))
        diss_steps += 1

    max_q_m = max_q_veh / k_j * 1000.0
    step = max(1, 5 // DT_MIN)

    warning: Optional[str] = None
    if max_q_m > 500:
        warning = "Queue exceeds 500 m — consider adjusting works schedule or implementing additional control."
    elif max_q_m > 240:
        warning = "Queue exceeds 240 m — PREPARE TO STOP repeater required (AGTTM Table 4.4a)."

    return QueueResponse(
        forms_queue=q_in > q_cap,
        approach_flow_dir=round(q_in),
        work_zone_capacity_vph=round(q_cap),
        volume_capacity_ratio=round(v_c, 2),
        max_queue_m=round(max_q_m, 1),
        max_queue_veh=round(max_q_veh, 1),
        max_queue_time_min=max_q_time_min,
        dissipation_time_min=float(diss_steps * DT_MIN),
        total_delay_veh_h=round(total_delay, 2),
        backward_wave_speed_kmh=round(abs(w_kmh), 1),
        time_series=TimeSeries(
            time_min=time_pts[::step],
            queue_m=q_m_pts[::step],
            queue_veh=q_v_pts[::step],
        ),
        warning=warning,
    )
