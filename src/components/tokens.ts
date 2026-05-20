export const C = {
  hivis:    '#FF6A00',
  hivisDk:  '#D95400',
  stop:     '#E11D2A',
  go:       '#00A85A',
  caution:  '#FFC400',
  info:     '#0A84FF',
  ink900:   '#0B1220',
  ink700:   '#2A3344',
  ink500:   '#5C6677',
  paper0:   '#FFFFFF',
  paper50:  '#F6F7F9',
  paper100: '#EBEEF3',
  paper200: '#DDE2E9',
  steel200: '#C7CCD4',
  steel300: '#A8B0BB',
} as const;

export type StatusKind = 'active' | 'go' | 'stop' | 'caution' | 'info' | 'neutral' | 'pending';
