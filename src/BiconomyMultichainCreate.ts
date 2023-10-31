/**
 * @module BiconomySmartAccountSDK
 * @description This module provides functionalities to create smart accounts easily using the Biconomy SDK.
 */

import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { DEFAULT_ECDSA_OWNERSHIP_MODULE, DEFAULT_MULTICHAIN_MODULE, ECDSAOwnershipValidationModule } from "@biconomy/modules";
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomyPaymaster, IHybridPaymaster, PaymasterMode, SponsorUserOperationDto } from '@biconomy/paymaster'
import { ethers } from "ethers";

import {ChainId, SmartAccountV2Config, SmartAccountV2MultiConfig} from './types/CreateSmartAccountConfig';
import { defaultBundleUrlByChainId } from "./utils/utils";
import { checkDuplicate, validateSmartAccountConfig } from "./utils/validation";

/**
 * Creates a Biconomy smart account based on the provided configuration.
 * 
 * @remarks
 * This function initializes various components such as the module, bundler, and paymaster.
 * This function will create a BiconomySmartAccountV2 instance using Biconomy's SDK.
 * If the `deployOnChain` option is provided in the configuration, it will also handle the deployment of the smart account.
 * 
 * @example
 * const account = await createSmartAccount(config);
 * 
 * @param config - Configuration for creating the smart account.
 * @returns A promise that resolves to the created Smart Account.
 * 
 * @throws Will throw an error if any of the initialization steps fail.
 */
const createSmartAccount = async (config: SmartAccountV2Config) => {
    const signer: ethers.Signer = config.signer;
    validateSmartAccountConfig(config);

    let module: ECDSAOwnershipValidationModule, bundler: IBundler, biconomySmartAccount: BiconomySmartAccountV2, paymaster: IHybridPaymaster<SponsorUserOperationDto> | undefined;

    try {
        console.info(`Initializing module with address: ${DEFAULT_MULTICHAIN_MODULE}`);
        module = await ECDSAOwnershipValidationModule.create({
            signer,
            moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
        })
    } catch (error) {
        (`Error on initializing module: ${error}`); 
        throw new Error(`Error on initializing module: ${error}`);
    }

    try {
        console.info(`Initializing bundler with url: ${defaultBundleUrlByChainId(config.chainId)}`);
        bundler = new Bundler({
            bundlerUrl: defaultBundleUrlByChainId(config.chainId),    
            chainId: config.chainId,
            entryPointAddress: config.entryPointAddress || DEFAULT_ENTRYPOINT_ADDRESS,
        })
    } catch (error) {
        throw new Error(`Error on initializing bundler: ${error}`);
    }
   
    if(config.paymasterApiKey){
        try {
            console.info(`Initializing paymaster with url: https://paymaster.biconomy.io/api/v1/${config.chainId}/${config.paymasterApiKey}`);
            paymaster = new BiconomyPaymaster({
                paymasterUrl: `https://paymaster.biconomy.io/api/v1/${config.chainId}/${config.paymasterApiKey}`,
            })
        } catch (error) {
            throw new Error(`Error on initializing paymaster: ${error}`);
        }
    }
  
    try {
        console.info(`Initializing biconomySmartAccount with chainId: ${config.chainId}`);
        biconomySmartAccount = await BiconomySmartAccountV2.create({
            chainId: config.chainId,
            bundler: bundler,
            paymaster: paymaster, 
            entryPointAddress: config.entryPointAddress || DEFAULT_ENTRYPOINT_ADDRESS,
            defaultValidationModule: module,
            activeValidationModule: module,
            rpcUrl: config.rpcUrl|| undefined,
            accountAddress: config.accountAddress || undefined,
            index: config.index || undefined,
            factoryAddress: config.factoryAddress || undefined,
            implementationAddress: config.implementationAddress|| undefined,
            defaultFallbackHandler: config.defaultFallbackHandler || undefined,
            nodeClientUrl: config.nodeClientUrl || undefined,
        })
    } catch (error) {
        throw new Error(`Error on initializing biconomySmartAccount: ${error}`);
    }
    const accountAddress = await biconomySmartAccount.getAccountAddress();
    console.info(`Counter factual address on chain id ${config.chainId} is ${await biconomySmartAccount.getAccountAddress()}`);
    
    if(config.deployOnChain){
        const prefundAmount = config.deployOnChain.prefundAmount;
        const isDeployed = await biconomySmartAccount.isAccountDeployed(accountAddress)
        console.log(`Smart account with address ${accountAddress} at chaid id ${config.chainId} is deployed: ${isDeployed}`);
        if(!isDeployed){
            console.log('Deploying smart account...');
            if(paymaster !== undefined){
                console.log('Sending gasless tx through paymaster...');
                await sendGaslessEmptyTx(biconomySmartAccount);
            } else {
                await prefundSmartAccount(signer, prefundAmount, biconomySmartAccount);
                await sendEmptyTx(biconomySmartAccount);
            }
            console.log(`Smart Account deployed at ${biconomySmartAccount.accountAddress}`);
        } else {
            console.log(`Smart account with address ${accountAddress} already deployed on chain id ${config.chainId}`);
        }
    }

    return biconomySmartAccount;
  }

