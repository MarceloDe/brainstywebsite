"use client";

import React from 'react';
import { T } from '../tokens';
import { Icon, Card, usd } from '../primitives';

export interface BillScanData {
  file: string;
  provider: string;
  lines: number;
  savings: number;
  items: { label: string; amt: number; flag?: string }[];
}

export function BillScanView({ d }: { d: BillScanData }) {
  return (
    <Card pad={0}>
      <div style={{ padding: '12px 15px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: T.amberSoft, display: 'grid', placeItems: 'center' }}>
          <Icon name="doc" size={17} color={T.warn} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{d.file}</div>
          <div style={{ fontSize: 11.5, color: T.ink3, fontWeight: 500 }}>{d.provider} · scanned {d.lines} lines</div>
        </div>
      </div>
      {d.items.map((it: { label: string; amt: number; flag?: string }, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 15px',
          borderBottom: `1px solid ${T.line}`, background: it.flag ? 'linear-gradient(90deg,#FDF4EC,#fff)' : '#fff' }}>
          <Icon name={it.flag ? 'alert' : 'check'} size={16} color={it.flag ? T.warn : T.ink3} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{it.label}</div>
            {it.flag && <div style={{ fontSize: 11, color: T.warn, fontWeight: 600 }}>{it.flag}</div>}
          </div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: it.flag ? T.warn : T.ink, fontVariantNumeric: 'tabular-nums' }}>{usd(it.amt)}</div>
        </div>
      ))}
      <div style={{ margin: 14, padding: '12px 14px', borderRadius: 14, border: `1px dashed ${T.warn}`, background: T.amberSoft,
        display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, color: T.warn, fontWeight: 700, letterSpacing: 0.3 }}>LIKELY OVERCHARGE FOUND</div>
          <div style={{ fontSize: 13, color: T.ink, fontWeight: 600, marginTop: 1 }}>You may be owed back</div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: T.warn, fontVariantNumeric: 'tabular-nums' }}>{usd(d.savings)}</div>
      </div>
    </Card>
  );
}
