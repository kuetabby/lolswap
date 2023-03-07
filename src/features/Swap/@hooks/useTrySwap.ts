import axios from "axios"
// import { useWeb3React } from "@web3-react/core"
// import { ethers } from "ethers"
// import { erc20ABI } from "wagmi"

import useToggle from "#/shared/hooks/useToggle"

import type { GetPriceParams, SwapQuote } from "#/redux/@models/Swap"

export interface ValidationError {
	field: string
	code: number
	reason: string
	description: string
}

export interface QuoteError {
	code: number
	reason: string
	validationErrors: ValidationError[]
}

const getQuote = async ({ fromToken, toToken, sellAmount }: GetPriceParams): Promise<SwapQuote | QuoteError | undefined> => {
	try {
		const request = await axios({
			method: "GET",
			url: `https://api.0x.org/swap/v1/quote?sellToken=${fromToken}&buyToken=${toToken}&sellAmount=${sellAmount}&slippagePercentage=0.01`,
		})
		const response = await request.data
		return response
	} catch (error) {
		const errors = error as QuoteError
		return errors
	}
}

export function useTrySwap({ fromToken, toToken, sellAmount }: GetPriceParams) {
	// const { provider } = useWeb3React()
	// const ERC20TokenContract = new ethers.Contract(fromToken, ERC20, provider)
	// provider.metho

	// provider?.sendTransaction
	// provider?.on()
	const [isLoadingSwap, toggleLoadingSwap] = useToggle()

	const swapTransaction = async (): Promise<SwapQuote | QuoteError | undefined> => {
		toggleLoadingSwap()
		try {
			const requestQuote = await getQuote({ fromToken, toToken, sellAmount })
			const responseQuote = requestQuote
			return responseQuote
		} catch (error) {
			const quoteError = error as QuoteError
			console.log(quoteError, "error quote")
			return quoteError
		} finally {
			toggleLoadingSwap()
		}
	}

	return [isLoadingSwap, swapTransaction] as const
}

export const ERC20 = [
	{
		constant: true,
		inputs: [],
		name: "name",
		outputs: [
			{
				name: "",
				type: "string",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				name: "_spender",
				type: "address",
			},
			{
				name: "_value",
				type: "uint256",
			},
		],
		name: "approve",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "totalSupply",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				name: "_from",
				type: "address",
			},
			{
				name: "_to",
				type: "address",
			},
			{
				name: "_value",
				type: "uint256",
			},
		],
		name: "transferFrom",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "decimals",
		outputs: [
			{
				name: "",
				type: "uint8",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				name: "_owner",
				type: "address",
			},
		],
		name: "balanceOf",
		outputs: [
			{
				name: "balance",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "symbol",
		outputs: [
			{
				name: "",
				type: "string",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: false,
		inputs: [
			{
				name: "_to",
				type: "address",
			},
			{
				name: "_value",
				type: "uint256",
			},
		],
		name: "transfer",
		outputs: [
			{
				name: "",
				type: "bool",
			},
		],
		payable: false,
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		constant: true,
		inputs: [
			{
				name: "_owner",
				type: "address",
			},
			{
				name: "_spender",
				type: "address",
			},
		],
		name: "allowance",
		outputs: [
			{
				name: "",
				type: "uint256",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		payable: true,
		stateMutability: "payable",
		type: "fallback",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "owner",
				type: "address",
			},
			{
				indexed: true,
				name: "spender",
				type: "address",
			},
			{
				indexed: false,
				name: "value",
				type: "uint256",
			},
		],
		name: "Approval",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				name: "value",
				type: "uint256",
			},
		],
		name: "Transfer",
		type: "event",
	},
]
