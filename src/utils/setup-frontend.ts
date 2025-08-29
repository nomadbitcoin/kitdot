import fs from "fs-extra";
import path from "path";
import { ProjectConfig } from "../types.js";
import { createTemplateLoader } from "./template-loader.js";
import { getTemplate } from "../templates/registry.js";

export async function setupFrontend(config: ProjectConfig): Promise<void> {
  const frontendDir = path.join(config.directory, "front");

  // Use new template system if template is specified
  if (config.template) {
    const template = getTemplate(config.template.name);
    if (!template) {
      throw new Error(
        `Template '${config.template.name}' not found in registry`
      );
    }

    const templateLoader = createTemplateLoader();
    try {
      await templateLoader.loadTemplate(template, frontendDir, config);
    } finally {
      await templateLoader.cleanup();
    }
  } else {
    // Fallback to legacy template system
    const templateDir = path.join(
      process.cwd(),
      "templates",
      "basic-polkadot-dapp"
    );

    if (await fs.pathExists(templateDir)) {
      await copyFrontendTemplate(templateDir, frontendDir, config);
    } else {
      await createBasicFrontendStructure(frontendDir, config);
    }
  }
}

async function copyFrontendTemplate(
  templateDir: string,
  frontendDir: string,
  config: ProjectConfig
): Promise<void> {
  await fs.copy(templateDir, frontendDir, {
    filter: (src) => {
      const basename = path.basename(src);
      return ![
        "node_modules",
        ".git",
        "dist",
        ".DS_Store",
        "tsconfig.tsbuildinfo",
        "package-lock.json",
      ].includes(basename);
    },
  });

  const packageJsonPath = path.join(frontendDir, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.name = `${config.name}-frontend`;
  packageJson.description = `Frontend for ${config.name} - A Polkadot Dapp`;

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  await updateAppTsx(frontendDir, config);

  // Create tsconfig.json if it doesn't exist
  const tsconfigPath = path.join(frontendDir, "tsconfig.json");
  if (!(await fs.pathExists(tsconfigPath))) {
    const tsconfig = {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "Bundler",
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: "force",
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        noFallthroughCasesInSwitch: true,
        noUncheckedSideEffectImports: true,
      },
      include: ["src", "wagmi.config.ts"],
    };
    await fs.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
  }

  // Create wagmi.config.ts if it doesn't exist
  const wagmiConfigPath = path.join(frontendDir, "wagmi.config.ts");
  if (!(await fs.pathExists(wagmiConfigPath))) {
    const wagmiConfig = `import { defineConfig } from '@wagmi/cli'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [],
  plugins: [],
})`;
    await fs.writeFile(wagmiConfigPath, wagmiConfig);
  }
}

async function createBasicFrontendStructure(
  frontendDir: string,
  config: ProjectConfig
): Promise<void> {
  const packageJson = {
    name: `${config.name}-frontend`,
    private: true,
    version: "0.0.0",
    type: "module",
    description: `Frontend for ${config.name} - A Polkadot Dapp`,
    scripts: {
      dev: "vite",
      build: "tsc -b && vite build",
      lint: "eslint .",
      "lint:fix": "eslint . --fix",
      preview: "vite preview",
    },
    dependencies: {
      "@wagmi/connectors": "^5.8.5",
      "@wagmi/core": "^2.17.3",
      react: "^18.3.1",
      "react-dom": "^18.3.1",
      viem: "^2.31.7",
      wagmi: "^2.15.6",
    },
    devDependencies: {
      "@types/react": "^18.3.12",
      "@types/react-dom": "^18.3.1",
      "@vitejs/plugin-react": "^4.3.3",
      "@wagmi/cli": "^2.3.1",
      autoprefixer: "^10.4.20",
      eslint: "^9.14.0",
      "eslint-plugin-react-hooks": "^5.0.0",
      "eslint-plugin-react-refresh": "^0.4.14",
      postcss: "^8.4.47",
      tailwindcss: "^3.4.14",
      typescript: "~5.6.2",
      vite: "^7.0.4",
    },
  };

  await fs.writeJson(path.join(frontendDir, "package.json"), packageJson, {
    spaces: 2,
  });
  await createBasicReactApp(frontendDir, config);
  await createViteConfig(frontendDir);
  await createTailwindConfig(frontendDir);
  await createTsconfig(frontendDir);
  await createWagmiConfig(frontendDir);
}

