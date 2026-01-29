"use client";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

type Props = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 accent-blue-600"
      />
      <span
        className={`flex-1 ${todo.completed ? "text-gray-400 line-through" : "text-gray-900 dark:text-gray-100"}`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700 transition-colors"
        aria-label="削除"
      >
        &times;
      </button>
    </li>
  );
}
