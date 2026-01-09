'use server';

/**
 * @fileOverview A flow that curates research papers based on a user's query.
 *
 * - curateResearchPapers - A function that curates research papers and returns a summarized explanation.
 * - CurateResearchPapersInput - The input type for the curateResearchPapers function.
 * - CurateResearchPapersOutput - The return type for the curateResearchPapers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurateResearchPapersInputSchema = z.object({
  query: z.string().describe('The medical topic or question to research.'),
});

export type CurateResearchPapersInput = z.infer<typeof CurateResearchPapersInputSchema>;

const CurateResearchPapersOutputSchema = z.object({
  summary: z.string().describe('A summarized, easy-to-understand explanation of the research papers.'),
});

export type CurateResearchPapersOutput = z.infer<typeof CurateResearchPapersOutputSchema>;

export async function curateResearchPapers(input: CurateResearchPapersInput): Promise<CurateResearchPapersOutput> {
  return curateResearchPapersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'curateResearchPapersPrompt',
  input: {schema: CurateResearchPapersInputSchema},
  output: {schema: CurateResearchPapersOutputSchema},
  prompt: `You are an expert medical researcher who can summarize complex scientific papers into easy-to-understand explanations for the average person.\n\n  Based on the user's query, search for relevant scientific papers and research. Then, summarize the information and present it back to the user in a chat format, stripping out the complex jargon.\n\n  User Query: {{{query}}}`,
});

const curateResearchPapersFlow = ai.defineFlow(
  {
    name: 'curateResearchPapersFlow',
    inputSchema: CurateResearchPapersInputSchema,
    outputSchema: CurateResearchPapersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
