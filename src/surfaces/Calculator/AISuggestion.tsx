import { useState } from 'react';
import { C } from '../../components/tokens';
import type { WizardInputs, WorksType, WorksCategory } from './types';

interface Suggestion {
  worksType: WorksType;
  worksCategory: WorksCategory;
  designStepName: string;
  agttmRef: string;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  eligibilityConcerns: string[];
  mandatoryActions: string[];
  alternativeWorksType: WorksType | null;
}

interface Props {
  inputs: WizardInputs;
  onApply: (worksType: WorksType, worksCategory: WorksCategory) => void;
}

const CONFIDENCE_STYLES = {
  high:   { bg: '#D4EDDA', color: '#155724', label: 'High confidence' },
  medium: { bg: '#FFF3CD', color: '#856404', label: 'Medium confidence' },
  low:    { bg: '#F8D7DA', color: '#721C24', label: 'Low confidence' },
};

export function AISuggestion({ inputs, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [error, setError] = useState('');

  const getSuggestion = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? 'Request failed');
      }
      setSuggestion(await res.json() as Suggestion);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      marginBottom: 24, borderRadius: 10,
      border: `1.5px solid ${open ? C.hivis : 'var(--border-default)'}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); if (!open && !suggestion) getSuggestion(); }}
        style={{
          width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10,
          background: open ? '#FFF3E9' : 'var(--bg-surface)', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 18 }}>✦</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: open ? C.hivis : 'var(--fg-default)' }}>
            AI Design Step Suggestion
          </div>
          <div style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>
            Claude analyses your inputs and recommends the most applicable AGTTM design step
          </div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--fg-subtle)', flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', background: 'var(--bg-surface)' }}>
          {loading && (
            <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--fg-subtle)', fontSize: 14 }}>
              Analysing worksite conditions…
            </div>
          )}

          {error && (
            <div style={{ padding: '12px 14px', borderRadius: 8, background: '#F8D7DA', color: '#721C24', fontSize: 13, marginTop: 8 }}>
              {error}
              <button onClick={getSuggestion} style={{ marginLeft: 12, fontSize: 12, fontWeight: 700, background: 'none', border: 'none', color: '#721C24', cursor: 'pointer', textDecoration: 'underline' }}>
                Retry
              </button>
            </div>
          )}

          {suggestion && !loading && (
            <div style={{ marginTop: 8 }}>
              {/* Suggestion card */}
              <div style={{
                borderRadius: 8, border: `1.5px solid ${C.hivis}`,
                background: '#FFF3E9', padding: '14px 16px', marginBottom: 12,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.hivis }}>{suggestion.designStepName}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 2 }}>{suggestion.agttmRef}</div>
                  </div>
                  <span style={{
                    flexShrink: 0, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: CONFIDENCE_STYLES[suggestion.confidence].bg,
                    color: CONFIDENCE_STYLES[suggestion.confidence].color,
                  }}>{CONFIDENCE_STYLES[suggestion.confidence].label}</span>
                </div>

                <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--fg-default)', lineHeight: 1.6 }}>
                  {suggestion.reasoning}
                </p>
              </div>

              {suggestion.eligibilityConcerns.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  {suggestion.eligibilityConcerns.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '7px 12px', background: '#FFF7D6', borderLeft: `3px solid #D9A600`, borderRadius: '0 6px 6px 0', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: '#856404', flexShrink: 0 }}>⚠</span> {c}
                    </div>
                  ))}
                </div>
              )}

              {suggestion.mandatoryActions.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  {suggestion.mandatoryActions.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '7px 12px', background: '#E5F1FF', borderLeft: `3px solid #0A84FF`, borderRadius: '0 6px 6px 0', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: '#0A84FF', flexShrink: 0 }}>▸</span> {a}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => onApply(suggestion.worksType, suggestion.worksCategory)}
                  style={{
                    padding: '9px 20px', borderRadius: 8, border: 'none',
                    background: C.hivis, color: C.ink900,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >Apply this design step</button>

                {suggestion.alternativeWorksType && (
                  <div style={{ fontSize: 12, color: 'var(--fg-subtle)', display: 'flex', alignItems: 'center' }}>
                    Alternative: <strong style={{ marginLeft: 4 }}>{suggestion.alternativeWorksType}</strong>
                  </div>
                )}

                <button
                  type="button"
                  onClick={getSuggestion}
                  style={{
                    padding: '9px 16px', borderRadius: 8,
                    border: '1.5px solid var(--border-default)',
                    background: 'var(--bg-surface)', color: 'var(--fg-default)',
                    fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >Re-analyse</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
