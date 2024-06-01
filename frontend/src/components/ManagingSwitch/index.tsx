// import React, {ChangeEvent} from "react";
// import { FormControlLabel, Switch } from "@mui/material";
// import { Txt } from "@/ui/texts";
// import { useValue } from "@/stores/hook";
// import { managingState, useManagingActions } from "@/stores/ManagingStore";

// export type ManagingSwitchProps = {
//   boardId: idT;
//   size?: "medium" | "small";
// };

// // eslint-disable-next-line
// export function useLogic(props: ManagingSwitchProps) {
//   const { boardId, size } = props;

//   const managing$ = useValue(managingState);
//   const managingAct = useManagingActions();

//   const isManagingMode = managing$.status === "loaded" && boardId === managing$.board.id;

//   function handleSwitchChange(e: ChangeEvent<HTMLInputElement>): void {
//     const checked = e.target.checked;
//     if (checked) {
//       managingAct.init({ boardId });
//     } else {
//       managingAct.reset();
//     }
//   }

//   return {
//     isManagingMode,
//     size,
//     handleSwitchChange,
//   };
// }

// export function ManagingSwitch(props: ManagingSwitchProps): JSX.Element {
//   const { isManagingMode, handleSwitchChange } = useLogic(props);

//   return (
//     <FormControlLabel
//       control={
//         <Switch
//           checked={isManagingMode}
//           onChange={handleSwitchChange}
//         />
//       }
//       label={
//         <Txt
//           variant='body2'
//           fontWeight={500}
//         >
//           관리자 모드
//         </Txt>
//       }
//     />
//   );
// }
