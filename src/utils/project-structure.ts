import fs from 'fs-extra';
import path from 'path';
import { ProjectConfig } from '../types.js';

export async function createProjectStructure(config: ProjectConfig): Promise<void> {
  await fs.ensureDir(config.directory);

  const folders = [];
  
  if (config.features.contracts) {
    folders.push('contracts/develop', 'contracts/deploy');
  }
  
  if (config.features.frontend) {
    folders.push('front');
  }
  
  if (config.features.cloudFunctions) {
    folders.push('cloud-functions');
  }
  
  if (config.features.documentation) {
    folders.push('docs');
  }

  for (const folder of folders) {
    await fs.ensureDir(path.join(config.directory, folder));
  }

  await createRootPackageJson(config);
  await createGitignore(config);
  await createReadme(config);
}

async function createRootPackageJson(config: ProjectConfig): Promise<void> {
  const packageJson = {
    name: config.name,
    version: '0.1.0',
    description: 'A Polkadot Dapp built with kit-dot',
    private: true,
    type: 'module',
    workspaces: getWorkspaces(config),
    scripts: {
      'install:all': 'npm install',
      'build:all': 'npm run build --workspaces',
      'lint:all': 'npm run lint --workspaces',
      'test:all': 'npm run test --workspaces'
    },
    devDependencies: {
      '@types/node': '^22.16.2',
      'typescript': '^5.6.2'
    },
    engines: {
      node: '>=18.0.0',
      npm: '>=8.0.0'
    }
  };

  await fs.writeJson(
    path.join(config.directory, 'package.json'), 
    packageJson, 
    { spaces: 2 }
  );
}

function getWorkspaces(config: ProjectConfig): string[] {
  const workspaces = [];
  
  if (config.features.contracts) {
    workspaces.push('contracts/deploy');
  }
  
  if (config.features.frontend) {
    workspaces.push('front');
  }
  
  if (config.features.cloudFunctions) {
    workspaces.push('cloud-functions');
  }

  return workspaces;
}

async function createGitignore(config: ProjectConfig): Promise<void> {
  const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log

# Cache
.cache/
.parcel-cache/

# Contracts
contracts/develop/out/
contracts/develop/cache/
contracts/deploy/artifacts/
contracts/deploy/cache/
contracts/deploy/typechain-types/

# Documentation
docs/book/`;

  await fs.writeFile(
    path.join(config.directory, '.gitignore'), 
    gitignoreContent
  );
}

async function createReadme(config: ProjectConfig): Promise<void> {
  const readmeContent = `# ${config.name}

A Polkadot Dapp built with [kit-dot](https://github.com/your-org/kit-dot).

## Project Structure

${config.features.contracts ? `
### 📄 Smart Contracts
- \`contracts/develop/\` - Smart contract development with Foundry
- \`contracts/deploy/\` - Smart contract deployment with Hardhat
` : ''}

${config.features.frontend ? `
### 🎨 Frontend
- \`front/\` - React frontend application with Polkadot integration
` : ''}

${config.features.cloudFunctions ? `
### ⚡ Cloud Functions
- \`cloud-functions/\` - Serverless functions for backend logic
` : ''}

${config.features.documentation ? `
### 📚 Documentation
- \`docs/\` - Project documentation built with mdbook
` : ''}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm run install:all
   \`\`\`

${config.features.frontend ? `
2. Start the frontend development server:
   \`\`\`bash
   cd front
   npm run dev
   \`\`\`
` : ''}

${config.features.contracts ? `
3. Build smart contracts:
   \`\`\`bash
   cd contracts/develop
   forge build
   \`\`\`
` : ''}

${config.features.documentation ? `
4. View documentation:
   \`\`\`bash
   cd docs
   mdbook serve
   \`\`\`
` : ''}

## Commands

- \`npm run build:all\` - Build all packages
- \`npm run lint:all\` - Lint all packages  
- \`npm run test:all\` - Test all packages

## Built with kit-dot

This project was created using [kit-dot](https://github.com/your-org/kit-dot), a toolkit for building Dapps on Polkadot Cloud.
`;

  await fs.writeFile(
    path.join(config.directory, 'README.md'), 
    readmeContent
  );
}