# Git Usage Instructions

## Git Workflow

When working on projects, use git to track all changes. Initialize git repository if not already present:

```bash
git init
```

## Commit Strategy

Make **small, focused commits** for each logical change. Commit frequently rather than bundling multiple changes.

## Commit Message Format

Use this simple format:

```single_phrase_describing the change
<type>: <brief description>

<optional details if needed>
```

### Types:

- `feat`: new feature
- `fix`: bug fix
- `refactor`: code restructuring
- `style`: formatting/styling changes
- `docs`: documentation updates
- `init`: initial setup
- `config`: configuration changes
- `test`: adding/updating tests

## Key Rules

1. **NEVER use `git add .` or `git add -A`** - Always specify exact file paths to avoid committing unwanted files (like TODO, temp files, etc.)
2. **Keep commit messages under 50 characters for the title**
3. **Commit before major refactors** to save working state
4. **Add all relevant files** using specific paths: `git add src/file.ts package.json`

## Branch Strategy (if applicable)

- Use descriptive branch names: `feature/auth`, `fix/api-timeout`
- Before starting again ask the user if he wants to merge current state or proceed with iteration.
- Commit regularly to feature branches before merging.

## Documentation Strategy

Create `claude.md` files in each project folder to explain the software architecture and logic.

### Folder Documentation Format

Each `claude.md` should contain:

```markdown
# [Folder/Module Name]

## Purpose

Brief explanation of what this folder/module does

## Architecture
```

PSEUDO-CODE:

- Main flow/logic in simple steps
- Key functions and their purpose
- Data flow between components

```

## Key Files
- `filename.ext` - what it does
- `another.js` - its responsibility

## Dependencies
- External libraries used
- Internal modules it depends on
```

### Examples:

**In `/src/auth/claude.md`:**

```markdown
# Authentication Module

## Purpose

Handles user login, registration, and session management

## Architecture
```

PSEUDO-CODE:

- User submits credentials → validate format
- Check against database → return user data or error
- Generate JWT token → store in secure cookie
- Middleware checks token on protected routes

```

## Key Files
- `auth.controller.js` - handles login/register requests
- `jwt.service.js` - token generation and validation
- `auth.middleware.js` - protects routes
```

**In `/src/database/claude.md`:**

```markdown
# Database Layer

## Purpose

Database connections, models, and query operations

## Architecture
```

PSEUDO-CODE:

- Initialize connection pool on startup
- Models define table structure and relationships
- Repository pattern for CRUD operations
- Migration system for schema changes

```

```

### Documentation Rules

1. **Create claude.md in every significant folder**
2. **Use pseudo-code blocks** to explain logic flow
3. **Keep explanations simple** - focus on "what" and "why"
4. **Update claude.md when refactoring** major logic
5. **Commit documentation changes** with code changes

Remember: Good git history helps track what was changed and why. Good folder documentation helps understand what exists and how it works.

# Workflow

- Prefer running single tests, and not the whole test suite, for performance
