import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AddTodo from "../AddTodo";

describe("AddTodo", () => {
  it("入力フィールドとボタンが表示される", () => {
    render(<AddTodo onAdd={vi.fn()} />);
    expect(screen.getByPlaceholderText("新しいTODOを入力...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "追加" })).toBeInTheDocument();
  });

  it("テキストを入力して送信するとonAddが呼ばれる", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByPlaceholderText("新しいTODOを入力...");
    await user.type(input, "新しいタスク");
    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(onAdd).toHaveBeenCalledWith("新しいタスク", "medium", "", null);
    expect(input).toHaveValue("");
  });

  it("空文字の場合はonAddが呼ばれない", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<AddTodo onAdd={onAdd} />);

    await user.click(screen.getByRole("button", { name: "追加" }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("スペースのみの場合はonAddが呼ばれない", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<AddTodo onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText("新しいTODOを入力..."), "   ");
    await user.click(screen.getByRole("button", { name: "追加" }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("前後にスペースがある場合はトリムされた値でonAddが呼ばれる", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<AddTodo onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText("新しいTODOを入力..."), "  タスク  ");
    await user.click(screen.getByRole("button", { name: "追加" }));
    expect(onAdd).toHaveBeenCalledWith("タスク", "medium", "", null);
  });

  it("連続して複数のTODOを追加できる", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByPlaceholderText("新しいTODOを入力...");
    const button = screen.getByRole("button", { name: "追加" });

    await user.type(input, "タスク1");
    await user.click(button);
    await user.type(input, "タスク2");
    await user.click(button);

    expect(onAdd).toHaveBeenCalledTimes(2);
    expect(onAdd).toHaveBeenNthCalledWith(1, "タスク1", "medium", "", null);
    expect(onAdd).toHaveBeenNthCalledWith(2, "タスク2", "medium", "", null);
  });

  it("Enterキーでフォームを送信できる", async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    render(<AddTodo onAdd={onAdd} />);

    const input = screen.getByPlaceholderText("新しいTODOを入力...");
    await user.type(input, "Enterで追加{enter}");

    expect(onAdd).toHaveBeenCalledWith("Enterで追加", "medium", "", null);
  });
});
