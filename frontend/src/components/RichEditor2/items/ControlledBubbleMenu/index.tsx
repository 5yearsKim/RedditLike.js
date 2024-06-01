import React from "react";
import { Popper } from "@mui/material";
import { Editor, isNodeSelection, posToDOMRect } from "@tiptap/core";

type ControlledBubbleMenuProps = {
  editor: Editor;
  open: boolean;
  children: React.ReactNode;
};

export function ControlledBubbleMenu({ editor, open, children }: ControlledBubbleMenuProps): JSX.Element {
  return (
    <Popper
      open={open}
      placement='top'
      sx={{ zIndex: 1600 }}
      modifiers={[
        {
          name: "offset",
          options: {
            // Add a slight vertical offset for the popper from the current selection
            offset: [0, 4],
          },
        },
        {
          name: "flip",
          enabled: true,
          options: {
            // We'll reposition (to one of the below fallback placements) whenever our Popper goes
            // outside of the editor. (This is necessary since our children aren't actually rendered
            // here, but instead with a portal, so the editor DOM node isn't a parent.)
            boundary: editor.options.element,
            fallbackPlacements: ["bottom", "top-start", "bottom-start", "top-end", "bottom-end"],
            padding: 8,
          },
        },
      ]}
      anchorEl={(): any => {
        // The logic here is taken from the positioning implementation in Tiptap's BubbleMenuPlugin
        // https://github.com/ueberdosis/tiptap/blob/16bec4e9d0c99feded855b261edb6e0d3f0bad21/packages/extension-bubble-menu/src/bubble-menu-plugin.ts#L183-L193

        const { from, to } = editor.state.selection;

        return {
          getBoundingClientRect: (): any => {
            try {
              if (isNodeSelection(editor.state.selection)) {
                const node = editor.view.nodeDOM(from) as HTMLElement;

                if (node && node.getBoundingClientRect) {
                  return node.getBoundingClientRect();
                }
              }

              return posToDOMRect(editor.view, from, to);
            } catch (e) {
              console.warn(e);
              return new DOMRect();
            }
          },
        };
      }}
    >
      {children}
    </Popper>
  );
}
