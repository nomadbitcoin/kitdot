import { TemplateRegistry } from "../types.js";

/**
 * Template Registry - Defines available project templates
 *
 * Each template can be:
 * - Local: Bundled with CLI in /templates directory
 * - Remote: Fetched from GitHub repositories using degit
 */
export const TEMPLATE_REGISTRY: TemplateRegistry = {
  // Local bundled template (current approach)
  "basic-polkadot-dapp": {
    name: "Basic Polkadot DApp",
    description:
      "React + TypeScript + Vite + Tailwind with Polkadot Cloud integration",
    framework: "React",
    category: "fullstack",
    source: {
      type: "local",
      localPath: "templates/basic-polkadot-dapp",
    },
    features: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Wagmi",
      "Smart Contracts",
      "Cloud Functions",
    ],
  },

  "social-login-web3-react": {
    name: "React Web3Auth Social Login",
    description:
      "React dApp template with Web3Auth social login - users authenticate with Google/Twitter/Facebook while blockchain interactions are abstracted away for seamless UX",
    framework: "React",
    category: "frontend",
    source: {
      type: "remote",
      repository: "w3b3d3v/web3auth-examples",
      branch: "web3dev-version",
      directory: "quick-starts/react-quick-start",
    },
    features: [
      "React",
      "Web3Auth",
      "Social Login",
      "Google Auth",
      "Twitter Auth",
      "Facebook Auth",
      "TypeScript",
      "Seamless UX",
    ],
    documentationUrl:
      "https://kitdot-fronted-templates.w3d.community/quick-starts/react-quick-start/",
  },
};

/**
 * Get available templates by category
 */
export function getTemplatesByCategory(
  category: "frontend" | "fullstack" | "backend"
) {
  return Object.entries(TEMPLATE_REGISTRY)
    .filter(([_, template]) => template.category === category)
    .map(([key, template]) => ({ key, ...template }));
}

/**
 * Get template definition by key
 */
export function getTemplate(key: string) {
  return TEMPLATE_REGISTRY[key];
}

/**
 * Get all available templates
 */
export function getAllTemplates() {
  return Object.entries(TEMPLATE_REGISTRY).map(([key, template]) => ({
    key,
    ...template,
  }));
}
