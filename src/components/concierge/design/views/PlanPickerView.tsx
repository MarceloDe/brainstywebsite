"use client";

import { T } from '../tokens';
import { Icon, Card, Pill, Sparkline } from '../primitives';

export interface Plan {
  name: string;
  deductible: string;
  network: string;
  premium: string;
  year: string;
  best?: boolean;
}

export interface PlanPickerData {
  plans: Plan[];
}

export function PlanPickerView({
  d,
  onPick,
}: {
  d: PlanPickerData;
  onPick?: (plan: Plan) => void;
}) {
  return (
    <Card pad={0}>
      <div style={{ padding: '12px 15px 9px', borderBottom: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="sliders" size={17} color={T.purple} />
        <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, flex: 1 }}>Best fit for how you use care</div>
      </div>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>
        {d.plans.map((p: Plan, i: number) => (
          <div key={i} onClick={() => onPick && onPick(p)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 13px', borderRadius: 14,
            border: `1.5px solid ${p.best ? T.blue : T.line2}`, cursor: 'pointer',
            background: p.best ? T.blueSoft : '#fff' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
                {p.name} {p.best && <Pill tone="blue"><Sparkline /> for you</Pill>}</div>
              <div style={{ fontSize: 11.5, color: T.ink3, fontWeight: 500, marginTop: 2 }}>{p.deductible} deductible · {p.network}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{p.premium}<span style={{ fontSize: 11, color: T.ink3, fontWeight: 600 }}>/mo</span></div>
              <div style={{ fontSize: 10.5, color: T.good, fontWeight: 700 }}>est. {p.year}/yr all-in</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
