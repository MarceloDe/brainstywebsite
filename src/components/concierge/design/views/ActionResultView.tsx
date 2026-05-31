"use client";

import { T } from '../tokens';
import { Icon, Card } from '../primitives';

export interface ActionResultData {
  title: string;
  sub: string;
}

export function ActionResultView({ d }: { d: ActionResultData }) {
  return (
    <Card style={{ borderColor: '#C9EEDF', background: 'linear-gradient(135deg,#F2FBF7,#fff)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 34, height: 34, borderRadius: 999, background: T.tealSoft, display: 'grid', placeItems: 'center' }}>
          <Icon name="checkc" size={20} color={T.goodDk} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{d.title}</div>
          <div style={{ fontSize: 12, color: T.ink2, fontWeight: 500 }}>{d.sub}</div>
        </div>
      </div>
    </Card>
  );
}
