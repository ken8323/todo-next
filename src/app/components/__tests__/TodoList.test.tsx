import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TodoList from "../TodoList";
import type { Todo } from "../../types";

const makeTodo = (overrides: Partial<Todo> & { id: string; text: string }): Todo => ({
  completed: false,
  priority: "medium",
  category: "未分類",
  dueDate: null,
  createdAt: new Date().toISOString(),
  ...overrides,
});

const todos: Todo[] = [
  makeTodo({ id: "1", text: "タスク1" }),
  makeTodo({ id: "2", text: "タスク2", completed: true }),
  makeTodo({ id: "3", text: "タスク3" }),
];

describe("TodoList", () => {
  it("TODOが空の場合メッセージが表示される", () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText("TODOがありません。追加してみましょう！")).toBeInTheDocument();
  });

  it("全てのTODOアイテムが表示される", () => {
    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText("タスク1")).toBeInTheDocument();
    expect(screen.getByText("タスク2")).toBeInTheDocument();
    expect(screen.getByText("タスク3")).toBeInTheDocument();
  });

  it("TODOの数だけリストアイテムが表示される", () => {
    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("TODOが1件のみの場合でもリストとして表示される", () => {
    const single = [makeTodo({ id: "1", text: "唯一のタスク" })];
    render(<TodoList todos={single} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("唯一のタスク")).toBeInTheDocument();
  });

  it("全て完了済みのTODOでもリストが表示される（空メッセージにならない）", () => {
    const allCompleted = [
      makeTodo({ id: "1", text: "完了A", completed: true }),
      makeTodo({ id: "2", text: "完了B", completed: true }),
    ];
    render(<TodoList todos={allCompleted} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.queryByText("TODOがありません。追加してみましょう！")).not.toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("完了・未完了が混在するリストで各チェック状態が正しい", () => {
    render(<TodoList todos={todos} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });
});
