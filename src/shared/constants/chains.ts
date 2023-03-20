export enum SupportedChainId {
	MAINNET = 1,
	ROPSTEN = 3,
	RINKEBY = 4,
	GOERLI = 5,
	KOVAN = 42,

	ARBITRUM_ONE = 42161,
	ARBITRUM_RINKEBY = 421611,
	ARBITRUM_GOERLI = 421613,

	OPTIMISM = 10,
	OPTIMISM_GOERLI = 420,

	POLYGON = 137,
	POLYGON_MUMBAI = 80001,

	CELO = 42220,
	CELO_ALFAJORES = 44787,

	BNB = 56,
}

export const CHAIN_IDS_TO_NAMES = {
	[SupportedChainId.MAINNET]: "mainnet",
	[SupportedChainId.ROPSTEN]: "ropsten",
	[SupportedChainId.RINKEBY]: "rinkeby",
	[SupportedChainId.GOERLI]: "goerli",
	[SupportedChainId.KOVAN]: "kovan",
	[SupportedChainId.POLYGON]: "polygon",
	[SupportedChainId.POLYGON_MUMBAI]: "polygon_mumbai",
	[SupportedChainId.CELO]: "celo",
	[SupportedChainId.CELO_ALFAJORES]: "celo_alfajores",
	[SupportedChainId.ARBITRUM_ONE]: "arbitrum",
	[SupportedChainId.ARBITRUM_RINKEBY]: "arbitrum_rinkeby",
	[SupportedChainId.ARBITRUM_GOERLI]: "arbitrum_goerli",
	[SupportedChainId.OPTIMISM]: "optimism",
	[SupportedChainId.OPTIMISM_GOERLI]: "optimism_goerli",
	[SupportedChainId.BNB]: "binance",
}

export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
	return !!chainId && !!SupportedChainId[chainId]
}

export const L1_CHAIN_IDS = [
	SupportedChainId.MAINNET,
	SupportedChainId.ROPSTEN,
	SupportedChainId.RINKEBY,
	SupportedChainId.GOERLI,
	SupportedChainId.KOVAN,
	SupportedChainId.POLYGON,
	SupportedChainId.POLYGON_MUMBAI,
	SupportedChainId.CELO,
	SupportedChainId.CELO_ALFAJORES,
] as const

export type SupportedL1ChainId = (typeof L1_CHAIN_IDS)[number]

export const L2_CHAIN_IDS = [
	SupportedChainId.ARBITRUM_ONE,
	SupportedChainId.ARBITRUM_GOERLI,
	SupportedChainId.OPTIMISM,
	SupportedChainId.OPTIMISM_GOERLI,
] as const

export type SupportedL2ChainId = (typeof L2_CHAIN_IDS)[number]

export const BSC_CHAIN_IDS = [SupportedChainId.BNB] as const

export type SupportedBSChainId = (typeof BSC_CHAIN_IDS)[number]
