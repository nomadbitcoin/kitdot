# Remote Template Loading Architecture

**Degit Integration System:**

The CLI uses degit for on-demand template fetching from GitHub repositories:

```typescript
// Degit source construction: repo/directory#branch
interface RemoteTemplateSource {
  type: 'remote';
  repository: string;  // e.g., 'w3b3d3v/web3auth-examples'
  branch?: string;     // e.g., 'web3dev-version'
  directory?: string;  // e.g., 'quick-starts/react-quick-start'
}

// Results in degit source: 
// 'w3b3d3v/web3auth-examples/quick-starts/react-quick-start#web3dev-version'
```

**Template Loading Workflow:**

1. **User Selection**: CLI presents available templates based on project type and category
2. **Template Validation**: Ensure selected template exists in registry
3. **Remote Fetching**: Use degit to clone specific repository/directory/branch
4. **File Customization**: Update package.json, component names, placeholder replacement
5. **Configuration Injection**: Ensure required TypeScript and Wagmi configs exist
6. **Optional Setup**: Prompt user for optional post-install configuration
7. **Cleanup**: Remove temporary files after processing

**Degit Source Construction Rules:**
- Repository path comes first: `owner/repo-name`
- Directory path is appended: `/path/to/template`  
- Branch specifier comes last: `#branch-name`
- Final format: `owner/repo/path/to/template#branch-name`

**Template Loading Strategy:**
```typescript
// Templates must be specified via registry - no fallback
if (!config.template) {
  throw new Error("Template must be specified for frontend setup");
}

const template = getTemplate(config.template.name);
await templateLoader.loadTemplate(template, targetDir, config);
```

**Error Handling:**
- Invalid branch names result in clear error messages
- Network failures fall back to cached templates when available
- Missing directories are reported with specific path information
