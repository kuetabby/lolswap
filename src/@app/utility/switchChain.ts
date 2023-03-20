import { Connector } from "@web3-react/types"

// import { networkConnection, walletConnectConnection } from "./Connection"
import { networkConnection } from "#/features/Swap/@utils/connectors/network"
import { walletConnectConnection } from "#/features/Swap/@utils/connectors/walletConnect"
// import { getChainInfo, L1ChainInfo } from "#/shared/constants/chainInfo"
import { isSupportedChain, SupportedChainId } from "#/shared/constants/chains"
import { getAddChainParameters } from "#/features/Swap/@utils/chain"
// import { FALLBACK_URLS, RPC_URLS } from "#/shared/constants/networks"
// import { getAddChainParameters } from "#/features/Swap/@utils/chain"

// function getRpcUrl(chainId: SupportedChainId): string {
// 	switch (chainId) {
// 		case SupportedChainId.MAINNET:
// 		case SupportedChainId.RINKEBY:
// 		case SupportedChainId.ROPSTEN:
// 		case SupportedChainId.KOVAN:
// 		case SupportedChainId.GOERLI:
// 			return RPC_URLS[chainId][0]
// 		// Attempting to add a chain using an infura URL will not work, as the URL will be unreachable from the MetaMask background page.
// 		// MetaMask allows switching to any publicly reachable URL, but for novel chains, it will display a warning if it is not on the "Safe" list.
// 		// See the definition of FALLBACK_URLS for more details.
// 		default:
// 			return FALLBACK_URLS[chainId][0]
// 	}
// }

export const switchChain = async (connector: Connector, chainId: SupportedChainId) => {
	if (!isSupportedChain(chainId)) {
		throw new Error(`Chain ${chainId} not supported for connector (${typeof connector})`)
	} else if (connector === walletConnectConnection.connector || connector === networkConnection.connector) {
		await connector.activate(+chainId)
	} else {
		await connector.activate(getAddChainParameters(Number(chainId)))
		// const info = getChainInfo(chainId)
		// console.log(getAddChainParameters(chainId))
		// console.log(+chainId === -1, "chainId")
		// await connector.activate(chainId === -1 ? undefined : )
		// if ((info as L1ChainInfo).networkType !== undefined) {
		// 	// console.log("error here")
		// 	// const chainInfo = info as L1ChainInfo
		// 	// const addChainParameter = {
		// 	// 	chainId,
		// 	// 	chainName: chainInfo?.label,
		// 	// 	rpcUrls: [getRpcUrl(chainId)],
		// 	// 	nativeCurrency: chainInfo?.nativeCurrency,
		// 	// 	blockExplorerUrls: [chainInfo?.explorer],
		// 	// }
		// 	// console.log(addChainParameter, "chain parameter")
		// 	// await connector.activate(addChainParameter)
		// 	// await connector.activate(chainId === -1 ? undefined : getAddChainParameters(desiredChainId))
		// }
	}
}
