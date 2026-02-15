# Code Style & Conventions

## TypeScript
- Strict mode enabled
- Use `type` keyword (not `interface`) for type definitions
- Path alias: `@/*` → `./src/*`
- Target: ES2017, Module: ESNext

## React / Next.js
- Next.js App Router
- Client components marked with `"use client"`
- Functional components with `export default function ComponentName()`
- State management via React hooks (useState, useCallback, useMemo)
- Custom hooks in `src/app/hooks/`

## Styling
- Tailwind CSS v4 utility classes
- Dark mode support via `dark:` variants

## Naming
- Component files: PascalCase (e.g., `TodoItem.tsx`)
- Hook files: camelCase with `use` prefix (e.g., `useLocalStorage.ts`)
- Type files: camelCase (e.g., `types.ts`)
- Test files: `ComponentName.test.tsx` in `__tests__/` directories

## Language
- UI text and comments may be in Japanese (日本語)
