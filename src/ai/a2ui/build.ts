/**
 * Pure, dependency-free A2UI builder. NO genkit / zod / react imports, so it is
 * safe to use on BOTH the server (the Genkit flow) and the client (the concierge
 * component, e.g. for the deterministic task menu and empty-widget fallback).
 *
 * It turns a small flat "widget intent" into a valid A2UI v0.9 message array
 * (createSurface + updateComponents). All component props are literals, so no
 * data model is needed. See compiler.ts for the zod schema the LLM fills.
 */
import {BRAINSTY_CATALOG_ID, A2UI_SELECT_ACTION} from './catalog';

export type WidgetKind = 'info' | 'actions' | 'steps' | 'confirm';

export interface WidgetOption {
  label: string;
  icon?: string;
  value?: string;
}
export interface WidgetStep {
  label: string;
  detail?: string;
  icon?: string;
}
export interface WidgetIntent {
  kind: WidgetKind;
  title?: string;
  options?: WidgetOption[];
  steps?: WidgetStep[];
  question?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface A2uiMessage {
  version: 'v0.9';
  createSurface?: {surfaceId: string; catalogId: string};
  updateComponents?: {surfaceId: string; components: ComponentNode[]};
}
interface ComponentNode {
  id: string;
  component: string;
  [prop: string]: unknown;
}

// Strip markdown noise (#, *, backticks, leading list markers) and collapse space.
const clean = (s: string | undefined, maxChars: number): string =>
  (s ?? '')
    .replace(/[#*`_>]/g, '')
    .replace(/^\s*[-•]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxChars);

/** Clamp free text to a word budget so the gist rule (R3) is always enforced. */
export function clampWords(s: string, maxWords = 40): string {
  const words = (s ?? '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (words.length <= maxWords) return words.join(' ');
  return words.slice(0, maxWords).join(' ') + '…';
}

/** Normalize whatever the model returned into a safe, bounded widget intent. */
export function sanitizeWidget(w: Partial<WidgetIntent> | undefined): WidgetIntent {
  const kind = (w?.kind ?? 'info') as WidgetKind;
  const title = w?.title ? clean(w.title, 80) : undefined;

  if (kind === 'actions') {
    const options = (w?.options ?? [])
      .slice(0, 6)
      .map((o) => ({
        label: clean(o?.label, 60),
        icon: o?.icon ? clean(o.icon, 40) : undefined,
        value: o?.value ? clean(o.value, 160) : undefined,
      }))
      .filter((o) => o.label.length > 0);
    return {kind: 'actions', title, options};
  }
  if (kind === 'steps') {
    const steps = (w?.steps ?? [])
      .slice(0, 6)
      .map((s) => ({
        label: clean(s?.label, 80),
        detail: s?.detail ? clean(s.detail, 140) : undefined,
        icon: s?.icon ? clean(s.icon, 40) : undefined,
      }))
      .filter((s) => s.label.length > 0);
    return {kind: 'steps', title, steps};
  }
  if (kind === 'confirm') {
    return {
      kind: 'confirm',
      question: clean(w?.question || title || 'Proceed?', 160),
      confirmLabel: w?.confirmLabel ? clean(w.confirmLabel, 40) : undefined,
      cancelLabel: w?.cancelLabel ? clean(w.cancelLabel, 40) : undefined,
    };
  }
  return {kind: 'info'};
}

/**
 * Compile a widget intent into A2UI messages for the given surface.
 * Input is sanitized first, so callers may pass raw model output.
 * Returns an empty array when there is nothing interactive to render.
 */
export function compileWidget(surfaceId: string, rawWidget: Partial<WidgetIntent> | undefined): A2uiMessage[] {
  const widget = sanitizeWidget(rawWidget);

  const components: ComponentNode[] = [];
  let n = 0;
  const id = (prefix: string) => `${prefix}-${n++}`;
  const push = (node: ComponentNode) => {
    components.push(node);
    return node.id;
  };

  const text = (value: string, variant?: string) =>
    push({id: id('txt'), component: 'Text', text: value, ...(variant ? {variant} : {})});

  const icon = (name?: string) =>
    name ? push({id: id('ic'), component: 'LucideIcon', name}) : undefined;

  const selectButton = (label: string, value: string, iconName?: string, variant = 'default') => {
    const ic = icon(iconName);
    const lbl = text(label, 'body');
    const child = push({
      id: id('row'),
      component: 'Row',
      children: [ic, lbl].filter(Boolean) as string[],
      align: 'center',
    });
    return push({
      id: id('btn'),
      component: 'Button',
      child,
      variant,
      // A2UI v0.9 Action shape: must be wrapped in `event` for dispatchAction
      // to emit it to the client action handler.
      action: {event: {name: A2UI_SELECT_ACTION, context: {value}}},
    });
  };

  const rootChildren: string[] = [];

  if (widget.kind === 'actions') {
    if (!widget.options || widget.options.length === 0) return [];
    if (widget.title) rootChildren.push(text(widget.title));
    for (const opt of widget.options) {
      rootChildren.push(selectButton(opt.label, opt.value ?? opt.label, opt.icon));
    }
  } else if (widget.kind === 'steps') {
    if (!widget.steps || widget.steps.length === 0) return [];
    if (widget.title) rootChildren.push(text(widget.title));
    widget.steps.forEach((step, i) => {
      const marker = icon(step.icon) ?? text(String(i + 1));
      const colChildren = [text(step.label, 'body')];
      if (step.detail) colChildren.push(text(step.detail, 'caption'));
      const body = push({id: id('col'), component: 'Column', children: colChildren});
      rootChildren.push(
        push({id: id('row'), component: 'Row', children: [marker, body], align: 'center'})
      );
    });
  } else if (widget.kind === 'confirm') {
    rootChildren.push(text(widget.question ?? 'Proceed?'));
    const yes = selectButton(widget.confirmLabel ?? 'Yes, proceed', 'Yes', 'Check', 'primary');
    const no = selectButton(widget.cancelLabel ?? 'Cancel', 'No', 'X');
    rootChildren.push(push({id: id('row'), component: 'Row', children: [yes, no], justify: 'start'}));
  } else {
    return [];
  }

  push({id: 'root', component: 'Column', children: rootChildren, align: 'stretch'});

  return [
    {version: 'v0.9', createSurface: {surfaceId, catalogId: BRAINSTY_CATALOG_ID}},
    {version: 'v0.9', updateComponents: {surfaceId, components}},
  ];
}

/** The deterministic main task menu (no LLM call). Guarantees R2/R4. */
export const DEFAULT_MENU: WidgetIntent = {
  kind: 'actions',
  title: 'How can I help you today?',
  options: [
    {label: 'Compare real prices', icon: 'DollarSign', value: 'Compare procedure prices for me.'},
    {label: 'Fight a surprise bill', icon: 'ShieldCheck', value: 'Help me fight a surprise medical bill.'},
    {label: 'Scan a medical bill (PDF)', icon: 'FileText', value: 'I want to scan a medical bill PDF.'},
    {label: 'Check my coverage', icon: 'Activity', value: 'Check my deductible and coverage status.'},
  ],
};
