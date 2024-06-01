
export function PushNotiSection() {
  return <div />;
}

// // view
// import React, { Fragment, ChangeEvent, MouseEvent } from "react";
// import { LoadingIndicator, ErrorBox } from "@/components/$statusTools";
// import { Box, Button, Switch, IconButton } from "@mui/material";
// import { Row, Col, Gap, Expand } from "@/ui/layouts";
// import { Txt } from "@/ui/texts";
// import { CloseIcon } from "@/ui/icons";
// import { Tooltip } from "@/ui/tools/Tooltip";
// import { simplifyUserAgent } from "./utils";

// // logic
// import { useEffect, useState } from "react";
// import { useListData } from "@/hooks/ListData";
// import { useSnackbar } from "@/hooks/Snackbar";
// import { useAlertDialog } from "@/hooks/dialogs/ConfirmDialog";
// // import { getFcmToken } from "@/system/firebase";
// // import { PushNotiS } from "@/services";

// export function PushNotiSection(): JSX.Element {
//   const { data: pushNotis$, actions: pushNotisAct } = useListData({
//     listData: PushNotiS.list,
//   });
//   const { showSnackbar } = useSnackbar();
//   const [currentFcmToken, setCurrentFcmToken] = useState<undefined | null | string>();

//   useEffect(() => {
//     pushNotisAct.init({});
//   }, []);

//   useEffect(() => {
//     const _init = async (): Promise<void> => {
//       const fcmToken = await getFcmToken();
//       setCurrentFcmToken(fcmToken);
//     };
//     _init();
//   }, []);

//   async function handleErrorRetry(): Promise<void> {
//     pushNotisAct.init({}, { force: true });
//   }

//   function handlePushNotiUpdated(updated: MPushNotiT): void {
//     pushNotisAct.replaceItem(updated);
//   }

//   function handlePushNotiDeleted(deleted: MPushNotiT): void {
//     pushNotisAct.filterItems((item) => item.id !== deleted.id);
//   }

//   async function handleCurrentDeviceRegister(): Promise<void> {
//     try {
//       const fcmToken = await getFcmToken();
//       setCurrentFcmToken(fcmToken);
//       if (!fcmToken) {
//         showSnackbar("info", "브라우저 알림을 허용해주세요.");
//         return;
//       }
//       await PushNotiS.create({ token: fcmToken });
//       pushNotisAct.init({}, { force: true });
//       showSnackbar("success", "현재 기기로 푸시알림 수신을 등록했어요.");
//     } catch (e) {
//       showSnackbar("error", "현재 기기 등록에 실패했어요." + e);
//     }
//   }

//   const { status, data: pushNotis } = pushNotis$;

//   if (status == "init" || status == "loading") {
//     return <LoadingIndicator width='100%' />;
//   }

//   if (status == "error") {
//     return <ErrorBox onRetry={handleErrorRetry} />;
//   }

//   return (
//     <>
//       {pushNotis.map((pushNoti) => {
//         return (
//           <Fragment key={pushNoti.id}>
//             <PushNotiItem
//               pushNoti={pushNoti}
//               currentFcmToken={currentFcmToken ?? null}
//               onUpdated={handlePushNotiUpdated}
//               onDeleted={handlePushNotiDeleted}
//             />
//           </Fragment>
//         );
//       })}
//       {pushNotis.length == 0 && (
//         <Col alignItems='center'>
//           <Txt color='vague.main'>등록된 푸시 알림 디바이스가 없어요.</Txt>
//           <Gap y={1} />
//         </Col>
//       )}
//       {!pushNotis.some((item) => item.token == currentFcmToken) && (
//         <Col
//           maxWidth={350}
//           margin='auto'
//           alignItems='center'
//         >
//           <Button
//             variant='outlined'
//             onClick={handleCurrentDeviceRegister}
//           >
//             현재 기기 푸시알림 등록
//           </Button>
//         </Col>
//       )}
//     </>
//   );
// }

// type PushNotiItemProps = {
//   pushNoti: PushNotiT;
//   currentFcmToken: string | null;
//   onUpdated: (newVal: PushNotiT) => void;
//   onDeleted: (newVal: PushNotiT) => void;
// };

// function PushNotiItem(props: PushNotiItemProps): JSX.Element {
//   const { pushNoti, currentFcmToken, onUpdated, onDeleted } = props;

//   const { showSnackbar } = useSnackbar();
//   const { showAlertDialog } = useAlertDialog();

//   const [isExpand, setIsExpand] = useState<boolean>(false);

//   function handleExpandToggle(): void {
//     setIsExpand(!isExpand);
//   }

//   async function handleIsAllowChange(e: ChangeEvent<HTMLInputElement>): Promise<void> {
//     const checked = e.target.checked;
//     try {
//       const updated = await PushNotiS.update(pushNoti.id, {
//         is_allow: checked,
//       });
//       onUpdated(updated);
//       showSnackbar("success", "변경되었어요.");
//     } catch (e) {
//       console.warn(e);
//       showSnackbar("success", "");
//     }
//   }

//   async function handleDeleteClick(e: MouseEvent<HTMLButtonElement>): Promise<void> {
//     e.preventDefault();
//     const isOk = await showAlertDialog({
//       title: "푸시알림 기기 삭제",
//       body: "해당 기기를 등록된 푸시알림 수신 리스트에서 삭제하시겠어요?",
//       useCancel: true,
//       useOk: true,
//     });
//     if (!isOk) {
//       return;
//     }
//     try {
//       const deleted = await PushNotiS.remove(pushNoti.id);
//       onDeleted(deleted);
//     } catch (e) {
//       console.warn(e);
//     }
//   }

//   return (
//     <Row
//       maxWidth={350}
//       margin='auto'
//     >
//       {isExpand ? (
//         <Txt variant='body3'>{pushNoti.user_agent}</Txt>
//       ) : (
//         <Txt>{simplifyUserAgent(pushNoti.user_agent ?? "")}</Txt>
//       )}
//       {currentFcmToken === pushNoti.token ? (
//         <Box px={1}>
//           <Txt
//             color='#ff0000'
//             variant='body3'
//           >
//             현재 기기
//           </Txt>
//         </Box>
//       ) : (
//         <Button
//           size='small'
//           onClick={handleExpandToggle}
//         >
//           {isExpand ? "접기.." : "상세 정보.."}
//         </Button>
//       )}
//       <Expand />

//       <Switch
//         checked={pushNoti.is_allow}
//         onChange={handleIsAllowChange}
//       />
//       <Tooltip title='삭제'>
//         <IconButton onClick={handleDeleteClick}>
//           <CloseIcon />
//         </IconButton>
//       </Tooltip>
//     </Row>
//   );
// }
