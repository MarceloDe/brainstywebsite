"use client";

/**
 * ChoiceGridView — procedure / form picker.
 * Ported verbatim from the prototype (blocks.jsx `ChoiceGrid`).
 */
import React from 'react';
import { T } from '../tokens';
import { Icon } from '../primitives';

export interface ChoiceGridData {
  options: { label: string; sub?: string; icon: string; intent: string }[];
}

export function ChoiceGridView({
  d,
  onPick,
}: {
  d: ChoiceGridData;
  onPick?: (option: ChoiceGridData['options'][number]) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
      {d.options.map((o, i: number) => (
        <button
          key={i}
          onClick={() => onPick && onPick(o)}
          style={{
            all: 'unset',
            cursor: 'pointer',
            boxSizing: 'border-box',
            padding: '12px 12px',
            borderRadius: 14,
            background: T.surface,
            border: `1px solid ${T.line2}`,
            boxShadow: T.shadowSm,
          }}
        >
          <Icon name={o.icon} size={19} color={T.blue} />
          <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginTop: 8 }}>{o.label}</div>
          {o.sub && <div style={{ fontSize: 11, color: T.ink3, fontWeight: 500, marginTop: 1 }}>{o.sub}</div>}
        </button>
      ))}
    </div>
  );
}
