# Frontend Tech Stack Management

**CLI-Level Technology Stack Strategy:**

The Kit-Dot CLI implements a **template-agnostic technology management approach** where each template defines its own stack while the CLI provides consistent project structure and tooling interfaces.

## Technology Stack Table - CLI Level

| Category | Approach | Purpose | Rationale |
|----------|----------|---------|-----------|
| Template System | fs-extra + Template Directory Structure | Scaffold frontend projects | Allows multiple frameworks without CLI complexity |
| Project Structure | Standardized `/front` directory | Consistent monorepo layout | Developer expectations across all templates |
| Configuration Management | Dynamic JSON manipulation | Inject project names/configs | Template independence with project customization |
| Dependency Management | Template-specific package.json | Framework-appropriate dependencies | Each template optimized for its use case |
| Build Integration | Template-defined scripts | Framework-specific build processes | CLI doesn't need build system knowledge |
| TypeScript Support | Universal across templates | Type safety requirement | Consistent developer experience |
| Polkadot Integration | Template-specific approach | Blockchain connectivity | Different templates can use different Polkadot SDKs |

**Template-Agnostic Patterns:**
- All frontend templates must include `/front` directory structure
- All templates must support TypeScript configuration  
- All templates must include standard npm scripts: `dev`, `build`, `lint`
- All templates must integrate with monorepo structure

**Template-Specific Flexibility:**
- Framework choice (React, Vue, Svelte, Angular)
- State management approach
- Styling solution
- Build tooling
- Polkadot/Substrate integration library
