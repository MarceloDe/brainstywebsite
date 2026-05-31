"use client";

/**
 * The Brainsty concierge A2UI catalog — official @a2ui/react, with the prototype's
 * rich blocks registered as CUSTOM A2UI components. Each component is binderless:
 * it reads its literal `d` payload straight from the component model and renders
 * the ported React view. Interactive blocks dispatch a `select` action carrying
 * the next intent, which the host routes back into the engine.
 *
 * Component names match dataset CanvasType: cost | compare | deductible |
 * providers | bill | plans | term | result | choice.
 */
import { z } from 'zod';
import { Catalog } from '@a2ui/web_core/v0_9';
import { basicCatalog, createBinderlessComponentImplementation } from '@a2ui/react/v0_9';
import { CONCIERGE_CATALOG_ID, SELECT_ACTION } from '@/ai/concierge/constants';

import { CostBreakdownView } from './views/CostBreakdownView';
import { CompareTableView } from './views/CompareTableView';
import { DeductibleMeterView } from './views/DeductibleMeterView';
import { ProviderListView } from './views/ProviderListView';
import { BillScanView } from './views/BillScanView';
import { PlanPickerView } from './views/PlanPickerView';
import { TermCardView } from './views/TermCardView';
import { ActionResultView } from './views/ActionResultView';
import { ChoiceGridView } from './views/ChoiceGridView';

// Schemas: `d` is the literal payload; `pickIntent` (interactive blocks) is the
// intent dispatched when a row/plan is tapped. z.any() so literals pass through.
const dataSchema = z.object({ d: z.any() });
const pickSchema = z.object({ d: z.any(), pickIntent: z.any() });

type Ctx = { context: { componentModel: { properties: Record<string, any> }; dispatchAction: (a: any) => void } };
const fire = (ctx: Ctx['context'], value: string) =>
  ctx.dispatchAction({ event: { name: SELECT_ACTION, context: { value } } });

const cost = createBinderlessComponentImplementation(
  { name: 'cost', schema: dataSchema },
  ({ context }: Ctx) => <CostBreakdownView d={context.componentModel.properties.d} />
);

const compare = createBinderlessComponentImplementation(
  { name: 'compare', schema: pickSchema },
  ({ context }: Ctx) => {
    const p = context.componentModel.properties;
    return <CompareTableView d={p.d} onPick={() => fire(context, p.pickIntent || 'book_done')} />;
  }
);

const deductible = createBinderlessComponentImplementation(
  { name: 'deductible', schema: dataSchema },
  ({ context }: Ctx) => <DeductibleMeterView d={context.componentModel.properties.d} />
);

const providers = createBinderlessComponentImplementation(
  { name: 'providers', schema: pickSchema },
  ({ context }: Ctx) => {
    const p = context.componentModel.properties;
    return <ProviderListView d={p.d} onBook={() => fire(context, p.pickIntent || 'book_done')} />;
  }
);

const bill = createBinderlessComponentImplementation(
  { name: 'bill', schema: dataSchema },
  ({ context }: Ctx) => <BillScanView d={context.componentModel.properties.d} />
);

const plans = createBinderlessComponentImplementation(
  { name: 'plans', schema: pickSchema },
  ({ context }: Ctx) => {
    const p = context.componentModel.properties;
    return <PlanPickerView d={p.d} onPick={() => fire(context, p.pickIntent || 'logged')} />;
  }
);

const term = createBinderlessComponentImplementation(
  { name: 'term', schema: dataSchema },
  ({ context }: Ctx) => <TermCardView d={context.componentModel.properties.d} />
);

const result = createBinderlessComponentImplementation(
  { name: 'result', schema: dataSchema },
  ({ context }: Ctx) => <ActionResultView d={context.componentModel.properties.d} />
);

const choice = createBinderlessComponentImplementation(
  { name: 'choice', schema: dataSchema },
  ({ context }: Ctx) => (
    <ChoiceGridView
      d={context.componentModel.properties.d}
      onPick={(o: { intent: string }) => fire(context, o.intent)}
    />
  )
);

export const conciergeCatalog = new Catalog(CONCIERGE_CATALOG_ID, [
  ...basicCatalog.components.values(),
  cost,
  compare,
  deductible,
  providers,
  bill,
  plans,
  term,
  result,
  choice,
]);
