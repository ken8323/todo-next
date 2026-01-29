export type Priority = "high" | "medium" | "low";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate: string | null;
  createdAt: string;
};

export type FilterState = {
  status: "all" | "active" | "completed";
  category: string;
};

export type SortKey = "createdAt" | "priority" | "dueDate";
