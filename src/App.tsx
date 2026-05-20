import { CalculatorApp } from './surfaces/Calculator/CalculatorApp';

export function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <CalculatorApp />
    </div>
  );
}
