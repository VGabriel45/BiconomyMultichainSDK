import { ChainId } from "@biconomy/core-types"

export const defaultBundleUrlByChainId = (chainId: ChainId) => {
    return `https://bundler.biconomy.io/api/v2/${chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`;
}