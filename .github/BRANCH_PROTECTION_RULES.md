# Branch Protection Rules & Workflow

## 🛡️ Branch Protection Configuration

### Main Branch Protection Rules

The `main` branch is protected with the following requirements:

#### Required Status Checks
- **Strict mode enabled**: PRs must be up-to-date with base branch before merging
- **Required checks**:
  - `test (18.x)` - Node.js 18 test suite
  - `test (20.x)` - Node.js 20 test suite  
  - `template-validation` - Template validation tests

#### Pull Request Reviews
- **Required approving reviews**: 1
- **Dismiss stale reviews**: Yes (when new commits are pushed)
- **Require approval on latest push**: Yes
- **Code owner reviews**: Not required

#### Additional Protections
- **Force pushes**: Disabled
- **Branch deletions**: Disabled
- **Conversation resolution**: Required before merge
- **Admin enforcement**: Disabled (admins can override)

## 🔄 Rebase Workflow

### Why Rebase is Required

The `strict: true` setting in status checks ensures that:
- PRs must be rebased with the latest main branch before merging
- This maintains a clean, linear git history
- Prevents merge conflicts and integration issues

### How to Rebase Your PR

When your PR falls behind main, follow these steps:

```bash
# 1. Fetch latest main branch
git fetch origin main

# 2. Rebase your feature branch
git rebase origin/main

# 3. Force push rebased branch (safely)
git push --force-with-lease
```

### Automated Rebase Reminders

A GitHub Action (`pr-rebase-reminder.yml`) automatically:
- Checks if PRs are behind main branch
- Comments with rebase instructions when needed
- Runs on PR open and synchronize events

## 📋 PR Submission Checklist

Before submitting a PR, ensure:

- [ ] Branch is up-to-date with main (rebased)
- [ ] All CI checks are passing
- [ ] Code follows project standards
- [ ] Tests are included for new features
- [ ] Documentation is updated if needed
- [ ] No merge conflicts exist

## 🔧 Configuration Files

### Branch Protection Config
- **File**: `.github/branch-protection-config.json`
- **Purpose**: Defines branch protection rules
- **Applied via**: GitHub API

### Rebase Reminder Workflow
- **File**: `.github/workflows/pr-rebase-reminder.yml`  
- **Purpose**: Automated rebase reminders
- **Triggers**: PR open, synchronize

## 🚨 Troubleshooting

### Common Issues

**Q: My PR shows "behind main" but I just rebased**
- GitHub may need a few minutes to update status
- Try refreshing the PR page
- Verify CI checks are running

**Q: Force push failed with "non-fast-forward" error**
- Use `git push --force-with-lease` for safety
- This prevents overwriting others' commits
- If it still fails, coordinate with team members

**Q: Rebase created merge conflicts**
- Resolve conflicts during rebase
- Use `git rebase --continue` after fixing
- Test thoroughly after conflict resolution

### Getting Help

1. Check PR comments for automated guidance
2. Review failed CI check logs
3. Contact team leads for complex conflicts
4. Use GitHub discussions for workflow questions

## 🔄 Updating Branch Protection Rules

To modify branch protection rules:

1. Edit `.github/branch-protection-config.json`
2. Apply changes via GitHub API:
   ```bash
   gh api --method PUT repos/nomadbitcoin/kit-dot/branches/main/protection --input .github/branch-protection-config.json
   ```
3. Commit and document the changes
4. Update this documentation accordingly

---

*This workflow ensures code quality and maintains a clean git history for the project.*