export interface ProjectConfig {
  name: string;
  type: ProjectType;
  directory: string;
  features: ProjectFeatures;
  template?: TemplateConfig;
}

export interface TemplateConfig {
  name: string;
  source: TemplateSource;
  path?: string; // For local templates or subfolder in remote repo
}

export type ProjectType = 'fullstack' | 'frontend' | 'backend';

export interface ProjectFeatures {
  contracts: boolean;
  frontend: boolean;
  cloudFunctions: boolean;
  documentation: boolean;
}

export interface TemplateOptions {
  projectName: string;
  projectType: ProjectType;
  targetDir: string;
}

export interface ContractConfig {
  foundryEnabled: boolean;
  hardhatEnabled: boolean;
  uupsEnabled: boolean;
}

export interface FrontendConfig {
  framework: 'react' | 'vue' | 'svelte';
  template: string;
}

export interface TemplateSource {
  type: 'local' | 'remote';
  repository?: string; // GitHub repo like 'user/repo' or full URL
  branch?: string; // Branch or tag, defaults to 'main'
  directory?: string; // Subdirectory within repo
  localPath?: string; // For local templates
}

export interface TemplateRegistry {
  [key: string]: TemplateDefinition;
}

export interface TemplateDefinition {
  name: string;
  description: string;
  framework: string;
  category: 'frontend' | 'fullstack' | 'backend';
  source: TemplateSource;
  features: string[];
  documentationUrl?: string; // Optional documentation URL
}

export interface DocsConfig {
  enabled: boolean;
  structure: 'global' | 'modular';
}