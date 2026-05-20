import React from 'react';
import { C, StatusKind } from './tokens';

interface CardProps {
  status?: Exclude<StatusKind, 'neutral' | 'pending'>;
  title?: string;
  children: React.ReactNode;
  padding?: number | string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const barColors: Record<string, string> = {
  active: C.hivis, go: C.go, stop: C.stop, caution: C.caution, info: C.info,
};

export function Card({ status, title, children, padding = 16, style, onClick }: CardProps) {
  const barColor = status ? barColors[status] : undefined;
  return (
    <div onClick={onClick} style={{
      background: C.paper0,
      border: `1.5px solid ${C.steel200}`,
      borderRadius: 8,
      boxShadow: '0 1px 2px rgba(11,18,32,0.08)',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>
      {barColor && <div style={{ height: 4, background: barColor }}/>}
      {title && (
        <div style={{
          padding: '12px 16px', borderBottom: `1px solid ${C.paper100}`,
          fontSize: 11, fontWeight: 700, color: C.ink500,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>{title}</div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}
