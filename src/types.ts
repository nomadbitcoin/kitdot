export interface ProjectConfig {
  name: string;
  type: ProjectType;
  directory: string;
  features: ProjectFeatures;
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

export interface DocsConfig {
  enabled: boolean;
  structure: 'global' | 'modular';
}