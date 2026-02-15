# Task Completion Checklist

After completing a coding task, run the following:

1. **Lint**: `npm run lint` - Ensure no ESLint errors
2. **Tests**: `npx vitest run` - Ensure all tests pass
3. **Build** (if significant changes): `npm run build` - Ensure build succeeds
4. **Git status**: `git status` - Review all changes before committing

## Testing Guidelines (from CLAUDE.md)
- Tests must verify actual functionality (no trivial assertions)
- No hardcoding to make tests pass
- Follow red-green-refactor
- Test boundary values, error cases
- Clear test case names describing what is being tested
- Minimal mocking, prefer testing close to real behavior
