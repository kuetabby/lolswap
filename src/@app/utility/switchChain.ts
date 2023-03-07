import { Connector } from "@web3-react/types"

import { networkConnection, walletConnectConnection } from "./Connection"
import { getChainInfo, L1ChainInfo } from "#/shared/constants/chainInfo"
import { isSupportedChain, SupportedChainId } from "#/shared/constants/chains"
import { FALLBACK_URLS, RPC_URLS } from "#/shared/constants/networks"

function getRpcUrl(chainId: SupportedChainId): string {
	switch (chainId) {
		case SupportedChainId.MAINNET:
		case SupportedChainId.RINKEBY:
		case SupportedChainId.ROPSTEN:
		case SupportedChainId.KOVAN:
		case SupportedChainId.GOERLI:
			return RPC_URLS[chainId][0]
		// Attempting to add a chain using an infura URL will not work, as the URL will be unreachable from the MetaMask background page.
		// MetaMask allows switching to any publicly reachable URL, but for novel chains, it will display a warning if it is not on the "Safe" list.
		// See the definition of FALLBACK_URLS for more details.
		default:
			return FALLBACK_URLS[chainId][0]
	}
}

export const switchChain = async (connector: Connector, chainId: SupportedChainId) => {
	if (!isSupportedChain(chainId)) {
		throw new Error(`Chain ${chainId} not supported for connector (${typeof connector})`)
	} else if (connector === walletConnectConnection.connector || connector === networkConnection.connector) {
		await connector.activate(chainId)
	} else {
		const info = getChainInfo(chainId)
		if ((info as L1ChainInfo).networkType !== undefined) {
			const chainInfo = info as L1ChainInfo
			const addChainParameter = {
				chainId,
				chainName: chainInfo?.label,
				rpcUrls: [getRpcUrl(chainId)],
				nativeCurrency: chainInfo?.nativeCurrency,
				blockExplorerUrls: [chainInfo?.explorer],
			}
			await connector.activate(addChainParameter)
		}
	}
}
