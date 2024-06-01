import React, { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Grid, Box } from "@mui/material";
import { SortableItem } from "./sortable_item";

interface ReorderableGridProps<ModelT> {
  items: ModelT[];
  columns: number;
  renderItem: (item: ModelT, index?: number) => JSX.Element;
  onReorder: (newItems: ModelT[]) => void;
  renderTail?: () => JSX.Element;
}

export function ReorderableGrid<ModelT extends { id: string | number }>(
  props: ReorderableGridProps<ModelT>,
): JSX.Element {
  const { items, columns, renderItem, onReorder, renderTail } = props;

  const [activeId, setActiveId] = useState<string | number | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 300, tolerance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 300, tolerance: 10 },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active.id || !over?.id) {
        return;
      }
      if (active.id !== over.id) {
        const oldIndex = items.findIndex((item) => item.id == active.id);
        const newIndex = items.findIndex((item) => item.id == over!.id);
        if (oldIndex >= 0 && newIndex >= 0) {
          onReorder(arrayMove(items, oldIndex, newIndex));
        }
      }

      setActiveId(null);
    },
    [items],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  function renderOverlay(): JSX.Element | null {
    if (!activeId) {
      return null;
    }
    const item = items.find((item) => item.id == activeId);
    if (!item) {
      return null;
    }
    return (
      <Box
        p={0.5}
        boxShadow={"0px 0px 5px rgba(0, 0, 0, 0.5)"}
      >
        {renderItem(item)}
      </Box>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={items}
        strategy={rectSortingStrategy}
      >
        <Grid
          container
          spacing={1}
          columns={columns}
        >
          {items.map((item, index) => (
            <Grid
              key={item.id}
              item
            >
              <SortableItem id={item.id}>{renderItem(item, index)}</SortableItem>
            </Grid>
          ))}

          {renderTail && <Grid item>{renderTail()}</Grid>}
        </Grid>
      </SortableContext>
      <DragOverlay
        adjustScale
        style={{ transformOrigin: "0 0 " }}
      >
        {renderOverlay()}
      </DragOverlay>
    </DndContext>
  );
}
