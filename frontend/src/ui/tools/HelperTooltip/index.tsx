import React from "react";
import { HelpOlIcon } from "@/ui/icons";
import { Tooltip } from "@/ui/tools/Tooltip";

type HelperTooltipProps = {
  tip: string;
  fontSize?: number;
};

export function HelperTooltip(props: HelperTooltipProps): JSX.Element {
  const { tip, fontSize } = props;
  return (
    <Tooltip
      title={tip}
      arrow
      placement='top'
    >
      <HelpOlIcon
        fontSize='small'
        sx={{ color: "vague.light", cursor: "pointer", fontSize: fontSize }}
      />
    </Tooltip>
  );
}
