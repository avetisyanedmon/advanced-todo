import { useState, type Key } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Tag, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import styled from "styled-components";
import DraggableRow from "./components/DraggableRow";
import DragHandle from "./components/DragHandle";
import type { Priority, Status, Task } from "../../types";
import type { RootState } from "../../store";
import {
  toggleTask,
  deleteTask,
  reorderTasks,
} from "../../store/slices/tasksSlice";
import TaskFormModal from "../TaskFormModal";

const TableContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  min-width: 100%;
  margin: 0 auto;
  padding: 24px;
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
`;

const priorityColors: Record<Priority, string> = {
  low: "green",
  medium: "orange",
  high: "red",
};

const statusColors: Record<Status, string> = {
  pending: "gold",
  in_progress: "orange",
  completed: "blue",
};

const TaskTable = () => {
  const dispatch = useDispatch();
  const tasksFromStore = useSelector((state: RootState) => state.tasks.tasks);
  const sensors = useSensors(useSensor(PointerSensor));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const columns: ColumnsType<Task> = [
    {
      title: "",
      dataIndex: "sort",
      key: "sort",
      width: "5%",
      render: (_: unknown, record: Task) => <DragHandle id={record.id} />,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "10%",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "12%",
      filters: Array.from(
        new Set(
          tasksFromStore
            .map((t) => t.category)
            .filter((cat): cat is string => !!cat)
        )
      ).map((cat) => ({ text: cat, value: cat })),
      onFilter: (value: boolean | Key, record: Task) =>
        record.category === value,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: "12%",
      filters: ["low", "medium", "high"].map((level) => ({
        text: level,
        value: level,
      })),
      onFilter: (value: boolean | Key, record: Task) =>
        record.priority === value,
      render: (priority: Priority) => (
        <Tag color={priorityColors[priority]}>{priority}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "12%",
      filters: ["pending", "in_progress", "completed"].map((status) => ({
        text: status,
        value: status,
      })),
      onFilter: (value: boolean | Key, record: Task) => record.status === value,
      render: (status: Status) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_: unknown, record: Task) => {
        const handleStatusChange = () => {
          const nextStatus: Status =
            record.status === "completed" ? "pending" : "completed";
          dispatch(toggleTask({ id: record.id, status: nextStatus }));
        };

        return (
          <ActionsWrapper data-drag-disabled>
            <Button
              type="link"
              style={{
                width: "70px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange();
              }}
            >
              {record.status === "completed" ? "Undo" : "Complete"}
            </Button>
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(record);
              }}
              style={{ marginLeft: 8 }}
            >
              Edit
            </Button>
            <Button
              type="link"
              danger
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteTask(record.id));
              }}
              style={{ marginLeft: 8 }}
            >
              Delete
            </Button>
          </ActionsWrapper>
        );
      },
    },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasksFromStore.findIndex((task) => task.id === active.id);
    const newIndex = tasksFromStore.findIndex((task) => task.id === over.id);

    const newTasks = arrayMove(tasksFromStore, oldIndex, newIndex);
    dispatch(reorderTasks(newTasks));
  };

  return (
    <>
      <TableContainer>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasksFromStore.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table
              rowKey="id"
              scroll={{ x: 800 }}
              columns={columns}
              dataSource={tasksFromStore}
              components={{
                body: {
                  row: DraggableRow,
                },
              }}
              pagination={{ pageSize: 7 }}
            />
          </SortableContext>
        </DndContext>
      </TableContainer>
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        initialTask={editingTask}
      />
    </>
  );
};

export default TaskTable;
