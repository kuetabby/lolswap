import ethereumLogoUrl from "#/assets/ethereum-logo.png"
import { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

export const defaultCollection: TokenUniswap = {
	id: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
	decimals: "18",
	logoURI: ethereumLogoUrl,
	name: "Ethereum",
	symbol: "ETH",
}
