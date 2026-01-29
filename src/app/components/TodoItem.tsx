"use client";

import { useState } from "react";
import type { Todo, Priority } from "../types";

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<Todo, "id" | "createdAt">>) => void;
};

const priorityLabel: Record<Priority, string> = { high: "高", medium: "中", low: "低" };
const priorityColor: Record<Priority, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const isOverdue =
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().toDateString());

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed) {
      onEdit(todo.id, { text: trimmed });
      setEditing(false);
    }
  };

  return (
    <li
      className={`rounded-lg border px-4 py-3 ${
        isOverdue
          ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="h-5 w-5 accent-blue-600"
        />

        {editing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") { setEditText(todo.text); setEditing(false); }
            }}
            autoFocus
            className="flex-1 rounded border border-blue-400 px-2 py-1 text-gray-900 focus:outline-none dark:bg-gray-800 dark:text-gray-100"
          />
        ) : (
          <span
            onDoubleClick={() => setEditing(true)}
            className={`flex-1 cursor-pointer ${
              todo.completed ? "text-gray-400 line-through" : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {todo.text}
          </span>
        )}

        <button
          onClick={() => onDelete(todo.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="削除"
        >
          &times;
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 pl-8 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-medium ${priorityColor[todo.priority]}`}>
          {priorityLabel[todo.priority]}
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {todo.category}
        </span>
        {todo.dueDate && (
          <span className={`${isOverdue ? "text-red-600 font-semibold" : "text-gray-500"}`}>
            期限: {todo.dueDate}
          </span>
        )}
      </div>
    </li>
  );
}
