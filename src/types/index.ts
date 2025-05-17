export type Priority = "low" | "medium" | "high";
export type Status = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priority: Priority;
  status: Status;
}
