# Template and Framework Selection Strategy

**Kit-Dot CLI Frontend Architecture Overview:**

The Kit-Dot CLI implements a **template-driven frontend architecture** that supports multiple project types while maintaining consistent tooling patterns across all generated projects.

**CLI Template Management Strategy:**
- **Template Repository**: `/templates/` directory contains complete project scaffolding
- **Dynamic Template Selection**: Based on project type (fullstack, frontend-only, backend-only)  
- **Template Copying**: Uses `fs-extra.copy()` with intelligent filtering to exclude build artifacts
- **Configuration Injection**: Dynamically updates `package.json`, component names, and configs per project

**Architecture Decision - Multi-Template Support:**
- Each template is self-contained with its own technology choices
- CLI focuses on **project structure consistency** rather than technology standardization
- Future templates can introduce different frameworks (Vue, Svelte, Angular) without CLI changes
- Template-specific documentation lives within each template directory

**Current Template: `basic-polkadot-dapp`**
- Framework: React + TypeScript + Vite + Tailwind
- Polkadot Integration: Wagmi for EVM compatibility
- This is ONE template among future many
