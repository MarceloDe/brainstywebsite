/**
 * Brainsty MVP dataset — fixed, grounded values for the demo.
 * Plan: Aetna PPO 1000. Care network: University of Miami Health System (UHealth), Miami FL.
 *
 * IMPORTANT: these are realistic *representative* MVP values (real plan structure
 * + real UHealth facility names), NOT a live price feed. The concierge serves the
 * cards from THIS data (never the LLM), so prices can never be hallucinated. The
 * same object is mirrored into Firestore (mvp_dataset/aetna_um) by scripts/seed-mvp-data.mjs
 * so the data also lives "in the database"; the engine reads from here for speed.
 *
 * Framework-agnostic (no genkit/react) so server flow + client + seed script can import it.
 */

export type CanvasType =
  | 'cost' | 'compare' | 'deductible' | 'providers' | 'bill' | 'plans' | 'term' | 'choice' | 'result';

export interface Chip { label: string; icon: string; intent: string; primary?: boolean }

export interface CanvasData {
  type: CanvasType;
  // exactly one of the following payloads is present, matching the view's `d` prop
  cost?: CostData;
  compare?: CompareData;
  deductible?: DeductibleData;
  providers?: ProviderData;
  bill?: BillData;
  plans?: PlansData;
  term?: TermData;
  choice?: ChoiceData;
  result?: ResultData;
}

export interface Turn {
  userEcho: string | null;
  say: string;
  canvas: CanvasData | null;
  chips: Chip[];
  sayDelay?: number;
}

// ── payload types ────────────────────────────────────────────────────
export interface CostData { name: string; place: string; cpt: string; charge: number; allowed: number; planPays: number; toDeductible: number; you: number; confidence: number; preventive?: boolean }
export interface CompareRow { name: string; miles: number; rating: number; you: number; save: number; best?: boolean }
export interface CompareData { title: string; rows: CompareRow[] }
export interface DeductibleData { plan: string; met: number; max: number; oopMet: number; oopMax: number }
export interface ProviderRow { init: string; name: string; spec: string; miles: number; rating: number }
export interface ProviderData { title: string; rows: ProviderRow[] }
export interface BillItem { label: string; amt: number; flag?: string }
export interface BillData { file: string; provider: string; lines: number; savings: number; items: BillItem[] }
export interface PlanRow { name: string; deductible: string; network: string; premium: string; year: string; best?: boolean }
export interface PlansData { plans: PlanRow[] }
export interface TermData { term: string; plain: string; example: string }
export interface ChoiceOption { label: string; sub?: string; icon: string; intent: string }
export interface ChoiceData { options: ChoiceOption[] }
export interface ResultData { title: string; sub: string }

// ── plan + care network constants ────────────────────────────────────
export const INSURER = 'Aetna';
export const NETWORK = 'University of Miami Health (UHealth)';

export const MENU: Chip[] = [
  { label: 'Estimate a procedure cost', icon: 'dollar', intent: 'estimate_cost' },
  { label: 'Where’s my deductible?', icon: 'shield', intent: 'deductible' },
  { label: 'Understand / dispute a bill', icon: 'doc', intent: 'dispute_bill' },
  { label: 'Find an in-network UHealth doctor', icon: 'user', intent: 'find_provider' },
  { label: 'Compare facility prices', icon: 'scale', intent: 'compare_price' },
  { label: 'Pick the right plan', icon: 'sliders', intent: 'pick_plan' },
  { label: 'Explain an insurance term', icon: 'book', intent: 'explain_term' },
];

const COSTS: Record<string, CostData> = {
  cost_mri: { name: 'MRI — Lumbar Spine', place: 'UHealth at Coral Gables', cpt: '72148', charge: 1310, allowed: 468, planPays: 0, toDeductible: 468, you: 468, confidence: 94 },
  cost_colon: { name: 'Colonoscopy (screening)', place: 'UHealth Digestive Health, Lennar Medical Center', cpt: '45378', charge: 2890, allowed: 0, planPays: 1020, toDeductible: 0, you: 0, confidence: 97, preventive: true },
  cost_mammo: { name: 'Mammogram (screening)', place: 'Sylvester Comprehensive Cancer Center', cpt: '77067', charge: 430, allowed: 0, planPays: 220, toDeductible: 0, you: 0, confidence: 98, preventive: true },
  cost_ct: { name: 'CT — Abdomen w/ contrast', place: 'UHealth Tower Imaging', cpt: '74160', charge: 2240, allowed: 712, planPays: 0, toDeductible: 690, you: 712, confidence: 91 },
};

