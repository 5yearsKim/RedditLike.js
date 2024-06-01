import React, { ReactNode } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

type ReorderableListProps<ModelT> = {
  items: ModelT[];
  renderItem: (item: ModelT, idx: number) => JSX.Element;
  onDrop?: (prevId: idT, newId: idT | null) => void;
  onReorder?: (items: ModelT[]) => void;
};

export function ReorderableList<ModelT extends BaseModelT>(props: ReorderableListProps<ModelT>): JSX.Element {
  const { items, renderItem, onDrop, onReorder } = props;

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (onDrop) {
      onDrop(active.id as number, over?.id ?? (null as any));
    }

    if (onReorder) {
      const fromIdx = items.findIndex((item) => item.id == active.id);
      const toIdx = items.findIndex((item) => item.id == over?.id);

      if (fromIdx >= 0 && toIdx >= 0) {
        const newItems = [...items];
        const pop = newItems[fromIdx];
        newItems.splice(fromIdx, 1);
        // if (to > from) {
        //   to -= 1;
        // }
        newItems.splice(toIdx, 0, pop);
        onReorder(newItems);
      }
    }
  }

  return (
    <div style={{ touchAction: "none" }}>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {/* We need components that use the useSortable hook */}
          {items.map((item, idx) => (
            <SortableItem
              key={item.id}
              id={item.id}
            >
              {renderItem(item, idx)}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem(props: { id: idT; children: ReactNode }): JSX.Element {
  // props.id
  // JavaScript

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </div>
  );
}
