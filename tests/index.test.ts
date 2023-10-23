import { BiconomySmartAccountV2 } from "@biconomy/account";
import {createSmartAccounts} from "../src/index";
import { Wallet, ethers, providers } from 'ethers';
import {ChainId, SmartAccountV2MultiConfig } from "../src/types/CreateSmartAccountConfig";
require('dotenv').config();

describe("BiconomySmartAccount API Specs", () => {
  let mumbaiProvider: providers.JsonRpcProvider, goerliProvider: providers.JsonRpcProvider;
  let mumbaiSigner: Wallet, goerliSigner: Wallet;

  beforeAll(async () => {
    mumbaiProvider = new providers.JsonRpcProvider(process.env.MUMBAI_RPC_URL)  
    goerliProvider = new providers.JsonRpcProvider(process.env.GOERLI_RPC_URL)  

    mumbaiSigner = new ethers.Wallet(process.env.PRIVATE_KEY || "", mumbaiProvider);
    goerliSigner = new ethers.Wallet(process.env.PRIVATE_KEY || "", goerliProvider);
  });

  it("Should create smart accounts on 2 chains", async () => {

    const configs: SmartAccountV2MultiConfig = [
        { 
          signer: mumbaiSigner,
          chainId: ChainId.POLYGON_MUMBAI,
          paymasterApiKey: process.env.MUMBAI_PAYMASTER_ID!,
        },
        { 
          signer: goerliSigner,
          chainId: ChainId.GOERLI,
          paymasterApiKey: process.env.BSC_TESTNET_PAYMASTER_ID!,
        }
    ]

    const smartAccounts = await createSmartAccounts(
      configs
    );

    expect(smartAccounts.length).toBe(2);
    expect(smartAccounts[0]!.chainId).toBe(ChainId.POLYGON_MUMBAI);
    expect(smartAccounts[1]!.chainId).toBe(ChainId.GOERLI);

    expect(smartAccounts[0]!).toBeInstanceOf(BiconomySmartAccountV2);
    expect(smartAccounts[1]!).toBeInstanceOf(BiconomySmartAccountV2);
    
  }, 50000);

  it("Should create smart account on 1 chain", async () => {
    
    const config: SmartAccountV2MultiConfig = 
        [{ 
          signer: mumbaiSigner,
          chainId: ChainId.POLYGON_MUMBAI,
          paymasterApiKey: process.env.MUMBAI_PAYMASTER_ID!,
        }]

    const smartAccounts = await createSmartAccounts(
      config,
    );

    expect(smartAccounts.length).toBe(1);
    expect(smartAccounts[0]!.chainId).toBe(ChainId.POLYGON_MUMBAI);

    expect(smartAccounts[0]!).toBeInstanceOf(BiconomySmartAccountV2);
    
  }, 50000);

  it("Should create and deploy Smart Accounts on 2 chains", async () => {

      const configs: SmartAccountV2MultiConfig = [
        { 
          signer: mumbaiSigner,
          chainId: ChainId.POLYGON_MUMBAI,
          paymasterApiKey: process.env.MUMBAI_PAYMASTER_ID!,
          deployOnChain : {
            prefundAmount: ethers.utils.parseEther("0.001")
          }
        },
        { 
          signer: goerliSigner,
          chainId: ChainId.GOERLI,
          paymasterApiKey: process.env.GOERLI_PAYMASTER_ID!,
          deployOnChain :{
            prefundAmount: ethers.utils.parseEther("0.01")
          }
        }
      ]

    const smartAccounts = await createSmartAccounts(
      configs,
    );
  }, 50000);

  it("Should create and deploy smart account on 1 chain", async () => {

    const config: SmartAccountV2MultiConfig = 
       [ { 
          signer: goerliSigner,
          chainId: ChainId.GOERLI,
          paymasterApiKey: process.env.GOERLI_PAYMASTER_ID!,
          deployOnChain: {
            prefundAmount: ethers.utils.parseEther("0.01")
          }
        }]

    const smartAccount = await createSmartAccounts(
      config,
    );

  }, 50000);

  it("Should throw and error if we provide duplicate chain ids", async () => {
    
    const configs: SmartAccountV2MultiConfig = [
        { 
          signer: mumbaiSigner,
          chainId: ChainId.POLYGON_MUMBAI,
          paymasterApiKey: process.env.MUMBAI_PAYMASTER_ID!,
        },
        { 
          signer: goerliSigner,
          chainId: ChainId.POLYGON_MUMBAI,
          paymasterApiKey: process.env.GOERLI_PAYMASTER_ID!,
        }
    ]

    await expect(createSmartAccounts(configs)).rejects.toThrow("Duplicate chain ids not allowed.");
    
  });

  it("Should throw and error if we provide duplicate paymaster ids", async () => {
    
    const configs: SmartAccountV2MultiConfig = [
      { 
        signer: mumbaiSigner,
        chainId: ChainId.POLYGON_MUMBAI,
        paymasterApiKey: process.env.MUMBAI_PAYMASTER_ID!,
      },
      { 
        signer: goerliSigner,
        chainId: ChainId.GOERLI,
        paymasterApiKey: process.env.MUMBAI_PAYMASTER_ID!,
      }
  ]

    await expect(createSmartAccounts(configs)).rejects.toThrow("Duplicate paymaster ids not allowed.");
    
  });

  // it("Should create a user operation tx", async () => {

  //   const config: SmartAccountV2Config = 
  //       { 
  //         chainId: ChainId.POLYGON_MUMBAI,
  //         paymasterApiKey: process.env.MUMBAI_PAYMASTER_ID!,
  //         optional: {
  //           ACCOUNT_INDEX: 1
  //         }
  //       }

  //   const smartAccount = await createSmartAccountAndDeploy(
  //     signer,
  //     config,
  //     ethers.utils.parseEther("0.001"),
  //   );
    
  //   const transaction = {
  //     to: await smartAccount.getAccountAddress(),
  //     data: '0x',
  //   }
  
  //   const userOp = await smartAccount.buildUserOp([transaction])
  //   userOp.paymasterAndData = "0x"
  
  //   const userOpResponse = await smartAccount.sendUserOp(userOp)
  
  //   const transactionDetail = await userOpResponse.wait()
  
  //   console.log("transaction detail below")
  //   console.log(transactionDetail)
  
  // }, 50000);

});