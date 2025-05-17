import { MenuOutlined } from "@ant-design/icons";
import { useDraggable } from "@dnd-kit/core";

const DragHandle = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ cursor: "grab" }}
    >
      <MenuOutlined style={{ color: "#999" }} />
    </div>
  );
};

export default DragHandle;
