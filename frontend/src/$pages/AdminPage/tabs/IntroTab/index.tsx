"use client";

import React, { ChangeEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Divider, IconButton, Switch } from "@mui/material";
import { Container, Gap, Row } from "@/ui/layouts";
import { Txt } from "@/ui/texts";
import { EditIcon } from "@/ui/icons";
import { EditableTextField } from "@/ui/tools/EditableTextField";
import { HelperTooltip } from "@/ui/tools/HelperTooltip";
import { GroupProtectionSelector } from "@/components/GroupProtectionSelector";
import { EditableAvatar } from "@/ui/tools/EditableAvatar";
import { Avatar } from "@/ui/tools/Avatar";
import { EditableThemeColor } from "./EditableThemeColor";
import { GroupKeyCheckDialog } from "./GroupKeyCheckDialog";
// logic
import { useGroup, useGroupActions } from "@/stores/GroupStore";
import * as GroupApi from "@/apis/groups";
import { buildImgUrl, uploadToS3 } from "@/utils/media";
import { maxLenValidator } from "@/utils/validator";
import { useSnackbar } from "@/hooks/Snackbar";
import { useImageCropper } from "@/hooks/dialogs/ImageCropperDialog";
import { FRONT_URL_SUFFIX } from "@/config";
import { GroupProtectionT } from "@/types";


