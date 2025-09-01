# Kit-Dot Frontend Architecture Document

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-08-29 | 1.0 | Initial CLI Frontend Architecture | Winston (Architect Agent) |

## Template and Framework Selection Strategy

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

## Frontend Tech Stack Management

**CLI-Level Technology Stack Strategy:**

The Kit-Dot CLI implements a **template-agnostic technology management approach** where each template defines its own stack while the CLI provides consistent project structure and tooling interfaces.

### Technology Stack Table - CLI Level

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

**CLI Responsibility Boundaries:**
- ✅ Project structure creation and enforcement
- ✅ Template copying and configuration injection
- ✅ Remote template fetching using degit
- ✅ Cross-component communication interfaces
- ✅ Environment configuration management
- ❌ Framework-specific code generation
- ❌ Build process execution and optimization
- ❌ Template-specific patterns and conventions

## Project Structure Standards

**CLI-Generated Project Structure:**

The Kit-Dot CLI enforces a **standardized monorepo structure** that remains consistent regardless of template choice, ensuring predictable project organization across all generated applications.

```
project-name/
├── front/                 # Frontend application (template-specific)
│   ├── src/               # Source code
│   ├── package.json       # Frontend dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   └── [template-files]   # Framework-specific files
├── contracts/             # Smart contract development
│   ├── develop/           # Foundry development environment
│   └── deploy/            # Hardhat deployment scripts
├── cloud-functions/       # Decentralized backend functions
│   ├── src/               # Function implementations
│   └── acurast.config.ts  # Parachain deployment config
├── docs/                  # Project documentation
│   ├── src/               # mdbook source
│   └── book.toml          # Documentation configuration
├── package.json           # Root package.json (monorepo)
└── README.md              # Project overview
```

**Frontend Directory Standards:**

All frontend templates must conform to these CLI expectations:
- **Location**: Always `/front` directory in project root
- **Package Naming**: `${projectName}-frontend` in package.json
- **TypeScript**: Must include tsconfig.json configuration
- **Standard Scripts**: `dev`, `build`, `lint`, `preview` in package.json
- **Integration Points**: Support for contract interaction and cloud function calls

## Component Standards Framework

**CLI Component Standards Strategy:**

The Kit-Dot CLI defines **interface standards** rather than implementation standards, allowing templates to use their preferred patterns while maintaining consistent integration points across the generated project ecosystem.

**Template Interface Requirements:**

Every frontend template must provide these standardized interfaces:

```typescript
// Required exports for CLI-generated projects
export interface TemplateStandards {
  // Contract interaction interface
  contractIntegration: ContractHooks | ContractServices;
  
  // Cloud function communication
  cloudFunctionClient: ApiClient | FunctionCaller;
  
  // Wallet connection standardization  
  walletProvider: WalletInterface;
  
  // Project configuration access
  projectConfig: ProjectSettings;
}
```

**CLI Template Validation:**
Templates must include these files for CLI compatibility:
- `package.json` with standard scripts (`dev`, `build`, `lint`)
- `tsconfig.json` for TypeScript support
- Integration point exports for monorepo communication
- Environment configuration handling

**Component Flexibility:**

Templates maintain full autonomy over:
- **Component Architecture**: Function vs Class components, composition patterns
- **State Management**: Redux, Zustand, Context, or framework-specific solutions  
- **Styling Approach**: CSS Modules, Styled Components, Tailwind, CSS-in-JS
- **File Organization**: Feature-based, layer-based, or custom structures
- **Testing Patterns**: Jest, Vitest, Testing Library configurations

## State Management Architecture

**CLI State Management Philosophy:**

The Kit-Dot CLI implements a **template-delegated state management approach** where state patterns are entirely template-specific, while the CLI provides consistent **cross-component communication interfaces** for monorepo integration.

**CLI-Level State Coordination:**

```typescript
// CLI provides inter-component communication, not state management
interface ProjectStateInterface {
  // Contract state sharing
  contractEvents: EventBus;
  
  // Cloud function state synchronization  
  functionResults: CrossComponentData;
  
  // Shared project configuration
  projectSettings: ConfigurationStore;
}
```

**CLI State Management Responsibilities:**

The CLI handles only **cross-boundary state**:
- **Project Configuration**: Shared across all components
- **Contract Connection State**: Available to frontend and cloud functions
- **Environment Variables**: Consistent access patterns
- **Build State**: Template compilation and deployment status

