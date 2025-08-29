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

**Available Templates:**
- `basic-polkadot-dapp`: React + TypeScript + Vite + Tailwind (local, fullstack category)
- `social-login-web3-react`: React + Web3Auth social login (remote, frontend category)
- Future templates: Vue, Svelte, Angular implementations

**Template Selection Logic:**
- **Frontend-only projects**: Show both frontend and fullstack category templates
- **Fullstack projects**: Show only fullstack category templates
- **Backend-only projects**: No frontend templates shown
