"use client";

/**
 * CostBreakdownView — ported verbatim from the prototype (blocks.jsx `CostBreakdown`).
 * Renders an estimated patient cost breakdown for a procedure.
 */
import React from 'react';
import { T } from '../tokens';
import { Icon, Card, Pill, Sparkline, usd } from '../primitives';

export interface CostBreakdownData {
  name: string;
  place: string;
  cpt: string;
  charge: number;
  allowed: number;
  planPays: number;
  toDeductible: number;
  you: number;
  confidence: number;
  preventive?: boolean;
}

type CostRow = [string, number, string];

export function CostBreakdownView({ d }: { d: CostBreakdownData }) {
  const rows: CostRow[] = [
    ['Provider charge', d.charge, T.ink2],
    ['Aetna negotiated rate', -(d.charge - d.allowed), T.good],
    ['Plan pays', -d.planPays, T.good],
    ['Applied to deductible', d.toDeductible, T.ink2],
  ];
  return (
    <Card pad={0}>
      <div
        style={{
          padding: '13px 15px 11px',
          borderBottom: `1px solid ${T.line}`,
          display: 'flex',
          alignItems: 'center',
          gap: 9,
        }}
      >
        <span style={{ width: 30, height: 30, borderRadius: 9, background: T.blueSoft, display: 'grid', placeItems: 'center' }}>
          <Icon name="dollar" size={17} color={T.blue} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{d.name}</div>
          <div style={{ fontSize: 11.5, color: T.ink3, fontWeight: 500 }}>{d.place} · CPT {d.cpt}</div>
        </div>
        <Pill tone="blue"><Sparkline /> {d.confidence}% match</Pill>
      </div>
      <div style={{ padding: '11px 15px' }}>
        {rows.map(([l, v, c]: CostRow, i: number) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', fontSize: 13 }}>
            <span style={{ color: T.ink2, fontWeight: 500 }}>{l}</span>
            <span style={{ color: c, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {v < 0 ? '−' : ''}{usd(Math.abs(v))}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          margin: '0 15px 14px',
          padding: '13px 15px',
          borderRadius: 14,
          background: T.grad,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.8)', fontWeight: 600, letterSpacing: 0.3 }}>YOUR ESTIMATED COST</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.72)', fontWeight: 500, marginTop: 2 }}>after Aetna + deductible</div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums', letterSpacing: -1 }}>{usd(d.you)}</div>
      </div>
    </Card>
  );
}
