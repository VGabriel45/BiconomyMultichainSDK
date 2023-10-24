# Biconomy Wrapper SDK - Create & Deploy Smart Accounts easily 🛠️

## Introduction

Biconomy has become an integral platform for developers wanting to harness the potential of Account Abstraction. As the blockchain landscape evolves, there's a growing need for an SDK that provides a seamless experience for developers to create and deploy smart accounts, that's why this SDK was created.

The Biconomy Wrapper SDK provides a very easy way of creating & deploying smart accounts.

Installation

```javascript
npm install biconomy-multichain-accounts-wrapper
```

Usage

1.Importing the SDK

```javascript
import { createSmartAccounts, ChainId, SmartAccountV2MultiConfig } from 'biconomy-multichain-accounts-wrapper';
```

2.Configuration

```javascript
const config: SmartAccountV2Config = {
  signer: yourSignerInstance,
  chainId: ChainId.POLYGON_MUMBAI,
  paymasterApiKey: 'YOUR_PAYMASTER_API_KEY',
  deployOnChain: {
    prefundAmount: ethers.utils.parseEther("0.1")
  }
};
```

### Example

Create your configs array.

```javascript
const configs: SmartAccountV2MultiConfig = [
        { 
          signer: mumbaiSigner,
          chainId: ChainId.POLYGON_MUMBAI,
          paymasterApiKey: {MUMBAI_PAYMASTER_ID},
        },
        { 
          signer: goerliSigner,
          chainId: ChainId.GOERLI,
          paymasterApiKey: {BSC_TESTNET_PAYMASTER_ID},
        }
    ]
```

Provide configs array as a parameter.

```javascript
const smartAccounts = await createSmartAccounts(
    configs
);
```

## 🛠️ Quickstart

This project is licensed under the MIT License. See the [LICENSE.md](./LICENSE.md) file for details.
