# Kit-Dot: TypeScript Development Toolkit for Polkadot Cloud

## Overview

Kit-Dot is a TypeScript CLI toolkit for building fully decentralized applications on Polkadot Cloud infrastructure. It provides standardized project templates and scaffolding for developers working with smart contracts, frontends, and decentralized cloud services. Currently in development as a project initialization tool with upcoming features for complete dApp development workflow.

## Problem Statement

**Awareness**: Developers working with Polkadot Cloud face fragmented tooling
**Acquisition**: Setting up new projects requires manual configuration of multiple tools
**Activation**: First API calls and contract deployments involve complex setup
**Retention**: Inconsistent patterns make long-term development difficult
**Product**: Missing standardized workflows for Polkadot Cloud development

## Solution Architecture

Kit-Dot addresses these issues through:

## Current Features

### Project Initialization

```bash
kit-dot init my-project
```

- Generates standardized project structure for Polkadot Cloud
- Includes frontend and contracts templates
- TypeScript configuration for all components
- Basic project scaffolding and dependencies setup
- Supports both monorepo and single repo project structures

## Coming Soon Features

### MCP Server Integration

- Model Context Protocol server for AI development assistance
- Automated code generation and smart contract interaction
- Intelligent project analysis and recommendations

### Enhanced Templates

- Templates with seamless wallet generation and onboarding
- Pre-configured authentication flows
- Ready-to-use wallet integration patterns

### 130 Pre-built Smart Contracts

- Audited contract library from thirdweb integration
- NFT, token, marketplace, and governance contracts
- One-command deployment of battle-tested contracts
- Upgradeable proxy patterns included

### Fully Decentralized Cloud Services

- **Acurast Parachain**: Decentralized cloud functions execution
- **Crust Network**: IPFS hosting and storage via Apillon SDK
- **Polkadot Cloud Native**: No AWS or traditional web2 dependencies
- Complete decentralized application stack

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

Kit-Dot generates complete project structures with the following components:

### Smart Contracts

- Hardhat development environment with testing framework
- Deployment scripts for Polkadot Cloud networks
- Official Parity templates integration
- Simplified flat directory structure

### Frontend Applications

- React + TypeScript with Polkadot Cloud integration
- Official Parity template integration
- Tailwind CSS for styling
- Templates loaded as-is without forced modifications
- Single repo mode for frontend-only projects

### Documentation

- mdbook project documentation
- Auto-generated API references
- Developer guides and deployment instructions

## Target Use Cases

### Development Teams

- Setting up new Polkadot Cloud projects
- Standardizing development workflows
- Deploying smart contracts to testnets
- Building frontend applications with wallet integration

### Individual Developers

- Learning Polkadot Cloud development
- Prototyping dApp ideas
- Contributing to existing projects
- Building portfolio projects

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
npm install -g kit-dot
```

## Quick Start

```bash
# Initialize new project
kit-dot init my-dapp
cd my-dapp

# Install dependencies
npm install

# Project structure is ready for development
# Additional features coming soon
```

## Available Commands

```bash
kit-dot init [name]     # Create new project (current)
```

### Coming Soon Commands

```bash
kit-dot templates       # Browse Dapp templates library
kit-dot contracts       # Browse thirdweb contract library
```

## Development Workflow (Planned)

### 1. Project Initialization

```bash
kit-dot init my-dapp          # Generate complete project structure
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
git clone https://github.com/your-org/kit-dot
cd kit-dot
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

Kit-Dot provides several templates:

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

Kit-Dot provides standardized tooling for Polkadot Cloud development. Get started with `kit-dot init` and begin building on Polkadot infrastructure.