**Template State Management Responsibilities:**

Templates handle **application-specific state**:
- UI state and user interactions
- Component-level data management  
- Application business logic state
- Template-specific async operations

## API Integration Architecture

**CLI API Integration Strategy:**

The Kit-Dot CLI establishes **standardized API integration interfaces** while allowing templates to implement their preferred HTTP clients and request patterns, ensuring consistent connectivity across the Polkadot Cloud ecosystem.

**CLI-Provided API Infrastructure:**

```typescript
// CLI generates these integration points
interface APIIntegrationStandards {
  // Smart contract interaction
  contractAPI: {
    endpoint: string;
    wagmiConfig: WagmiConfiguration;
    chainConfig: PolkadotCloudConfig;
  };
  
  // Decentralized cloud functions
  cloudFunctionAPI: {
    acurastEndpoint: string;
    functionManifest: FunctionRegistry;
    authConfig: DecentralizedAuth;
  };
  
  // IPFS/Crust storage
  storageAPI: {
    apillonConfig: ApillonSDKConfig;
    ipfsGateways: string[];
    crustConfig: CrustNetworkConfig;
  };
}
```

**Template API Client Freedom:**

Templates can use any HTTP client implementation:
- **React Templates**: Fetch, Axios, TanStack Query, SWR
- **Vue Templates**: Axios, Vue Query, Pinia async actions
- **Framework Agnostic**: Native fetch, custom clients

**Decentralized API Architecture:**

- **No Traditional REST APIs**: All communication through blockchain or decentralized infrastructure
- **Acurast Functions**: Serverless execution on parachain infrastructure
- **Contract Events**: Real-time blockchain state monitoring
- **IPFS Communication**: Content-addressed data exchange

## Remote Template Loading Architecture

**Degit Integration System:**

The CLI uses degit for on-demand template fetching from GitHub repositories:

```typescript
// Degit source construction: repo/directory#branch
interface RemoteTemplateSource {
  type: 'remote';
  repository: string;  // e.g., 'w3b3d3v/web3auth-examples'
  branch?: string;     // e.g., 'web3dev-version'
  directory?: string;  // e.g., 'quick-starts/react-quick-start'
}

// Results in degit source: 
// 'w3b3d3v/web3auth-examples/quick-starts/react-quick-start#web3dev-version'
```

**Template Loading Workflow:**

1. **User Selection**: CLI presents available templates based on project type and category
2. **Template Validation**: Ensure selected template exists in registry
3. **Remote Fetching**: Use degit to clone specific repository/directory/branch
4. **File Customization**: Update package.json, component names, placeholder replacement
5. **Configuration Injection**: Ensure required TypeScript and Wagmi configs exist
6. **Optional Setup**: Prompt user for optional post-install configuration
7. **Cleanup**: Remove temporary files after processing

**Degit Source Construction Rules:**
- Repository path comes first: `owner/repo-name`
- Directory path is appended: `/path/to/template`  
- Branch specifier comes last: `#branch-name`
- Final format: `owner/repo/path/to/template#branch-name`

**Template Loading Strategy:**
```typescript
// Templates must be specified via registry - no fallback
if (!config.template) {
  throw new Error("Template must be specified for frontend setup");
}

const template = getTemplate(config.template.name);
await templateLoader.loadTemplate(template, targetDir, config);
```

**Error Handling:**
- Invalid branch names result in clear error messages
- Network failures fall back to cached templates when available
- Missing directories are reported with specific path information

## Routing Architecture

**CLI Routing Strategy:**

The Kit-Dot CLI implements a **template-autonomous routing approach** where routing patterns are entirely template-specific, while the CLI provides **consistent navigation interfaces** for cross-component integration within the monorepo structure.

**CLI-Level Routing Coordination:**

```typescript
// CLI provides navigation hooks, not routing implementation
interface ProjectNavigationInterface {
  // Deep linking to documentation
  navigateToDocsSection(section: string): void;
  
  // Cross-component navigation patterns
  openContractInterface(contractAddress: string): void;
  
  // External navigation to decentralized services
  navigateToIPFSContent(hash: string): void;
}
```

**Template Routing Freedom:**

