# API Integration Architecture

**CLI API Integration Strategy:**

The Kit-Dot CLI establishes **standardized API integration interfaces** while allowing templates to implement their preferred HTTP clients and request patterns, ensuring consistent connectivity across the Polkadot Cloud ecosystem.

**CLI-Provided API Infrastructure:**

```typescript
// CLI generates these integration points
interface APIIntegrationStandards {
  // Smart contract interaction
  contractAPI: {
    endpoint: string;
    wagmiConfig: WagmiConfiguration;
    chainConfig: PolkadotCloudConfig;
  };
  
  // Decentralized cloud functions
  cloudFunctionAPI: {
    acurastEndpoint: string;
    functionManifest: FunctionRegistry;
    authConfig: DecentralizedAuth;
  };
  
  // IPFS/Crust storage
  storageAPI: {
    apillonConfig: ApillonSDKConfig;
    ipfsGateways: string[];
    crustConfig: CrustNetworkConfig;
  };
}
```

**Template API Client Freedom:**

Templates can use any HTTP client implementation:
- **React Templates**: Fetch, Axios, TanStack Query, SWR
- **Vue Templates**: Axios, Vue Query, Pinia async actions
- **Framework Agnostic**: Native fetch, custom clients

**Decentralized API Architecture:**

- **No Traditional REST APIs**: All communication through blockchain or decentralized infrastructure
- **Acurast Functions**: Serverless execution on parachain infrastructure
- **Contract Events**: Real-time blockchain state monitoring
- **IPFS Communication**: Content-addressed data exchange
