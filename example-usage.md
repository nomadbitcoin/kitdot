# Kit-Dot Enhanced Template System

## Overview

Kit-Dot now supports both **local** and **remote** template loading using degit. This allows for:

- **Local Templates**: Bundled with the CLI (existing approach)
- **Remote Templates**: Fetched from GitHub repositories on-demand
- **Template Registry**: Centralized configuration of available templates
- **Framework Choice**: Users can select from multiple frontend frameworks

## Architecture

### Template Registry System

Templates are defined in `src/templates/registry.ts`:

```typescript
export const TEMPLATE_REGISTRY: TemplateRegistry = {
  'basic-polkadot-dapp': {
    name: 'Basic Polkadot DApp',
    description: 'React + TypeScript + Vite + Tailwind with Polkadot Cloud integration',
    framework: 'React',
    category: 'fullstack',
    source: {
      type: 'local',
      localPath: 'templates/basic-polkadot-dapp'
    },
    features: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Wagmi']
  },

  'nextjs-polkadot': {
    name: 'Next.js Polkadot DApp',
    description: 'Next.js-based DApp with SSR and Polkadot integration',
    framework: 'Next.js',
    category: 'frontend',
    source: {
      type: 'remote',
      repository: 'polkadot-templates/nextjs-dapp',
      branch: 'main',
      directory: 'template' // Optional subdirectory
    },
    features: ['Next.js', 'TypeScript', 'SSR', 'Polkadot SDK']
  },

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
};
```

### Template Loading Process

1. **User Selection**: CLI presents available templates based on project type
2. **Template Resolution**: System determines local vs remote source
3. **Remote Fetching**: Uses degit to clone specific repository/directory/branch
4. **Local Processing**: Copies local templates from bundled directory
5. **Customization**: Updates package.json, file contents with project name
6. **Cleanup**: Removes temporary files for remote templates

### Degit Integration

Remote templates are fetched using degit with support for:

- **Repository**: Any GitHub repository (`user/repo`)
- **Branches/Tags**: Specific branch or tag (`#branch-name`)
- **Subdirectories**: Template in subfolder (`repo/subfolder`)
- **Caching**: Degit handles caching for faster subsequent fetches

Example degit sources:
- `polkadot-templates/react-dapp` - Main branch, root directory
- `polkadot-templates/vue-dapp#v2.0` - Specific tag
- `polkadot-templates/monorepo/vue-template` - Subdirectory

## Usage Examples

### Current CLI Flow

```bash
kit-dot init my-project
```

1. **Project Type Selection**:
   - 🌟 Full-stack Dapp (Frontend + Smart Contracts + Cloud Functions)
   - 🎨 Frontend only (React app for Polkadot)
   - ⚙️ Backend only (Smart Contracts + Cloud Functions)

2. **Template Selection** (if frontend is included):
   - React - Basic Polkadot DApp (React + TypeScript + Vite + Tailwind)
   - React - React Web3Auth Social Login (Social login with Google/Twitter/Facebook)
   - Next.js - Next.js-based DApp with SSR and Polkadot integration
   - Vue - Vue 3 + Composition API with Polkadot Cloud
   - Svelte - SvelteKit-based DApp with Polkadot integration

3. **Project Generation**:
   - Templates are fetched/copied
   - Files are customized with project name
   - Project structure is created

## Benefits

### For CLI Maintainers
- **Reduced Bundle Size**: Templates don't need to be bundled with CLI
- **Easier Updates**: Templates can be updated independently
- **Community Templates**: Easy to add third-party templates

### For Template Authors
- **Independent Repositories**: Templates can be maintained separately
- **Version Control**: Templates can have their own versioning
- **Specialized Templates**: Framework-specific optimizations

### for Developers
- **Framework Choice**: Select preferred frontend framework
- **Up-to-date Templates**: Always get latest template versions
- **Specialized Options**: Templates optimized for specific use cases

## Adding New Templates

### 1. Remote Template

```typescript
// Add to registry.ts
'angular-polkadot': {
  name: 'Angular Polkadot DApp',
  description: 'Angular-based DApp with Polkadot integration',
  framework: 'Angular',
  category: 'frontend',
  source: {
    type: 'remote',
    repository: 'polkadot-templates/angular-dapp',
    branch: 'main'
  },
  features: ['Angular', 'TypeScript', 'RxJS', 'Polkadot SDK']
}
```

### 2. Local Template

```typescript
// Add to registry.ts  
'custom-local': {
  name: 'Custom Local Template',
  description: 'Locally bundled custom template',
  framework: 'React',
  category: 'frontend',
  source: {
    type: 'local',
    localPath: 'templates/custom-local'
  },
  features: ['Custom', 'Features']
}
```

## Template Requirements

All templates must include:

- **package.json** with standard scripts (`dev`, `build`, `lint`)
- **tsconfig.json** for TypeScript support
- **Integration points** for contract interaction and cloud functions
- **Placeholder replacement** support (`{{project-name}}`, `template-name`)

## File Structure

```
kit-dot/
├── src/
│   ├── templates/
│   │   └── registry.ts          # Template definitions
│   ├── utils/
│   │   ├── template-loader.ts   # Degit integration
│   │   └── setup-frontend.ts    # Updated to use new system
│   └── commands/
│       └── init.ts              # Enhanced with template selection
├── templates/
│   └── basic-polkadot-dapp/     # Local template (existing)
└── .kit-dot-cache/              # Temporary remote template storage
```

This enhanced system maintains backward compatibility while enabling flexible template management and community contributions.

## Featured Template: Web3Auth Social Login

The `social-login-web3-react` template provides a seamless user experience by abstracting blockchain complexity:

### Key Features
- **Social Authentication**: Users login with familiar social media accounts (Google, Twitter, Facebook)
- **Seamless UX**: Blockchain interactions happen in the background
- **Web3Auth Integration**: Enterprise-grade social login infrastructure
- **React + TypeScript**: Modern development stack
- **Zero Web3 Friction**: Users don't need crypto wallets to get started

### Usage Example
```bash
kit-dot init my-social-dapp
# Select "Frontend only" or "Full-stack Dapp"
# Choose "React - React Web3Auth Social Login"
# Template is fetched from w3b3d3v/web3auth-examples repository
```

### What You Get
- Pre-configured Web3Auth setup
- Social login components (Google, Twitter, Facebook)
- Wallet abstraction layer
- Example blockchain interactions
- TypeScript type definitions
- Complete documentation at: https://kitdot-fronted-templates.w3d.community/quick-starts/react-quick-start/

This template is perfect for projects that want to onboard mainstream users without requiring crypto knowledge or wallet setup.