/**
 * Assembles a grounded CanvasData payload into an A2UI v0.9 message array that
 * the concierge catalog renders. The root component name == canvas.type, and the
 * literal payload is passed as the `d` prop. Framework-agnostic (server + client).
 */
import type { CanvasData } from './dataset';
import { CONCIERGE_CATALOG_ID, CONCIERGE_SURFACE_ID } from './constants';

export function assembleCanvas(canvas: CanvasData | null | undefined): unknown[] {
  if (!canvas) return [];
  const payload = (canvas as unknown as Record<string, unknown>)[canvas.type];
  const node: Record<string, unknown> = { id: 'root', component: canvas.type, d: payload };
  if (canvas.type === 'compare' || canvas.type === 'providers') node.pickIntent = 'book_done';
  else if (canvas.type === 'plans') node.pickIntent = 'logged';
  return [
    { version: 'v0.9', createSurface: { surfaceId: CONCIERGE_SURFACE_ID, catalogId: CONCIERGE_CATALOG_ID } },
    { version: 'v0.9', updateComponents: { surfaceId: CONCIERGE_SURFACE_ID, components: [node] } },
  ];
}
