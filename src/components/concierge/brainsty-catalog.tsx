"use client";

/**
 * The Brainsty A2UI catalog: the official `basicCatalog` (Column, Row, Text,
 * Button, Card, Divider, ...) extended with a `LucideIcon` component so that
 * agent-generated widgets use the SAME lucide-react icon set the rest of the
 * site uses (requirement R4). The catalog id must match
 * BRAINSTY_CATALOG_ID, which the server compiler stamps into every createSurface.
 */
import { z } from "zod";
import * as Lucide from "lucide-react";
import type { LucideIcon as LucideIconType } from "lucide-react";
import { Catalog, CommonSchemas } from "@a2ui/web_core/v0_9";
import { basicCatalog, createComponentImplementation } from "@a2ui/react/v0_9";
import { BRAINSTY_CATALOG_ID } from "@/ai/a2ui/catalog";

const LucideIconApi = {
  name: "LucideIcon",
  schema: z.object({
    name: CommonSchemas.DynamicString,
  }),
};

const LucideIcon = createComponentImplementation(LucideIconApi, ({ props }) => {
  const key = (props.name as string) || "Sparkles";
  const Icon =
    ((Lucide as unknown as Record<string, LucideIconType>)[key]) ?? Lucide.Sparkles;
  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50/80 text-primary border border-blue-100/60">
      <Icon className="h-4 w-4" />
    </span>
  );
});

export const brainstyCatalog = new Catalog(BRAINSTY_CATALOG_ID, [
  ...basicCatalog.components.values(),
  LucideIcon,
]);
