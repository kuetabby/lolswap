import { useQuery } from "react-query"
import axios, { AxiosError } from "axios"
import { message } from "antd"
import { useAppDispatch } from "#/redux/store"

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

export type ErrorResponse = {
	statusCode: number
	error: string
	description: string
	meta: {
		type: string
		value: string
	}[]
	requestId: string
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
		return response
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const errorAxios = error as AxiosError<ErrorResponse>
			if (errorAxios) {
				const errorResponse = errorAxios?.response?.data?.error
				return errorResponse
			}
			return error.message
		} else {
			return "failed get token price"
		}
	}
}

export function useGet1inchTokenPrice({ fromToken, toToken, sellAmount }: CustomGetPriceParams) {
	const signTransaction = useAllowExchange()

	const dispatch = useAppDispatch()

	const amount = String(sellAmount).split(".").join("")

	const url = `https://api.1inch.io/v5.0/1/quote?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${amount}`

	return useQuery<Swap1inchPrice, AxiosError<ErrorResponse>>([url], async () => get1inchPrice(url), {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: false,
		refetchInterval: 10000,
		retry: 1,
		enabled: Boolean(toToken) && Boolean(+sellAmount),
		onError: (error) => {
			if (error.response) {
				message.error(error.response?.data?.description)
				return error.response?.data?.description
			}
			message.error(error.message)
			return error.message
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
