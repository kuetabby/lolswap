import { useCallback, useEffect, useMemo, useState } from "react"
import { useAppSelector } from "#/redux/store"
import { useQuery, useMutation } from "react-query"
import { gql } from "graphql-request"
import { useWeb3React } from "@web3-react/core"
import axios from "axios"
import { useWorker } from "@koale/useworker"

import useToggle from "#/shared/hooks/useToggle"
import { useGetToken } from "#/shared/hooks/useGetToken"

import { isAddress } from "#/@app/utility/Address"

import ethereumLogoUrl from "#/assets/ethereum-logo.png"

// const INFURA_KEY = import.meta.env.VITE_INFURA_KEY

export type BaseToken = {
	id: string
	decimals: string
	name?: string
	symbol?: string
}

export type Token = {
	address: string
	chainId: number
	decimals: number
	logoURI?: string
	name: string
	symbol: string
}

export type TokenUniswap = {
	logoURI?: string
	isNative?: false
	isToken?: true
} & BaseToken

export const SearchTokensDocument = gql`
	query {
		tokens(first: 1000, orderBy: "volumeUSD", orderDirection: "desc", where: { name_contains_nocase: "" }) {
			id
			name
			symbol
			feesUSD
			decimals
		}
	}
`

const endpoint = "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokens.1inch.eth.link"
const client = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"

