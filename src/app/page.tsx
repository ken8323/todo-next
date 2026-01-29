"use client";

import { useCallback, useMemo, useState } from "react";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import FilterBar from "./components/FilterBar";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Todo, Priority, FilterState, SortKey } from "./types";

export default function Home() {
  const [todos, setTodos, isLoaded] = useLocalStorage<Todo[]>("todos", []);
  const [filter, setFilter] = useState<FilterState>({ status: "all", category: "" });
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");

  const addTodo = useCallback(
    (text: string, priority: Priority, category: string, dueDate: string | null) => {
      setTodos((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text,
          completed: false,
          priority,
          category: category.trim() || "未分類",
          dueDate,
          createdAt: new Date().toISOString(),
        },
      ]);
    },
    [setTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    },
    [setTodos]
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
    },
    [setTodos]
  );

  const editTodo = useCallback(
    (id: string, updates: Partial<Omit<Todo, "id" | "createdAt">>) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    [setTodos]
  );

  const categories = useMemo(
    () => [...new Set(todos.map((t) => t.category))].sort(),
    [todos]
  );

  const filteredAndSorted = useMemo(() => {
    let result = todos;

    if (filter.status === "active") result = result.filter((t) => !t.completed);
    if (filter.status === "completed") result = result.filter((t) => t.completed);
    if (filter.category) result = result.filter((t) => t.category === filter.category);

    const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

    return [...result].sort((a, b) => {
      if (sortKey === "priority") return priorityOrder[a.priority] - priorityOrder[b.priority];
      if (sortKey === "dueDate") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [todos, filter, sortKey]);

  if (!isLoaded) return null;

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">
        TODO List
      </h1>
      <div className="mb-6">
        <AddTodo onAdd={addTodo} />
      </div>
      {todos.length > 0 && (
        <div className="mb-4">
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            sortKey={sortKey}
            onSortChange={setSortKey}
            categories={categories}
          />
        </div>
      )}
      <TodoList
        todos={filteredAndSorted}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onEdit={editTodo}
      />
      {todos.length > 0 && (
        <p className="mt-4 text-sm text-gray-500">
          {remaining} 件の未完了タスク / 全 {todos.length} 件
        </p>
      )}
    </div>
  );
}
