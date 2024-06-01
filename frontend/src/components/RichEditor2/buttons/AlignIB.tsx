import React, { useState, MouseEvent } from "react";
import {
  FormatAlignJustifyIcon,
  FormatAlignCenterIcon,
  FormatAlignLeftIcon,
  FormatAlignRightIcon,
} from "@/ui/icons";
import { Popover } from "@mui/material";
import { Row } from "@/ui/layouts";
import { ButtonProps } from "./type";
import { IB } from "./style";

interface AlignIBProps extends ButtonProps {}

export function AlignIB(props: AlignIBProps): JSX.Element {
  const { editor } = props;
  const [popEl, setPopEl] = useState<HTMLElement | null>(null);

  function handleClick(e: MouseEvent<HTMLElement>): void {
    setPopEl(e.currentTarget);
  }

  function handlePopClose(): void {
    setPopEl(null);
  }

  function getMainIcon(): JSX.Element {
    if (editor.isActive({ textAlign: "left" })) {
      return <FormatAlignLeftIcon fontSize='small' />;
    }
    if (editor.isActive({ textAlign: "right" })) {
      return <FormatAlignRightIcon fontSize='small' />;
    }
    if (editor.isActive({ textAlign: "center" })) {
      return <FormatAlignCenterIcon fontSize='small' />;
    }
    return <FormatAlignJustifyIcon fontSize='small' />;
  }
  return (
    <>
      <Popover
        open={Boolean(popEl)}
        anchorEl={popEl}
        onClose={handlePopClose}
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
        transformOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        slotProps={{
          paper: { sx: { bgcolor: "#444444", boxShadow: 0 } },
        }}
      >
        <Row tabIndex={0}>
          <IB
            icon={<FormatAlignLeftIcon />}
            onClick={(): boolean => editor.chain().focus().setTextAlign("left").run()}
            selected={editor.isActive({ textAlign: "left" })}
          />
          <IB
            icon={<FormatAlignCenterIcon />}
            onClick={(): boolean => editor.chain().focus().setTextAlign("center").run()}
            selected={editor.isActive({ textAlign: "center" })}
          />
          <IB
            icon={<FormatAlignRightIcon />}
            onClick={(): boolean => editor.chain().focus().setTextAlign("right").run()}
            selected={editor.isActive({ textAlign: "right" })}
          />
          <IB
            icon={<FormatAlignJustifyIcon />}
            onClick={(): boolean => editor.chain().focus().setTextAlign("justify").run()}
            selected={editor.isActive({ textAlign: "justify" })}
          />
        </Row>
      </Popover>
      <IB
        icon={getMainIcon()}
        onClick={handleClick}
      />
    </>
  );
}
