import { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"
import { SupportedChainId } from "#/shared/constants/chains"

import ethereumLogoUrl from "#/assets/ethereum-logo.png"
import binanceLogoUrl from "#/assets/bnb-logo.webp"

const ETH = {
	id: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	decimals: "18",
	logoURI: ethereumLogoUrl,
	name: "Ethereum",
	symbol: "ETH",
}

const BNB = {
	id: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	decimals: "18",
	logoURI: binanceLogoUrl,
	name: "BNB",
	symbol: "BNB",
}

// export const defaultCollection: TokenUniswap = {
// }

type DefaultCollectionMap = { readonly [chainId: number]: TokenUniswap }

export const defaultCollection: DefaultCollectionMap = {
	[SupportedChainId.MAINNET]: ETH,
	[SupportedChainId.ARBITRUM_ONE]: ETH,
	[SupportedChainId.BNB]: BNB,
}
