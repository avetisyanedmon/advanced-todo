import { useEffect } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useDispatch } from "react-redux";
import { addTask, editTask } from "../../store/slices/tasksSlice";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "../../types";

const { Option } = Select;

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task | null;
}

const TaskFormModal = ({
  isOpen,
  onClose,
  initialTask,
}: TaskFormModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialTask) {
      form.setFieldsValue(initialTask);
    } else {
      form.resetFields();
    }
  }, [initialTask, form]);

  const handleSubmit = (values: Omit<Task, "id">) => {
    if (initialTask) {
      dispatch(editTask({ ...initialTask, ...values }));
    } else {
      dispatch(addTask({ id: uuidv4(), ...values }));
    }
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={initialTask ? "Edit Task" : "Create New Task"}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{ priority: "medium", status: "pending" }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title!" }]}
        >
          <Input placeholder="Enter task title" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input placeholder="Enter task description" />
        </Form.Item>

        <Form.Item name="category" label="Category">
          <Input placeholder="Enter category" />
        </Form.Item>

        <Form.Item name="priority" label="Priority">
          <Select>
            <Option value="low">Low</Option>
            <Option value="medium">Medium</Option>
            <Option value="high">High</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select>
            <Option value="pending">Pending</Option>
            <Option value="in_progress">In Progress</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {initialTask ? "Save Changes" : "Add Task"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;
