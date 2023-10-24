# Biconomy Wrapper SDK - Create & Deploy Smart Accounts easily 🛠️

Overview
The Biconomy platform has emerged as a pivotal tool for developers keen on leveraging Account Abstraction in the blockchain domain. Recognizing the escalating demand for a developer-friendly SDK to facilitate the effortless creation and deployment of smart accounts, we introduce the Biconomy Wrapper SDK.

Features
- Simplified interface for creating and deploying smart accounts.
- Multi-chain support for enhanced flexibility.
- Integrated account management for seamless user operations.

Installation
To integrate the Biconomy Wrapper SDK into your project:

```javascript
npm install biconomy-multichain-accounts-wrapper
```

Usage

1. SDK Integration
Import the necessary modules from the SDK:

```javascript
import { createSmartAccounts, ChainId, SmartAccountV2MultiConfig } from 'biconomy-multichain-accounts-wrapper';
```

2.Configuration
Define the configuration parameters:
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

3. Example Workflow
To create and deploy smart accounts on-chain:

If the deployOnChain field is omitted, the smart account will be instantiated but not deployed. Deployment will be triggered upon the first UserOperation.

The optional deployOnChain field, if provided, mandates the prefundAmount—the gas amount allocated for smart account deployment. Ensure adequate gas provisioning for each chain.

```javascript

const mumbaiProvider = new providers.JsonRpcProvider(process.env.MUMBAI_RPC_URL)  
const goerliProvider = new providers.JsonRpcProvider(process.env.GOERLI_RPC_URL)  

const mumbaiSigner = new ethers.Wallet(process.env.PRIVATE_KEY || "", mumbaiProvider);
const goerliSigner = new ethers.Wallet(process.env.PRIVATE_KEY || "", goerliProvider);

const configs: SmartAccountV2MultiConfig = [
        { 
          signer: mumbaiSigner,
          chainId: ChainId.POLYGON_MUMBAI,
          paymasterApiKey: {MUMBAI_PAYMASTER_ID},
          deployOnChain: {
            prefundAmount: ethers.utils.parseEther("0.01")
          }
        },
        { 
          signer: goerliSigner,
          chainId: ChainId.GOERLI,
          paymasterApiKey: {BSC_TESTNET_PAYMASTER_ID},
          deployOnChain: {
            prefundAmount: ethers.utils.parseEther("0.1")
          }
        }
    ]
```

Get the created smart accounts.

```javascript
const smartAccounts = await createSmartAccounts(
    configs
);
```


Once the smart accounts are created you can start using them.

```javascript
const smartAccount = smartAccounts[0];
  
const transaction = {
    to: await smartAccount.getAccountAddress() || "",
    data: '0x',
}

const userOp = await smartAccount?.buildUserOp([transaction])
userOp.paymasterAndData = "0x"

const userOpResponse = await smartAccount.sendUserOp(userOp)

const transactionDetail = await userOpResponse.wait()

console.log("transaction detail below")
console.log(transactionDetail)
```

***Functions***
- createSmartAccounts(configs: SmartAccountV2MultiConfig[]): Promise<SmartAccount[]>
    Parameters:
    configs: Array of configurations for creating smart accounts.
    Returns: Promise that resolves to an array of created smart accounts.

***Types***
- SmartAccountV2Config
    signer: Signer instance for the blockchain.
    chainId: Chain ID from the ChainId enum.
    paymasterApiKey: API key for the paymaster.
    deployOnChain: Optional configuration for deploying the smart account on-chain.
- SmartAccountV2MultiConfig
    signer: Signer instance for the blockchain.
    chainId: Chain ID from the ChainId enum.
    paymasterApiKey: API key for the paymaster.
    deployOnChain: Optional configuration for deploying the smart account on-chain.

***ChainId***
Enum for supported blockchain chains. Examples:
- POLYGON_MUMBAI
- GOERLI

This project is licensed under the MIT License. See the [LICENSE.md](./LICENSE.md) file for details.
