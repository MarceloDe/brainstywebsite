"use client";

/**
 * Renders a grounded canvas (assembled A2UI v0.9 messages) through the OFFICIAL
 * @a2ui/react renderer using the Brainsty concierge catalog. Interactions inside
 * a block dispatch a `select` action whose value (an intent) is routed to onAction.
 */
import { useEffect, useMemo, useRef } from 'react';
import { MessageProcessor } from '@a2ui/web_core/v0_9';
import { A2uiSurface } from '@a2ui/react/v0_9';
import { injectStyles } from '@a2ui/react/styles';
import { conciergeCatalog } from './catalog';

export function ConciergeCanvas({
  messages,
  onAction,
}: {
  messages: unknown[];
  onAction: (intent: string) => void;
}) {
  const actionRef = useRef(onAction);
  actionRef.current = onAction;

  useEffect(() => {
    injectStyles();
  }, []);

  const surfaces = useMemo(() => {
    if (!messages || messages.length === 0) return [];
    try {
      const processor = new MessageProcessor([conciergeCatalog], (action) => {
        const ctx = action as { context?: Record<string, unknown>; name?: string };
        const value = ctx?.context?.value ?? ctx?.name ?? '';
        if (value) actionRef.current(String(value));
      });
      processor.processMessages(messages as never);
      return Array.from(processor.model.surfacesMap.values());
    } catch (err) {
      console.error('Concierge A2UI render failed:', err);
      return [];
    }
  }, [messages]);

  if (surfaces.length === 0) return null;
  return (
    <>
      {surfaces.map((s) => (
        <A2uiSurface key={s.id} surface={s} />
      ))}
    </>
  );
}
