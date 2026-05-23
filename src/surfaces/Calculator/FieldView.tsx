import { useEffect } from 'react';
import { C } from '../../components/tokens';
import type { CalculationResult } from './engine';
import type { WizardInputs } from './types';

interface Props {
  result: CalculationResult;
  inputs: WizardInputs;
  zoneName?: string;
  onClose: () => void;
}

export function FieldView({ result: r, inputs: inp, zoneName, onClose }: Props) {
  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const distances = [
    ['Merge taper',   `${r.mergeTaperLength} m`],
    ['Buffer zone',   `${r.bufferZoneLength} m`],
    ['Sight dist.',   `${r.sightDistanceM} m`],
    ['Sign spacing',  `${r.approachSignSpacing} m`],
    ['Cone spacing',  `${r.coneSpacingM} m`],
    ['Zone length',   `≥ ${r.minTempZoneLength} m`],
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Field view"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 480,
        background: '#1A1A1A', borderRadius: '20px 20px 0 0',
        maxHeight: '95dvh', overflowY: 'auto',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Header */}
        <div style={{ padding: '8px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.hivis, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
              {zoneName ?? 'Zone'} · Field View
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
              {inp.projectName || 'Unnamed Project'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>
              {inp.location || inp.roadName || inp.date}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close field view"
            style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, cursor: 'pointer' }}
          >✕</button>
        </div>

        {/* Temp speed — dominant hero element */}
        <div style={{
          margin: '0 16px 16px',
          background: C.hivis, borderRadius: 16,
          padding: '24px 0', textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Temp Speed Zone
          </div>
          <div style={{ fontSize: 80, fontWeight: 900, color: '#000', lineHeight: 1, margin: '4px 0' }}>
            {r.recommendedTempSpeed}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'rgba(0,0,0,0.6)' }}>km/h</div>
        </div>

        {/* Warnings — shown prominently if any */}
        {r.warnings.length > 0 && (
          <div style={{ margin: '0 16px 16px' }}>
            {r.warnings.map((w, i) => (
              <div key={i} style={{
                padding: '10px 14px', borderRadius: 10, marginBottom: 8,
                background: '#3D2400', borderLeft: `3px solid ${C.caution}`,
                fontSize: 13, color: '#FFD580', lineHeight: 1.5,
              }}>⚠ {w}</div>
            ))}
          </div>
        )}

        {/* Key distances grid */}
        <div style={{ margin: '0 16px 16px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Key Distances
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {distances.map(([label, value]) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px',
              }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Design step */}
        <div style={{ margin: '0 16px 16px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 14px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Design Step
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.hivis }}>{r.designStepName}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{r.designStepRef}</div>
        </div>

        {/* Equipment summary */}
        {r.equipment.length > 0 && (
          <div style={{ margin: '0 16px 24px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Equipment
            </div>
            {r.equipment.slice(0, 6).map((eq, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13 }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{eq.item}</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>{eq.quantity}</span>
              </div>
            ))}
            {r.equipment.length > 6 && (
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
                +{r.equipment.length - 6} more items — see full report
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
