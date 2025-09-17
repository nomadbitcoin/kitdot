# kitdot: TypeScript Development Toolkit for Polkadot Cloud

## Overview

kitdot is a TypeScript CLI toolkit for building fully decentralized applications on Polkadot Cloud infrastructure. It provides standardized project templates and scaffolding for developers working with smart contracts, frontends, and decentralized cloud services. Currently in development as a project initialization tool with upcoming features for complete dApp development workflow.

## Problem Statement

**Awareness**: Developers working with Polkadot Cloud face fragmented tooling
**Acquisition**: Setting up new projects requires manual configuration of multiple tools
**Activation**: First API calls and contract deployments involve complex setup
**Retention**: Inconsistent patterns make long-term development difficult
**Product**: Missing standardized workflows for Polkadot Cloud development

## Solution Architecture

kitdot addresses these issues through:

## Current Features

### Project Initialization

```bash
kitdot init my-project
```

- Generates standardized project structure for Polkadot Cloud
- Includes frontend and contracts templates
- TypeScript configuration for all components
- Basic project scaffolding and dependencies setup
- Supports both monorepo and single repo project structures

## Current Development Status

### Phase 0: Foundation ✅ COMPLETE

- ✅ Project structure refactoring (Stories 1.1 completed)
- ✅ Template validation system with CI/CD integration
- ✅ Official Parity template integration (react-solidity-hardhat)
- ✅ Remote template loading from GitHub repositories
- ✅ Core CLI functionality with TypeScript compilation

### Phase 1: Core Features 🔄 IN PROGRESS (Target: Week 2)

- **UX Enhancement**: Implement ink.js terminal components for modern CLI experience
- **NPX Distribution**: Complete package publishing and cross-platform testing
- **Dependency Integration**: Reliable `-i` flag functionality for auto-installation
- **Error Handling**: Comprehensive error messages and recovery strategies

### Phase 2: MVP Launch 📋 PLANNED (Target: Week 3 - Hackathon Ready)

- **Live Deployment Testing**: Verify contracts deploy to PolkaVM successfully
- **Beta User Testing**: Gather feedback from 5+ experienced developers
- **Demo Preparation**: Hackathon presentation materials and live demo

## Post-MVP Features (Deferred)

### AI Integration & Automation

- Model Context Protocol server for development assistance
- GPT workflow integration for template discovery
- Intelligent project analysis and recommendations

### Enhanced Template Ecosystem

- Thirdweb contracts compatibility testing (130+ pre-built contracts)
- Advanced wallet integration templates
- Multiple framework support (Vue, Svelte, Angular)
- Template marketplace and community contributions

### Advanced Embedded Tools

- **Pop CLI v0.9.0+**: Integrated local PolkaVM node management
- **Scaffold-eth components**: Reusable UI components for Web3
- **Advanced SDK integrations**: Beyond basic template scaffolding

## Project Generated Structure

## Fullstack Project Structure

```
my-polkadot-dapp/
├── contracts/            # Smart contract development (flat structure)
│   ├── src/              # Solidity contracts
│   ├── test/             # Contract tests
│   ├── scripts/          # Deployment scripts
│   ├── hardhat.config.ts # Hardhat configuration
│   └── package.json      # Contract dependencies
├── front/                # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   └── generated.ts  # Contract types
│   ├── package.json      # Frontend dependencies
│   └── tsconfig.json     # TypeScript config
├── docs/                 # mdbook docs
│   ├── src/
│   └── book.toml
└── package.json          # Monorepo config
```

## Frontend-Only Project Structure

```
my-frontend-dapp/
├── src/                  # Frontend source code
│   ├── components/       # UI components
│   ├── App.tsx           # Main application
│   └── main.tsx          # Application entry
├── public/               # Static assets
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Build configuration
└── README.md             # Project documentation
```

## Project Templates

kitdot generates complete project structures with the following components:

### Smart Contracts

- ✅ Hardhat development environment with testing framework
- ✅ Official Parity templates integration (react-solidity-hardhat)
- ✅ Simplified flat directory structure (develop/deploy → contracts/)
- 🔄 PolkaVM deployment scripts and testing
- 🔄 Local PolkaVM node integration via pop cli

### Frontend Applications

- ✅ React + TypeScript with Polkadot Cloud integration
- ✅ Official Parity template integration (paritytech/create-polkadot-dapp)
- ✅ Templates loaded as-is without forced modifications
- ✅ Single repo mode for frontend-only projects
- ✅ Tailwind CSS and Vite build system
- 🔄 Enhanced terminal UX with ink.js components

### Documentation

- mdbook project documentation
- Auto-generated API references
- Developer guides and deployment instructions

## Target Use Cases

### Primary Target: Ethereum Developers Transitioning to Polkadot

