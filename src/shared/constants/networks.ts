import { SupportedChainId } from "./chains"

const INFURA_KEY = import.meta.env.VITE_INFURA_KEY

if (typeof INFURA_KEY === "undefined") {
	throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`)
}

export const FALLBACK_URLS: { [key in SupportedChainId]: string[] } = {
	[SupportedChainId.MAINNET]: [
		// "Safe" URLs
		"https://api.mycryptoapi.com/eth",
		"https://cloudflare-eth.com",
		// "Fallback" URLs
		"https://rpc.ankr.com/eth",
		"https://eth-mainnet.public.blastapi.io",
	],
	[SupportedChainId.ROPSTEN]: [
		// "Fallback" URLs
		"https://rpc.ankr.com/eth_ropsten",
	],
	[SupportedChainId.RINKEBY]: [
		// "Fallback" URLs
		"https://rinkeby-light.eth.linkpool.io/",
	],
	[SupportedChainId.GOERLI]: [
		// "Safe" URLs
		"https://rpc.goerli.mudit.blog/",
		// "Fallback" URLs
		"https://rpc.ankr.com/eth_goerli",
	],
	[SupportedChainId.KOVAN]: [
		// "Safe" URLs
		"https://kovan.poa.network",
		// "Fallback" URLs
		"https://eth-kovan.public.blastapi.io",
	],
	[SupportedChainId.POLYGON]: [
		// "Safe" URLs
		"https://polygon-rpc.com/",
		"https://rpc-mainnet.matic.network",
		"https://matic-mainnet.chainstacklabs.com",
		"https://rpc-mainnet.maticvigil.com",
		"https://rpc-mainnet.matic.quiknode.pro",
		"https://matic-mainnet-full-rpc.bwarelabs.com",
	],
	[SupportedChainId.POLYGON_MUMBAI]: [
		// "Safe" URLs
		"https://matic-mumbai.chainstacklabs.com",
		"https://rpc-mumbai.maticvigil.com",
		"https://matic-testnet-archive-rpc.bwarelabs.com",
	],
	[SupportedChainId.ARBITRUM_ONE]: [
		// "Safe" URLs
		"https://arb1.arbitrum.io/rpc",
		// "Fallback" URLs
		"https://arbitrum.public-rpc.com",
	],
	[SupportedChainId.ARBITRUM_GOERLI]: [
		// "Safe" URLs
		"https://goerli-rollup.arbitrum.io/rpc",
	],
	[SupportedChainId.OPTIMISM]: [
		// "Safe" URLs
		"https://mainnet.optimism.io/",
		// "Fallback" URLs
		"https://rpc.ankr.com/optimism",
	],
	[SupportedChainId.OPTIMISM_GOERLI]: [
		// "Safe" URLs
		"https://goerli.optimism.io",
	],
	[SupportedChainId.CELO]: [
		// "Safe" URLs
		`https://forno.celo.org`,
	],
	[SupportedChainId.CELO_ALFAJORES]: [
		// "Safe" URLs
		`https://alfajores-forno.celo-testnet.org`,
	],
}

export const RPC_URLS: { [key in SupportedChainId]: string[] } = {
	[SupportedChainId.MAINNET]: [`https://mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[SupportedChainId.MAINNET]],
	[SupportedChainId.RINKEBY]: [`https://rinkeby.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[SupportedChainId.RINKEBY]],
	[SupportedChainId.ROPSTEN]: [`https://ropsten.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[SupportedChainId.ROPSTEN]],
	[SupportedChainId.GOERLI]: [`https://goerli.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[SupportedChainId.GOERLI]],
	[SupportedChainId.KOVAN]: [`https://kovan.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[SupportedChainId.KOVAN]],
	[SupportedChainId.OPTIMISM]: [`https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[SupportedChainId.OPTIMISM]],
	[SupportedChainId.OPTIMISM_GOERLI]: [
		`https://optimism-goerli.infura.io/v3/${INFURA_KEY}`,
		...FALLBACK_URLS[SupportedChainId.OPTIMISM_GOERLI],
	],
	[SupportedChainId.ARBITRUM_ONE]: [
		`https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
		...FALLBACK_URLS[SupportedChainId.ARBITRUM_ONE],
	],
	[SupportedChainId.ARBITRUM_GOERLI]: [
		`https://arbitrum-rinkeby.infura.io/v3/${INFURA_KEY}`,
		...FALLBACK_URLS[SupportedChainId.ARBITRUM_GOERLI],
	],
	[SupportedChainId.POLYGON]: [`https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[SupportedChainId.POLYGON]],
	[SupportedChainId.POLYGON_MUMBAI]: [
		`https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
		...FALLBACK_URLS[SupportedChainId.POLYGON_MUMBAI],
	],
	[SupportedChainId.CELO]: FALLBACK_URLS[SupportedChainId.CELO],
	[SupportedChainId.CELO_ALFAJORES]: FALLBACK_URLS[SupportedChainId.CELO_ALFAJORES],
}
