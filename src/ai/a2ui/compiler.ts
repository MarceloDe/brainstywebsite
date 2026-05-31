/**
 * Server-side zod schema for the LLM's widget intent, plus re-exports of the
 * pure builder in ./build. The builder is genkit-free so it can also run on the
 * client; this file adds the genkit/zod schema used to constrain Gemini output.
 *
 * NOTE: the intent is a FLAT object keyed by a z.enum (never a discriminatedUnion
 * /z.literal): Gemini's structured-output response_schema rejects JSON-schema
 * `const`, which literals compile to, returning a 400.
 */
import {z} from 'genkit';

export {compileWidget, sanitizeWidget, clampWords, DEFAULT_MENU} from './build';
export type {WidgetIntent, WidgetKind, A2uiMessage, WidgetOption, WidgetStep} from './build';

export const WidgetIntentSchema = z.object({
  kind: z
    .enum(['info', 'actions', 'steps', 'confirm'])
    .describe(
      'actions = clickable choices (DEFAULT when the user could act next); steps = an ordered sequence; confirm = yes/no; info = pure acknowledgement only.'
    ),
  title: z.string().optional().describe('A SHORT heading, max 8 words. No markdown. Never put option text here.'),
  options: z
    .array(
      z.object({
        label: z.string().describe('Short button text, max 5 words.'),
        icon: z.string().optional().describe('lucide-react icon name, e.g. Search, Calendar, ShieldCheck.'),
        value: z.string().optional().describe('Message sent back when clicked. Defaults to label.'),
      })
    )
    .optional()
    .describe('REQUIRED when kind=actions. Provide 2-4 options.'),
  steps: z
    .array(
      z.object({
        label: z.string().describe('Step title, max 6 words.'),
        detail: z.string().optional().describe('One short clarifying line.'),
        icon: z.string().optional().describe('lucide-react icon name.'),
      })
    )
    .optional()
    .describe('REQUIRED when kind=steps. Provide 2-5 steps.'),
  question: z.string().optional().describe('REQUIRED when kind=confirm.'),
  confirmLabel: z.string().optional(),
  cancelLabel: z.string().optional(),
});
