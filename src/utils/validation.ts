import { SmartAccountV2Config, SmartAccountV2MultiConfig } from "../types/CreateSmartAccountConfig";
import { ethers } from "ethers";

/**
 * Validates the provided configuration for creating a smart account.
 * @param {SmartAccountV2Config} config - Configuration object for creating the smart account.
 * @throws {Error} Throws an error if the configuration is invalid.
 */
export const validateSmartAccountConfig = (config: SmartAccountV2Config) => {
    console.info("Validating smart account config...");
    if(!config.signer){
        throw new Error("Signer is required.");
    }
    if (!config.chainId) {
        throw new Error("Chain ID is required.");
    }
    if (!config.paymasterApiKey) {
        throw new Error("Paymaster API KEY is required.");
    }
};

/**
 * Checks for duplicate values in configs
 * @param {ethers.Signer} signer - The signer object used to sign transactions.
 * @param {SmartAccountV2Config} configs - Configuration object array for creating the smart accounts.
 * @throws {Error} Throws an error if there is any duplicated value.
 */
export const checkDuplicate = (configs: SmartAccountV2MultiConfig) => {
    console.info("Checking for duplicate values in configs...");
    checkDuplicateChainIds(configs);
    checkDuplicatePaymasterIds(configs);
}

const checkDuplicateChainIds = (configs: SmartAccountV2MultiConfig) => {
    const chainIds = configs.map(config => config.chainId);
    if(new Set(chainIds).size !== chainIds.length) {
        throw new Error("Duplicate chain ids not allowed.");
    }
};

const checkDuplicatePaymasterIds = (configs: SmartAccountV2MultiConfig) => {
    const paymasterIds = configs.map(config => config.paymasterApiKey);
    if(new Set(paymasterIds).size !== paymasterIds.length) {
        throw new Error("Duplicate paymaster api keys not allowed.");
    }
};