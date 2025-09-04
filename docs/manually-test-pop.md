## Manual Setup Instructions for Pop-CLI Chain Tools

Before implementing the automated installation, you can manually test the chain-only features:

### Step 1: Install Prerequisites

**Install Rust & Cargo:**

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

**Verify Installation:**

```bash
cargo --version
rustc --version
```

### Step 2: Clone Pop-CLI Repository with Degit

**Install degit (if not already installed):**

```bash
npm install -g degit
```

**Clone pop-cli source:**

```bash
# Create workspace directory
mkdir -p ~/.kit-dot/workspace
cd ~/.kit-dot/workspace

# Clone using degit (same pattern as your CLI templates)
degit r0gue-io/pop-cli pop-cli-source
cd pop-cli-source
```

### Step 3: Build Chain-Only Features

**Build with only chain features (reduces size by ~50%):**

```bash
# Build chain-only binary
cargo build --no-default-features --features chain --release

# Verify the build
./target/release/pop --version
```

**Install globally (optional):**

```bash
# Create tools directory
mkdir -p ~/.kit-dot/tools

# Copy binary to tools directory
cp ./target/release/pop ~/.kit-dot/tools/pop

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
export PATH="$HOME/.kit-dot/tools:$PATH"

# Test installation
pop --version
```

### Step 4: Test Chain Launching with Skip Confirm

**Available chain commands (skip confirmation prompts):**

```bash
# Launch different networks with --skip-confirm (no prompts!)
pop up paseo --skip-confirm              # Paseo testnet
pop up polkadot --skip-confirm           # Polkadot relay chain
pop up polkadot+asset-hub --skip-confirm # Polkadot + Asset Hub parachain
pop up kusama --skip-confirm             # Kusama relay chain
pop up westend --skip-confirm            # Westend testnet

# Check running chains
pop ps

# Stop chains
pop down
```

### Step 6: Verify Network Mapping

Test the network names that will be used in Kit-Dot:

```bash
# Kit-Dot command -> Pop-CLI command mapping (with --skip-confirm)
pop up polkadot+asset-hub --skip-confirm    # npx kitdot node asset_hub
pop up paseo --skip-confirm                 # npx kitdot node paseo
pop up polkadot --skip-confirm              # npx kitdot node polkadot
pop up kusama --skip-confirm                # npx kitdot node kusama
pop up westend --skip-confirm               # npx kitdot node westend
pop up polkadot+bridge-hub --skip-confirm   # npx kitdot node bridge_hub
pop up polkadot+collectives --skip-confirm  # npx kitdot node collectives
```
