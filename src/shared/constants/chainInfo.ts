import { SupportedChainId, SupportedL1ChainId } from "./chains"

import ethereumLogoUrl from "#/assets/ethereum-logo.png"

export const AVERAGE_L1_BLOCK_TIME = 12

export enum NetworkType {
	L1,
	L2,
}

interface BaseChainInfo {
	readonly networkType: NetworkType
	readonly blockWaitMsBeforeWarning?: number
	readonly docs: string
	readonly bridge?: string
	readonly explorer: string
	readonly infoLink: string
	readonly logoUrl: string
	readonly circleLogoUrl?: string
	readonly label: string
	readonly helpCenterUrl?: string
	readonly nativeCurrency: {
		name: string // e.g. 'Goerli ETH',
		symbol: string // e.g. 'gorETH',
		decimals: number // e.g. 18,
	}
	readonly color?: string
	readonly backgroundColor?: string
}

export interface L1ChainInfo extends BaseChainInfo {
	readonly networkType: NetworkType.L1
	readonly defaultListUrl?: string
}

export interface L2ChainInfo extends BaseChainInfo {
	readonly networkType: NetworkType.L2
	readonly bridge: string
	readonly statusPage?: string
	readonly defaultListUrl: string
}

// type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo } & {
// 	readonly [chainId in SupportedL2ChainId]: L2ChainInfo
// } & { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo } & { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

const CHAIN_INFO: ChainInfoMap = {
	[SupportedChainId.MAINNET]: {
		networkType: NetworkType.L1,
		docs: "https://docs.uniswap.org/",
		explorer: "https://etherscan.io/",
		infoLink: "https://info.uniswap.org/#/",
		label: "Ethereum",
		logoUrl: ethereumLogoUrl,
		nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
		color: "#627EEA",
	},
	[SupportedChainId.RINKEBY]: {
		networkType: NetworkType.L1,
		docs: "https://docs.uniswap.org/",
		explorer: "https://rinkeby.etherscan.io/",
		infoLink: "https://info.uniswap.org/#/",
		label: "Rinkeby",
		logoUrl: ethereumLogoUrl,
		nativeCurrency: { name: "Rinkeby Ether", symbol: "rETH", decimals: 18 },
		color: "FB118E",
	},
	[SupportedChainId.ROPSTEN]: {
		networkType: NetworkType.L1,
		docs: "https://docs.uniswap.org/",
		explorer: "https://ropsten.etherscan.io/",
		infoLink: "https://info.uniswap.org/#/",
		label: "Ropsten",
		logoUrl: ethereumLogoUrl,
		nativeCurrency: { name: "Ropsten Ether", symbol: "ropETH", decimals: 18 },
		color: "A08116",
	},
	[SupportedChainId.KOVAN]: {
		networkType: NetworkType.L1,
		docs: "https://docs.uniswap.org/",
		explorer: "https://kovan.etherscan.io/",
		infoLink: "https://info.uniswap.org/#/",
		label: "Kovan",
		logoUrl: ethereumLogoUrl,
		nativeCurrency: { name: "Kovan Ether", symbol: "kovETH", decimals: 18 },
		color: "FF0420",
	},
	[SupportedChainId.GOERLI]: {
		networkType: NetworkType.L1,
		docs: "https://docs.uniswap.org/",
		explorer: "https://goerli.etherscan.io/",
		infoLink: "https://info.uniswap.org/#/",
		label: "Görli",
		logoUrl: ethereumLogoUrl,
		nativeCurrency: { name: "Görli Ether", symbol: "görETH", decimals: 18 },
		color: "209853",
	},
}

export function getChainInfo(chainId: SupportedChainId | SupportedL1ChainId | number): L1ChainInfo | number | undefined {
	if (chainId) {
		return CHAIN_INFO[chainId] ?? undefined
	}
	return undefined
}
