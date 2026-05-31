"use client";

/**
 * Renders an A2UI v0.9 message array (produced by the concierge flow) using the
 * official @a2ui/react renderer. Any clickable action inside the surface is
 * routed back to `onAction`, which the chat uses to send the next message.
 *
 * A fresh MessageProcessor is built whenever the message array changes: each
 * assistant turn ships a self-contained createSurface + updateComponents, so a
 * new processor cleanly replaces the previous surface.
 */
import { useEffect, useMemo, useRef } from "react";
import { MessageProcessor } from "@a2ui/web_core/v0_9";
import { A2uiSurface } from "@a2ui/react/v0_9";
import { injectStyles } from "@a2ui/react/styles";
import { brainstyCatalog } from "./brainsty-catalog";

interface A2uiHostProps {
  messages: unknown[];
  onAction: (value: string) => void;
}

export default function A2uiHost({ messages, onAction }: A2uiHostProps) {
  // Keep the latest handler without forcing a processor rebuild.
  const actionRef = useRef(onAction);
  actionRef.current = onAction;

  useEffect(() => {
    injectStyles();
  }, []);

  const surfaces = useMemo(() => {
    if (!messages || messages.length === 0) return [];
    try {
      const processor = new MessageProcessor([brainstyCatalog], (action) => {
        const ctx = (action as { context?: Record<string, unknown>; name?: string });
        const value = ctx?.context?.value ?? ctx?.name ?? "";
        actionRef.current(String(value));
      });
      processor.processMessages(messages as never);
      return Array.from(processor.model.surfacesMap.values());
    } catch (err) {
      console.error("A2UI render failed:", err);
      return [];
    }
  }, [messages]);

  if (surfaces.length === 0) return null;

  return (
    <div className="a2ui-surface flex flex-col gap-2">
      {surfaces.map((surface) => (
        <A2uiSurface key={surface.id} surface={surface} />
      ))}
    </div>
  );
}
