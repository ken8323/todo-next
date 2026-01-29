"use client";

import type { FilterState, SortKey } from "../types";

type Props = {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
  categories: string[];
};

export default function FilterBar({
  filter,
  onFilterChange,
  sortKey,
  onSortChange,
  categories,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filter.status}
        onChange={(e) =>
          onFilterChange({ ...filter, status: e.target.value as FilterState["status"] })
        }
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      >
        <option value="all">すべて</option>
        <option value="active">未完了</option>
        <option value="completed">完了済み</option>
      </select>

      <select
        value={filter.category}
        onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      >
        <option value="">全カテゴリ</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={sortKey}
        onChange={(e) => onSortChange(e.target.value as SortKey)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      >
        <option value="createdAt">作成日順</option>
        <option value="priority">優先度順</option>
        <option value="dueDate">期限順</option>
      </select>
    </div>
  );
}
