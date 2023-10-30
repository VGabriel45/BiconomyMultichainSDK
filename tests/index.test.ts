import { BiconomySmartAccountV2 } from "@biconomy/account";
import {createSmartAccountMultichain} from "../src/index";
import { Wallet, ethers, providers } from 'ethers';
import {ChainId, SmartAccountV2Config, SmartAccountV2MultiConfig } from "../src/types/CreateSmartAccountConfig";
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

  // it("Should create a smart account on 2 chains", async () => {

  //   const configs: SmartAccountV2MultiConfig = [
  //       { 
  //         signer: mumbaiSigner,
  //         chainId: ChainId.POLYGON_MUMBAI,
  //         paymasterApiKey: process.env.MUMBAI_PAYMASTER_ID!,
  //         index: 3
  //       },
  //       { 
  //         signer: goerliSigner,
  //         chainId: ChainId.GOERLI,
  //         paymasterApiKey: process.env.BSC_TESTNET_PAYMASTER_ID!,
  //         index: 3
  //       }
  //   ]

  //   const smartAccount = await createSmartAccountMultichain(
  //     configs
  //   );

  //   expect(smartAccount.MUMBAI?.chainId).toBe(ChainId.POLYGON_MUMBAI);
  //   expect(smartAccount.GOERLI?.chainId).toBe(ChainId.GOERLI);

  //   expect(smartAccount.MUMBAI).toBeInstanceOf(BiconomySmartAccountV2);
  //   expect(smartAccount.GOERLI).toBeInstanceOf(BiconomySmartAccountV2);

  //   const accountsByOwner = await smartAccount.MUMBAI?.getSmartAccountsByOwner({chainId: ChainId.POLYGON_MUMBAI, owner: mumbaiSigner.address, index: 0})
  //   console.log(accountsByOwner);
    
  // }, 50000);

  it("Should create smart account on 1 chain", async () => {
    
    const config: SmartAccountV2MultiConfig = 
        [{ 
          signer: mumbaiSigner,
          chainId: ChainId.POLYGON_MUMBAI,
          paymasterApiKey: process.env.MUMBAI_PAYMASTER_ID!,
        }]

    const smartAccount = await createSmartAccountMultichain(
      config,
    );

    expect(smartAccount.MUMBAI?.chainId).toBe(ChainId.POLYGON_MUMBAI);

    expect(smartAccount.MUMBAI).toBeInstanceOf(BiconomySmartAccountV2);
    
  }, 50000);

  // it("Should create and deploy Smart Accounts on 2 chains", async () => {

  //     const configs: SmartAccountV2MultiConfig = [
  //       { 
  //         signer: mumbaiSigner,
  //         chainId: ChainId.POLYGON_MUMBAI,
  //         paymasterApiKey: process.env.MUMBAI_PAYMASTER_ID!,
  //         deployOnChain : {
  //           prefundAmount: ethers.utils.parseEther("0.001")
  //         },
  //         index: 12
  //       },
  //       { 
  //         signer: goerliSigner,
  //         chainId: ChainId.GOERLI,
  //         paymasterApiKey: process.env.GOERLI_PAYMASTER_ID!,
  //         deployOnChain :{
  //           prefundAmount: ethers.utils.parseEther("0.01")
  //         },
  //         index: 12
  //       }
  //     ]

  //   const smartAccount = await createSmartAccountMultichain(
  //     configs,
  //   );

  //   expect(smartAccount.MUMBAI?.chainId).toBe(ChainId.POLYGON_MUMBAI);
  //   expect(smartAccount.GOERLI?.chainId).toBe(ChainId.GOERLI);

  //   expect(smartAccount.MUMBAI).toBeInstanceOf(BiconomySmartAccountV2);
  //   expect(smartAccount.GOERLI).toBeInstanceOf(BiconomySmartAccountV2);

  // }, 100000);

  // it("Should create and deploy smart account on 1 chain", async () => {

  //   const config: SmartAccountV2MultiConfig = 
  //      [ { 
  //         signer: goerliSigner,
  //         chainId: ChainId.GOERLI,
  //         paymasterApiKey: process.env.GOERLI_PAYMASTER_ID!,
  //         deployOnChain: {
  //           prefundAmount: ethers.utils.parseEther("0.01")
  //         }
  //       }]

  //   const smartAccount = await createSmartAccountMultichain(
  //     config,
  //   );

  // }, 50000);

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

    await expect(createSmartAccountMultichain(configs)).rejects.toThrow("Duplicate chain ids not allowed.");
    
  });

  it("Should throw and error if we provide duplicate paymaster api keys", async () => {
    
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

    await expect(createSmartAccountMultichain(configs)).rejects.toThrow("Duplicate paymaster api keys not allowed.");
    
  });

  it("Should create a user operation tx", async () => {

    const config: SmartAccountV2MultiConfig = 
       [ { 
          signer: mumbaiSigner,
          chainId: ChainId.POLYGON_MUMBAI,
          paymasterApiKey: process.env.MUMBAI_PAYMASTER_ID!,
        }]

    const smartAccount = await createSmartAccountMultichain(
      config,
    );
  
    const transaction = {
      to: await smartAccount.MUMBAI?.getAccountAddress() || "",
      data: '0x',
    }
  
    const userOp = await smartAccount.MUMBAI?.buildUserOp([transaction])
    userOp!.paymasterAndData = "0x"
  
    const userOpResponse = await smartAccount.MUMBAI?.sendUserOp(userOp!)
  
    const transactionDetail = await userOpResponse!.wait()
  
    console.log("transaction detail below")
    console.log(transactionDetail)
  
  }, 50000);

});