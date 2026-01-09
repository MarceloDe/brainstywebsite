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

const AiConciergeAssistanceOutputSchema = z.object({
  response: z.string().describe('The response from the AI concierge.'),
});
export type AiConciergeAssistanceOutput = z.infer<typeof AiConciergeAssistanceOutputSchema>;

export async function aiConciergeAssistance(input: AiConciergeAssistanceInput): Promise<AiConciergeAssistanceOutput> {
  return aiConciergeAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiConciergeAssistancePrompt',
  input: {schema: AiConciergeAssistanceInputSchema},
  output: {schema: AiConciergeAssistanceOutputSchema},
  prompt: `You are an expert healthcare concierge. Your goal is to provide personalized guidance and support to the user based on their query.

User Query: {{{query}}}`,
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
