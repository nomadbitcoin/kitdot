# Pop-CLI Node Management - Brownfield Enhancement

## Epic Goal

Enable Kit-Dot users to launch local blockchain nodes with simple commands like `kit-dot node asset_hub`, providing seamless local development environment setup while maintaining the existing CLI architecture and user experience patterns.

## Epic Description

**Existing System Context:**
- Current relevant functionality: TypeScript CLI with `init` command for project scaffolding
- Technology stack: TypeScript, Commander.js, Node.js, ora (spinners), chalk (colors), inquirer (prompts)
- Integration points: CLI entry point (`src/cli.ts`), command structure, tool installation patterns

**Enhancement Details:**
- What's being added/changed: New `node` command that manages pop-cli installation and blockchain node launching
- How it integrates: Follows existing Commander.js command patterns, reuses tool installation UX (ora, chalk)
- Success criteria: Users launch Asset Hub, Paseo, Polkadot chains with single commands, cross-platform support

## Stories

### Story 1: Platform Detection & Rust Installation System
**Objective:** Implement cross-platform detection (Linux/macOS/Windows/WSL) and automatic Rust installation with fallback to manual instructions.

**Key Components:**
- Platform detection system (`detectPlatform()`)
- Rust installation checker (`isRustInstalled()`)
- Automatic Rust installation for supported platforms
- Platform-specific manual installation instructions
- PATH updates after Rust installation

**Acceptance Criteria:**
- System correctly identifies Linux, macOS, Windows, WSL platforms
- Automatic Rust installation works on Linux/macOS/WSL via rustup
- Windows users receive clear manual installation instructions
- Rust installation failures provide helpful guidance
- PATH is properly updated after successful installation

### Story 2: Pop-CLI Tool Management & Installation
**Objective:** Create PopCliManager and PopCliInstaller classes with multi-strategy installation approach.

**Key Components:**
- PopCliManager class for tool detection and execution
- PopCliInstaller with multiple strategies (binary → cargo → source)
- Tool detection and management with PATH handling
- Chain-only feature installation (~50% size reduction)
- Comprehensive error handling for installation failures

**Acceptance Criteria:**
- Pop-cli installation succeeds via pre-compiled binaries when available
- Cargo installation works as fallback when Rust is available
- Source compilation works as final fallback
- Tool detection correctly identifies installed pop-cli
- Installation progress feedback follows existing UX patterns

### Story 3: Node Command with Network Mapping
**Objective:** Implement `kit-dot node <network>` command with user-friendly network mapping.

**Key Components:**
- Node command following Commander.js patterns
- Network mapping (asset_hub → polkadot+asset-hub)
- Integration with PopCliManager for execution
- Auto-installation trigger when tools missing
- Enhanced help with available networks

**Acceptance Criteria:**
- `kit-dot node asset_hub`, `kit-dot node paseo`, `kit-dot node polkadot` commands work
- Unknown networks show helpful error with available options
- Auto-installation triggers gracefully when pop-cli missing
- `--skip-confirm` flag eliminates binary download prompts
- Command follows existing CLI UX patterns (ora, chalk, clear messaging)

## Compatibility Requirements

- [x] Existing APIs remain unchanged (additive `node` command only)
- [x] No database schema changes required
- [x] CLI output follows existing patterns (ora spinners, chalk colors, Commander.js)
- [x] Performance impact minimal (tools installed once, cached thereafter)

## Risk Mitigation

- **Primary Risk:** Rust compilation failures block feature on certain platforms
- **Mitigation:** Multi-strategy installation approach with pre-compiled binaries first, graceful fallback to manual instructions
- **Rollback Plan:** Remove `node` command registration, no impact on existing `init` functionality

## Definition of Done

- [ ] All three stories completed with acceptance criteria met
- [ ] `kit-dot node asset_hub`, `kit-dot node paseo`, `kit-dot node polkadot` commands work
- [ ] Cross-platform installation (Linux, macOS auto-install; Windows manual instructions)
- [ ] Existing `kit-dot init` functionality verified through testing
- [ ] Integration points (CLI, tool management) working correctly
- [ ] Error handling provides clear guidance when installation fails
- [ ] No regression in existing CLI features

## Implementation Notes

**Network Mapping:**
```typescript
{
  asset_hub: ["polkadot+asset-hub"],
  paseo: ["paseo"],
  polkadot: ["polkadot"],
  kusama: ["kusama"],
  westend: ["westend"],
  bridge_hub: ["polkadot+bridge-hub"],
  collectives: ["polkadot+collectives"]
}
```

**File Structure:**
```
src/
├── tools/
│   └── pop-cli/
│       ├── installer.ts         # Platform detection & installation
│       └── manager.ts           # Tool execution management
├── commands/
│   ├── node.ts                  # Node command implementation
│   └── init.ts                  # Existing init command
└── cli.ts                       # Main CLI entry point
```

**Key Dependencies:**
- Rust toolchain (auto-installed on Linux/macOS/WSL)
- Pop-CLI with chain features only
- Existing Kit-Dot CLI infrastructure

---

*Epic created from pop-cli integration plan: `/Users/nomadbitcoin/Projects/kit-dot/pop-cli-integration-plan.md`*