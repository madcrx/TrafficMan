import type { WizardInputs, Zone } from './types';

export async function createShare(inputs: WizardInputs, zones: Zone[]): Promise<string> {
  const payload = zones.length > 1 ? { zones } : { inputs };
  const res = await fetch('/api/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: payload }),
  });
  if (!res.ok) throw new Error('Failed to create share link');
  const data = await res.json() as { token: string };
  return `${window.location.origin}/?share=${data.token}`;
}

export async function loadShare(token: string): Promise<WizardInputs | { zones: Zone[] }> {
  const res = await fetch(`/api/share/${token}`);
  if (!res.ok) throw new Error('Share not found or expired');
  const data = await res.json() as { inputs: WizardInputs | { zones: Zone[] } };
  return data.inputs;
}
