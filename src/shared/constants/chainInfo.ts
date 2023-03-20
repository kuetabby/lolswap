import { SupportedBSChainId, SupportedChainId, SupportedL1ChainId, SupportedL2ChainId } from "./chains"

import ethereumLogoUrl from "#/assets/ethereum-logo.png"
import optimismLogoUrl from "#/assets/optimistic_ethereum.svg"
import arbitrumLogoUrl from "#/assets/arbitrum_logo.svg"
import polygonMaticLogo from "#/assets/polygon-matic-logo.svg"
import celoLogo from "#/assets/celo_logo.svg"
import binanceLogo from "#/assets/bnb-logo.webp"

import { ARBITRUM_LIST, CELO_LIST, OPTIMISM_LIST } from "#/@app/utility/Token/listsUrls"

export const AVERAGE_L1_BLOCK_TIME = 12

export enum NetworkType {
	L1,
	L2,
	BSC,
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

export interface BSChainInfo extends BaseChainInfo {
	readonly networkType: NetworkType.BSC
}

type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo | BSChainInfo } & {
	readonly [chainId in SupportedL2ChainId]: L2ChainInfo
} & { readonly [chainId in SupportedL1ChainId]: L1ChainInfo } & { readonly [chainId in SupportedBSChainId]: BSChainInfo }

