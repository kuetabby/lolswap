import { ConnectionType } from "#/@app/utility/Connection"
import { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

export interface UserState {
	selectedWallet?: ConnectionType
	tokens: {
		[chainId: number]: {
			[address: string]: TokenUniswap
		}
	}
	slippageAmount: string
	slippageType: "button" | "input"
	timestamp: number
}
