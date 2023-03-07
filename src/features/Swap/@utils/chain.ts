import { SupportedChainId } from "@uniswap/sdk-core"

import type { AddEthereumChainParameter } from "@web3-react/types"
import type { BasicChainInformation, ExtendedChainInformation, UrlsInformation } from "../@models/chain"

const ETH: AddEthereumChainParameter["nativeCurrency"] = {
	name: "Ether",
	symbol: "ETH",
	decimals: 18,
}

const MATIC: AddEthereumChainParameter["nativeCurrency"] = {
	name: "Matic",
	symbol: "MATIC",
	decimals: 18,
}

const CELO: AddEthereumChainParameter["nativeCurrency"] = {
	name: "Celo",
	symbol: "CELO",
	decimals: 18,
}

const INFURA_KEY = import.meta.env.VITE_INFURA_KEY
// const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY

function isExtendedChainInformation(
	chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
	return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
	const chainInformation = CHAINS[chainId]
	if (isExtendedChainInformation(chainInformation)) {
		return {
			chainId,
			chainName: chainInformation.name,
			nativeCurrency: chainInformation.nativeCurrency,
			rpcUrls: chainInformation.urls,
			blockExplorerUrls: chainInformation.blockExplorerUrls,
		}
	} else {
		return chainId
	}
}

export const CHAINS: { [chainId: number]: BasicChainInformation | ExtendedChainInformation } = {
	[SupportedChainId.MAINNET]: {
		urls: [
			INFURA_KEY ? `https://mainnet.infura.io/v3/${INFURA_KEY}` : "",
			// ALCHEMY_KEY ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}` : "",
			"https://cloudflare-eth.com",
		].filter((url) => url !== ""),
		name: "Mainnet",
	},
	[SupportedChainId.ROPSTEN]: {
		urls: ["https://staging.orionprotocol.io/rpc"],
		// urls: [INFURA_KEY ? `https://ropsten.infura.io/v3/${INFURA_KEY}` : ""].filter((url) => url !== ""),
		name: "Ropsten",
	},
	[SupportedChainId.RINKEBY]: {
		urls: [INFURA_KEY ? `https://rinkeby.infura.io/v3/${INFURA_KEY}` : ""].filter((url) => url !== ""),
		name: "Rinkeby",
	},
	[SupportedChainId.GOERLI]: {
		urls: [INFURA_KEY ? `https://goerli.infura.io/v3/${INFURA_KEY}` : ""].filter((url) => url !== ""),
		name: "Görli",
	},
	[SupportedChainId.KOVAN]: {
		urls: [INFURA_KEY ? `https://kovan.infura.io/v3/${INFURA_KEY}` : ""].filter((url) => url !== ""),
		name: "Kovan",
	},
	// Optimism
	[SupportedChainId.OPTIMISM]: {
		urls: [INFURA_KEY ? `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}` : "", "https://mainnet.optimism.io"].filter(
			(url) => url !== ""
		),
		name: "Optimism",
		nativeCurrency: ETH,
		blockExplorerUrls: ["https://optimistic.etherscan.io"],
	},
	69: {
		urls: [INFURA_KEY ? `https://optimism-kovan.infura.io/v3/${INFURA_KEY}` : "", "https://kovan.optimism.io"].filter(
			(url) => url !== ""
		),
		name: "Optimism Kovan",
		nativeCurrency: ETH,
		blockExplorerUrls: ["https://kovan-optimistic.etherscan.io"],
	},
	// Arbitrum
	[SupportedChainId.ARBITRUM_ONE]: {
		urls: [INFURA_KEY ? `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}` : "", "https://arb1.arbitrum.io/rpc"].filter(
			(url) => url !== ""
		),
		name: "Arbitrum One",
		nativeCurrency: ETH,
		blockExplorerUrls: ["https://arbiscan.io"],
	},
	[SupportedChainId.ARBITRUM_RINKEBY]: {
		urls: [INFURA_KEY ? `https://arbitrum-rinkeby.infura.io/v3/${INFURA_KEY}` : "", "https://rinkeby.arbitrum.io/rpc"].filter(
			(url) => url !== ""
		),
		name: "Arbitrum Testnet",
		nativeCurrency: ETH,
		blockExplorerUrls: ["https://testnet.arbiscan.io"],
	},
	// Polygon
	[SupportedChainId.POLYGON]: {
		urls: [INFURA_KEY ? `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}` : "", "https://polygon-rpc.com"].filter(
			(url) => url !== ""
		),
		name: "Polygon Mainnet",
		nativeCurrency: MATIC,
		blockExplorerUrls: ["https://polygonscan.com"],
	},
	[SupportedChainId.POLYGON_MUMBAI]: {
		urls: [INFURA_KEY ? `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}` : ""].filter((url) => url !== ""),
		name: "Polygon Mumbai",
		nativeCurrency: MATIC,
		blockExplorerUrls: ["https://mumbai.polygonscan.com"],
	},
	// Celo
	[SupportedChainId.CELO]: {
		urls: ["https://forno.celo.org"],
		name: "Celo",
		nativeCurrency: CELO,
		blockExplorerUrls: ["https://explorer.celo.org"],
	},
	[SupportedChainId.CELO_ALFAJORES]: {
		urls: ["https://alfajores-forno.celo-testnet.org"],
		name: "Celo Alfajores",
		nativeCurrency: CELO,
		blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org"],
	},
}

export const URLS: UrlsInformation = Object.keys(CHAINS).reduce<UrlsInformation>((accumulator, chainId) => {
	const validURLs: string[] = CHAINS[Number(chainId)].urls

	if (validURLs.length) {
		accumulator[Number(chainId)] = validURLs
	}

	return accumulator
}, {})
