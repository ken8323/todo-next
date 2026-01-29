"use client";

import { useCallback } from "react";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import { type Todo } from "./components/TodoItem";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function Home() {
  const [todos, setTodos, isLoaded] = useLocalStorage<Todo[]>("todos", []);

  const addTodo = useCallback((text: string) => {
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ]);
  }, [setTodos]);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, [setTodos]);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, [setTodos]);

  if (!isLoaded) return null;

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">
        TODO List
      </h1>
      <div className="mb-6">
        <AddTodo onAdd={addTodo} />
      </div>
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      {todos.length > 0 && (
        <p className="mt-4 text-sm text-gray-500">
          {remaining} 件の未完了タスク / 全 {todos.length} 件
        </p>
      )}
    </div>
  );
}
