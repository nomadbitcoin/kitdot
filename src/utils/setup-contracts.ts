import fs from 'fs-extra';
import path from 'path';
import { ProjectConfig } from '../types.js';

export async function setupContracts(config: ProjectConfig): Promise<void> {
  // Always use default contracts template (backend at root, fullstack in subdirectory)
  await setupDefaultContracts(config);
}

async function setupDefaultContracts(config: ProjectConfig): Promise<void> {
  const defaultContractsPath = path.join(process.cwd(), 'templates/default/contracts');

  // For backend-only projects, copy directly to root folder
  const targetDir = config.type === 'backend' ? config.directory : path.join(config.directory, 'contracts');

  // Copy the default contracts template
  await fs.copy(defaultContractsPath, targetDir, {
    filter: (src) => {
      const basename = path.basename(src);
      // Exclude node_modules and other build artifacts
      return !['node_modules', '.git', 'dist', 'build'].includes(basename);
    }
  });

  // Personalize package.json with project name
  const packageJsonPath = path.join(targetDir, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    const packageJson = await fs.readJson(packageJsonPath);
    // For backend-only, use project name directly; for fullstack, add -contracts suffix
    packageJson.name = config.type === 'backend' ? config.name : `${config.name}-contracts`;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }
}

