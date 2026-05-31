"use client";

/**
 * ProviderListView — ported verbatim from the prototype (blocks.jsx `ProviderList`).
 * In-network provider list with per-row Book action.
 */
import React from 'react';
import { T } from '../tokens';
import { Icon, Card, Pill } from '../primitives';

export interface ProviderListRow {
  init: string;
  name: string;
  spec: string;
  miles: number;
  rating: number;
}

export interface ProviderListData {
  title: string;
  rows: ProviderListRow[];
}

export function ProviderListView({
  d,
  onBook,
}: {
  d: ProviderListData;
  onBook?: (row: ProviderListRow) => void;
}) {
  return (
    <Card pad={0}>
      <div style={{ padding: '12px 15px 9px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="user" size={17} color={T.blue} />
        <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, flex: 1 }}>{d.title}</div>
        <Pill tone="good"><Icon name="check" size={11} color={T.goodDk} /> in-network</Pill>
      </div>
      {d.rows.map((r: ProviderListRow, i: number) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            padding: '11px 15px',
            borderBottom: i < d.rows.length - 1 ? `1px solid ${T.line}` : 'none',
          }}
        >
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              background: T.purpSoft,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              color: T.purple,
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            {r.init}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{r.name}</div>
            <div style={{ fontSize: 11.5, color: T.ink3, fontWeight: 500 }}>
              {r.spec} · {r.miles} mi · <Icon name="star" size={11} color={T.warn} style={{ verticalAlign: -1 }} /> {r.rating}
            </div>
          </div>
          <button
            onClick={() => onBook && onBook(r)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: 700,
              color: T.blue,
              padding: '7px 12px',
              borderRadius: 10,
              background: T.blueSoft,
            }}
          >
            Book
          </button>
        </div>
      ))}
    </Card>
  );
}
