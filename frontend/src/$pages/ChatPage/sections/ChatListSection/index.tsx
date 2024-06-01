import React from "react";
import { useTranslations } from "next-intl";
import { LoadingIndicator, ErrorBox } from "@/components/$statusTools";
import { ChatRoomItem } from "@/components/ChatRoomItem";
import { ListView } from "@/ui/tools/ListView";
import { Col, Box, Center, Gap } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { ChatOlIcon } from "@/ui/icons";
// logic
import { useEffect, MouseEvent } from "react";
import { useMe } from "@/stores/UserStore";
import { useChatRoomsStore, getListChatRoomOption } from "@/stores/ChatRoomsStore";
import type { ChatRoomT } from "@/types";

type ChatListSectionProps = {
  onFocusRoom: (chatRoom: ChatRoomT) => void;
};

export function ChatListSection({
  onFocusRoom,
}: ChatListSectionProps): JSX.Element {
  const t = useTranslations("pages.ChatPage.ChatListSection");

  const { data: chatRooms$, actions: chatRoomsAct } = useChatRoomsStore();
  const me = useMe();

  const listOpt = getListChatRoomOption({ userId: me?.id });

  useEffect(() => {
    chatRoomsAct.load(listOpt);
  }, [me?.id]);

  function handleErrorRetry(): void {
    chatRoomsAct.load(listOpt, { force: true });
  }

  function handleLoaderDetect(): void {
    chatRoomsAct.refill();
  }

  function handleChatRoomClick(e: MouseEvent<HTMLElement>, chatRoom: ChatRoomT): void {
    onFocusRoom(chatRoom);
  }


  const { status, data: chatRooms } = chatRooms$;

  if (status == "init") {
    return <Box color='vague.main'>...</Box>;
  }
  if (status == "loading") {
    return (
      <Center width='100%'>
        <LoadingIndicator />
      </Center>
    );
  }
  if (status == "error") {
    return (
      <Center width='100%'>
        <ErrorBox onRetry={handleErrorRetry} />;
      </Center>
    );
  }

  if (chatRooms.length === 0) {
    return (
      <Col
        mt={1}
        alignItems='center'
        width='100%'
        height='100%'
      >
        <Txt variant='h6'>{t("noChat")}</Txt>
        <Gap y={2} />
        <ChatOlIcon sx={{ fontSize: 40, color: "vague.light" }} />
        <Gap y={1} />
        <Box maxWidth={270}>
          <Txt
            color='vague.light'
            fontWeight={500}
            textAlign='center'
          >
            {t("clickToStartChat")}
          </Txt>
        </Box>
      </Col>
    );
  }

  return (
    <Box
      width='100%'
      height='100%'
      position='relative'
      flex={1}
      display='flex'
      sx={{
        overflowY: "scroll",
      }}
    >
      <Col width='100%'>
        <ListView
          data={chatRooms}
          renderItem={(item): JSX.Element => {
            return (
              <Box key={item.id}>
                <ChatRoomItem
                  chatRoom={item}
                  onClick={(e): void => handleChatRoomClick(e, item)}
                />
              </Box>
            );
          }}
          onLoaderDetect={handleLoaderDetect}
        />
      </Col>
    </Box>
  );
}
