"use client";
import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Autocomplete } from "@mui/material";
import { TextField } from "@mui/material";
import { BoardAuthor } from "@/components/BoardAuthor";
// logic
import { useState, useCallback, SyntheticEvent, useEffect } from "react";
import { debounce } from "@mui/material/utils";
import * as BoardUserApi from "@/apis/board_users";
import type { BoardUserT, ListBoardUserOptionT } from "@/types";

type BoardUserLookupProps = {
  boardId: idT;
  onSelect: (user: BoardUserT) => void;
};

export function BoardUserLookup({
  boardId,
  onSelect,
}: BoardUserLookupProps): JSX.Element {
  const t = useTranslations("components.BoardUserLookup");
  // const [anchorEl, setAncholEl] = useState<null | HTMLDivElement>(null);
  const [nickname, setNickname] = useState<string>("");
  const [cands, setCands] = useState<BoardUserT[]>([]);

  useEffect(() => {
    _bringCandidates.clear();
    if (!nickname) {
      setCands([]);
    } else {
      _bringCandidates(nickname);
    }
  }, [nickname]);

  const _bringCandidates = useCallback(
    debounce(async (nickname: string) => {
      try {
        const listOpt: ListBoardUserOptionT = {
          $author: true,
          boardId,
          nickname,
        };
        const { data: fetched } = await BoardUserApi.list(listOpt);
        setCands(fetched);
      } catch (e) {
        setCands([]);
      }
    }, 500),
    [],
  );

  function handleNicknameChange(e: SyntheticEvent<Element, Event>, newValue: string | null): void {
    setNickname(newValue ?? "");
  }

  function handleAuthorSelect(e: SyntheticEvent<Element, Event>, boardUser: BoardUserT | null): void {
    e.preventDefault();
    if (!boardUser) {
      return;
    }
    onSelect(boardUser);
  }

  return (
    <Autocomplete
      options={cands ? cands : []}
      // freeSolo
      clearOnBlur={false}
      inputValue={nickname}
      onInputChange={handleNicknameChange}
      onChange={handleAuthorSelect}
      renderInput={(params): ReactNode => {
        return (
          <TextField
            {...params}
            label={t("searchUser")}
          />
        );
      }}
      getOptionLabel={(option: BoardUserT): string => option.nickname ?? ""}
      isOptionEqualToValue={(option, value): boolean => option.id === value.id}
      renderOption={(props, option): ReactNode => {
        return (
          <li {...props}>
            <BoardAuthor author={option.author ?? null} />
          </li>
        );
      }}
    />
  );
}
