"use client";

import { T } from '../tokens';
import { Icon, Card, Pill } from '../primitives';

export interface TermCardData {
  term: string;
  plain: string;
  example: string;
}

export function TermCardView({ d }: { d: TermCardData }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <Icon name="book" size={17} color={T.purple} />
        <div style={{ fontSize: 14, fontWeight: 800, color: T.ink }}>{d.term}</div>
        <Pill tone="purple" style={{ marginLeft: 'auto' }}>plain English</Pill>
      </div>
      <div style={{ fontSize: 13.5, color: T.ink2, fontWeight: 500, lineHeight: 1.5 }}>{d.plain}</div>
      <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 12, background: T.sunk,
        fontSize: 12.5, color: T.ink2, lineHeight: 1.45 }}>
        <span style={{ fontWeight: 700, color: T.purple }}>For you: </span>{d.example}
      </div>
    </Card>
  );
}
