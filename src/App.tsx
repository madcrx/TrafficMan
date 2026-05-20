import { useState } from 'react';
import { C } from './components/tokens';
import { DesktopApp } from './surfaces/Desktop/DesktopApp';
import { MobileApp }  from './surfaces/Mobile/MobileApp';
import { TabletApp }  from './surfaces/Tablet/TabletApp';
import { DashboardApp } from './surfaces/Dashboard/DashboardApp';

type Surface = 'desktop' | 'tablet' | 'mobile' | 'dashboard';

const surfaces: Array<{ id: Surface; label: string; desc: string; frame: string }> = [
  { id: 'desktop',   label: 'Desktop',   desc: 'Planner workstation',    frame: 'desk'   },
  { id: 'tablet',    label: 'Tablet',    desc: 'In-truck rugged device', frame: 'tablet' },
  { id: 'mobile',    label: 'Mobile',    desc: 'Field controller phone',  frame: 'phone'  },
  { id: 'dashboard', label: 'Dashboard', desc: 'Supervisor web view',    frame: 'browser'},
];

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 390, height: 844,
      background: '#1A1A1A', borderRadius: 48,
      padding: '16px 6px', boxShadow: '0 40px 80px rgba(0,0,0,0.35)',
      position: 'relative', overflow: 'hidden',
      border: '2px solid #333',
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 32, background: '#1A1A1A', borderRadius: 20, zIndex: 10,
      }}/>
      <div style={{
        width: '100%', height: '100%',
        borderRadius: 40, overflow: 'hidden', background: '#fff',
        display: 'flex', flexDirection: 'column',
      }}>
        {children}
      </div>
    </div>
  );
}

function TabletFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 1024, height: 680,
      background: '#2A2D38', borderRadius: 20,
      padding: '12px 10px', boxShadow: '0 40px 80px rgba(0,0,0,0.35)',
      border: '2px solid #444',
    }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function DesktopFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 1200, height: 780,
      background: '#1A1D26', borderRadius: 12,
      padding: '32px 0 0', boxShadow: '0 40px 80px rgba(0,0,0,0.35)',
      position: 'relative',
    }}>
      {/* Titlebar dots */}
      <div style={{ position: 'absolute', top: 12, left: 18, display: 'flex', gap: 8 }}>
        {['#FF5F57','#FFBD2E','#28C840'].map(c => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }}/>
        ))}
      </div>
      <div style={{ width: '100%', height: 'calc(100% - 32px)', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 1200, height: 820,
      background: '#1A1D26', borderRadius: 12,
      padding: '40px 0 0', boxShadow: '0 40px 80px rgba(0,0,0,0.35)',
      position: 'relative',
    }}>
      {/* Browser chrome */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40,
                    display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10 }}>
        {['#FF5F57','#FFBD2E','#28C840'].map(c => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }}/>
        ))}
        <div style={{
          flex: 1, height: 24, background: '#2A2D38', borderRadius: 6, margin: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, color: '#888', fontFamily: 'monospace',
        }}>
          trafficman.io/dashboard
        </div>
      </div>
      <div style={{ width: '100%', height: 'calc(100% - 40px)', overflow: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

export function App() {
  const [surface, setSurface] = useState<Surface>('desktop');

  const renderSurface = () => {
    switch (surface) {
      case 'desktop':   return <DesktopFrame><DesktopApp/></DesktopFrame>;
      case 'tablet':    return <TabletFrame><TabletApp/></TabletFrame>;
      case 'mobile':    return <PhoneFrame><MobileApp/></PhoneFrame>;
      case 'dashboard': return <BrowserFrame><DashboardApp/></BrowserFrame>;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D1018', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Header nav */}
      <div style={{
        width: '100%', padding: '20px 40px',
        display: 'flex', alignItems: 'center', gap: 32,
        borderBottom: '1px solid #1E2230',
      }}>
        <img src="/assets/logo-wordmark-onDark.svg" height="28" alt="TrafficMan"/>
        <div style={{ width: 1, height: 24, background: '#2A3344' }}/>
        <div style={{ display: 'flex', gap: 4 }}>
          {surfaces.map(s => {
            const active = surface === s.id;
            return (
              <button key={s.id} onClick={() => setSurface(s.id)} style={{
                padding: '8px 18px', borderRadius: 8, border: 'none',
                background: active ? C.hivis : 'transparent',
                color: active ? C.ink900 : '#A8B0BB',
                fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.01em',
              }}>
                {s.label}
                <span style={{
                  display: 'block', fontSize: 10, fontWeight: 400,
                  color: active ? C.ink700 : '#5C6677', textTransform: 'uppercase', letterSpacing: '0.06em',
                  marginTop: 1,
                }}>{s.desc}</span>
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1 }}/>
        <span style={{
          fontSize: 11, color: '#5C6677', fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>TrafficMan Design System</span>
      </div>

      {/* Surface viewport */}
      <div style={{
        flex: 1, width: '100%', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', overflow: 'auto',
      }}>
        {renderSurface()}
      </div>
    </div>
  );
}
