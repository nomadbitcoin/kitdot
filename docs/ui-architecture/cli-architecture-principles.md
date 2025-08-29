# CLI Architecture Principles

## CLI Responsibility Boundaries

**✅ CLI Responsibilities:**
- Project structure creation and enforcement
- Template copying and configuration injection
- Monorepo integration and coordination
- Cross-component communication interfaces
- Environment configuration management
- Development tooling integration

**❌ CLI Non-Responsibilities:**
- Framework-specific code generation
- Build process execution and optimization
- Dependency version management
- Application business logic
- Template-specific patterns and conventions

## Template Development Guidelines

**Required Template Standards:**
1. **Directory Structure**: Must work within `/front` directory
2. **TypeScript Support**: Must include proper tsconfig.json
3. **Standard Scripts**: Must support `dev`, `build`, `lint` commands
4. **Integration Interfaces**: Must expose contract and cloud function hooks
5. **Configuration Handling**: Must support project name injection

**Template Freedom Areas:**
1. **Framework Choice**: Any frontend framework or vanilla JS
2. **Styling Solution**: Any CSS approach or styling library
3. **State Management**: Any state solution appropriate to framework
4. **Component Architecture**: Any component patterns and organization
5. **Build Tooling**: Any bundler or build system
