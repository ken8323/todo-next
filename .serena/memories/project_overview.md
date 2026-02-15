# Project Overview: todo-next

## Purpose
A TODO list web application with features including:
- Add/edit/delete/toggle TODO items
- Priority levels (high/medium/low)
- Categories
- Due dates
- Filtering (by status, category) and sorting (by creation date, priority, due date)
- Data persistence via localStorage

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: React 19.2.3
- **Styling**: Tailwind CSS v4
- **Testing**: Vitest + Testing Library (React, jest-dom, user-event) with jsdom environment
- **Linting**: ESLint 9 with next core-web-vitals and typescript configs

## Project Structure
```
src/
  app/
    page.tsx           # Main page component (client component)
    layout.tsx         # Root layout
    types.ts           # Type definitions (Todo, Priority, FilterState, SortKey)
    globals.css        # Global styles (Tailwind)
    components/
      AddTodo.tsx      # Add todo form
      TodoList.tsx     # Todo list display
      TodoItem.tsx     # Individual todo item
      FilterBar.tsx    # Filter and sort controls
      __tests__/       # Component tests
    hooks/
      useLocalStorage.ts  # Custom hook for localStorage persistence
    __tests__/
      page.test.tsx    # Page-level tests
  test/
    setup.ts           # Vitest setup file
    CLAUDE.md          # Testing guidelines
```

## Code Style & Conventions
- Client components use `"use client"` directive
- TypeScript with `type` keyword for type definitions (not `interface`)
- Functional components with `export default function`
- React hooks: useCallback, useMemo, useState for state management
- Path alias: `@/*` maps to `./src/*`
- UI text is in Japanese (日本語)
- Tailwind CSS utility classes for styling (dark mode support)
