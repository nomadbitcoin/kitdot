import fs from 'fs-extra';
import path from 'path';
import degit from 'degit';
import ora, { Ora } from 'ora';
import chalk from 'chalk';
import { TemplateDefinition, TemplateSource, ProjectConfig } from '../types.js';

/**
 * Template Loader - Handles loading templates from local and remote sources
 */
export class TemplateLoader {
  private tempDir: string;

  constructor() {
    // Create temporary directory for remote template downloads
    this.tempDir = path.join(process.cwd(), '.kit-dot-cache');
  }

  /**
   * Load a template to the target directory
   */
  async loadTemplate(
    template: TemplateDefinition,
    targetDir: string,
    config: ProjectConfig
  ): Promise<void> {
    const spinner = ora(`Loading ${template.name} template...`).start();

    try {
      let templatePath: string;

      if (template.source.type === 'local') {
        templatePath = await this.loadLocalTemplate(template.source);
      } else {
        templatePath = await this.loadRemoteTemplate(template.source, spinner);
      }

      // Copy template to target directory
      await this.copyTemplate(templatePath, targetDir, config);
      
      // Customize template files
      await this.customizeTemplate(targetDir, config);

      spinner.succeed(`${template.name} template loaded successfully`);
    } catch (error) {
      spinner.fail(`Failed to load ${template.name} template`);
      throw error;
    }
  }

  /**
   * Load local template
   */
  private async loadLocalTemplate(source: TemplateSource): Promise<string> {
    const templatePath = path.join(process.cwd(), source.localPath!);
    
    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Local template not found at ${templatePath}`);
    }

    return templatePath;
  }

  /**
   * Load remote template using degit
   */
  private async loadRemoteTemplate(
    source: TemplateSource, 
    spinner: Ora
  ): Promise<string> {
    // Ensure temp directory exists
    await fs.ensureDir(this.tempDir);

    // Build degit source string
    let degitSource = source.repository!;
    
    if (source.directory) {
      degitSource += `/${source.directory}`;
    }
    
    if (source.branch && source.branch !== 'main') {
      degitSource += `#${source.branch}`;
    }

    spinner.text = `Downloading template from ${source.repository}...`;

    // Create temporary directory for this template
    const tempTemplatePath = path.join(this.tempDir, `template-${Date.now()}`);

    try {
      const emitter = degit(degitSource, { 
        cache: true, 
        force: true,
        verbose: false 
      });

      await emitter.clone(tempTemplatePath);
      
      return tempTemplatePath;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to download template from ${source.repository}: ${errorMessage}`);
    }
  }

  /**
   * Copy template files to target directory
   */
  private async copyTemplate(
    sourcePath: string, 
    targetPath: string, 
    config: ProjectConfig
  ): Promise<void> {
    await fs.copy(sourcePath, targetPath, {
      filter: (src) => {
        const basename = path.basename(src);
        // Exclude common directories/files that shouldn't be copied
        return ![
          'node_modules', 
          '.git', 
          'dist', 
          '.DS_Store', 
          'tsconfig.tsbuildinfo', 
          'package-lock.json',
          '.next',
          '.nuxt',
          '.svelte-kit',
          'build'
        ].includes(basename);
      }
    });
  }

  /**
   * Customize template files with project-specific information
   */
  private async customizeTemplate(templateDir: string, config: ProjectConfig): Promise<void> {
    // Update package.json
    await this.updatePackageJson(templateDir, config);
    
    // Update other template files with project name
    await this.updateTemplateFiles(templateDir, config);
  }

  /**
   * Update package.json with project-specific information
   */
  private async updatePackageJson(templateDir: string, config: ProjectConfig): Promise<void> {
    const packageJsonPath = path.join(templateDir, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      
      packageJson.name = `${config.name}-frontend`;
      packageJson.description = `Frontend for ${config.name} - A Polkadot DApp`;
      
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }

  /**
   * Update template files with project name and other customizations
   */
  private async updateTemplateFiles(templateDir: string, config: ProjectConfig): Promise<void> {
    // Common files that might need project name replacement
    const filesToUpdate = [
      'src/App.tsx',
      'src/App.vue', 
      'src/App.svelte',
      'index.html',
      'README.md'
    ];

    for (const file of filesToUpdate) {
      const filePath = path.join(templateDir, file);
      
      if (await fs.pathExists(filePath)) {
        try {
          let content = await fs.readFile(filePath, 'utf-8');
          
          // Replace common placeholders
          content = content
            .replace(/{{project-name}}/g, config.name)
            .replace(/{{PROJECT_NAME}}/g, config.name.toUpperCase())
            .replace(/create-polkadot-dapp/g, config.name)
            .replace(/template-name/g, config.name);
          
          await fs.writeFile(filePath, content);
        } catch (error) {
          // Ignore errors for individual files - they might be binary or have encoding issues
          console.warn(chalk.yellow(`Warning: Could not update ${file}`));
        }
      }
    }
  }

  /**
   * Clean up temporary files
   */
  async cleanup(): Promise<void> {
    try {
      await fs.remove(this.tempDir);
    } catch (error) {
      // Ignore cleanup errors
      console.warn(chalk.yellow('Warning: Could not clean up temporary files'));
    }
  }
}

/**
 * Create a template loader instance
 */
export function createTemplateLoader(): TemplateLoader {
  return new TemplateLoader();
}