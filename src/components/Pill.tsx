import { C, StatusKind } from './tokens';

interface PillProps {
  kind: StatusKind;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const pillPalette: Record<StatusKind, { bg: string; fg: string }> = {
  active:  { bg: C.hivis,    fg: C.ink900 },
  go:      { bg: C.go,       fg: '#fff' },
  stop:    { bg: C.stop,     fg: '#fff' },
  caution: { bg: C.caution,  fg: C.ink900 },
  info:    { bg: C.info,     fg: '#fff' },
  neutral: { bg: C.paper100, fg: C.ink700 },
  pending: { bg: C.paper100, fg: C.ink700 },
};

export function Pill({ kind, children, style }: PillProps) {
  const p = pillPalette[kind] ?? pillPalette.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '4px 10px', borderRadius: 999,
      background: p.bg, color: p.fg,
      fontSize: 11, fontWeight: 700, lineHeight: 1,
      letterSpacing: '0.06em', textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
}
