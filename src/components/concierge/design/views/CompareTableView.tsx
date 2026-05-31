"use client";

/**
 * CompareTableView — compare in-network facilities block.
 * Ported verbatim from the prototype (blocks.jsx `CompareTable`).
 */
import React from 'react';
import { T } from '../tokens';
import { Icon, Card, Pill, usd } from '../primitives';

export interface CompareTableRow {
  name: string;
  miles: number;
  rating: number;
  you: number;
  save: number;
  best?: boolean;
}

export interface CompareTableData {
  title: string;
  rows: CompareTableRow[];
}

export function CompareTableView({
  d,
  onPick,
}: {
  d: CompareTableData;
  onPick?: (row: CompareTableRow) => void;
}) {
  return (
    <Card pad={0}>
      <div style={{ padding: '12px 15px 9px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `1px solid ${T.line}` }}>
        <Icon name="scale" size={17} color={T.purple} />
        <div style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: T.ink }}>{d.title}</div>
        <span style={{ fontSize: 11, color: T.ink3, fontWeight: 600 }}>{d.rows.length} in-network</span>
      </div>
      <div>
        {d.rows.map((r: CompareTableRow, i: number) => (
          <div
            key={i}
            onClick={() => onPick && onPick(r)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '11px 15px',
              borderBottom: i < d.rows.length - 1 ? `1px solid ${T.line}` : 'none',
              cursor: onPick ? 'pointer' : 'default',
              background: r.best ? 'linear-gradient(90deg,#F1FBF7,#fff)' : '#fff',
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: r.best ? T.tealSoft : T.sunk,
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Icon name="building" size={18} color={r.best ? T.goodDk : T.ink2} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
                {r.name} {r.best && <Pill tone="good">Best value</Pill>}
              </div>
              <div style={{ fontSize: 11.5, color: T.ink3, fontWeight: 500, display: 'flex', gap: 9, marginTop: 2 }}>
                <span><Icon name="pin" size={11} color={T.ink3} style={{ verticalAlign: -1 }} /> {r.miles} mi</span>
                <span><Icon name="star" size={11} color={T.warn} style={{ verticalAlign: -1 }} /> {r.rating}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: r.best ? T.goodDk : T.ink, fontVariantNumeric: 'tabular-nums' }}>{usd(r.you)}</div>
              {r.save > 0 && <div style={{ fontSize: 10.5, color: T.good, fontWeight: 700 }}>save {usd(r.save)}</div>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
