import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const DraggableRow = ({
  className,
  style,
  ...restProps
}: DraggableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: restProps["data-row-key"],
    });

  const rowStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-drag-disabled]")) return;
    listeners?.onPointerDown?.(e);
  };

  return (
    <tr
      ref={setNodeRef}
      {...attributes}
      onPointerDown={handlePointerDown}
      style={rowStyle}
      className={className}
      {...restProps}
    />
  );
};

export default DraggableRow;