async function createBasicReactApp(
  frontendDir: string,
  config: ProjectConfig
): Promise<void> {
  await fs.ensureDir(path.join(frontendDir, "src"));
  await fs.ensureDir(path.join(frontendDir, "public"));

  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/polkadot-logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  await fs.writeFile(path.join(frontendDir, "index.html"), indexHtml);

  const mainTsx = `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi-config.ts';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
);`;

  await fs.writeFile(path.join(frontendDir, "src/main.tsx"), mainTsx);

  const appTsx = `import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            ${config.name}
          </h1>
          <p className="text-xl text-gray-300">
            Built with kit-dot for Polkadot Cloud
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Welcome to your Polkadot Dapp!
            </h2>
            <p className="text-gray-300 mb-4">
              This is a starter template for building decentralized applications on Polkadot Cloud.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-3">
                  🔗 Smart Contracts
                </h3>
                <p className="text-gray-400 text-sm">
                  Deploy and interact with smart contracts on Polkadot Hub
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-3">
                  ⚡ Cloud Functions
                </h3>
                <p className="text-gray-400 text-sm">
                  Build scalable backend services with serverless functions
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;`;

  await fs.writeFile(path.join(frontendDir, "src/App.tsx"), appTsx);
}

async function updateAppTsx(
  frontendDir: string,
  config: ProjectConfig
): Promise<void> {
  const appTsxPath = path.join(frontendDir, "src/App.tsx");

  if (await fs.pathExists(appTsxPath)) {
    let content = await fs.readFile(appTsxPath, "utf-8");
    content = content.replace(/create-polkadot-dapp/g, config.name);
    await fs.writeFile(appTsxPath, content);
  }
}

async function createViteConfig(frontendDir: string): Promise<void> {
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});`;

  await fs.writeFile(path.join(frontendDir, "vite.config.ts"), viteConfig);
}

async function createTailwindConfig(frontendDir: string): Promise<void> {
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

  await fs.writeFile(
    path.join(frontendDir, "tailwind.config.js"),
    tailwindConfig
  );

  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

  await fs.writeFile(
    path.join(frontendDir, "postcss.config.js"),
    postcssConfig
  );

  const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;

  await fs.writeFile(path.join(frontendDir, "src/index.css"), indexCss);
}

async function createTsconfig(frontendDir: string): Promise<void> {
  const tsconfig = {
    compilerOptions: {
      target: "ES2020",
      useDefineForClassFields: true,
      lib: ["ES2020", "DOM", "DOM.Iterable"],
      module: "ESNext",
      skipLibCheck: true,
      moduleResolution: "Bundler",
      allowImportingTsExtensions: true,
      isolatedModules: true,
      moduleDetection: "force",
      noEmit: true,
      jsx: "react-jsx",
      strict: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
      noFallthroughCasesInSwitch: true,
      noUncheckedSideEffectImports: true,
    },
    include: ["src", "wagmi.config.ts"],
  };
  await fs.writeJson(path.join(frontendDir, "tsconfig.json"), tsconfig, {
    spaces: 2,
  });
}

async function createWagmiConfig(frontendDir: string): Promise<void> {
  const wagmiConfig = `import { defineConfig } from '@wagmi/cli'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [],
  plugins: [],
})`;
  await fs.writeFile(path.join(frontendDir, "wagmi.config.ts"), wagmiConfig);
}
