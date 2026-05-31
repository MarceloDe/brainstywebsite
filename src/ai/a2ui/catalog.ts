/**
 * Shared constants for the Brainsty A2UI catalog.
 *
 * This file is intentionally framework-agnostic (no React, no Genkit) so it can
 * be imported by both the server-side compiler (`compiler.ts`, runs in the
 * Genkit flow) and the client renderer (`a2ui-host.tsx`). The id here MUST match
 * the id used when constructing the client `Catalog`, otherwise the surface the
 * agent creates will reference a catalog the renderer does not know about.
 */
export const BRAINSTY_CATALOG_ID = 'brainsty-v1';

/** The single action name every clickable A2UI widget emits. */
export const A2UI_SELECT_ACTION = 'select';

/** The default surface id the concierge renders into. */
export const CONCIERGE_SURFACE_ID = 'concierge';
