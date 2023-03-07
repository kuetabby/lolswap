import type { AddEthereumChainParameter } from "@web3-react/types"

export interface BasicChainInformation {
	urls: string[]
	name: string
}

export interface ExtendedChainInformation extends BasicChainInformation {
	nativeCurrency: AddEthereumChainParameter["nativeCurrency"]
	blockExplorerUrls: AddEthereumChainParameter["blockExplorerUrls"]
}

export type UrlsInformation = { [chainId: number]: string[] }
