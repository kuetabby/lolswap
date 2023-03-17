import { useMemo } from "react"
import { useQuery } from "react-query"
import { useWeb3React } from "@web3-react/core"
import axios, { AxiosError } from "axios"
import LZString from "lz-string"

import type { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"
import type { ErrorResponse } from "#/features/Swap/@hooks/useGetTokenPrice"

export type SessionToken = {
	[chainId: number]: {
		[address: string]: Token1inch
	}
}

type Token1inch = {
	symbol: string
	name: string
	address: string
	decimals: number
	logoURI: string
}

type Tokens1inch = {
	tokens: {
		[address: string]: Token1inch
	}
}

const minutes = 1000 * 60

async function getTokenByChain(chainId: number = 1) {
	const request = await axios.get<Tokens1inch>(`https://api.1inch.io/v5.0/${chainId}/tokens`)
	const response = await request.data
	return response
}

export const useStoreToken = () => {
	const { chainId } = useWeb3React()

	const tokens = sessionStorage.getItem(`tokens`)
	const tokensParsed: SessionToken | undefined = tokens ? JSON.parse(LZString.decompress(tokens)) : undefined
	const tokensByChain = chainId && !!tokensParsed ? tokensParsed[chainId] ?? {} : {}

	return useQuery<Tokens1inch, AxiosError<ErrorResponse>>([chainId], async () => getTokenByChain(chainId), {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: false,
		refetchInterval: minutes * 10,
		staleTime: minutes * 5,
		enabled: !!chainId && !Object.keys(tokensByChain).length,
		onSuccess: (data) => {
			chainId &&
				sessionStorage.setItem(
					`tokens`,
					tokensParsed
						? LZString.compress(
								JSON.stringify({
									...tokensParsed,
									[chainId]: data.tokens,
								})
						  )
						: LZString.compress(JSON.stringify({ [chainId]: data.tokens }))
				)
			return data
		},
	})
}

export const useSessionToken = () => {
	const { chainId } = useWeb3React()

	const tokens = sessionStorage.getItem(`tokens`)
	const tokensParsed: SessionToken | undefined = tokens ? JSON.parse(LZString.decompress(tokens)) : undefined

	const sessionTokens =
		chainId && tokensParsed
			? (Object.values(tokensParsed[chainId]).map((item) => ({
					id: item.address,
					decimals: String(item.decimals),
					name: item.name,
					symbol: item.symbol,
					logoURI: item.logoURI,
			  })) as TokenUniswap[])
			: []

	return useMemo(() => sessionTokens, [chainId, tokensParsed])
}
