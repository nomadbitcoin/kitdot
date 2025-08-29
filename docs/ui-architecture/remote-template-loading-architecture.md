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
2. **Source Resolution**: Determine if template is local (bundled) or remote (GitHub)
3. **Remote Fetching**: Use degit to clone specific repository/directory/branch
4. **Local Processing**: Copy local templates from bundled directory
5. **File Customization**: Update package.json, component names, placeholder replacement
6. **Configuration Injection**: Ensure required TypeScript and Wagmi configs exist
7. **Cleanup**: Remove temporary files for remote templates

**Degit Source Construction Rules:**
- Repository path comes first: `owner/repo-name`
- Directory path is appended: `/path/to/template`  
- Branch specifier comes last: `#branch-name`
- Final format: `owner/repo/path/to/template#branch-name`

**Template Fallback Strategy:**
```typescript
if (config.template) {
  // Use new remote/local template system
  await templateLoader.loadTemplate(template, targetDir, config);
} else {
  // Fallback to legacy bundled template
  await copyFrontendTemplate(templateDir, targetDir, config);
}
```

**Error Handling:**
- Invalid branch names result in clear error messages
- Network failures fall back to cached templates when available
- Missing directories are reported with specific path information
