import React from 'react';

interface IconProps {
  size?: number;
  sw?: number;
  style?: React.CSSProperties;
  color?: string;
}

const Ico = ({ d, size = 18, sw = 1.75, style }: IconProps & { d: React.ReactNode }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round"
    style={style}
  >{d}</svg>
);

export const IcInbox    = (p: IconProps) => <Ico {...p} d={<><path d="M3 14 L8 14 L9 17 L15 17 L16 14 L21 14"/><path d="M5 14 L7 5 L17 5 L19 14 V19 H5 Z"/></>}/>;
export const IcDoc      = (p: IconProps) => <Ico {...p} d={<><path d="M5 3 L15 3 L19 7 L19 21 L5 21 Z"/><path d="M14 3 L14 8 L19 8"/></>}/>;
export const IcMap      = (p: IconProps) => <Ico {...p} d={<><path d="M3 6 L9 4 L15 6 L21 4 V18 L15 20 L9 18 L3 20 Z"/><path d="M9 4 L9 18"/><path d="M15 6 L15 20"/></>}/>;
export const IcBox      = (p: IconProps) => <Ico {...p} d={<><path d="M3 7 L12 3 L21 7 L21 17 L12 21 L3 17 Z"/><path d="M3 7 L12 11 L21 7"/><path d="M12 11 V21"/></>}/>;
export const IcCheck    = (p: IconProps) => <Ico {...p} d={<path d="M5 12 L10 17 L19 7"/>}/>;
export const IcShield   = (p: IconProps) => <Ico {...p} d={<><path d="M12 3 L20 6 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V6 Z"/><path d="M9 12 L11 14 L15 10"/></>}/>;
export const IcChevR    = (p: IconProps) => <Ico {...p} d={<path d="M9 5 L16 12 L9 19"/>}/>;
export const IcChevL    = (p: IconProps) => <Ico {...p} d={<path d="M15 5 L8 12 L15 19"/>}/>;
export const IcChevD    = (p: IconProps) => <Ico {...p} d={<path d="M5 9 L12 16 L19 9"/>}/>;
export const IcSettings = (p: IconProps) => <Ico {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19 12 L21 12 M3 12 L5 12 M12 3 L12 5 M12 19 L12 21 M16.5 7.5 L18 6 M6 18 L7.5 16.5 M16.5 16.5 L18 18 M6 6 L7.5 7.5"/></>}/>;
export const IcFilter   = (p: IconProps) => <Ico {...p} d={<path d="M4 5 H20 L14 12 V19 L10 21 V12 Z"/>}/>;
export const IcSearch   = (p: IconProps) => <Ico {...p} d={<><circle cx="11" cy="11" r="6"/><path d="M16 16 L21 21"/></>}/>;
export const IcDownload = (p: IconProps) => <Ico {...p} d={<><path d="M12 3 V15"/><path d="M7 11 L12 16 L17 11"/><path d="M5 21 H19"/></>}/>;
export const IcX        = (p: IconProps) => <Ico {...p} d={<><path d="M6 6 L18 18"/><path d="M18 6 L6 18"/></>}/>;
export const IcPlus     = (p: IconProps) => <Ico {...p} d={<><path d="M12 5 V19"/><path d="M5 12 H19"/></>}/>;
export const IcMinus    = (p: IconProps) => <Ico {...p} d={<path d="M5 12 H19"/>}/>;
export const IcCamera   = (p: IconProps) => <Ico {...p} d={<><path d="M4 8 H7 L9 6 H15 L17 8 H20 V18 H4 Z"/><circle cx="12" cy="13" r="3.2"/></>}/>;
export const IcCloud    = (p: IconProps) => <Ico {...p} d={<path d="M7 18 A4 4 0 0 1 7 10 A5 5 0 0 1 16.5 9.5 A3.5 3.5 0 0 1 17 18 Z"/>}/>;
export const IcCone     = (p: IconProps) => <Ico {...p} d={<><path d="M12 3 L17 19 L7 19 Z"/><path d="M9.5 11 L14.5 11"/><path d="M8.25 15 L15.75 15"/><path d="M4 21 L20 21"/></>}/>;
export const IcAlert    = (p: IconProps) => <Ico {...p} d={<><path d="M12 3 L22 20 L2 20 Z"/><path d="M12 10 V14"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/></>}/>;
export const IcHome     = (p: IconProps) => <Ico {...p} d={<><path d="M4 10 L12 3 L20 10 V20 H4 Z"/><path d="M9 20 V14 H15 V20"/></>}/>;
export const IcRadio    = (p: IconProps) => <Ico {...p} d={<><rect x="3" y="7" width="14" height="13" rx="2"/><circle cx="10" cy="14" r="3"/><path d="M17 10 L21 6"/><circle cx="21" cy="5" r="1.4" fill="currentColor" stroke="none"/></>}/>;
export const IcUser     = (p: IconProps) => <Ico {...p} d={<><circle cx="12" cy="8" r="4"/><path d="M4 21 C4 16 8 14 12 14 C16 14 20 16 20 21"/></>}/>;
export const IcArrow    = (p: IconProps) => <Ico {...p} d={<><path d="M3 12 L21 12"/><path d="M14 5 L21 12 L14 19"/></>}/>;
