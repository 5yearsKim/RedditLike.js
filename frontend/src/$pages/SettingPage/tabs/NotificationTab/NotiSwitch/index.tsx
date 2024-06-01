import { ChangeEvent } from "react";
import { Row, Gap, Expand } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { HelperTooltip } from "@/ui/tools/HelperTooltip";
import { Switch } from "@mui/material";


type NotiSwitchProps = {
  label: string;
  checked: boolean;
  helper?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => any;
};

export function NotiSwitch({
  label,
  checked,
  helper,
  onChange,
}: NotiSwitchProps): JSX.Element {

  return (
    <Row
      width='100%'
      maxWidth='300px'
      margin='auto'
    >
      <Txt variant='subtitle2'>{label}</Txt>

      {helper && (
        <>
          <Gap x={1} />
          <HelperTooltip tip={helper} />
        </>
      )}

      <Expand />

      <Switch
        checked={checked}
        onChange={onChange}
      />
    </Row>
  );
}
