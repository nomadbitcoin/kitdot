# Project Structure Standards

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
