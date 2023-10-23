/**
 * Represents the overheads associated with gas usage.
 */
import { GasOverheads } from "@biconomy/account/dist/src/utils/Preverificaiton";

/**
 * Interface for the Biconomy bundler.
 */
import { IBundler } from "@biconomy/bundler";

/**
 * Base validation module from Biconomy.
 */
import { BaseValidationModule } from "@biconomy/modules";

/**
 * Interface for the Biconomy paymaster.
 */
import { IPaymaster } from "@biconomy/paymaster";

/**
 * Ethers library for Ethereum-based operations.
 */
import { ethers } from "ethers";

/**
 * Provider from ethers for Ethereum-based operations.
 */
import { Provider } from "@ethersproject/providers";

/**
 * Represents the signer used for signing Ethereum transactions.
 */
type Signer = ethers.Signer;

/**
 * Enum representing supported chain IDs.
 */
export enum ChainId {
  POLYGON_MUMBAI = 80001,
  GOERLI = 5,
}

/**
 * Optional configuration options for a smart account.
 */
export interface BaseSmartAccountConfigOptionals {
  index?: number;
  provider?: Provider;
  entryPointAddress?: string;
  accountAddress?: string;
  overheads?: Partial<GasOverheads>;
  paymaster?: IPaymaster;
  bundler?: IBundler;
}

/**
 * Optional configuration specific to BiconomySmartAccountV2.
 */
export interface BiconomySmartAccountV2ConfigOptionals extends BaseSmartAccountConfigOptionals {
  factoryAddress?: string;
  implementationAddress?: string;
  defaultFallbackHandler?: string;
  rpcUrl?: string;
  nodeClientUrl?: string;
  activeValidationModule?: BaseValidationModule;
}

/**
 * Configuration for creating a BiconomySmartAccountV2.
 */
export type SmartAccountV2Config = BiconomySmartAccountV2ConfigOptionals & {
  chainId: ChainId;
  signer: Signer,
  paymasterApiKey: string;
  deployOnChain?: {
    prefundAmount: ethers.BigNumber;
  };
}

/**
 * Represents an array of configurations for creating a BiconomySmartAccountV2 on multiple chains.
 */
export type SmartAccountV2MultiConfig = SmartAccountV2Config[];