export const defaultTokens = [
	{
		id: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
		decimals: "18",
		logoURI: ethereumLogoUrl,
		name: "Ethereum",
		symbol: "ETH",
	},
	{
		id: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
		decimals: "18",
		logoURI:
			"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
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
	// {
	// 	id: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
	// 	decimals: "6",
	// 	logoURI: "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
	// 	name: "TetherUSD",
	// 	symbol: "USDT",
	// },
]

const useSearchTokensQuery = () => {
	return useQuery(
		["list tokens"],
		async () => {
			try {
				const request = await axios({ method: "GET", url: endpoint })
				const response = await request.data
				return response
			} catch (error) {
				console.log(error, "error get list token")
			}
		},
		{
			refetchOnWindowFocus: false,
			refetchOnMount: true,
			refetchOnReconnect: true,
		}
	)
}

export const useSearchUniswapTokenQuery = () => {
	return useMutation(
		async ({ name }: { name: string }) => {
			const request = await axios<{ data: { tokens: TokenUniswap[] } }>({
				method: "POST",
				url: client,
				data: JSON.stringify({
					query: `
					query searchTokens($searchQuery: String!) {
						tokens(first: 200, orderBy: "volumeUSD", orderDirection: "desc", where: { name_contains_nocase: $searchQuery}) {
							id
							name
							symbol
							decimals
							}
						}`,
					variables: {
						searchQuery: name,
					},
				}),
			})
			const response = await request.data
			const tokens = await response.data
			return tokens
		},
		{
			retryDelay: 1000,
		}
	)
}

export function useSearchTokens(value: string) {
	const { data, isFetching, error } = useSearchTokensQuery()

	const { chainId, account } = useWeb3React()

	const currentChainId = chainId ?? 1

	const selectionDefault = [
		{
			address: account || "",
			chainId: 1,
			decimals: 18,
			logoURI: ethereumLogoUrl,
			name: "Ethereum",
			symbol: "ETH",
		},
		{
			address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
			chainId: 1,
			decimals: 18,
			logoURI:
				"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
			name: "WrappedEther",
			symbol: "WETH",
		},
		{
			address: "0x111111111117dC0aa78b770fA6A738034120C302",
			chainId: 1,
			decimals: 18,
			logoURI: "https://tokens.1inch.io/0x111111111117dc0aa78b770fa6a738034120c302.png",
			name: "1INCHToken",
			symbol: "1INCH",
		},
		{
			address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
			chainId: 1,
			decimals: 6,
			logoURI: "https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
			name: "TetherUSD",
			symbol: "USDT",
		},
	]

	const sortedTokens: Token[] = useMemo(() => {
		if (data?.tokens.length) {
			const selectionMap = data?.tokens.filter((item: Token) => item.chainId === currentChainId)
			return selectionMap.sort((a: Token, b: Token) => {
				const tokenA = {
					name: a.name.toLowerCase(),
					symbol: a.symbol.toLowerCase(),
				}

				const tokenB = {
					name: b.name.toLowerCase(),
					symbol: b.symbol.toLowerCase(),
				}

				if (tokenA.name < tokenB.name && tokenA.symbol < tokenB.symbol) return -1
				if (tokenA.name > tokenB.name && tokenA.symbol > tokenB.symbol) return 1
				return 0
			})
		}

		return []
	}, [data, isFetching, currentChainId])

	const filteredTokens = useMemo(() => {
		// return robot.name.toLowerCase().includes(searchField.toLowerCase());
		if (sortedTokens?.length) {
			const sortedSelection = [...selectionDefault, ...sortedTokens]
			const uniqueSelection = Array.from(new Set(sortedSelection?.map((item: Token) => item.address))).map((token) => {
				return sortedSelection.find((a: Token) => a.address === token)
			}) as Token[]
			return uniqueSelection.filter((token: Token) => token?.name?.toLowerCase().includes(value.toLowerCase()))
		}

		return []
	}, [account, value])

	return [filteredTokens, isFetching, error] as const
}

const filterUniTokens = (
	uniTokens: TokenUniswap[],
	userTokens: TokenUniswap[],
	defaultTokens: TokenUniswap[],
	searchValue: string
) => {
	if (uniTokens.length) {
		const filterDefaulTokens = defaultTokens.filter((item) => item.name?.toLowerCase().includes(searchValue.toLowerCase()))
		const definedTokens = [...filterDefaulTokens, ...userTokens, ...uniTokens].filter(Boolean)
		const uniqueTokens = Array.from(new Set(definedTokens?.map((item) => item.id.toLowerCase()))).map((token) => {
			return definedTokens.find((defToken) => defToken.id.toLowerCase() === token)
		}) as TokenUniswap[]

		return uniqueTokens
	}

	return []
}

export const AddressZero = "0x0000000000000000000000000000000000000000"

export function useSearchTokenUniswap(value: string) {
	const { tokens: userTokens } = useAppSelector((state) => state.user)

	const [tokenList, setTokenList] = useState<TokenUniswap[]>([])

	const { isLoading: isLoadingQuery, mutate, data: dataUniswap } = useSearchUniswapTokenQuery()
	const { chainId } = useWeb3React()
	// 0xdac17f958d2ee523a2206206994597c13d831ec7
	// 0x1b4dd5ea240732ddac8d74fd1cd9026addc02e3c

	const [isLoadingToken, toggleLoadingToken, finishedLoadingToken] = useToggle()

	const [filteredWorker, { status: sortStatus }] = useWorker(filterUniTokens, { timeout: 1500 })
	const [searchContractAddress] = useGetToken(value)

	const isLoading = isLoadingToken || isLoadingQuery

	// console.log(userTokens, "user tokens")

	useEffect(() => {
		searchContract(value)
	}, [value])

	const searchContract = (address: string) => {
		const isZeroAddress = address === AddressZero

		toggleLoadingToken()
		setTokenList([])

		if (isZeroAddress) {
			finishedLoadingToken()
			throw Error(`Invalid 'address' parameter '${address}'.`)
		} else {
			const tokenFromStorage = selectUserTokens(address)
			const tokenFromUniswap = selectUniswapTokens(address)
			if (tokenFromStorage) {
				setTokenList([tokenFromStorage])
				finishedLoadingToken()
			} else if (tokenFromUniswap) {
				setTokenList([tokenFromUniswap])
				finishedLoadingToken()
			} else {
				validatingAddress(address)
			}
		}
	}

	const selectUserTokens = useCallback(
		(address: string) => {
			if (chainId) {
				const token = userTokens?.[chainId]?.[address]
				if (typeof userTokens === "undefined" || typeof token === "undefined") {
					return false
				}
				return token
			}
			return false
		},
		[chainId, userTokens]
	)

	const selectUniswapTokens = useCallback(
		(address: string) => {
			const tokens = dataUniswap?.tokens as BaseToken[] | undefined
			if (tokens?.length) {
				const token = tokens.find((item) => item.id.toLowerCase() === address.toLowerCase())
				if (typeof token !== "undefined") {
					return token
				}
				return false
			}
			return false
		},
		[dataUniswap]
	)

	const arrayOfUserTokens = useMemo(() => {
		if (chainId && typeof userTokens[chainId] !== "undefined") {
			return Object.values(userTokens[chainId])
		}

		return []
	}, [chainId, userTokens])

	const validatingAddress = async (address: string) => {
		const isValidAddress = await isAddress(address)
		if (isValidAddress) {
			searchContractAddress(address)
				.then((res) => {
					if (typeof res !== "undefined") {
						setTokenList([res])
					}
				})
				.catch(() => {
					setTokenList([])
				})
				.finally(() => {
					finishedLoadingToken()
				})
		} else {
			mutate(
				{ name: address },
				{
					onError: () => {
						setTokenList([])
						finishedLoadingToken()
					},
					onSuccess: (successMutateData) => {
						// const arrayOfUserTokens = Object.values(userTokens[chainId as number]) || []
						// console.log(chainId && Object.values(userTokens[chainId]))
						return filteredWorker(successMutateData?.tokens, arrayOfUserTokens, defaultTokens, address).then((res) => {
							setTokenList(res)
							finishedLoadingToken()
							return res
						})
					},
					// uniqueSelection.filter((token: Token) => token?.name?.toLowerCase().includes(value.toLowerCase()))
				}
			)
		}
	}

	const validatingListToken = useCallback(
		(address: string) => {
			const tokensUser = chainId && userTokens?.[chainId]?.[address]
			const tokensUniswap = dataUniswap?.tokens as BaseToken[] | undefined

			if (typeof tokensUser !== "undefined" || typeof tokensUser !== "number") {
				return tokensUser
			} else if (typeof tokensUniswap !== "undefined") {
				const token = tokensUniswap.find((item) => item.id.toLowerCase() === address.toLowerCase())
				if (token) {
					return token
				}
				return false
			} else {
				return false
			}
		},
		[dataUniswap, userTokens, chainId]
	)

	return [tokenList, isLoading, sortStatus, validatingListToken] as const
}
