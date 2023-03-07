/// <reference types="vite/client" />

declare module "@metamask/jazzicon" {
	export default function (diameter: number, seed: number): HTMLElement
}

interface ImportMetaEnv {
	readonly VITE_INFURA_KEY: string
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

interface Window {
	// walletLinkExtension is injected by the Coinbase Wallet extension
	walletLinkExtension?: any
	ethereum: import("ethers").providers.ExternalProvider & { isBraveWallet?: true; isCoinbaseWallet?: true }
	// ethereum?: {
	// 	// set by the Coinbase Wallet mobile dapp browser
	// 	isCoinbaseWallet?: true
	// 	// set by the Brave browser when using built-in wallet
	// 	isBraveWallet?: true
	// 	// set by the MetaMask browser extension (also set by Brave browser when using built-in wallet)
	// 	isMetaMask?: true
	// 	autoRefreshOnNetworkChange?: boolean
	// 	on?: (...args: any[]) => void
	// 	removeListener?: (...args: any[]) => void
	// }
	web3?: Record<string, unknown>
}

declare module "content-hash" {
	declare function decode(x: string): string
	declare function getCodec(x: string): string
}

declare module "multihashes" {
	declare function decode(buff: Uint8Array): { code: number; name: string; length: number; digest: Uint8Array }
	declare function toB58String(hash: Uint8Array): string
}
