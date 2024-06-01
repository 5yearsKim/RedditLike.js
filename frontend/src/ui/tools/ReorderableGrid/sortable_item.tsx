import React, { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SortableItemProps = {
  id: string | number;
  children: JSX.Element;
};

export function SortableItem(props: SortableItemProps): JSX.Element {
  const { id, children } = props;

  const { isDragging, attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
}
