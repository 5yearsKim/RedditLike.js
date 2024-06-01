"use client";
import React, { Fragment } from "react";
import { useTranslations } from "next-intl";
import { useResponsive } from "@/hooks/Responsive";
import { Popper, Paper, List, ListItemButton, Divider, Chip, IconButton, ClickAwayListener } from "@mui/material";
import { Search, SearchIconWrapper, StyledInputBase } from "./style";
import { SearchIcon, CloseIcon } from "@/ui/icons";
import { Box, Row, Gap } from "@/ui/layouts";
import { BoardAvatar } from "@/ui/tools/Avatar";
import { Txt } from "@/ui/texts";
import { BoardSearchItem } from "@/components/BoardSearchItem";
// logic
import { useRef, ChangeEvent, MouseEvent, FocusEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useBoardSearch } from "@/hooks/BoardSearch";
import { useSearch$, useSearchActions } from "@/stores/SearchStore";
import { BoardT } from "@/types";


export function SearchBar(): JSX.Element {
  const t = useTranslations("components.Navbar.SearchBar");
  const router = useRouter();

  const search$ = useSearch$();
  const searchAct = useSearchActions();

  const searchRef = useRef<null | HTMLDivElement>(null);
  // const [popperOpen, setPopperOpen] = useState<boolean>(false);

  const { query, searchBoard: selectedBoard } = search$;

  const { status: boardSearchStatus, boardCand, reset: resetBoardSearch } = useBoardSearch({ query });

  const popperOpen = boardSearchStatus !== "init" && query.length > 0;

  function handleQueryChange(e: ChangeEvent<HTMLInputElement>): void {
    searchAct.patch({ query: e.target.value });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key == "Enter") {
      handleSearchClick();
    }
    if (e.key == "Backspace") {
      if (search$.query.length == 0 && selectedBoard) {
        searchAct.patch({ searchBoard: null });
      }
    }
  }

  function handleBoardClick(e: MouseEvent, board: BoardT): void {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/boards/${board.id}`);
    resetBoardSearch();
    searchAct.patch({ query: "" });
  }

  function handleFocus(): void {
    searchAct.patch({ isSearchFocused: true });
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>): void {
    // exception
    if (e.relatedTarget?.id.startsWith("search")) {
      return;
    }
    searchAct.patch({ isSearchFocused: false });
  }

  function handlePopperBlur(): void {
    resetBoardSearch();
  }

  function handleBoardTagDelete(): void {
    searchAct.patch({ searchBoard: null });
  }

  function handleClearClick(): void {
    searchAct.patch({ query: "", searchBoard: null });
  }

  function handleSearchClick(): void {
    if (search$.searchBoard) {
      const board = search$.searchBoard;
      router.push(`/boards/${board.id}?q=${query}`);
    } else {
      router.push(`/searches/post?q=${query}`);
    }
    resetBoardSearch();
  }


  const { downSm } = useResponsive();
  const { isSearchFocused } = search$;

  function renderBoardCand(): JSX.Element {
    if (boardSearchStatus == "error" || boardSearchStatus == "init") {
      // return <div>error</div>;
      return <></>;
    }
    if (boardSearchStatus === "loading") {
      return (
        <Box mx={2}>
          <Txt color='vague.main'>{t("loading")}...</Txt>
        </Box>
      );
    }
    return (
      <List>
        {boardCand.map((board) => {
          return (
            <ListItemButton
              key={board.id}
              dense
              onClick={(e): void => handleBoardClick(e, board)}
            >
              <BoardSearchItem board={board} />
            </ListItemButton>
          );
        })}
      </List>
    );
  }

  return (
    <Fragment>
      <Search
        ref={searchRef}
        focused={isSearchFocused}
      >
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <Row>
          {selectedBoard && (
            <Chip
              avatar={
                <Box>
                  <BoardAvatar
                    board={selectedBoard}
                    size='24px'
                  />
                </Box>
              }
              label={
                downSm ? (
                  isSearchFocused ? undefined : (
                    <Box
                      maxWidth={60}
                      overflow='hidden'
                    >
                      <Txt variant='body3'>{selectedBoard.name}</Txt>
                    </Box>
                  )
                ) : (
                  <Txt variant='body3'>{selectedBoard.name}</Txt>
                )
              }
              onDelete={isSearchFocused && downSm ? undefined : handleBoardTagDelete}
            />
          )}
        </Row>
        <StyledInputBase
          // placeholder='검색..'
          value={query}
          onChange={handleQueryChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete='off'
          inputProps={{
            id: "searchbar",
            "aria-label": "search",
            inputMode: "search",
          }}
        />
        {query.length > 0 && (
          <IconButton
            aria-label='search-close'
            id='search-close-icon'
            onClick={handleClearClick}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Search>
      <ClickAwayListener onClickAway={handlePopperBlur}>
        <Popper
          open={popperOpen}
          anchorEl={searchRef.current}
          placement='bottom-start'
          sx={{
            paddingTop: 2,
            zIndex: 2000,
            width: downSm ? "100%" : undefined,
            paddingLeft: downSm ? "8px" : undefined,
            paddingRight: downSm ? "8px" : undefined,
          }}
        >
          <Paper
            sx={{
              bgcolor: "paper.main",
              width: downSm ? "100%" : "500px",
            }}
          >
            <Box pl={2}>
              <Txt variant='subtitle1'>{t("board")}</Txt>
            </Box>
            {renderBoardCand()}
            <Divider />
            <ListItemButton onClick={handleSearchClick}>
              <SearchIcon
                sx={{ marginTop: "2px" }}
                fontSize='small'
              />
              <Gap x={1} />
              <Row>
                <Txt fontWeight={500}>{query}</Txt>
                <Box mr={0.5} />
                <Txt>{t("search")}...</Txt>
              </Row>
            </ListItemButton>
          </Paper>
        </Popper>
      </ClickAwayListener>
    </Fragment>
  );
}
