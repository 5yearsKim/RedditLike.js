import React from "react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { PostImage } from "@/ui/custom_nodes/PostImage";

function Component(props: NodeViewProps): JSX.Element {
  const { path, alt, width, height } = props.node.attrs;
  return (
    <NodeViewWrapper>
      <PostImage
        path={path}
        alt={alt}
        width={width}
        height={height}
      />
    </NodeViewWrapper>
  );
}

export default Node.create({
  name: "postImage",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      path: {
        default: "",
      },
      alt: {
        default: "",
      },
      width: {
        default: 0,
      },
      height: {
        default: 0,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "post-image",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["post-image", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(Component);
  },
});

