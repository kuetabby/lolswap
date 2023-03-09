import { useQuery } from "react-query"
import { useAppDispatch } from "#/redux/store"
import axios, { AxiosError } from "axios"

import { setBuyTradeAmount } from "#/redux/slices/Swap"

import { useAllowExchange } from "./useAllowance"

import type { Swap1inchPrice } from "#/redux/@models/Swap"

type GetPriceParams = {
	fromToken: string
	toToken: string
	sellAmount: string
}

type CustomGetPriceParams = {
	allowance?: string
} & GetPriceParams

type Swap1inchParams = {
	fromTokenAddress: string
	toTokenAddress: string
	amount: string
	fromAddress: string
	slippage: string
	gasLimit: string
}

type Swap1inchResponse = {
	fromToken: {
		symbol: string
		name: string
		address: string
		decimals: number
		logoURI: string
	}
	toToken: {
		symbol: string
		name: string
		address: string
		decimals: number
		logoURI: string
	}
	toTokenAmount: string
	fromTokenAmount: string
	protocols: [string]
	tx: {
		to: string
		from: string
		value: string
		data: string
		gasPrice: string
		gas: string
	}
}

const get1inchPrice = async (url: string) => {
	const request = await axios.get<Swap1inchPrice>(url, {
		headers: {
			Accept: "application/json",
		},
	})
	const response = await request.data
	return response
}

export const get1inchSwap = async (params: Swap1inchParams) => {
	try {
		const request = await axios.get<Swap1inchResponse>(`https://api.1inch.io/v5.0/1/swap?${new URLSearchParams(params).toString()}`)
		const response = await request.data
		console.log(response, "get swap 1inch")
		return response
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorAxios = error as AxiosError<{ error: string }>
			if (errorAxios) {
				const errorResponse = errorAxios?.response?.data?.error
				// console.log("error message: ", errorResponse)
				return errorResponse
			}
			// console.log("error message: ", error.message)
			return error.message
		} else {
			// console.log("unexpected error: ", error)
			return "failed get token price"
		}
	}
}

export function useGet1inchTokenPrice({ fromToken, toToken, sellAmount }: CustomGetPriceParams) {
	const signTransaction = useAllowExchange()

	const dispatch = useAppDispatch()

	const amount = String(sellAmount).split(".").join("")

	const url = `https://api.1inch.io/v5.0/1/quote?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${amount}`

	return useQuery<Swap1inchPrice>([url], async () => get1inchPrice(url), {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: false,
		refetchInterval: 10000,
		retry: 3,
		retryDelay: 2000,
		enabled: Boolean(toToken) && Boolean(+sellAmount),
		onError: (error) => {
			if (axios.isAxiosError(error)) {
				const errorAxios = error as AxiosError<{ error: string }>
				if (errorAxios) {
					const errorResponse = errorAxios?.response?.data?.error
					// console.log("error message: ", errorResponse)
					return errorResponse
				}
				// console.log("error message: ", error.message)
				return error.message
			} else {
				// console.log("unexpected error: ", error)
				return "failed get token price"
			}
		},
		onSuccess: (data) => {
			if (typeof data !== "string") {
				const buyAmount = +data.toTokenAmount / 10 ** +data.toToken.decimals
				dispatch(setBuyTradeAmount(String(buyAmount)))
				signTransaction(fromToken, sellAmount)
				return data
			}
		},
	})
}
