import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TodoItem from "../TodoItem";
import type { Todo } from "../../types";

const baseTodo: Todo = {
  id: "1",
  text: "テストタスク",
  completed: false,
  priority: "medium",
  category: "未分類",
  dueDate: null,
  createdAt: new Date().toISOString(),
};

describe("TodoItem", () => {
  it("TODOのテキストが表示される", () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText("テストタスク")).toBeInTheDocument();
  });

  it("未完了の場合チェックボックスが未チェック", () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("完了の場合チェックボックスがチェック済み", () => {
    const completed = { ...baseTodo, completed: true };
    render(<TodoItem todo={completed} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("チェックボックスをクリックするとonToggleが呼ばれる", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<TodoItem todo={baseTodo} onToggle={onToggle} onDelete={vi.fn()} onEdit={vi.fn()} />);

    await user.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith("1");
  });

  it("削除ボタンをクリックするとonDeleteが呼ばれる", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "削除" }));
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("完了済みタスクに取り消し線が適用される", () => {
    const completed = { ...baseTodo, completed: true };
    render(<TodoItem todo={completed} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText("テストタスク")).toHaveClass("line-through");
  });

  it("未完了タスクには取り消し線が適用されない", () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText("テストタスク")).not.toHaveClass("line-through");
  });

  it("長いテキストのTODOが正しく表示される", () => {
    const longTodo: Todo = { ...baseTodo, id: "2", text: "あ".repeat(200) };
    render(<TodoItem todo={longTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />);
    expect(screen.getByText("あ".repeat(200))).toBeInTheDocument();
  });

  it("onToggleに正しいIDが渡される（異なるID）", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    const todo: Todo = { ...baseTodo, id: "abc-999", text: "別タスク" };
    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={vi.fn()} onEdit={vi.fn()} />);

    await user.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledWith("abc-999");
  });

  it("onDeleteに正しいIDが渡される（異なるID）", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    const todo: Todo = { ...baseTodo, id: "xyz-123", text: "削除タスク" };
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "削除" }));
    expect(onDelete).toHaveBeenCalledWith("xyz-123");
  });
});