const COMPARE_MRI: CompareData = {
  title: 'MRI lumbar · your cost after Aetna · Miami',
  rows: [
    { name: 'UHealth at Coral Gables', miles: 2.1, rating: 4.8, you: 468, save: 842, best: true },
    { name: 'SimonMed Imaging — Miami', miles: 3.4, rating: 4.5, you: 540, save: 770 },
    { name: 'Baptist Health Imaging — Kendall', miles: 5.0, rating: 4.6, you: 695, save: 615 },
    { name: 'UHealth Tower (hospital)', miles: 4.2, rating: 4.7, you: 1310, save: 0 },
  ],
};

const DEDUCTIBLE: DeductibleData = { plan: 'PPO 1000', met: 340, max: 1000, oopMet: 340, oopMax: 4000 };

const PROVIDERS: Record<string, ProviderData> = {
  prov_pc: {
    title: 'Primary care · UHealth in-network · 4 mi',
    rows: [
      { init: 'JL', name: 'Dr. Joaquín Lima', spec: 'Family medicine · UHealth Coral Gables', miles: 1.1, rating: 4.9 },
      { init: 'DK', name: 'Dr. Daniela Cruz', spec: 'Internal medicine · UHealth Kendall', miles: 1.9, rating: 4.6 },
      { init: 'RM', name: 'Dr. Rosa Mejía', spec: 'Primary care · Lennar Medical Center', miles: 2.5, rating: 4.8 },
    ],
  },
  prov_ortho: {
    title: 'Orthopedics · UHealth in-network · 6 mi',
    rows: [
      { init: 'AR', name: 'Dr. Ana Reyes', spec: 'Orthopedic surgery · UHealth Sports Medicine', miles: 1.8, rating: 4.9 },
      { init: 'MC', name: 'Dr. Marcos Castro', spec: 'Sports medicine · Lennar Medical Center', miles: 2.6, rating: 4.7 },
      { init: 'SP', name: 'Dr. Sanjay Patel', spec: 'Orthopedics · UHealth Tower', miles: 3.4, rating: 4.8 },
    ],
  },
  prov_derm: {
    title: 'Dermatology · UHealth in-network · 6 mi',
    rows: [
      { init: 'ET', name: 'Dr. Elena Torres', spec: 'Dermatology · UHealth Coral Gables', miles: 2.1, rating: 4.8 },
      { init: 'BW', name: 'Dr. Brian Wong', spec: 'Medical & surgical derm · UHealth Kendall', miles: 3.0, rating: 4.7 },
    ],
  },
  prov_cardio: {
    title: 'Cardiology · UHealth in-network · 8 mi',
    rows: [
      { init: 'NH', name: 'Dr. Nadia Haddad', spec: 'Cardiology · UHealth Tower', miles: 3.5, rating: 4.9 },
      { init: 'TO', name: 'Dr. Tomás Ortega', spec: 'Interventional cardiology · UHealth', miles: 5.2, rating: 4.7 },
    ],
  },
};

const BILL: BillData = {
  file: 'UHealth_ER_visit_0420.pdf',
  provider: 'UHealth Tower — Emergency Dept',
  lines: 14,
  savings: 1850,
  items: [
    { label: 'ER facility fee (level 4)', amt: 1850, flag: '4× the Medicare fair price ($465)' },
    { label: 'ER facility fee', amt: 1850, flag: 'Duplicate — billed twice' },
    { label: 'CT head, no contrast', amt: 940 },
    { label: 'IV push + hydration', amt: 285 },
  ],
};

const PLANS: PlansData = {
  plans: [
    { name: 'Aetna HDHP + HSA', deductible: '$2,800', network: 'Broad', premium: '$210', year: '$4,700', best: true },
    { name: 'Aetna PPO 1000 (current)', deductible: '$1,000', network: 'Broad PPO', premium: '$420', year: '$5,900' },
    { name: 'Aetna EPO Select', deductible: '$750', network: 'Narrow', premium: '$330', year: '$5,200' },
  ],
};

