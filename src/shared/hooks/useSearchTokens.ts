import { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import { useMutation } from "react-query"
import { useAppSelector } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"

import { AddressZero, BaseToken, TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"
import { useGetToken } from "./useGetToken"
import useToggle from "./useToggle"

import { isAddress } from "#/@app/utility/Address"
import { SupportedChainId } from "../constants/chains"
import { listDefaultTokens } from "#/@app/utility/Token/listsTokens"

const clientSubgraph = {
	[SupportedChainId.MAINNET]: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
	[SupportedChainId.ARBITRUM_ONE]: "https://api.thegraph.com/subgraphs/name/messari/uniswap-v3-arbitrum",
}

const useSearchUniswapTokenQuery = () => {
	return useMutation(
		async ({ name, id }: { name: string; id: number }) => {
			const customQuery = name && `where: { name_contains_nocase: $searchQuery}`

			const customGraph = {
				[SupportedChainId.MAINNET]: `
				query searchTokens($searchQuery: String!) {
					tokens(first: 200, orderBy: "volumeUSD", orderDirection: "desc", ${customQuery}) {
						id
						name
						symbol
						decimals
						}
					}`,
				[SupportedChainId.ARBITRUM_ONE]: `
				query searchTokens($searchQuery: String!) {
					tokens(first: 200, orderBy: "lastPriceUSD", orderDirection: "desc", ${customQuery}) {
						id
						name
						symbol
						decimals
						}
					}`,
			}

			const request = await axios<{ data: { tokens: TokenUniswap[] } }>({
				method: "POST",
				url: clientSubgraph[id as keyof typeof clientSubgraph],
				data: JSON.stringify({
					query: customGraph[id as keyof typeof customGraph],
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
	const { tokens: userTokens } = useAppSelector((state) => state.user)

	const [tokenList, setTokenList] = useState<TokenUniswap[]>([])

	const { isLoading: isLoadingQuery, mutate, data: dataUniswap } = useSearchUniswapTokenQuery()
	const [searchContractAddress] = useGetToken(value)

	const { chainId } = useWeb3React()

	const [isLoadingToken, toggleLoadingToken, finishedLoadingToken] = useToggle()

	const isLoading = isLoadingToken || isLoadingQuery

	const defaultTokens = chainId ? listDefaultTokens[chainId] : []

	useEffect(() => {
		if (chainId) {
			searchContract(value, chainId)
		}
	}, [value, chainId])

	const arrayOfUserTokens = useMemo(() => {
		if (chainId && typeof userTokens[chainId] !== "undefined") {
			return Object.values(userTokens[chainId])
		}

		return []
	}, [chainId, userTokens])

	const cachedToken = useMemo(() => {
		const definedTokens = tokenList.filter(Boolean)
		const uniqueTokens = Array.from(new Set(definedTokens?.map((item) => item.id.toLowerCase()))).map((token) => {
			return definedTokens.find((defToken) => defToken.id.toLowerCase() === token)
		}) as TokenUniswap[]

		return uniqueTokens
	}, [tokenList])

	const searchContract = async (query: string, id: number) => {
		const isValidAddress = await isAddress(query)
		const isZeroAddress = (await query) === AddressZero

		toggleLoadingToken()
		setTokenList([])

		if (isZeroAddress) {
			finishedLoadingToken()
			throw Error(`Invalid 'address' parameter '${query}'.`)
		} else if (isValidAddress) {
			return searchTokenByAddress(query)
		} else {
			return mutate(
				{ name: query, id },
				{
					onError: () => {
						searchTokenByName(query, [])
					},
					onSuccess: (data) => {
						searchTokenByName(query, data?.tokens)
					},
				}
			)
		}
	}

	const searchTokenByAddress = (query: string) => {
		const storageToken = arrayOfUserTokens
		const combinedToken = [...defaultTokens, ...storageToken]

		const findAddress = combinedToken.find((item) => item.id.toLowerCase() === query.toLowerCase())
		if (findAddress) {
			setTokenList([findAddress])
			finishedLoadingToken()
			return findAddress
		}

		searchContractAddress(query)
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
	}

	const searchTokenByName = (query: string, tokens: TokenUniswap[]) => {
		const storageToken = arrayOfUserTokens
		const uniswapToken = tokens ?? []
		const combinedToken = [...defaultTokens, ...storageToken, ...uniswapToken]

		if (!query) {
			setTokenList(combinedToken)
			finishedLoadingToken()
			return uniswapToken
		}
		const findName = combinedToken.filter((item) => item.name?.toLocaleLowerCase().includes(query.toLowerCase()))
		if (findName.length) {
			setTokenList(findName)
			finishedLoadingToken()
			return findName
		} else {
			setTokenList([])
			finishedLoadingToken()
			return []
		}
	}

	const validatingToken = useCallback(
		(address: string) => {
			const storageToken = arrayOfUserTokens
			const uniswapToken: BaseToken[] = dataUniswap?.tokens ?? []
			const combinedToken = [...defaultTokens, ...storageToken, ...uniswapToken]

			const token = combinedToken.find((item) => item.id.toLowerCase() === address.toLowerCase())
			if (token) {
				return token
			}
			return false
		},
		[arrayOfUserTokens, dataUniswap?.tokens, defaultTokens]
	)

	return [cachedToken, isLoading, validatingToken] as const
}

export function useSearchByAddress(value: string) {
	const { tokens: userTokens } = useAppSelector((state) => state.user)

	const [tokenList, setTokenList] = useState<TokenUniswap[]>([])

	const { isLoading: isLoadingQuery, mutate, data: dataUniswap } = useSearchUniswapTokenQuery()
	const [searchContractAddress] = useGetToken(value)

	const { chainId } = useWeb3React()

	const [isLoadingToken, toggleLoadingToken, finishedLoadingToken] = useToggle()

	const isLoading = isLoadingToken || isLoadingQuery

	const defaultTokens = chainId ? listDefaultTokens[chainId] : []

	useEffect(() => {
		mutate({ name: "", id: chainId ?? 0 })
	}, [])

	useEffect(() => {
		searchContract(value)
	}, [value])

	const arrayOfUserTokens = useMemo(() => {
		if (chainId && typeof userTokens[chainId] !== "undefined") {
			return Object.values(userTokens[chainId])
		}

		return []
	}, [chainId, userTokens])

	const cachedToken = useMemo(() => {
		const definedTokens = tokenList.filter(Boolean)
		const uniqueTokens = Array.from(new Set(definedTokens?.map((item) => item.id.toLowerCase()))).map((token) => {
			return definedTokens.find((defToken) => defToken.id.toLowerCase() === token)
		}) as TokenUniswap[]

		return uniqueTokens
	}, [tokenList])

	const searchContract = async (query: string) => {
		const isZeroAddress = (await query) === AddressZero

		toggleLoadingToken()
		setTokenList([])

		if (isZeroAddress) {
			finishedLoadingToken()
			throw Error(`Invalid 'address' parameter '${query}'.`)
		} else {
			return searchTokenByAddress(query)
		}
	}

	const searchTokenByAddress = (query: string) => {
		const storageToken = arrayOfUserTokens
		const uniswapToken: BaseToken[] = dataUniswap?.tokens ?? []
		const combinedToken = [...defaultTokens, ...storageToken, ...uniswapToken]

		const findAddress = combinedToken.find((item) => item.id.toLowerCase() === query.toLowerCase())
		if (findAddress) {
			setTokenList([findAddress])
			finishedLoadingToken()
			return findAddress
		}

		searchContractAddress(query)
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
	}

	const validatingToken = useCallback(
		(address: string) => {
			const storageToken = arrayOfUserTokens
			const uniswapToken: BaseToken[] = dataUniswap?.tokens ?? []
			const combinedToken = [...defaultTokens, ...storageToken, ...uniswapToken]

			const token = combinedToken.find((item) => item.id.toLowerCase() === address.toLowerCase())
			if (token) {
				return token
			}
			return false
		},
		[arrayOfUserTokens, dataUniswap?.tokens, defaultTokens]
	)

	return [cachedToken, isLoading, validatingToken] as const
}
