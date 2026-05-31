'use server';
/**
 * Fast, grounded concierge NLU. The model's ONLY job is to (1) classify a typed
 * question into one of the fixed intents and (2) write a short reply. All numbers
 * and cards come from the grounded dataset (dataset.ts) via respond()/assembler —
 * never from the model — so prices can't be hallucinated and latency stays low.
 *
 * Known intents (menu / chip / choice taps) never reach this flow; the client
 * resolves them locally from the pure dataset. Only free text hits Gemini.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { INTENTS } from '@/ai/concierge/dataset';

const InputSchema = z.object({
  query: z.string().describe('The user’s free-text healthcare question.'),
  language: z.enum(['en', 'es', 'pt']).optional(),
});
export type ConciergeClassifyInput = z.infer<typeof InputSchema>;

const OutputSchema = z.object({
  intent: z.enum(INTENTS as unknown as [string, ...string[]]).describe('The single best-matching intent.'),
  say: z.string().describe('A warm reply as Wefella, 25 words or fewer, in the active language.'),
});
export type ConciergeClassifyOutput = z.infer<typeof OutputSchema>;

export async function conciergeClassify(input: ConciergeClassifyInput): Promise<ConciergeClassifyOutput> {
  return conciergeClassifyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'conciergeClassifyPrompt',
  input: { schema: InputSchema },
  output: { schema: OutputSchema },
  prompt: `You are Wefella, an independent healthcare concierge. The user has an Aetna PPO 1000 plan and uses the University of Miami Health (UHealth) network in Miami.

Classify the user's message into exactly ONE intent:
- estimate_cost: wants a procedure price in general
- cost_mri / cost_colon / cost_mammo / cost_ct: a specific procedure (MRI, colonoscopy, mammogram, CT)
- compare_price: compare facilities / where is it cheaper
- deductible: deductible / out-of-pocket status
- dispute_bill: a bill, charge, EOB, or possible overcharge
- find_provider: find an in-network doctor
- prov_pc / prov_ortho / prov_derm / prov_cardio: a specific specialty (primary care, orthopedics, dermatology, cardiology)
- pick_plan: choosing or switching plans
- explain_term: wants a term explained
- term_coins / term_copay / term_ded / term_eob / term_oop: a specific term (coinsurance, copay, deductible, EOB, out-of-pocket max)
- menu: greeting, thanks, or unclear
- general: the question is NOT about this Aetna plan or the UHealth network (anything off-topic — general health, small talk, other subjects)

Then write "say": a warm, plain reply AS Wefella, 30 words or fewer, no markdown, in the active language ({{{language}}}, default English).
- For healthcare-plan intents: keep it to a quick lead-in; the interface shows the real numbers, so do NOT invent prices or facility names.
- For "general": actually ANSWER the question directly in 30 words or fewer (a helpful gist), then you may gently note you specialize in their Aetna + UHealth coverage.

User message: {{{query}}}`,
});

const clamp = (s: string, n = 30) => {
  const w = (s ?? '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  return w.length <= n ? w.join(' ') : w.slice(0, n).join(' ') + '…';
};

const conciergeClassifyFlow = ai.defineFlow(
  { name: 'conciergeClassifyFlow', inputSchema: InputSchema, outputSchema: OutputSchema },
  async (input) => {
    let retries = 2;
    let delay = 800;
    while (retries > 0) {
      try {
        const { output } = await prompt(input);
        if (output) return { intent: output.intent, say: clamp(output.say) };
      } catch (err: any) {
        console.warn(`conciergeClassify failed (retries left ${retries - 1}):`, err?.message || err);
        retries--;
        if (retries === 0) break;
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
      }
    }
    // Safe fallback: route to the menu with a gentle nudge.
    return { intent: 'menu', say: 'Let me pull up what I can help with.' };
  }
);
