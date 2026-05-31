'use server';
/**
 * @fileOverview Wefella concierge flow.
 *
 * The model is harnessed to return a SHORT (<=30 word) textual gist plus a
 * structured "widget intent". A deterministic compiler (see ../a2ui/compiler)
 * turns that intent into a valid A2UI v0.9 message array which the client
 * renders with @a2ui/react. This guarantees that whenever the reply implies an
 * action, choice, or sequence, a clickable/visual interface is produced.
 *
 * - aiConciergeAssistance - entry point used by the concierge client.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {compileWidget, clampWords, WidgetIntentSchema, type A2uiMessage} from '@/ai/a2ui/compiler';
import {CONCIERGE_SURFACE_ID} from '@/ai/a2ui/catalog';

const AiConciergeAssistanceInputSchema = z.object({
  query: z.string().describe('The user query for the AI concierge.'),
  language: z.enum(['en', 'es', 'pt']).optional().describe('The active language of the user interface.'),
});
export type AiConciergeAssistanceInput = z.infer<typeof AiConciergeAssistanceInputSchema>;

// What the LLM is asked to produce.
const ModelOutputSchema = z.object({
  response: z
    .string()
    .describe('The gist reply. MAXIMUM 30 words. No markdown. Plain, warm, jargon-free.'),
  widget: WidgetIntentSchema.describe(
    'The interactive interface to render alongside the reply.'
  ),
});

// What the flow returns to the client: text + ready-to-render A2UI messages.
const AiConciergeAssistanceOutputSchema = z.object({
  response: z.string(),
  a2ui: z.array(z.any()).describe('A2UI v0.9 messages, ready for the renderer. May be empty.'),
});
export type AiConciergeAssistanceOutput = z.infer<typeof AiConciergeAssistanceOutputSchema>;

export async function aiConciergeAssistance(
  input: AiConciergeAssistanceInput
): Promise<AiConciergeAssistanceOutput> {
  return aiConciergeAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiConciergeAssistancePrompt',
  input: {schema: AiConciergeAssistanceInputSchema},
  output: {schema: ModelOutputSchema},
  prompt: `You are Wefella, an expert healthcare concierge and autonomous resident of Brainsty.

### HARD RULES
1. "response": 30 words OR FEWER. Plain prose, no markdown, no lists, no repetition. State only the gist.
2. NEVER list options, steps, or buttons inside "response" — those belong in "widget" only.
3. "widget.title": a SHORT heading, max 8 words. Do NOT put sentences, disclaimers, or option text here.
4. Do not repeat yourself anywhere. Be concise.

### WIDGET (how the user interacts)
- kind="actions": use whenever the user could do something next (the common case). Provide 2-4 options. Each option: short "label" (max 5 words), a lucide-react "icon" (e.g. Search, Calendar, Activity, Heart, ShieldCheck, Video, FileText, DollarSign, Stethoscope, Pill, Upload), and optional "value".
- kind="steps": use to explain a SEQUENCE. Provide 2-5 steps, each a short "label" + optional "detail" + lucide "icon".
- kind="confirm": a yes/no decision. Provide "question".
- kind="info": ONLY when there is truly nothing to act on.

### MULTILINGUAL
Respond in the user's active language: {{{language}}} (default English). Translate ALL labels, titles, options. Do NOT translate lucide icon names.

### PERSONA
Warm, clear, protective. You guard the user's money, expose real prices, and stop surprise bills.

User Query: {{{query}}}`,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const FALLBACK = (msg: string): AiConciergeAssistanceOutput => {
  const widget = {
    kind: 'actions' as const,
    title: undefined,
    options: [{label: 'Try again', value: 'Hello', icon: 'RefreshCw'}],
  };
  return {response: msg, a2ui: compileWidget(CONCIERGE_SURFACE_ID, widget) as A2uiMessage[]};
};

const aiConciergeAssistanceFlow = ai.defineFlow(
  {
    name: 'aiConciergeAssistanceFlow',
    inputSchema: AiConciergeAssistanceInputSchema,
    outputSchema: AiConciergeAssistanceOutputSchema,
  },
  async (input) => {
    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
      try {
        const {output} = await prompt(input);
        if (output) {
          return {
            response: clampWords(output.response, 40),
            a2ui: compileWidget(CONCIERGE_SURFACE_ID, output.widget),
          };
        }
      } catch (err: any) {
        console.warn(`Gemini API call failed (retries left: ${retries - 1}):`, err?.message || err);
        retries--;
        if (retries === 0) {
          return FALLBACK(
            "Wefella's shield brain is briefly overloaded. I'm still guarding your dashboard — try again in a moment."
          );
        }
        await sleep(delay);
        delay *= 2;
      }
    }

    return FALLBACK('Wefella is experiencing high volume right now. Please try again shortly.');
  }
);
