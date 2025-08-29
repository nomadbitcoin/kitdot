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
- Includes frontend, contracts, and cloud-functions templates
- TypeScript configuration for all components
- Basic project scaffolding and dependencies setup

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

```
my-polkadot-dapp/
├── contracts/
│   ├── develop/          # Foundry development
│   │   ├── src/          # Solidity contracts
│   │   ├── test/         # Contract tests
│   │   └── foundry.toml  # Configuration
│   └── deploy/           # Hardhat deployment
│       ├── scripts/      # Deploy scripts
│       └── hardhat.config.ts
├── front/                # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── wagmi-config.ts # Polkadot Cloud config
│   │   └── generated.ts  # Contract types
│   └── package.json
├── cloud-functions/      # Acurast Functions
│   ├── src/
│   │   ├── handlers/     # Decentralized API handlers
│   │   └── services/     # Business logic
│   └── acurast.config.ts # Parachain deployment config
├── docs/                 # mdbook docs
│   ├── src/
│   └── book.toml
└── package.json          # Monorepo config
```

## Project Templates

Kit-Dot generates complete project structures with the following components:

### Smart Contracts

- Foundry development environment with testing framework
- Hardhat deployment scripts for Polkadot Cloud networks
- Access to 130+ audited contracts from thirdweb library
- Upgradeable proxy patterns and OpenZeppelin standards

### Frontend Applications

- React + TypeScript with Polkadot Cloud integration
- Wagmi hooks for EVM compatibility
- Tailwind CSS for styling
- Automatic wallet generation and onboarding flows

### Decentralized Cloud Functions

- Acurast parachain function templates
- TypeScript development environment
- Contract event monitoring and indexing
- Fully decentralized execution environment

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
- **Foundry**: Smart contract development and testing
- **Hardhat**: Contract deployment and verification
- **React**: Frontend user interfaces
- **Wagmi**: Blockchain interaction hooks
- **Vite**: Fast development server and builds

### Decentralized Infrastructure

- **Acurast Parachain**: Decentralized cloud function execution
- **Crust Network**: IPFS hosting and storage
- **Apillon SDK**: Polkadot Cloud services integration
- **mdbook**: Documentation generation
- **No Web2 Dependencies**: Fully decentralized stack

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

- Access to 130+ audited contracts from thirdweb
- Foundry-based development environment
- Deployment to Polkadot Cloud networks

### 3. Frontend Development

- React + TypeScript templates
- Automatic wallet generation and onboarding
- Polkadot Cloud integration

### 4. Decentralized Cloud Functions

- Acurast parachain deployment
- Event monitoring and indexing
- Fully decentralized backend services

### 5. Hosting and Storage

- IPFS hosting via Crust Network
- Decentralized storage solutions
- Apillon SDK integration

## Configuration

### Environment Variables

```bash
# .env
APOLLON_API_KEY=your_api_key
APOLLON_API_SECRET=your_secret
APOLLON_WEBSITE_UUID=your_uuid
```

### Project Structure

Generated projects include pre-configured:

- Polkadot Cloud network connections
- Acurast function deployment settings
- IPFS hosting configuration via Crust
- Smart contract deployment scripts
- Frontend wallet integration

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

- `basic-polkadot-dapp/`: Full-stack decentralized application
- `contract-only/`: Smart contract development (coming soon)
- `frontend-only/`: Frontend application (coming soon)
- Custom templates for specific use cases

### Thirdweb Contract Integration

- 130+ audited smart contracts available
- NFT, token, marketplace, and governance contracts
- One-command deployment and customization
- Battle-tested security patterns

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
