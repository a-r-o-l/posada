import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import React from "react";

function ServiceAccordion({
  title,
  content,
  link,
  linkTitle,
}: {
  title: string;
  content: React.ReactNode;
  link: string;
  linkTitle: string;
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="cursor-pointer hover:no-underline">
          <p className="text-xl font-bold">{title}</p>
        </AccordionTrigger>
        <AccordionContent>
          <div className="text-base">
            <div className="flex items-center gap-2">
              <p className="font-black">Web: </p>
              <Link
                href={link}
                className="text-blue-600 hover:text-blue-800 underline hover:no-underline"
              >
                {linkTitle}
              </Link>
            </div>
            {content}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ServiceAccordion;
