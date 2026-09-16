"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return <AccordionPrimitive.Root data-slot="accordion" className={cn("ui-accordion", className)} {...props} />;
}

export function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("ui-accordion__item", className)} {...props} />;
}

export function AccordionTrigger({ children, className, ...props }: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="ui-accordion__heading">
      <AccordionPrimitive.Trigger data-slot="accordion-trigger" className={cn("ui-accordion__trigger", className)} {...props}>
        {children}
        <Plus className="ui-accordion__indicator" size={20} aria-hidden="true" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ children, className, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel data-slot="accordion-content" className="ui-accordion__panel" {...props}>
      <div className={cn("ui-accordion__content", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}
