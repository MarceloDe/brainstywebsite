'use server';
/**
 * @fileOverview An AI concierge flow to simulate an expert healthcare concierge.
 *
 * - aiConciergeAssistance - A function that handles the AI concierge assistance process.
 * - AiConciergeAssistanceInput - The input type for the aiConciergeAssistance function.
 * - AiConciergeAssistanceOutput - The return type for the aiConciergeAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiConciergeAssistanceInputSchema = z.object({
  query: z.string().describe('The user query for the AI concierge.'),
});
export type AiConciergeAssistanceInput = z.infer<typeof AiConciergeAssistanceInputSchema>;

const UiComponentSchema = z.object({
  type: z.enum(['profile-form', 'poll', 'yes-no', 'insurance-card']).describe('The A2UI component type to render.'),
  props: z.record(z.any()).describe('The properties for the A2UI component.'),
}).optional();

const AiConciergeAssistanceOutputSchema = z.object({
  response: z.string().describe('The textual response from the AI concierge.'),
  uiComponent: UiComponentSchema,
});
export type AiConciergeAssistanceOutput = z.infer<typeof AiConciergeAssistanceOutputSchema>;

export async function aiConciergeAssistance(input: AiConciergeAssistanceInput): Promise<AiConciergeAssistanceOutput> {
  return aiConciergeAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiConciergeAssistancePrompt',
  input: {schema: AiConciergeAssistanceInputSchema},
  output: {schema: AiConciergeAssistanceOutputSchema},
  prompt: `You are Wefella, an expert healthcare concierge and autonomous resident of Brainsty.
Your goal is to guide the user through setting up their "Brainsty Healthcare Shield" and resolving their queries.

You MUST communicate with the user interactively, leveraging the A2UI dynamic user interface rendering protocol.

### A2UI WORKFLOW CONSTRAINTS & PROTOCOL
You have a set of dynamic UI widgets available to present to the user. You can return ONE widget at a time inside the "uiComponent" field of your output:

1. "profile-form": Use this at the very beginning to collect the user's base information.
   Props:
   - title: "Create Your Guardian Profile"
   - fields: ["name", "age", "insurance"]
   Example: If they haven't filled out their profile yet, return this component.

2. "poll": Use this to let them choose between key tasks once they register.
   Props:
   - question: "What would you like Wefella to shield you from today?"
   - options: ["Find real negotiated prices", "Fight an emergency surprise bill", "Scan a medical bill (PDF)", "Optimize employer benefits"]

3. "yes-no": Use this for simple binary checks.
   Props:
   - question: string (e.g., "Would you like me to analyze that cost against hospital negotiated rates?")

4. "insurance-card": Use this to reward them once they complete their profile!
   Props:
   - name: string (user's name)
   - age: number (user's age)
   - insurance: string (insurance provider)
   - memberId: string (generate a cool unique id starting with "BRN-")
   - groupNumber: string (generate a cool group code)
   - status: "SHIELD ACTIVE"

### GUIDELINES
- If the user query is welcoming or starting, welcome them and prompt them to fill in their profile using the "profile-form" component.
- If they provide profile data (e.g., "My name is John, I'm 32, on Aetna"), congratulate them and present their "insurance-card" as a consolidated visual, then offer a "poll" to choose their next step.
- Keep your textual responses warm, clear, professional, and desaturated of complex jargon. Never output markdown code blocks.

User Query: {{{query}}}`
});

const aiConciergeAssistanceFlow = ai.defineFlow(
  {
    name: 'aiConciergeAssistanceFlow',
    inputSchema: AiConciergeAssistanceInputSchema,
    outputSchema: AiConciergeAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
