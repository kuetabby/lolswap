import { useWeb3React } from "@web3-react/core"
import { useAppDispatch } from "#/redux/store"
import { useQuery } from "react-query"
import axios, { AxiosError } from "axios"

import { setGasPriceAmount } from "#/redux/slices/Swap"

type ApiRequest = {
	queryParams: string | string[][] | Record<string, string> | URLSearchParams | undefined
	apiBaseUrl: string
	methodName: string
}

type Allowance = {
	tokenAddress: string
	walletAddress: string | undefined
}

type AllowanceResponse = {
	allowance: string
}

type TransactionResponse = {
	data: string
	gasPrice: string
	to: string
	value: string
}

function apiRequestUrl({ apiBaseUrl, methodName, queryParams }: ApiRequest) {
	return apiBaseUrl + methodName + "?" + new URLSearchParams(queryParams).toString()
}

export const useAllowance = ({ tokenAddress, walletAddress = "" }: Allowance) => {
	const { chainId } = useWeb3React()

	const apiBaseUrl = `https://api.1inch.io/v5.0/${chainId}/approve/allowance?${new URLSearchParams({
		tokenAddress,
		walletAddress,
	}).toString()}`

	async function checkAllowance(url: string) {
		const requestApi = await axios.get<AllowanceResponse>(url, {
			headers: {
				Accept: "application/json",
			},
		})
		const responseApi = await requestApi.data
		return responseApi
	}

	const { data, isFetching, error } = useQuery([tokenAddress, walletAddress], async () => checkAllowance(apiBaseUrl), {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: false,
		enabled: Boolean(chainId) && Boolean(tokenAddress) && Boolean(walletAddress),
		onError: (error) => {
			if (axios.isAxiosError(error)) {
				const errorAxios = error as AxiosError<{ error: string }>
				if (errorAxios) {
					const errorResponse = errorAxios?.response?.data?.error
					console.log("error message: ", errorResponse)
					return errorResponse
				}
				console.log("error message: ", error.message)
				return error.message
			} else {
				console.log("unexpected error: ", error)
				return "failed get token price"
			}
		},
		onSuccess: (data) => {
			console.log(data, "allowance")
		},
	})

	return [data, isFetching, error] as const
}

export const useAllowExchange = () => {
	const { chainId } = useWeb3React()
	const dispatch = useAppDispatch()

	const apiBaseUrl = `https://api.1inch.io/v5.0/${chainId}`

	async function buildTxForApproveTradeWithRouter(tokenAddress: string, amount?: string) {
		const url = apiRequestUrl({
			apiBaseUrl,
			methodName: "/approve/transaction",
			queryParams: amount ? { tokenAddress, amount } : { tokenAddress },
		})

		const request = await axios.get<TransactionResponse>(url, {
			headers: {
				Accept: "application/json",
			},
		})
		const response = await request.data
		dispatch(setGasPriceAmount(response.gasPrice))

		// const gasLimit = await signers?.estimateGas({
		// 	...transaction,
		// 	from: account,
		// })
		// const gas = gasLimit?.toString()
		console.log(response, "transaction")
		return response
	}

	const signTransaction = async (address: string, amount?: string) => {
		try {
			const requestTransactionSign = await buildTxForApproveTradeWithRouter(address, amount)
			const responseTransactionSign = await requestTransactionSign
			return responseTransactionSign
		} catch (error) {
			return error
		}
	}

	return signTransaction
}
