import { BiconomySmartAccountV2 } from "@biconomy/account";
import {createSmartAccountMultichain} from "../src/index";
import { Wallet, ethers, providers } from 'ethers';
import {ChainId, SmartAccountV2Config, SmartAccountV2MultiConfig } from "../src/types/CreateSmartAccountConfig";
import { PaymasterMode, IHybridPaymaster, SponsorUserOperationDto } from "@biconomy/paymaster";
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

  it("Should create a smart account on 2 chains", async () => {

    const configs: SmartAccountV2MultiConfig = [
        { 
          signer: mumbaiSigner,
          chainId: ChainId.POLYGON_MUMBAI,
          index: 3,
          deployOnChain: {
            prefundAmount: ethers.utils.parseEther("0.001")
          }
        },
        { 
          signer: goerliSigner,
          chainId: ChainId.GOERLI,
          index: 3,
          deployOnChain: {
            prefundAmount: ethers.utils.parseEther("0.003")
          }
        }
    ]

    const smartAccount = await createSmartAccountMultichain(
      configs
    );

    expect(smartAccount.MUMBAI?.chainId).toBe(ChainId.POLYGON_MUMBAI);
    expect(smartAccount.GOERLI?.chainId).toBe(ChainId.GOERLI);

    expect(smartAccount.MUMBAI).toBeInstanceOf(BiconomySmartAccountV2);
    expect(smartAccount.GOERLI).toBeInstanceOf(BiconomySmartAccountV2);

  }, 50000);

  // it("Should create a smart account on 2 chains gasless", async () => {

  //   const signerBalanceBefore = await mumbaiSigner.getBalance();

  //   const configs: SmartAccountV2MultiConfig = [
  //       { 
  //         signer: mumbaiSigner,
  //         chainId: ChainId.POLYGON_MUMBAI,
  //         paymasterApiKey: process.env.MUMBAI_PAYMASTER_API_KEY!,
  //         index: 5,
  //         deployOnChain: {
  //           prefundAmount: ethers.utils.parseEther("0")
  //         }
  //       },
  //       { 
  //         signer: goerliSigner,
  //         chainId: ChainId.GOERLI,
  //         paymasterApiKey: process.env.GOERLI_PAYMASTER_API_KEY!,
  //         index: 4,
  //         deployOnChain: {
  //           prefundAmount: ethers.utils.parseEther("0")
  //         }
  //       }
  //   ]

  //   const smartAccount = await createSmartAccountMultichain(
  //     configs
  //   );

  //   expect(smartAccount.MUMBAI?.chainId).toBe(ChainId.POLYGON_MUMBAI);
  //   // expect(smartAccount.GOERLI?.chainId).toBe(ChainId.GOERLI);

  //   expect(smartAccount.MUMBAI).toBeInstanceOf(BiconomySmartAccountV2);
  //   // expect(smartAccount.GOERLI).toBeInstanceOf(BiconomySmartAccountV2);

  //   const signerBalanceAfter = await mumbaiSigner.getBalance();

  //   expect(signerBalanceAfter).toEqual(signerBalanceBefore);

  // }, 50000);

  // it("Should create smart account on 1 chain", async () => {
    
  //   const config: SmartAccountV2MultiConfig = 
  //       [{ 
  //         signer: mumbaiSigner,
  //         chainId: ChainId.POLYGON_MUMBAI,
  //         paymasterApiKey: process.env.MUMBAI_PAYMASTER_API_KEY!,
  //       }]

  //   const smartAccount = await createSmartAccountMultichain(
  //     config,
  //   );

  //   expect(smartAccount.MUMBAI?.chainId).toBe(ChainId.POLYGON_MUMBAI);

  //   expect(smartAccount.MUMBAI).toBeInstanceOf(BiconomySmartAccountV2);
    
  // }, 50000);

  // it("Should create and deploy Smart Accounts on 2 chains", async () => {

  //     const configs: SmartAccountV2MultiConfig = [
  //       { 
  //         signer: mumbaiSigner,
  //         chainId: ChainId.POLYGON_MUMBAI,
  //         paymasterApiKey: process.env.MUMBAI_PAYMASTER_API_KEY!,
  //         deployOnChain : {
  //           prefundAmount: ethers.utils.parseEther("0.001")
  //         },
  //         index: 12
  //       },
  //       { 
  //         signer: goerliSigner,
  //         chainId: ChainId.GOERLI,
  //         paymasterApiKey: process.env.GOERLI_PAYMASTER_API_KEY!,
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

  // it("Should create and deploy smart account on 1 chain GASLESS", async () => {

  //   const config: SmartAccountV2MultiConfig = 
  //      [ { 
  //         signer: mumbaiSigner,
  //         chainId: ChainId.POLYGON_MUMBAI,
  //         paymasterApiKey: process.env.MUMBAI_PAYMASTER_API_KEY!,
  //         index: 22
  //       }]

  //   const smartAccount = await createSmartAccountMultichain(
  //     config,
  //   );

  //   const transaction = {
  //     to: smartAccount.MUMBAI?.accountAddress || "",
  //     data: '0x',
  //   }
  
  //   const userOp = await smartAccount.MUMBAI?.buildUserOp([transaction])
  //   userOp!.paymasterAndData = "0x"

  //   const biconomyPaymaster = smartAccount.GOERLI?.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
  //   let paymasterServiceData = {
  //     mode: PaymasterMode.SPONSORED,
  //     smartAccountInfo: {
  //       name: 'BICONOMY',
  //       version: '1.0.0'
  //     }
  //   }

  //   const paymasterAndDataResponse = await biconomyPaymaster?.getPaymasterAndData(userOp!, paymasterServiceData);

  //   if (
  //     paymasterAndDataResponse.callGasLimit &&
  //     paymasterAndDataResponse.verificationGasLimit &&
  //     paymasterAndDataResponse.preVerificationGas
  //   ) {
  //     userOp!.callGasLimit = paymasterAndDataResponse.callGasLimit;
  //     userOp!.verificationGasLimit =
  //     paymasterAndDataResponse.verificationGasLimit;
  //     userOp!.preVerificationGas =
  //     paymasterAndDataResponse.preVerificationGas;
  //   }

  //   userOp!.paymasterAndData = paymasterAndDataResponse?.paymasterAndData || "0x";

  //   const resp = await smartAccount.MUMBAI?.sendUserOp(userOp!)

  //   const receipt = await resp!.wait(1)
  //   console.log(receipt, "receipt");
    

  // }, 50000);

  // it("Should throw and error if we provide duplicate chain ids", async () => {
    
  //   const configs: SmartAccountV2MultiConfig = [
  //       { 
  //         signer: mumbaiSigner,
  //         chainId: ChainId.POLYGON_MUMBAI,
  //         paymasterApiKey: process.env.MUMBAI_PAYMASTER_API_KEY!,
  //       },
  //       { 
  //         signer: goerliSigner,
  //         chainId: ChainId.POLYGON_MUMBAI,
  //         paymasterApiKey: process.env.GOERLI_PAYMASTER_API_KEY!,
  //       }
  //   ]

  //   await expect(createSmartAccountMultichain(configs)).rejects.toThrow("Duplicate chain ids not allowed.");
    
  // });

  // it("Should throw and error if we provide duplicate paymaster api keys", async () => {
    
  //   const configs: SmartAccountV2MultiConfig = [
  //     { 
  //       signer: mumbaiSigner,
  //       chainId: ChainId.POLYGON_MUMBAI,
  //       paymasterApiKey: process.env.MUMBAI_PAYMASTER_API_KEY!,
  //     },
  //     { 
  //       signer: goerliSigner,
  //       chainId: ChainId.GOERLI,
  //       paymasterApiKey: process.env.MUMBAI_PAYMASTER_API_KEY!,
  //     }
  // ]

  //   await expect(createSmartAccountMultichain(configs)).rejects.toThrow("Duplicate paymaster api keys not allowed.");
    
  // });

  // it("Should create and send a sponsored user operation", async () => {

  //   const signerBalanceBefore = await mumbaiSigner.getBalance();

  //   const config: SmartAccountV2MultiConfig = 
  //      [ { 
  //         signer: mumbaiSigner,
  //         chainId: ChainId.POLYGON_MUMBAI,
  //         paymasterApiKey: process.env.MUMBAI_PAYMASTER_API_KEY!,
  //       }]

  //   const smartAccount = await createSmartAccountMultichain(
  //     config,
  //   );


  //   const transaction = {
  //     to: smartAccount.MUMBAI?.accountAddress || "",
  //     data: '0x',
  //   }

  //   const userOp = await smartAccount.MUMBAI.buildUserOp([transaction])
  //   userOp.paymasterAndData = "0x"

  //   const biconomyPaymaster = smartAccount.MUMBAI?.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
  //   let paymasterServiceData = {
  //     mode: PaymasterMode.SPONSORED,
  //     calculateGasLimits: true
  //   }

  //   const paymasterAndDataResponse = await biconomyPaymaster?.getPaymasterAndData(userOp, paymasterServiceData);

  //   if (
  //     paymasterAndDataResponse.callGasLimit &&
  //     paymasterAndDataResponse.verificationGasLimit &&
  //     paymasterAndDataResponse.preVerificationGas
  //   ) {
  //     userOp.callGasLimit = paymasterAndDataResponse.callGasLimit;
  //     userOp.verificationGasLimit =
  //     paymasterAndDataResponse.verificationGasLimit;
  //     userOp.preVerificationGas =
  //     paymasterAndDataResponse.preVerificationGas;
  //   }

  //   userOp!.paymasterAndData = paymasterAndDataResponse?.paymasterAndData || "0x";

  //   const resp = await smartAccount.MUMBAI?.sendUserOp(userOp!)

  //   const receipt = await resp!.wait(1)
  //   console.log(receipt, "receipt");

  //   const signerBalanceAfter = await mumbaiSigner.getBalance();

  //   expect(signerBalanceAfter).toEqual(signerBalanceBefore);
  
  // }, 50000);

});