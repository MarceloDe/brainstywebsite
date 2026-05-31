"use client";

/**
 * DeductibleMeterView — ported verbatim from the prototype (blocks.jsx `DeductibleMeter`).
 * Two progress bars (deductible + out-of-pocket max) with a summary footer.
 */
import React from 'react';
import { T } from '../tokens';
import { Icon, Card, usd } from '../primitives';

export interface DeductibleMeterData {
  plan: string;
  met: number;
  max: number;
  oopMet: number;
  oopMax: number;
}

function Bar({
  label,
  met,
  max,
  pct,
  tone,
}: {
  label: string;
  met: number;
  max: number;
  pct: number;
  tone: string;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
        <span style={{ color: T.ink2, fontWeight: 600 }}>{label}</span>
        <span style={{ color: T.ink, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {usd(met)} <span style={{ color: T.ink3 }}>/ {usd(max)}</span>
        </span>
      </div>
      <div style={{ height: 9, borderRadius: 99, background: T.sunk, overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', borderRadius: 99, background: tone }} />
      </div>
    </div>
  );
}

export function DeductibleMeterView({ d }: { d: DeductibleMeterData }) {
  const pct = Math.min(100, (d.met / d.max) * 100);
  const oopPct = Math.min(100, (d.oopMet / d.oopMax) * 100);
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 13 }}>
        <Icon name="shield" size={17} color={T.blue} />
        <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, flex: 1 }}>Your plan, today</div>
        <span style={{ fontSize: 11, color: T.ink3, fontWeight: 600 }}>Aetna · {d.plan}</span>
      </div>
      <Bar label="Deductible met" met={d.met} max={d.max} pct={pct} tone={T.grad} />
      <Bar label="Out-of-pocket max" met={d.oopMet} max={d.oopMax} pct={oopPct} tone="linear-gradient(90deg,#0BA678,#3DD9A3)" />
      <div
        style={{
          marginTop: 4,
          padding: '10px 12px',
          borderRadius: 12,
          background: T.sunk,
          fontSize: 12.5,
          color: T.ink2,
          fontWeight: 500,
          lineHeight: 1.45,
        }}
      >
        <b style={{ color: T.ink }}>{usd(d.max - d.met)} to go</b> before Aetna covers 90%. After that you pay max{' '}
        <b style={{ color: T.ink }}>{usd(d.oopMax - d.oopMet)}</b> this year.
      </div>
    </Card>
  );
}
