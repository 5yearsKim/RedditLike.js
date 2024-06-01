import React from "react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { Tweet } from "@/ui/custom_nodes/Tweet";

function Component(props: NodeViewProps): JSX.Element {
  const id = props.node.attrs.id;
  return (
    <NodeViewWrapper>
      <Tweet id={id} />
    </NodeViewWrapper>
  );
}

export default Node.create({
  name: "tweet",

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
        tag: "tweet",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["tweet", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});
