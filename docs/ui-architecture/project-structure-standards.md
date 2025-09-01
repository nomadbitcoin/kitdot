# Project Structure Standards

**CLI-Generated Project Structure:**

The Kit-Dot CLI supports both **monorepo and single repo structures** depending on project type, ensuring predictable organization across all generated applications.

## Fullstack/Backend Projects (Monorepo Structure)

```
project-name/
├── front/                 # Frontend application (template-specific)
│   ├── src/               # Source code
│   ├── package.json       # Frontend dependencies
│   ├── tsconfig.json      # TypeScript configuration
│   └── [template-files]   # Framework-specific files
├── contracts/             # Smart contract development (flat structure)
│   ├── src/               # Solidity contracts
│   ├── test/              # Contract tests
│   ├── scripts/           # Deployment scripts
│   ├── hardhat.config.ts  # Hardhat configuration
│   └── package.json       # Contract dependencies
├── docs/                  # Project documentation
│   ├── src/               # mdbook source
│   └── book.toml          # Documentation configuration
├── package.json           # Root package.json (monorepo)
└── README.md              # Project overview
```

## Frontend-Only Projects (Single Repo Structure)

```
project-name/
├── src/                   # Frontend source code
├── public/                # Static assets
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Build configuration
├── tailwind.config.js     # Styling configuration
├── .gitignore             # Git ignore patterns
└── README.md              # Project overview
```

**Frontend Directory Standards:**

Frontend templates must conform to these CLI expectations:

### For Fullstack Projects:
- **Location**: Always `/front` directory in project root
- **Package Naming**: `${projectName}-frontend` in package.json

### For Frontend-Only Projects:
- **Location**: Template loaded directly at project root
- **Package Naming**: Template's original naming preserved
- **Single Repo**: No monorepo structure, template as-is

### Common Standards:
- **TypeScript**: Must include tsconfig.json configuration
- **Standard Scripts**: `dev`, `build`, `lint`, `preview` in package.json
- **Template Loading**: Templates copied as-is without forced modifications