// type ChainInfoMap = { readonly [chainId: number]: L1ChainInfo } & { readonly [chainId in SupportedL1ChainId]: L1ChainInfo }

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
		color: "#FB118E",
	},
	[SupportedChainId.ROPSTEN]: {
		networkType: NetworkType.L1,
		docs: "https://docs.uniswap.org/",
		explorer: "https://ropsten.etherscan.io/",
		infoLink: "https://info.uniswap.org/#/",
		label: "Ropsten",
		logoUrl: ethereumLogoUrl,
		nativeCurrency: { name: "Ropsten Ether", symbol: "ropETH", decimals: 18 },
		color: "#A08116",
	},
	[SupportedChainId.KOVAN]: {
		networkType: NetworkType.L1,
		docs: "https://docs.uniswap.org/",
		explorer: "https://kovan.etherscan.io/",
		infoLink: "https://info.uniswap.org/#/",
		label: "Kovan",
		logoUrl: ethereumLogoUrl,
		nativeCurrency: { name: "Kovan Ether", symbol: "kovETH", decimals: 18 },
		color: "#FF0420",
	},
	[SupportedChainId.GOERLI]: {
		networkType: NetworkType.L1,
		docs: "https://docs.uniswap.org/",
		explorer: "https://goerli.etherscan.io/",
		infoLink: "https://info.uniswap.org/#/",
		label: "Görli",
		logoUrl: ethereumLogoUrl,
		nativeCurrency: { name: "Görli Ether", symbol: "görETH", decimals: 18 },
		color: "#209853",
	},
	[SupportedChainId.OPTIMISM]: {
		networkType: NetworkType.L2,
		docs: "https://optimism.io/",
		explorer: "https://optimistic.etherscan.io/",
		infoLink: "https://info.uniswap.org/#/optimism/",
		label: "Optimism",
		logoUrl: optimismLogoUrl,
		nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
		color: "#FF0420",
		bridge: "https://app.optimism.io/bridge",
		statusPage: "https://optimism.io/status",
		defaultListUrl: OPTIMISM_LIST,
		// blockWaitMsBeforeWarning: ms`25m`,
		// Optimism perfers same icon for both
		// circleLogoUrl: optimismLogoUrl,
		// helpCenterUrl: 'https://help.uniswap.org/en/collections/3137778-uniswap-on-optimistic-ethereum-oξ',
		// backgroundColor: darkTheme.chain_10_background,
	},
	[SupportedChainId.OPTIMISM_GOERLI]: {
		networkType: NetworkType.L2,
		docs: "https://optimism.io/",
		explorer: "https://goerli-optimism.etherscan.io/",
		infoLink: "https://info.uniswap.org/#/optimism/",
		label: "Optimism Görli",
		logoUrl: optimismLogoUrl,
		nativeCurrency: { name: "Optimism Goerli Ether", symbol: "görOpETH", decimals: 18 },
		color: "#FF0420",
		bridge: "https://app.optimism.io/bridge",
		statusPage: "https://optimism.io/status",
		defaultListUrl: OPTIMISM_LIST,
		// blockWaitMsBeforeWarning: ms`25m`,
		// helpCenterUrl: 'https://help.uniswap.org/en/collections/3137778-uniswap-on-optimistic-ethereum-oξ',
	},
	[SupportedChainId.ARBITRUM_ONE]: {
		networkType: NetworkType.L2,
		docs: "https://offchainlabs.com/",
		explorer: "https://arbiscan.io/",
		infoLink: "https://info.uniswap.org/#/arbitrum",
		label: "Arbitrum",
		logoUrl: arbitrumLogoUrl,
		nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
		color: "#28A0F0",
		bridge: "https://bridge.arbitrum.io/",
		defaultListUrl: ARBITRUM_LIST,
		blockWaitMsBeforeWarning: 1000 * 60 * 10,
		circleLogoUrl: arbitrumLogoUrl,
		helpCenterUrl: "https://help.uniswap.org/en/collections/3137787-uniswap-on-arbitrum",
		backgroundColor: "#040E34",
	},
	[SupportedChainId.ARBITRUM_GOERLI]: {
		networkType: NetworkType.L2,
		docs: "https://offchainlabs.com/",
		explorer: "https://goerli.arbiscan.io/",
		infoLink: "https://info.uniswap.org/#/arbitrum/",
		label: "Arbitrum Goerli",
		logoUrl: arbitrumLogoUrl,
		nativeCurrency: { name: "Goerli Arbitrum Ether", symbol: "goerliArbETH", decimals: 18 },
		color: "#28A0F0",
		bridge: "https://bridge.arbitrum.io/",
		defaultListUrl: ARBITRUM_LIST, // TODO: use arbitrum goerli token list
		// blockWaitMsBeforeWarning: ms`10m`,
		// helpCenterUrl: 'https://help.uniswap.org/en/collections/3137787-uniswap-on-arbitrum',
	},
	[SupportedChainId.POLYGON]: {
		networkType: NetworkType.L1,
		docs: "https://polygon.io/",
		explorer: "https://polygonscan.com/",
		infoLink: "https://info.uniswap.org/#/polygon/",
		label: "Polygon",
		logoUrl: polygonMaticLogo,
		nativeCurrency: { name: "Polygon Matic", symbol: "MATIC", decimals: 18 },
		color: "#A457FF",
		bridge: "https://wallet.polygon.technology/login",
		// blockWaitMsBeforeWarning: ms`10m`,
		// circleLogoUrl: polygonCircleLogoUrl,
		// backgroundColor: darkTheme.chain_137_background,
	},
	[SupportedChainId.POLYGON_MUMBAI]: {
		networkType: NetworkType.L1,
		docs: "https://polygon.io/",
		explorer: "https://mumbai.polygonscan.com/",
		infoLink: "https://info.uniswap.org/#/polygon/",
		label: "Polygon Mumbai",
		logoUrl: polygonMaticLogo,
		nativeCurrency: { name: "Polygon Mumbai Matic", symbol: "mMATIC", decimals: 18 },
		bridge: "https://wallet.polygon.technology/bridge",
		// blockWaitMsBeforeWarning: ms`10m`,
	},
	[SupportedChainId.CELO]: {
		networkType: NetworkType.L1,
		docs: "https://docs.celo.org/",
		explorer: "https://celoscan.io/",
		infoLink: "https://info.uniswap.org/#/celo",
		label: "Celo",
		logoUrl: celoLogo,
		nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
		bridge: "https://www.portalbridge.com/#/transfer",
		defaultListUrl: CELO_LIST,
		// blockWaitMsBeforeWarning: ms`10m`,
		// circleLogoUrl: celoCircleLogoUrl,
	},
	[SupportedChainId.CELO_ALFAJORES]: {
		networkType: NetworkType.L1,
		docs: "https://docs.celo.org/",
		explorer: "https://alfajores-blockscout.celo-testnet.org/",
		infoLink: "https://info.uniswap.org/#/celo",
		label: "Celo Alfajores",
		logoUrl: celoLogo,
		nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
		bridge: "https://www.portalbridge.com/#/transfer",
		defaultListUrl: CELO_LIST,
		// blockWaitMsBeforeWarning: ms`10m`,
	},
	[SupportedChainId.BNB]: {
		networkType: NetworkType.BSC,
		docs: "https://docs.bnbchain.org/docs/overview",
		explorer: "https://bscscan.com",
		infoLink: "https://info.uniswap.org/#/",
		label: "BNB Chain",
		logoUrl: binanceLogo,
		nativeCurrency: {
			name: "Binance",
			symbol: "BNB",
			decimals: 18,
		},
		color: "#F3BA2F",
	},
}

// export function getChainInfo(chainId: SupportedChainId | SupportedL1ChainId | number): L1ChainInfo | number | undefined {
export function getChainInfo(chainId: SupportedL1ChainId): L1ChainInfo
export function getChainInfo(chainId: SupportedL2ChainId): L2ChainInfo
export function getChainInfo(chainId: SupportedChainId): L1ChainInfo | L2ChainInfo | BSChainInfo
export function getChainInfo(chainId: SupportedBSChainId): BSChainInfo
export function getChainInfo(
	chainId: SupportedChainId | SupportedL1ChainId | SupportedL2ChainId | SupportedBSChainId | number | undefined
): L1ChainInfo | L2ChainInfo | BSChainInfo | undefined

/**
 * Overloaded method for returning ChainInfo given a chainID
 * Return type varies depending on input type:
 * number | undefined -> returns chaininfo | undefined
 * SupportedChainId -> returns L1ChainInfo | L2ChainInfo
 * SupportedL1ChainId -> returns L1ChainInfo
 * SupportedL2ChainId -> returns L2ChainInfo
 */
export function getChainInfo(chainId: any): any {
	if (chainId) {
		return CHAIN_INFO[chainId] ?? undefined
	}
	return undefined
}
