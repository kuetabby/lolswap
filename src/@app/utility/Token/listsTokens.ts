import { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

import { SupportedChainId } from "#/shared/constants/chains"

import ethereumLogoUrl from "#/assets/ethereum-logo.png"
import wethLogoUrl from "#/assets/weth-logo.png"

const nativeEth = {
	id: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	decimals: "18",
	logoURI: ethereumLogoUrl,
	name: "Ethereum",
	symbol: "ETH",
}

export type ListDefaultTokens = { readonly [chainId: number]: TokenUniswap[] }

export const listDefaultTokens: ListDefaultTokens = {
	[SupportedChainId.MAINNET]: [
		nativeEth,
		{
			id: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
			decimals: "18",
			logoURI: wethLogoUrl,
			name: "Wrapped Ether",
			symbol: "WETH",
		},
		{
			id: "0x111111111117dC0aa78b770fA6A738034120C302",
			decimals: "18",
			logoURI: "https://tokens.1inch.io/0x111111111117dc0aa78b770fa6a738034120c302.png",
			name: "1INCHToken",
			symbol: "1INCH",
		},
	],
	[SupportedChainId.ARBITRUM_ONE]: [
		nativeEth,
		{
			id: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
			decimals: "18",
			logoURI: wethLogoUrl,
			name: "Wrapped Ether",
			symbol: "WETH",
		},
	],
}