- **Experience Level**: Developers with existing Ethereum/Web3 experience
- **Pain Point**: Complex setup process for Polkadot development environment
- **Value Proposition**: Familiar patterns with Polkadot-specific optimizations
- **Success Metric**: Contracts deployed to PolkaVM within first project initialization

### Secondary Target: Web3 Development Teams

- **Use Case**: Standardizing development workflows across team members
- **Value Proposition**: Consistent project structure and tooling
- **Success Metric**: Reduced onboarding time for new team members

### Hackathon & Rapid Prototyping

- **Use Case**: Quick project setup for hackathons and proof-of-concepts
- **Value Proposition**: Zero-to-deployed in minutes rather than hours
- **Success Metric**: Live demos with working PolkaVM contracts

### Educational & Portfolio Development

- **Use Case**: Learning Polkadot development, building portfolio projects
- **Value Proposition**: Official templates ensure best practices
- **Success Metric**: Functional projects that demonstrate Web3 capabilities

### Benefits

- Reduced setup time from hours to minutes
- Consistent project structure across teams
- Type-safe development with TypeScript
- Integrated testing and deployment workflows

## Technology Stack

### Blockchain

- **Polkadot Cloud**: Primary deployment target
- **Passet Hub**: Testnet for development
- **EVM Compatibility**: Ethereum-compatible contracts

### Development

- **TypeScript**: Type safety across all components
- **Hardhat**: Smart contract development, testing and deployment
- **React**: Frontend user interfaces
- **Wagmi**: Blockchain interaction hooks
- **Vite**: Fast development server and builds

### Infrastructure

- **Polkadot Cloud**: Primary deployment target
- **Official Templates**: Parity-maintained project templates
- **mdbook**: Documentation generation
- **TypeScript**: End-to-end type safety

## Installation

```bash
npm install -g kitdot
```

## Quick Start

### Current (v0.1.0)

```bash
# Install from source (development)
git clone https://github.com/your-org/kitdot
cd kitdot
npm install && npm run build
npm link

# Initialize new project
kitdot init my-dapp
cd my-dapp
npm install
```

### Target MVP (v0.2.0 - Hackathon Ready)

```bash
# Global installation
npx kitdot init my-dapp

# With auto-dependency installation
npx kitdot init my-dapp -i

# Enhanced UX with terminal components
# Validated templates with guaranteed deployment success
```

## Available Commands

### Current Commands

```bash
kitdot init [name]     # Create new project with template selection
kitdot init [name] -i  # Create project with auto-dependency installation
```

### Project Templates Available

- **basic-polkadot-dapp**: Official Parity React + Solidity + Hardhat template
- **social-login-web3-react**: React dApp with Web3Auth social login integration
- **Project Types**: Fullstack, frontend-only, contracts-only

### Post-MVP Commands (Planned)

```bash
kitdot templates       # Browse template library with community contributions
kitdot contracts       # Browse thirdweb contract library (130+ contracts)
kitdot deploy         # One-command deployment to PolkaVM networks
kitdot validate       # Validate project configuration and dependencies
```

## Development Workflow (Planned)

### 1. Project Initialization

```bash
kitdot init my-dapp          # Generate complete project structure
```

### 2. Smart Contract Development

- Official Parity templates
- Hardhat-based development environment
- Deployment to Polkadot Cloud networks

### 3. Frontend Development

- React + TypeScript templates
- Official Parity template integration
- Single repo and monorepo support

## Configuration

### Environment Variables

```bash
# .env (for future features)
POLKADOT_CLOUD_API_KEY=your_api_key
```

### Project Structure

Generated projects include pre-configured:

- Polkadot Cloud network connections
- Smart contract deployment scripts
- Frontend template integration
- TypeScript configuration

## Contributing

### Development Setup

```bash
git clone https://github.com/your-org/kitdot
cd kitdot
npm install
npm run build
npm link
```

### Testing

```bash
npm test                      # Run test suite
npm run lint                  # Check code style
npm run lint:fix              # Fix formatting
```

### Project Templates

kitdot provides several templates:

- `basic-polkadot-dapp/`: Official Parity React + Solidity + Hardhat template
- `social-login-web3-react/`: React with Web3Auth social login integration
- Additional templates for specific use cases

### Official Template Integration

- Uses official Parity create-polkadot-dapp templates
- React + Solidity + Hardhat development stack
- Templates loaded as-is without modifications
- Authentic Polkadot development patterns

## Requirements

- Node.js >= 18.0.0
- npm or yarn
- Git

## License

MIT License - see LICENSE file for details.

## Resources

- [Polkadot Cloud Documentation](https://docs.polkadot.cloud/)
- [Foundry Documentation](https://book.getfoundry.sh/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Hardhat Documentation](https://hardhat.org/docs)

---

kitdot provides standardized tooling for Polkadot Cloud development. Get started with `kitdot init` and begin building on Polkadot infrastructure.