const TERMS: Record<string, TermData> = {
  term_coins: { term: 'Coinsurance', plain: 'Your share of a covered cost after you’ve met your deductible — usually a percentage. Aetna pays the rest.', example: 'On your PPO it’s 10%. After your deductible, a $468 MRI would cost you about $47.' },
  term_copay: { term: 'Copay', plain: 'A flat fee at the time of a visit (like $30 for a checkup). It doesn’t depend on the total bill.', example: 'Your plan: $30 primary care · $60 specialist · $0 telehealth at UHealth.' },
  term_ded: { term: 'Deductible', plain: 'What you pay out of pocket before your plan starts sharing costs each year.', example: 'You’ve paid $340 of $1,000. $660 to go before Aetna pays 90%.' },
  term_eob: { term: 'EOB (Explanation of Benefits)', plain: 'Not a bill. It shows what the provider charged, what Aetna allowed, and what you may owe.', example: 'If it says “patient responsibility $468,” match that against any UHealth bill before paying a cent.' },
  term_oop: { term: 'Out-of-pocket maximum', plain: 'The most you’ll pay in a year. After you hit it, Aetna covers 100%.', example: 'Yours is $4,000. You’re at $340 — even a hospital stay is capped there.' },
};

const back: Chip = { label: 'Back to menu', icon: 'arrow', intent: 'menu' };

/** All intents the LLM may classify a free-text query into. */
export const INTENTS = [
  'menu', 'estimate_cost', 'cost_mri', 'cost_colon', 'cost_mammo', 'cost_ct',
  'compare_price', 'deductible', 'dispute_bill', 'bill_result', 'draft_dispute',
  'find_provider', 'prov_pc', 'prov_ortho', 'prov_derm', 'prov_cardio',
  'pick_plan', 'explain_term', 'term_coins', 'term_copay', 'term_ded', 'term_eob', 'term_oop',
  'book_done', 'sent', 'logged', 'general',
] as const;
export type Intent = (typeof INTENTS)[number];

/** Keyword fast-path: typed text → intent, before any LLM call. */
export const KEYWORDS: Record<string, string[]> = {
  estimate_cost: ['cost', 'price', 'how much', 'estimate', 'procedure', 'mri', 'scan', 'ct'],
  deductible: ['deductible', 'oop', 'out of pocket', 'out-of-pocket', 'met', 'how much have i'],
  dispute_bill: ['bill', 'dispute', 'charge', 'overcharge', 'eob', 'statement'],
  find_provider: ['provider', 'doctor', 'physician', 'in-network', 'in network', 'find a', 'specialist'],
  compare_price: ['compare', 'cheaper', 'best price', 'facility', 'where'],
  pick_plan: ['plan', 'coverage', 'switch', 'hdhp', 'ppo', 'enroll'],
  explain_term: ['explain', 'what is', 'what’s', 'whats', 'coinsurance', 'copay', 'term', 'mean'],
};

/**
 * The grounded intent router. Mirrors the prototype respond() but with the
 * canvas carrying typed data from the dataset above. The shell renders userEcho
 * + say + chips; the A2UI surface renders canvas.
 */
