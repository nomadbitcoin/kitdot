# Template System Examples

## Successful Template Integration: Web3Auth Social Login

The `social-login-web3-react` template demonstrates the complete remote template workflow:

**Registry Configuration:**
```typescript
'social-login-web3-react': {
  name: 'React Web3Auth Social Login',
  description: 'React dApp template with Web3Auth social login - users authenticate with Google/Twitter/Facebook while blockchain interactions are abstracted away for seamless UX',
  framework: 'React',
  category: 'frontend',
  source: {
    type: 'remote',
    repository: 'w3b3d3v/web3auth-examples',
    branch: 'web3dev-version',
    directory: 'quick-starts/react-quick-start'
  },
  features: ['React', 'Web3Auth', 'Social Login', 'Google Auth', 'Twitter Auth', 'Facebook Auth', 'TypeScript', 'Seamless UX'],
  documentationUrl: 'https://kitdot-fronted-templates.w3d.community/quick-starts/react-quick-start/'
}
```

**User Experience:**
1. `kit-dot init my-social-dapp`
2. Select "🎨 Frontend only" 
3. Choose "React - React dApp template with Web3Auth social login..."
4. Template fetched from: `w3b3d3v/web3auth-examples/quick-starts/react-quick-start#web3dev-version`
5. Documentation displayed: Complete setup guide and API reference

**Key Architectural Benefits:**
- **Zero CLI Changes**: New templates added by registry updates only
- **Community Driven**: Templates maintained by domain experts
- **Version Specific**: Branch targeting ensures consistent template versions
- **Self Documenting**: Documentation URLs provide immediate user guidance

## Template Selection Logic in Action

**Frontend-Only Project Selection:**
```typescript
const availableTemplates = getTemplatesByCategory('frontend')
  .concat(getTemplatesByCategory('fullstack'));

// Results in:
// - React Web3Auth Social Login (frontend)
// - Basic Polkadot DApp (fullstack)
```

**User Interface Display:**
```
? Choose a frontend template: (Use arrow keys)
❯ React - React dApp template with Web3Auth social login - users authenticate with Google/Twitter/Facebook while blockchain interactions are abstracted away for seamless UX
  React - React + TypeScript + Vite + Tailwind with Polkadot Cloud integration
```
