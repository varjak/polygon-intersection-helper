# Commit Message Conventions

This project follows [Semantic Release](https://semantic-release.gitbook.io/) conventions for commit messages.

## Format

Each commit message consists of a **type**, an optional **scope**, and a **subject**:

```
<type>(<scope>): <subject>
```

### Types

The following commit types trigger releases:

- **feat**: A new feature (triggers a **minor** release, e.g., 1.0.0 → 1.1.0)
- **fix**: A bug fix (triggers a **patch** release, e.g., 1.0.0 → 1.0.1)
- **perf**: A performance improvement (triggers a **patch** release)

Other commit types (do not trigger releases):

- **docs**: Documentation changes
- **style**: Code style changes (formatting, whitespace, etc.)
- **refactor**: Code refactoring without changing functionality
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates, etc.
- **ci**: CI/CD configuration changes
- **build**: Build system or external dependency changes

### Breaking Changes

To trigger a **major** release (e.g., 1.0.0 → 2.0.0), include `BREAKING CHANGE:` in the commit body or add `!` after the type:

```
feat!: remove deprecated API endpoints

BREAKING CHANGE: The old /api/v1 endpoints have been removed. Use /api/v2 instead.
```

## Examples

```
feat: add polygon union helper function
fix: correct intersection calculation for edge case
perf: optimize polygon comparison algorithm
docs: update README with usage examples
refactor: simplify polygon validation logic
test: add tests for edge cases
chore: update dependencies
```

## Best Practices

1. Use the imperative mood ("add feature" not "added feature")
2. Keep the subject line concise (preferably under 72 characters)
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the body to explain what and why, not how
6. Separate subject from body with a blank line

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
