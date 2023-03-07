import { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"
import { useWeb3React } from "@web3-react/core"
import axios from "axios"
import { useMutation } from "react-query"

// type Props = {
// }

export const useExchangeToken = () => {
	const { chainId } = useWeb3React()

	return useMutation(async (token: TokenUniswap) => {
		const request = await axios.post(`https://token-prices.1inch.io/v1.1/${chainId}`, {
			tokens: [token.id],
		})

		const response = await request.data
		console.log(response, "exchange 1inch oken")
		return response
	})
}
