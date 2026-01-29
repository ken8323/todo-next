import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "../page";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// crypto.randomUUID mock
let uuidCounter = 0;
vi.stubGlobal("crypto", {
  ...crypto,
  randomUUID: () => `uuid-${++uuidCounter}`,
});

describe("Home (page.tsx)", () => {
  beforeEach(() => {
    localStorageMock.clear();
    uuidCounter = 0;
  });

  it("タイトルが表示される", () => {
    render(<Home />);
    expect(screen.getByText("TODO List")).toBeInTheDocument();
  });

  it("TODOが空の場合、空メッセージが表示される", () => {
    render(<Home />);
    expect(screen.getByText("TODOがありません。追加してみましょう！")).toBeInTheDocument();
  });

  it("TODOを追加できる", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText("新しいTODOを入力..."), "買い物");
    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(screen.getByText("買い物")).toBeInTheDocument();
    expect(screen.getByText("1 件の未完了タスク / 全 1 件")).toBeInTheDocument();
  });

  it("TODOを完了に切り替えられる", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText("新しいTODOを入力..."), "掃除");
    await user.click(screen.getByRole("button", { name: "追加" }));
    await user.click(screen.getByRole("checkbox"));

    expect(screen.getByText("0 件の未完了タスク / 全 1 件")).toBeInTheDocument();
  });

  it("TODOを削除できる", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText("新しいTODOを入力..."), "洗濯");
    await user.click(screen.getByRole("button", { name: "追加" }));

    expect(screen.getByText("洗濯")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "削除" }));

    expect(screen.queryByText("洗濯")).not.toBeInTheDocument();
    expect(screen.getByText("TODOがありません。追加してみましょう！")).toBeInTheDocument();
  });

  it("複数のTODOを追加してカウンターが正しく表示される", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText("新しいTODOを入力...");
    const button = screen.getByRole("button", { name: "追加" });

    await user.type(input, "タスクA");
    await user.click(button);
    await user.type(input, "タスクB");
    await user.click(button);
    await user.type(input, "タスクC");
    await user.click(button);

    expect(screen.getByText("3 件の未完了タスク / 全 3 件")).toBeInTheDocument();
  });

  it("完了を解除して未完了に戻せる", async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.type(screen.getByPlaceholderText("新しいTODOを入力..."), "トグルタスク");
    await user.click(screen.getByRole("button", { name: "追加" }));

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox); // 完了にする
    expect(screen.getByText("0 件の未完了タスク / 全 1 件")).toBeInTheDocument();

    await user.click(checkbox); // 未完了に戻す
    expect(screen.getByText("1 件の未完了タスク / 全 1 件")).toBeInTheDocument();
  });

  it("複数TODOの中から特定のものだけ削除できる", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText("新しいTODOを入力...");
    const button = screen.getByRole("button", { name: "追加" });

    await user.type(input, "残すタスク");
    await user.click(button);
    await user.type(input, "消すタスク");
    await user.click(button);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    await user.click(deleteButtons[0]); // 新しい順なので「消すタスク」が先頭

    expect(screen.queryByText("消すタスク")).not.toBeInTheDocument();
    expect(screen.getByText("残すタスク")).toBeInTheDocument();
    expect(screen.getByText("1 件の未完了タスク / 全 1 件")).toBeInTheDocument();
  });

  it("全てのTODOを削除すると空メッセージが表示される", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText("新しいTODOを入力...");
    const button = screen.getByRole("button", { name: "追加" });

    await user.type(input, "タスク1");
    await user.click(button);
    await user.type(input, "タスク2");
    await user.click(button);

    // 全て削除
    await user.click(screen.getAllByRole("button", { name: "削除" })[0]);
    await user.click(screen.getByRole("button", { name: "削除" }));

    expect(screen.getByText("TODOがありません。追加してみましょう！")).toBeInTheDocument();
  });

  it("一部を完了にしたときカウンターが正しく更新される", async () => {
    const user = userEvent.setup();
    render(<Home />);

    const input = screen.getByPlaceholderText("新しいTODOを入力...");
    const button = screen.getByRole("button", { name: "追加" });

    await user.type(input, "タスクA");
    await user.click(button);
    await user.type(input, "タスクB");
    await user.click(button);
    await user.type(input, "タスクC");
    await user.click(button);

    // 1つ目と3つ目を完了にする
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[2]);

    expect(screen.getByText("1 件の未完了タスク / 全 3 件")).toBeInTheDocument();
  });

  it("localStorageに保存済みのデータが復元される", () => {
    const savedTodos = [
      { id: "saved-1", text: "保存済みタスク", completed: false, priority: "medium", category: "未分類", dueDate: null, createdAt: new Date().toISOString() },
      { id: "saved-2", text: "完了済み保存タスク", completed: true, priority: "medium", category: "未分類", dueDate: null, createdAt: new Date().toISOString() },
    ];
    localStorageMock.clear();
    localStorage.setItem("todos", JSON.stringify(savedTodos));

    render(<Home />);

    expect(screen.getByText("保存済みタスク")).toBeInTheDocument();
    expect(screen.getByText("完了済み保存タスク")).toBeInTheDocument();
    expect(screen.getByText("1 件の未完了タスク / 全 2 件")).toBeInTheDocument();
  });
});
