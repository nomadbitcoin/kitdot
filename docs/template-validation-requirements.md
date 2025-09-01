# Template Validation Requirements

## Purpose

Ensure all templates in the kit-dot registry are battle-tested and production-ready before being offered to users. This prevents template loading failures and maintains a high-quality user experience.

## Validation Checklist

### For Remote Templates

Before adding any remote template to `src/templates/registry.ts`, verify:

#### Repository Accessibility
- [ ] Repository exists and is publicly accessible
- [ ] Branch specified in config exists (verify main/master naming)
- [ ] Directory path (if specified) exists in the repository
- [ ] Repository owner/organization is stable and reliable

#### Template Functionality
- [ ] Template can be downloaded successfully using degit
- [ ] All required files are present in the specified directory
- [ ] package.json exists and is valid
- [ ] Dependencies can be installed without errors
- [ ] Basic build/dev commands work

#### Integration Testing
- [ ] Template integrates correctly with kit-dot project structure
- [ ] Generated project follows expected patterns
- [ ] No conflicts with kit-dot's file filtering logic
- [ ] Template works in both standalone and monorepo contexts

### For Local Templates

Before adding local templates to `/templates/` directory:

#### Template Structure
- [ ] Complete project structure is present
- [ ] All necessary configuration files included
- [ ] No build artifacts or temporary files included
- [ ] Template follows consistent naming patterns

#### Documentation
- [ ] README.md explains template purpose and features
- [ ] Setup instructions are clear and complete
- [ ] Dependencies and requirements documented
- [ ] Template-specific documentation included

## Automated Testing Requirements

### CI/CD Pipeline Tests

Implement automated validation that runs before deployment:

```typescript
// Example test structure
describe('Template Validation', () => {
  Object.entries(TEMPLATE_REGISTRY).forEach(([key, template]) => {
    if (template.source.type === 'remote') {
      test(`${key} template is downloadable`, async () => {
        // Test degit download succeeds
        // Verify required files exist
        // Check package.json validity
      });
    }
  });
});
```

### Test Coverage Requirements

- [ ] All remote templates have download validation tests
- [ ] All templates have basic structure validation
- [ ] Branch/directory path validation for remote templates
- [ ] Integration tests verify templates work with kit-dot CLI

## Failure Response Protocol

### When Template Validation Fails

1. **Immediate Response:**
   - Remove failing template from registry
   - Update documentation to reflect removal
   - Notify maintainers of affected template

2. **Investigation:**
   - Determine root cause (repo moved, branch renamed, etc.)
   - Contact template owner if possible
   - Document findings

3. **Resolution:**
   - Fix configuration if simple (branch name change)
   - Find alternative template if original is abandoned
   - Update validation tests to catch similar issues

### Communication

- [ ] Template validation status visible in CI/CD dashboard
- [ ] Failed validations trigger alerts to maintainers
- [ ] Users are informed if templates become unavailable

## Implementation Timeline

### Phase 1: Immediate Fix
- [x] Fix paritytech/create-polkadot-dapp branch reference
- [x] Test current templates manually

### Phase 2: Basic Validation (Week 1)
- [x] Implement basic remote template download tests
- [x] Add CI/CD integration
- [x] Document validation requirements

### Phase 3: Comprehensive Validation (Week 2)
- [x] Full integration testing
- [ ] Template health monitoring
- [ ] Automated failure reporting

## Monitoring and Maintenance

### Regular Health Checks
- Weekly automated template validation runs
- Quarterly manual template review
- Annual template ecosystem assessment

### Performance Metrics
- Template download success rate
- User project creation success rate
- Time to detect and resolve template issues

## Post-Install Commands Support

Templates can now include optional post-install commands that execute automatically after template files are copied. This feature addresses templates that require additional setup steps.

### Configuration Schema

```typescript
interface TemplateDefinition {
  // ... existing fields ...
  postInstall?: {
    description?: string; // Optional description of setup steps
    commands: Array<{
      command: string; // Command to execute (e.g., "npm run generate")
      workingDirectory?: string; // Optional subdirectory (relative to project root)
      description?: string; // Optional command description
      timeout?: number; // Optional timeout in milliseconds (default: 60000)
    }>;
  };
}
```

### Example Configuration

```typescript
"basic-polkadot-dapp": {
  name: "Basic Polkadot DApp",
  description: "Official React + Solidity + Hardhat template from Parity Technologies",
  framework: "React",
  category: "fullstack",
  source: {
    type: "remote",
    repository: "paritytech/create-polkadot-dapp",
    branch: "main",
    directory: "templates/react-solidity-hardhat"
  },
  features: ["React", "TypeScript", "Vite", "Tailwind CSS", "Solidity", "Hardhat"],
  postInstall: {
    description: "Install dependencies and generate frontend components",
    commands: [
      {
        command: "npm install",
        workingDirectory: "frontend",
        description: "Installing frontend dependencies",
        timeout: 180000 // 3 minutes
      },
      {
        command: "npm run generate",
        workingDirectory: "frontend",
        description: "Generate frontend components and setup required dependencies",
        timeout: 120000 // 2 minutes
      }
    ]
  }
}
```

### Common Use Cases

- **Dependency Installation**: `npm install` - Install template dependencies (typically first)
- **Code Generation**: `npm run generate` - Generate boilerplate components (after dependencies)
- **Asset Building**: `npm run build:initial` - Build initial assets
- **Configuration Setup**: `npm run setup` - Initialize configuration files

**⚠️ Important**: Commands that depend on node_modules (like `npm run generate`) must be preceded by `npm install` in the commands array.

### Validation Requirements

Post-install commands are automatically validated:
- Commands must be non-empty strings
- Timeout values must be between 10s and 10 minutes
- Working directories must be valid relative paths
- Commands execute with proper error handling and timeouts

## Contributing Guidelines

### For Contributors Adding Templates

1. **Validation Required:** All new templates must pass validation checklist
2. **Testing:** Include tests that verify template functionality
3. **Documentation:** Provide clear setup and usage instructions
4. **Maintenance:** Commit to maintaining template or transferring ownership
5. **Post-Install Commands:** Document any required post-install steps and include them in template configuration

### Review Process

1. **Initial Review:** Template functionality and structure assessment
2. **Validation Testing:** Automated and manual validation execution
3. **Integration Testing:** Verify template works with kit-dot CLI
4. **Documentation Review:** Ensure adequate documentation provided
5. **Approval:** Template added to registry and validation suite

---

*This document ensures kit-dot maintains high-quality templates and prevents production failures like the paritytech/create-polkadot-dapp branch issue (GitHub Issue #4).*