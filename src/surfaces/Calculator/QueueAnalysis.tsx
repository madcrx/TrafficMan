import { useState } from 'react';
import { C } from '../../components/tokens';
import type { CalculationResult } from './engine';
import type { WizardInputs } from './types';

interface QueueResult {
  forms_queue: boolean;
  approach_flow_dir: number;
  work_zone_capacity_vph: number;
  volume_capacity_ratio: number;
  max_queue_m: number;
  max_queue_veh: number;
  max_queue_time_min: number;
  dissipation_time_min: number;
  total_delay_veh_h: number;
  backward_wave_speed_kmh: number;
  time_series: { time_min: number[]; queue_m: number[]; queue_veh: number[] };
  warning?: string;
}

interface Props {
  result: CalculationResult;
  inputs: WizardInputs;
}

function SparkLine({ times, values, maxVal }: { times: number[]; values: number[]; maxVal: number }) {
  if (values.length < 2) return null;
  const W = 480; const H = 100; const PAD = 8;
  const maxT = times[times.length - 1] || 1;
  const x = (t: number) => PAD + (t / maxT) * (W - 2 * PAD);
  const y = (v: number) => H - PAD - (v / Math.max(maxVal, 1)) * (H - 2 * PAD);
  const pts = times.map((t, i) => `${x(t)},${y(values[i])}`).join(' ');
  const areaClose = `${x(times[times.length - 1])},${H - PAD} ${x(times[0])},${H - PAD}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 100, display: 'block' }} aria-hidden="true">
      <defs>
        <linearGradient id="qgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.hivis} stopOpacity="0.3" />
          <stop offset="100%" stopColor={C.hivis} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={`${pts} ${areaClose}`} fill="url(#qgrad)" />
      <polyline points={pts} fill="none" stroke={C.hivis} strokeWidth="2" strokeLinejoin="round" />
      {/* x-axis */}
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--border-default)" strokeWidth="1" />
      {/* Labels */}
      <text x={PAD} y={H} fontSize="9" fill="var(--fg-subtle)">0 min</text>
      <text x={W - PAD} y={H} fontSize="9" fill="var(--fg-subtle)" textAnchor="end">{Math.round(maxT)} min</text>
      <text x={PAD} y={PAD + 2} fontSize="9" fill="var(--fg-subtle)">{Math.round(maxVal)} m</text>
    </svg>
  );
}

export function QueueAnalysis({ result, inputs }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QueueResult | null>(null);
  const [error, setError] = useState('');

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      // Estimate works duration from maxStopTime or default 60 min
      const durationMin = inputs.maxStopTime > 0 ? inputs.maxStopTime : 60;
      const res = await fetch('/api/queue/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approach_flow_vph: inputs.peakHourVolume,
          directional_split: 0.55,
          posted_speed: inputs.postedSpeed,
          temp_speed: result.recommendedTempSpeed,
          lanes_total: inputs.lanesInDirection * 2,
          lanes_blocked: 1,
          lane_width: inputs.laneWidth,
          heavy_veh_pct: inputs.heavyVehiclePercent,
          control_method: inputs.controlMethod,
          duration_min: durationMin,
        }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? 'Analysis failed');
      }
      setData(await res.json() as QueueResult);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const maxQueueM = data?.time_series.queue_m ? Math.max(...data.time_series.queue_m) : 0;

  return (
    <div style={{
      marginBottom: 32, borderRadius: 10,
      border: `1.5px solid ${open ? C.hivis : 'var(--border-default)'}`,
      overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); if (!open && !data) runAnalysis(); }}
        style={{
          width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
          background: open ? '#FFF3E9' : 'var(--bg-surface)', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 16 }}>🐍</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: open ? C.hivis : 'var(--fg-default)' }}>
            Advanced Queue Analysis
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>
            Kinematic wave model — capacity, v/c ratio, time-series queue profile
          </div>
        </div>
        {data && !loading && (
          <span style={{ fontSize: 12, fontWeight: 700, color: data.forms_queue ? C.stop : C.go, flexShrink: 0 }}>
            {data.forms_queue ? `⚠ ${data.max_queue_m} m max queue` : '✓ No queue forms'}
          </span>
        )}
        <span style={{ fontSize: 12, color: 'var(--fg-subtle)', flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', background: 'var(--bg-surface)' }}>
          {loading && (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--fg-subtle)', fontSize: 14 }}>
              Running kinematic wave model…
            </div>
          )}

          {error && (
            <div style={{ padding: '12px 14px', borderRadius: 8, background: '#F8D7DA', color: '#721C24', fontSize: 13, marginTop: 8 }}>
              {error === 'Queue engine unavailable' ? 'Queue engine offline — start the Python service.' : error}
              <button onClick={runAnalysis} style={{ marginLeft: 12, fontSize: 12, fontWeight: 700, background: 'none', border: 'none', color: '#721C24', cursor: 'pointer', textDecoration: 'underline' }}>Retry</button>
            </div>
          )}

          {data && !loading && (
            <div style={{ marginTop: 8 }}>
              {data.warning && (
                <div style={{ padding: '10px 14px', borderRadius: 8, background: '#FFF7D6', borderLeft: `3px solid #D9A600`, marginBottom: 12, fontSize: 13, color: 'var(--fg-default)' }}>
                  ⚠ {data.warning}
                </div>
              )}

              {/* Key metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Work zone capacity', value: `${data.work_zone_capacity_vph} vph`, color: C.info },
                  { label: 'Vol / Capacity ratio', value: data.volume_capacity_ratio.toFixed(2), color: data.volume_capacity_ratio > 1 ? C.stop : C.go },
                  { label: 'Max queue', value: `${data.max_queue_m} m`, color: data.max_queue_m > 240 ? C.stop : C.go },
                  { label: 'Queue peak at', value: `${data.max_queue_time_min} min`, color: 'var(--fg-default)' },
                  { label: 'Dissipation after works', value: `${data.dissipation_time_min} min`, color: 'var(--fg-default)' },
                  { label: 'Total delay', value: `${data.total_delay_veh_h} veh·h`, color: 'var(--fg-default)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'var(--paper-50)', borderRadius: 8, padding: '10px 14px', borderTop: `3px solid ${color}` }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-default)' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Backward wave speed */}
              <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginBottom: 12 }}>
                Queue tail propagation: <strong>{data.backward_wave_speed_kmh} km/h</strong> upstream &nbsp;·&nbsp;
                Directional flow: <strong>{data.approach_flow_dir} vph</strong>
              </div>

              {/* Time-series chart */}
              {data.time_series.queue_m.length > 1 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                    Queue length over time
                  </div>
                  <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, padding: '8px', background: 'var(--paper-50)' }}>
                    <SparkLine
                      times={data.time_series.time_min}
                      values={data.time_series.queue_m}
                      maxVal={maxQueueM}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 6 }}>
                    Chart shows queue length (m) vs time (min). Dashed region is post-works dissipation.
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={runAnalysis}
                style={{ marginTop: 12, padding: '7px 16px', borderRadius: 8, border: '1.5px solid var(--border-default)', background: 'var(--bg-surface)', color: 'var(--fg-default)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}
              >Re-run analysis</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
