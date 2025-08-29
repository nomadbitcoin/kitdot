# Routing Architecture

**CLI Routing Strategy:**

The Kit-Dot CLI implements a **template-autonomous routing approach** where routing patterns are entirely template-specific, while the CLI provides **consistent navigation interfaces** for cross-component integration within the monorepo structure.

**CLI-Level Routing Coordination:**

```typescript
// CLI provides navigation hooks, not routing implementation
interface ProjectNavigationInterface {
  // Deep linking to documentation
  navigateToDocsSection(section: string): void;
  
  // Cross-component navigation patterns
  openContractInterface(contractAddress: string): void;
  
  // External navigation to decentralized services
  navigateToIPFSContent(hash: string): void;
}
```

**Template Routing Freedom:**

Each template can implement any routing solution:
- **React Templates**: React Router, Reach Router, Next.js Router, Wouter
- **Vue Templates**: Vue Router, Nuxt.js routing, custom solutions
- **Svelte Templates**: SvelteKit routing, Page.js, custom routing
- **Angular Templates**: Angular Router, UI-Router

**Development Environment Routing:**

- **Frontend**: `http://localhost:3000` (template-specific port)
- **Documentation**: `http://localhost:3001` (mdbook serve)
- **Contract Explorer**: Links to testnet explorers
- **IPFS Gateway**: Links to decentralized content

**Production Routing Architecture:**

- **Frontend**: Hosted on IPFS via Crust Network + Apillon
- **Static Site**: Documentation deployed to decentralized hosting
- **Deep Links**: Direct links to contract interfaces and cloud functions
- **Domain Management**: ENS or Polkadot domain integration
