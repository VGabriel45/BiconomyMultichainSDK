import { ChainId } from "@biconomy/core-types"
// import logger from "./logger";

export const defaultBundleUrlByChainId = (chainId: ChainId) => {
    return `https://bundler.biconomy.io/api/v2/${chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`;
}

// export const logConsole = (message: string, isError: boolean) => {
//     if(process.env.NODE_ENV === 'test'){
//         if(isError){
//             logger.error(message)
//         } else {
//             logger.info(message)
//         }
//     } else {
//         console.log(message);
//     }
// }