/**
 * Creates multiple Smart Accounts based on the provided configurations.
 * 
 * @remarks
 * This function ensures that there are no duplicate configurations before creating the smart accounts.
 * This uses Biconomy's SDK to create BiconomySmartAccountV2 instances, if you provide "deployOnChain" property, the smart account will also be deployed.
 * 
 * @example
 * const accounts = await createSmartAccountMultichain(configs);
 * 
 * @param configs - An array of configurations for creating the smart accounts.
 * @returns An object with the created smart accounts on each chain.
 */
export const createSmartAccountMultichain = async (configs: SmartAccountV2MultiConfig) => {

    checkDuplicate(configs);

    const promises = configs.map(async (config) => {
        return createSmartAccount(
            config
        ).then(account => (account));
    });

    const resolvedPromises = await Promise.all(promises);
    return {
        MUMBAI: resolvedPromises.find((account) => account.chainId === ChainId.POLYGON_MUMBAI)!,
        GOERLI: resolvedPromises.find((account) => account.chainId === ChainId.GOERLI)!,
    }
}
/**
 * Prefunds a Smart Account with a specified amount.
 * 
 * @example
 * const tx = await prefundSmartAccount(signer, ethers.utils.parseEther("1"));
 * 
 * @param signer - The signer object used to sign transactions.
 * @param prefundAmount - The amount to prefund the smart account with.
 * @param smartAccount - The Smart Account instance.
 * @returns A promise that resolves to the transaction details.
 */
async function prefundSmartAccount(signer: ethers.Signer, prefundAmount: ethers.BigNumber, smartAccount: BiconomySmartAccountV2) {
    const accountAddr = await smartAccount.getAccountAddress();

    const prefund = {
        to: accountAddr,
        value: prefundAmount,
    } 

    const tx = await signer.sendTransaction(prefund);
    await tx.wait(5);

    return tx;
}

/**
 * Sends an empty transaction using the paymaster to pay for the gas.
 * 
 * @example
 * await sendGaslessEmptyTx(smartAccount);
 * 
 * @param smartAccount - The Smart Account to send the empty transaction to.
 */
async function sendGaslessEmptyTx(smartAccount: BiconomySmartAccountV2) {
    const accountAddr = await smartAccount.getAccountAddress();
    const transaction = {
        to: accountAddr,
        data: '0x',
    }

    const userOp = await smartAccount.buildUserOp([transaction])
    
    const biconomyPaymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
    let paymasterServiceData = {
        mode: PaymasterMode.SPONSORED,
        calculateGasLimits: true
    }
    
    const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(userOp, paymasterServiceData);
    
    userOp.paymasterAndData = paymasterAndDataResponse?.paymasterAndData || "0x";

    const userOpResponse = await smartAccount.sendUserOp(userOp)
    
    const transactionDetail = await userOpResponse.wait()
  
    console.log("transaction detail below")
    console.log(transactionDetail)
}

/**
 * Sends an empty transaction to a Smart Account.
 * 
 * @example
 * await sendEmptyTx(smartAccount);
 * 
 * @param smartAccount - The Smart Account to send the empty transaction to.
 */
async function sendEmptyTx(smartAccount: BiconomySmartAccountV2) {
    const accountAddr = await smartAccount.getAccountAddress();
    
    const transaction = {
      to: accountAddr,
      data: '0x',
    }
  
    const userOp = await smartAccount.buildUserOp([transaction])
    userOp.paymasterAndData = "0x"
  
    const userOpResponse = await smartAccount.sendUserOp(userOp)
  
    const transactionDetail = await userOpResponse.wait()
  
    console.log("transaction detail below")
    console.log(transactionDetail)
}