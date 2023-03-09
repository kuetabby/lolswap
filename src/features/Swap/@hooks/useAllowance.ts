import { useWeb3React } from "@web3-react/core"
import { useAppDispatch } from "#/redux/store"
import { useQuery } from "react-query"
import axios, { AxiosError } from "axios"
import { erc20ABI } from "wagmi"
import { ethers } from "ethers"

import { setGasPriceAmount } from "#/redux/slices/Swap"

import {
	ApiRequest,
	Allowance,
	AllowanceResponse,
	SpenderResponse,
	TransactionResponse,
	ApproveCancelled,
	ApproveResponse,
} from "../@models/allowance"

function apiRequestUrl({ apiBaseUrl, methodName, queryParams }: ApiRequest) {
	return apiBaseUrl + methodName + "?" + new URLSearchParams(queryParams).toString()
}

async function apiRequestApprove<T>(url: string) {
	const requestApi = await axios.get<T>(url, {
		headers: {
			Accept: "application/json",
		},
	})
	const responseApi = await requestApi.data
	return responseApi
}

export const useAllowance = ({ tokenAddress, walletAddress = "" }: Allowance) => {
	const { chainId } = useWeb3React()

	const apiBaseUrl = `https://api.1inch.io/v5.0/${chainId}/approve/allowance?${new URLSearchParams({
		tokenAddress,
		walletAddress,
	}).toString()}`

	return useQuery([tokenAddress, walletAddress], async () => apiRequestApprove<AllowanceResponse>(apiBaseUrl), {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: false,
		retry: 3,
		retryDelay: 2000,
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
	})

	// return [data, isFetching, error] as const
}

export const useSpenderAllowance = () => {
	const { chainId } = useWeb3React()

	const apiBaseUrl = `https://api.1inch.io/v5.0/${chainId}/approve/spender`

	return useQuery(["spender target"], async () => apiRequestApprove<SpenderResponse>(apiBaseUrl), {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: false,
		retry: 3,
		retryDelay: 2000,
		enabled: Boolean(chainId),
	})
}

export const usePermitAllowance = () => {
	const { provider, account } = useWeb3React()

	const signer = provider?.getSigner(account)

	const tokenAllowance = async (address: string, amount: string, spender: string) => {
		try {
			const contract = new ethers.Contract(address, erc20ABI, signer)
			const transaction = await contract.approve(spender, amount)
			transaction.wait()
			const response = (await transaction) as ApproveResponse
			return { type: "success", response }
		} catch (error) {
			const errorCancel = error as ApproveCancelled
			return { type: "error", errorCancel }
		}
	}

	return [tokenAllowance]
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