export function IntroTab(): JSX.Element {
  const t = useTranslations("pages.AdminPage.IntroTab");

  const group = useGroup();
  const groupAct = useGroupActions();
  const [keyEditorOpen, setKeyEditorOpen] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const { showImageCropper } = useImageCropper();

  async function handleNameUpdate(newVal: string): Promise<void> {
    try {
      const updated = await GroupApi.update(group.id, { name: newVal });
      groupAct.patchData({ group: updated });
      enqueueSnackbar(t("nameUpdateSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("nameUpdateFailed"), { variant: "error" });
    }
  }

  async function handleAvatarSelect(imgFile: File): Promise<void> {
    const cropped = await showImageCropper({
      src: URL.createObjectURL(imgFile),
      aspect: 1,
      cropShape: "rect",
    });
    if (cropped == null) {
      return;
    }
    try {
      const croppedImgFile = cropped.imgFile;
      const { putUrl, key } = await GroupApi.getAvatarPresignedUrl(group.id, croppedImgFile.type);
      await uploadToS3(putUrl, croppedImgFile);
      const updated = await GroupApi.update(group.id, { avatar_path: key });
      groupAct.patchData({ group: updated });
      enqueueSnackbar(t("logoUpdateSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("logoUpdateFailed"), { variant: "error" });
    }
  }

  async function handleAvatarRemove(): Promise<void> {
    try {
      const updated = await GroupApi.update(group.id, { avatar_path: null });
      groupAct.patchData({ group: updated });
    } catch (e) {
      console.warn(e);
    }
  }

  async function handleShortNameUpdate(newVal: string): Promise<void> {
    try {
      const updated = await GroupApi.update(group.id, { short_name: newVal == "" ? null : newVal });
      groupAct.patchData({ group: updated });
      enqueueSnackbar(t("shortNameUpdateSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("shortNameUpdateFailed"), { variant: "error" });
    }
  }

  async function handleDescriptionUpdate(newVal: string): Promise<void> {
    try {
      const updated = await GroupApi.update(group.id, { description: newVal == "" ? null : newVal });
      groupAct.patchData({ group: updated });
      enqueueSnackbar(t("descriptionUpdateSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("descriptionUpdateFailed"), { variant: "error" });
    }
  }

  async function handleKeyEditorUpdate(key: string): Promise<void> {
    try {
      const updated = await GroupApi.update(group.id, { key });
      groupAct.patchData({ group: updated });
      enqueueSnackbar(t("domainUpdateSuccess"), { variant: "success" });
      setKeyEditorOpen(false);
    } catch (e: any) {
      if (e.response.data.code == "ALREADY_EXIST") {
        enqueueSnackbar(t("domainAlreadyExist"), { variant: "error" });
      } else {
        console.warn(e);
        enqueueSnackbar(t("domainUpdateFailed"), { variant: "error" });
      }
    }
  }

  async function handleThemeColorUpdate(themeColor: string | null): Promise<void> {
    try {
      const updated = await GroupApi.update(group.id, { theme_color: themeColor });
      groupAct.patchData({ group: updated });
      enqueueSnackbar(t("themeColorUpdateSuccess"), { variant: "success" });
    } catch (e) {
      enqueueSnackbar(t("themeColorUpdateFailed"), { variant: "error" });
    }
  }

  async function handleProtectionUpdate(newVal: GroupProtectionT): Promise<void> {
    try {
      const updated = await GroupApi.update(group.id, { protection: newVal });
      groupAct.patchData({ group: updated });
      enqueueSnackbar(t("protectionUpdateSuccess"), { variant: "success" });
      setKeyEditorOpen(false);
    } catch (e) {
      enqueueSnackbar(t("protectionUpdateFailed"), { variant: "error" });
    }
  }

  async function handleAllowCreateBoardUpdate(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const checked = e.target.checked;
    try {
      const updated = await GroupApi.update(group.id, { allow_create_board: checked });
      groupAct.patchData({ group: updated });
      if (checked) {
        enqueueSnackbar(t("allowedUserCreateBoard"), { variant: "success" });
      } else {
        enqueueSnackbar(t("disallowedUserCreateBoard"), { variant: "info" });
      }
    } catch (e) {
      enqueueSnackbar(t("userCreateBoardUpdateFailed"), { variant: "error" });
    }
  }

  return (
    <Container rtlP>

      <Txt variant="h6">{t("groupSetting")}</Txt>
      <Gap y={1}/>

      <Divider/>

      <Gap y={2}/>

      <Row>
        <Txt variant='body1' fontWeight={700}>{t("groupLogo")}</Txt>
      </Row>

      <Gap y={1}/>

      <EditableAvatar
        src={group.avatar_path ? buildImgUrl(null, group.avatar_path, { size: "xs" }) : undefined}
        showCropper={false}
        onImageRemove={handleAvatarRemove}
        onImageSelect={handleAvatarSelect}
        buttonSize='30px'
        renderAvatar={(src) => {
          return (
            <Avatar
              src={src}
              size={60}
              rseed={group.id}
              letter={group.name.trim()[0]}
              variant="rounded"
            />
          );
        }}
      />

      <Gap y={4}/>

      <Row>
        <Txt variant='body1' fontWeight={700} >{t("groupName")}</Txt>
      </Row>

      <Gap y={1}/>

      <EditableTextField
        value={group.name}
        actionLoc="right"
        onUpdate={handleNameUpdate}
        txtProps={{
          variant: "body1",
          fontWeight: 500,
        }}
      />

      <Gap y={4}/>

      <Row>
        <Txt variant="body1" fontWeight={700}>{t("groupShortName")}</Txt>
        <Gap x={1}/>
        <HelperTooltip
          tip={t("groupShortNameHelper")}
        />
      </Row>

      <Gap y={1}/>

      <EditableTextField
        value={group.short_name ?? ""}
        actionLoc="right"
        onUpdate={handleShortNameUpdate}
        renderText={(val, handleEditClick) => (
          <Row flexWrap='wrap'>
            {val == "" ? (
              <Txt variant='body1' fontWeight={500} color='vague.main'>({group.name})</Txt>
            ) : (
              <Txt variant='body1' fontWeight={500}>{val}</Txt>
            )}
            <IconButton onClick={(e): void => handleEditClick(e as any)}>
              <EditIcon />
            </IconButton>
          </Row>
        )}
      />

      <Gap y={4}/>

      <Row>
        <Txt variant="body1" fontWeight={700}>{t("groupDescription")}</Txt>
        {/* <Gap x={1}/>
        <HelperTooltip
          tip="짧은 그룹 이름은 로고 대신에 표시돼요. 비워두면 그룹 이름으로 대체돼요."
        /> */}
      </Row>

      <Gap y={1}/>

      <EditableTextField
        value={group.description ?? ""}
        variant='standard'
        actionLoc="bottom"
        onUpdate={handleDescriptionUpdate}
        validators={[maxLenValidator(200)]}
        renderText={(val, handleEditClick) => (
          <Row flexWrap='wrap'>
            {val == "" ? (
              <Txt variant='body1' fontWeight={500} color='vague.main'>({t("noDescription")})</Txt>
            ) : (
              <Txt variant='body1' fontWeight={500}>{val}</Txt>
            )}
            <IconButton onClick={(e): void => handleEditClick(e as any)}>
              <EditIcon />
            </IconButton>
          </Row>
        )}
      />

      <Gap y={4}/>

      <Txt variant="body1" fontWeight={700}>{t("domain")}</Txt>
      <Gap y={1}/>
      <Row>
        <Txt variant="body2" fontWeight={500}>{group.key}.{FRONT_URL_SUFFIX}</Txt>
        <Gap x={1}/>
        <IconButton onClick={() => setKeyEditorOpen(true)}>
          <EditIcon/>
        </IconButton>
      </Row>

      <Gap y={4}/>


      <Txt variant="body1" fontWeight={700}>{t("themeColor")}</Txt>
      <Gap y={1}/>
      <EditableThemeColor
        themeColor={group.theme_color ?? undefined}
        onUpdateColor={handleThemeColorUpdate}
      />

      <Gap y={4}/>

      <Txt variant="body1" fontWeight={700}>{t("groupProtection")}</Txt>
      <Gap y={1}/>

      <GroupProtectionSelector
        value={group.protection}
        onSelect={handleProtectionUpdate}
      />

      <Gap y={2}/>

      <GroupKeyCheckDialog
        open={keyEditorOpen}
        groupKey={group.key}
        onClose={() => setKeyEditorOpen(false)}
        onUpdate={handleKeyEditorUpdate}
      />

      <Gap y={4}/>

      <Row>
        <Txt variant="body1" fontWeight={700}>{t("allowUserCreateBoard")}</Txt>
        <Gap x={1}/>
        <HelperTooltip
          tip={t("allowUserCreateBoardHelper")}
        />
        <Switch
          checked={Boolean(group.allow_create_board)}
          onChange={handleAllowCreateBoardUpdate}
        />
      </Row>


      <Gap y={8}/>

    </Container>
  );
}