Each template can implement any routing solution:
- **React Templates**: React Router, Reach Router, Next.js Router, Wouter
- **Vue Templates**: Vue Router, Nuxt.js routing, custom solutions
- **Svelte Templates**: SvelteKit routing, Page.js, custom routing
- **Angular Templates**: Angular Router, UI-Router

**Development Environment Routing:**

- **Frontend**: `http://localhost:3000` (template-specific port)
- **Documentation**: `http://localhost:3001` (mdbook serve)
- **Contract Explorer**: Links to testnet explorers
- **IPFS Gateway**: Links to decentralized content

**Production Routing Architecture:**

- **Frontend**: Hosted on IPFS via Crust Network + Apillon
- **Static Site**: Documentation deployed to decentralized hosting
- **Deep Links**: Direct links to contract interfaces and cloud functions
- **Domain Management**: ENS or Polkadot domain integration

## CLI Architecture Principles

### CLI Responsibility Boundaries

**✅ CLI Responsibilities:**
- Project structure creation and enforcement
- Template copying and configuration injection
- Remote template fetching with degit
- Template registry management and selection logic
- Monorepo integration and coordination
- Cross-component communication interfaces
- Environment configuration management
- Development tooling integration
- Template categorization and filtering
- Documentation URL integration

**❌ CLI Non-Responsibilities:**
- Framework-specific code generation
- Build process execution and optimization
- Dependency version management
- Application business logic
- Template-specific patterns and conventions
- Template content maintenance (handled by template repositories)

### Template Development Guidelines

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

## Template System Examples

### Successful Template Integration: Web3Auth Social Login

The `social-login-web3-react` template demonstrates the complete remote template workflow:

**Registry Configuration:**
```typescript
'social-login-web3-react': {
  name: 'React Web3Auth Social Login',
  description: 'React dApp template with Web3Auth social login - users authenticate with Google/Twitter/Facebook while blockchain interactions are abstracted away for seamless UX',
  framework: 'React',
  category: 'frontend',
  source: {
    type: 'remote',
    repository: 'w3b3d3v/web3auth-examples',
    branch: 'web3dev-version',
    directory: 'quick-starts/react-quick-start'
  },
  features: ['React', 'Web3Auth', 'Social Login', 'Google Auth', 'Twitter Auth', 'Facebook Auth', 'TypeScript', 'Seamless UX'],
  documentationUrl: 'https://kitdot-fronted-templates.w3d.community/quick-starts/react-quick-start/'
}
```

**User Experience:**
1. `kit-dot init my-social-dapp`
2. Select "🎨 Frontend only" 
3. Choose "React - React dApp template with Web3Auth social login..."
4. Template fetched from: `w3b3d3v/web3auth-examples/quick-starts/react-quick-start#web3dev-version`
5. Documentation displayed: Complete setup guide and API reference

**Key Architectural Benefits:**
- **Zero CLI Changes**: New templates added by registry updates only
- **Community Driven**: Templates maintained by domain experts
- **Version Specific**: Branch targeting ensures consistent template versions
- **Self Documenting**: Documentation URLs provide immediate user guidance

### Template Selection Logic in Action

**Frontend-Only Project Selection:**
```typescript
const availableTemplates = getTemplatesByCategory('frontend')
  .concat(getTemplatesByCategory('fullstack'));

// Results in:
// - React Web3Auth Social Login (frontend)
// - Basic Polkadot DApp (fullstack)
```

**User Interface Display:**
```
? Choose a frontend template: (Use arrow keys)
❯ React - React dApp template with Web3Auth social login - users authenticate with Google/Twitter/Facebook while blockchain interactions are abstracted away for seamless UX
  React - React + TypeScript + Vite + Tailwind with Polkadot Cloud integration
```

## Future Architecture Considerations

### Template Ecosystem Expansion
- Template discovery and marketplace mechanisms
- Version management and template updates
- Quality standards and template validation
- Community template contribution guidelines
- Automated template testing and validation

### CLI Evolution
- Enhanced cross-template compatibility testing
- Improved template configuration injection
- Better integration with Polkadot ecosystem tools
- Advanced monorepo management features
- Template performance analytics and usage metrics

### Remote Template Infrastructure
- Template caching strategies for offline development
- Template version pinning and update notifications
- Automated template validation and security scanning
- Community template submission and review process

---

*This document defines the CLI-level frontend architecture strategy for Kit-Dot. Individual templates maintain their own specific implementation documentation within their respective directories.*