export function respond(intent: string): Turn {
  switch (intent) {
    case 'menu':
    case 'start':
      return { userEcho: null, say: 'I’m Wefella, your Brainsty shield. I’m independent — no insurer pays me. With your Aetna plan and UHealth network, what should I look into?', canvas: null, chips: MENU.slice() };

    case 'estimate_cost':
      return {
        userEcho: 'Estimate a procedure cost',
        say: 'I price the real number — after Aetna’s negotiated rate and where your deductible stands. Which one?',
        canvas: { type: 'choice', choice: { options: [
          { label: 'MRI / scan', sub: 'most overpriced', icon: 'activity', intent: 'cost_mri' },
          { label: 'Colonoscopy', sub: 'screening', icon: 'activity', intent: 'cost_colon' },
          { label: 'Mammogram', sub: 'screening', icon: 'heart', intent: 'cost_mammo' },
          { label: 'CT scan', sub: 'w/ contrast', icon: 'activity', intent: 'cost_ct' },
        ] } },
        chips: [back],
      };

    case 'cost_mri': case 'cost_colon': case 'cost_mammo': case 'cost_ct': {
      const d = COSTS[intent];
      const say = d.preventive
        ? 'Good news — this is a preventive screening, so Aetna covers it 100%. Your cost is $0. Don’t let UHealth bill you for it.'
        : 'Here’s the honest number. Aetna’s rate cuts the sticker price sharply — but your deductible isn’t met, so this applies to it.';
      return { userEcho: d.name, say, canvas: { type: 'cost', cost: d }, chips: [
        { label: 'Compare nearby prices', icon: 'scale', intent: 'compare_price' },
        { label: 'Find these centers', icon: 'pin', intent: 'find_provider' },
        { label: 'Why this much?', icon: 'book', intent: 'term_coins' },
      ] };
    }

    case 'compare_price':
      return { userEcho: 'Compare facility prices', say: 'Same scan, four Miami options. UHealth Tower (hospital) bills nearly 3× the imaging center for an identical MRI.', canvas: { type: 'compare', compare: COMPARE_MRI }, chips: [
        { label: 'Book the best value', icon: 'check', intent: 'book_done', primary: true },
        { label: 'Check my deductible', icon: 'shield', intent: 'deductible' },
        { label: 'How accurate is this?', icon: 'spark', intent: 'term_eob' },
      ] };

    case 'deductible':
      return { userEcho: 'Where’s my deductible?', say: 'You’re 34% of the way there. Here’s the full picture — and what’s left before Aetna picks up more.', canvas: { type: 'deductible', deductible: DEDUCTIBLE }, chips: [
        { label: 'What counts toward it?', icon: 'book', intent: 'term_ded' },
        { label: 'Estimate a procedure', icon: 'dollar', intent: 'estimate_cost' },
      ] };

    case 'dispute_bill':
      return { userEcho: 'Understand / dispute a bill', say: 'Send me the bill — PDF or a photo — and I’ll line-item it against fair prices and your EOB.', canvas: { type: 'choice', choice: { options: [
        { label: 'Scan a sample ER bill', sub: 'try it now', icon: 'doc', intent: 'bill_result' },
        { label: 'Upload my own', sub: 'PDF or photo', icon: 'clip', intent: 'bill_result' },
      ] } }, chips: [back] };

    case 'bill_result':
      return { userEcho: 'UHealth_ER_visit_0420.pdf', sayDelay: 1200, say: 'I found a likely overcharge. One line is billed 4× the Medicare fair price — and there’s a duplicate facility fee.', canvas: { type: 'bill', bill: BILL }, chips: [
        { label: 'Draft a dispute letter', icon: 'doc', intent: 'draft_dispute', primary: true },
        { label: 'Explain these codes', icon: 'book', intent: 'term_eob' },
        { label: 'Log to my Shield', icon: 'shield', intent: 'logged' },
      ] };

    case 'draft_dispute':
      return { userEcho: 'Draft a dispute letter', say: 'Done. I drafted an itemized dispute citing the fair-price benchmarks for both lines. Review, then send.', canvas: { type: 'result', result: { title: 'Dispute letter ready', sub: '1 page · cites 2 issues · $1,850 disputed' } }, chips: [
        { label: 'Send to billing dept', icon: 'send', intent: 'sent', primary: true },
        { label: 'Edit the letter', icon: 'doc', intent: 'logged' },
      ] };

    case 'find_provider':
      return { userEcho: 'Find an in-network UHealth doctor', say: 'I’ll only show UHealth doctors Aetna covers in-network — so you never get a surprise out-of-network bill. What kind?', canvas: { type: 'choice', choice: { options: [
        { label: 'Primary care', sub: '$30 copay', icon: 'user', intent: 'prov_pc' },
        { label: 'Orthopedics', sub: '$60 specialist', icon: 'activity', intent: 'prov_ortho' },
        { label: 'Dermatology', sub: '$60 specialist', icon: 'heart', intent: 'prov_derm' },
        { label: 'Cardiology', sub: '$60 specialist', icon: 'heart', intent: 'prov_cardio' },
      ] } }, chips: [back] };

    case 'prov_pc': case 'prov_ortho': case 'prov_derm': case 'prov_cardio': {
      const d = PROVIDERS[intent];
      return { userEcho: d.title.split(' ·')[0] + ' near me', say: 'All UHealth, in-network and accepting your plan, sorted by rating. Book and I’ll confirm coverage before the visit.', canvas: { type: 'providers', providers: d }, chips: [
        { label: 'Estimate a visit cost', icon: 'dollar', intent: 'estimate_cost' },
        { label: 'Check my deductible', icon: 'shield', intent: 'deductible' },
      ] };
    }

    case 'pick_plan':
      return { userEcho: 'Pick the right plan', say: 'Based on last year — 1 ER visit, 1 MRI, 4 office visits at UHealth — here’s what each Aetna plan would actually have cost you.', canvas: { type: 'plans', plans: PLANS }, chips: [
        { label: 'Why this pick?', icon: 'spark', intent: 'term_oop' },
        { label: 'Compare to current', icon: 'scale', intent: 'logged' },
      ] };

    case 'explain_term':
      return { userEcho: 'Explain an insurance term', say: 'Which one’s tripping you up? I’ll keep it plain, with how it applies to *your* Aetna plan.', canvas: { type: 'choice', choice: { options: [
        { label: 'Coinsurance', icon: 'book', intent: 'term_coins' },
        { label: 'Deductible', icon: 'shield', intent: 'term_ded' },
        { label: 'EOB', icon: 'doc', intent: 'term_eob' },
        { label: 'Out-of-pocket max', icon: 'dollar', intent: 'term_oop' },
      ] } }, chips: [back] };

    case 'term_coins': case 'term_copay': case 'term_ded': case 'term_eob': case 'term_oop': {
      const d = TERMS[intent];
      const more: Record<string, string> = { term_coins: 'term_copay', term_copay: 'term_coins', term_ded: 'term_oop', term_eob: 'term_ded', term_oop: 'term_ded' };
      const m = more[intent];
      return { userEcho: 'What’s ' + d.term.split(' (')[0].toLowerCase() + '?', say: 'Here’s the plain-English version 👇', canvas: { type: 'term', term: d }, chips: [
        { label: 'And ' + TERMS[m].term.split(' (')[0].toLowerCase() + '?', icon: 'book', intent: m },
        { label: 'Estimate a cost', icon: 'dollar', intent: 'estimate_cost' },
      ] };
    }

    case 'book_done':
      return { userEcho: 'Book the best value', say: 'Booked. I’ll confirm in-network coverage and send the prep instructions.', canvas: { type: 'result', result: { title: 'UHealth at Coral Gables — requested', sub: 'Tue 9:40 AM · est. $468 · in-network confirmed' } }, chips: [{ label: 'Add to calendar', icon: 'calendar', intent: 'logged' }, back] };

    case 'sent':
      return { userEcho: 'Send to billing dept', say: 'Sent. I’ll track the response and nudge them at day 14 if they go quiet.', canvas: { type: 'result', result: { title: 'Dispute submitted', sub: 'UHealth Tower billing · tracking #BR-4471 · $1,850' } }, chips: [back] };

    case 'logged':
      return { userEcho: null, say: 'Done — logged to your Shield. Anything else?', canvas: null, chips: MENU.slice(0, 4).concat([back]) };

    // Off-topic / not about this Aetna + UHealth plan: the LLM answers briefly
    // (<=30-word gist, set in ask()); no card, menu stays available.
    case 'general':
      return { userEcho: null, say: 'Here’s the short version.', canvas: null, chips: MENU.slice(0, 4).concat([back]) };

    default:
      return { userEcho: null, say: 'I can dig into that. Where to?', canvas: null, chips: MENU.slice() };
  }
}

/** The full dataset object, used by the Firestore seed script. */
export const MVP_DATASET = { insurer: INSURER, network: NETWORK, MENU, COSTS, COMPARE_MRI, DEDUCTIBLE, PROVIDERS, BILL, PLANS, TERMS };
