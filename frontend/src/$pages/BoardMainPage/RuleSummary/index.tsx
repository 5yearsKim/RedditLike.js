import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { UnfoldIcon } from "@/ui/icons";
import { Row, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import type { BoardRuleT } from "@/types";

type RuleSummaryProps = {
  rules: BoardRuleT[];
};


export function RuleSummary({
  rules,
}: RuleSummaryProps): JSX.Element {

  return (
    <div>
      {rules.map((rule, idx) => {
        return (
          <Accordion
            square
            // disableGutters
            key={rule.id}
            sx={{ padding: 0 }}
          >
            <AccordionSummary expandIcon={<UnfoldIcon />}>
              <Row>
                <Txt
                  variant='body2'
                  fontWeight={700}
                >
                  {idx + 1}.{" "}
                </Txt>
                <Gap x={1} />
                <Txt
                  variant='body2'
                  fontWeight={500}
                >
                  {" "}
                  {rule.title}
                </Txt>
              </Row>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 1 }}>
              <Txt
                variant='body2'
                fontWeight={500}
              >
                {rule.description}
              </Txt>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
