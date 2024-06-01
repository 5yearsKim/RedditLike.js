import React from "react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { PollItem } from "@/ui/custom_nodes/PollItem";

function Component(props: NodeViewProps): JSX.Element {
  const id = props.node.attrs.id;
  return (
    <NodeViewWrapper>
      <PollItem pollId={id} isEditable />
    </NodeViewWrapper>
  );
}

export default Node.create({
  name: "pollItem",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      id: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "poll-item",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["poll-item", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
