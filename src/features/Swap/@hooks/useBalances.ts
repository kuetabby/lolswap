import { useEffect, useState } from "react"
import { useWeb3React, Web3ReactHooks } from "@web3-react/core"

import { BigNumber } from "@ethersproject/bignumber"
import { formatEther } from "@ethersproject/units"
import { ethers } from "ethers"

import useToggle from "#/shared/hooks/useToggle"

import { BaseSwapState } from "#/redux/@models/Swap"

export function useBalances(provider?: ReturnType<Web3ReactHooks["useProvider"]>, accounts?: string[]): BigNumber[] | undefined {
	const [balances, setBalances] = useState<BigNumber[] | undefined>()

	useEffect(() => {
		if (provider && accounts?.length) {
			let stale = false

			void Promise.all(accounts.map((account) => provider.getBalance(account))).then((balances) => {
				if (stale) return
				setBalances(balances)
			})

			return () => {
				stale = true
				setBalances(undefined)
			}
		}
	}, [provider, accounts])

	return balances
}

export async function isNativeToken(provider?: ReturnType<Web3ReactHooks["useProvider"]>, address?: string) {
	if (provider && address) {
		const bytecode = await provider?.getCode(address)
		return bytecode === "0x"
	}
	return false
}

export const useBalanceTokenBased = (token: BaseSwapState, isSupported: boolean) => {
	const { provider, account } = useWeb3React()

	const [balance, setBalance] = useState("0")

	const [isLoading, toggleLoading] = useToggle()

	useEffect(() => {
		if (isSupported && account) {
			checkToken()
		}

		if (!isSupported || !account) {
			setBalance("0")
		}
	}, [isSupported, account, token.id])

	const checkToken = async () => {
		const checkIsNative = await isNativeToken(provider, token.id)
		setBalance("0")
		toggleLoading()
		if (checkIsNative) {
			try {
				const requestNativeBalance = await displayNativeBalance({ account, provider })
				const responseNativeBalance = await requestNativeBalance
				setBalance(responseNativeBalance)
				// console.log(responseNativeBalance, "native balance")
				return responseNativeBalance
			} catch (error) {
				setBalance("0")
			} finally {
				toggleLoading()
			}
		} else {
			try {
				const requestERCBalance = await displayERCBalance({ token, account, provider })
				const responseERCBalance = await requestERCBalance
				setBalance(responseERCBalance)
				// console.log(responseERCBalance, "erc balance")
				return responseERCBalance
			} catch (error) {
				setBalance("0")
			} finally {
				toggleLoading()
			}
		}
	}

	return [balance, isLoading] as const
}

type NativeBalanceParams = {
	provider?: ReturnType<Web3ReactHooks["useProvider"]>
	account?: string
}

const displayNativeBalance = async (params: NativeBalanceParams) => {
	const { account, provider } = params
	if (provider && account) {
		const requestBalance = await provider?.getBalance(account)
		const etherBalance = formatEther(requestBalance)
		const price = parseFloat(etherBalance).toFixed(5).toString()
		return price
	}
	return "0"
}

type ERCBalanceParams = {
	provider?: ReturnType<Web3ReactHooks["useProvider"]>
	account?: string
	token: BaseSwapState
}

const displayERCBalance = async (params: ERCBalanceParams) => {
	const { token, account, provider } = params
	if (provider && token.id && account) {
		const tokenContract = new ethers.Contract(token.id, ABI20, provider)
		const requestBalance = await tokenContract.balanceOf(account)
		const responseBalance = await requestBalance
		const formattedBalance = ethers.utils.formatUnits(responseBalance, token.decimals)
		return formattedBalance
	}

	return "0"
}

const ABI20 = [
	{
		type: "constructor",
		payable: false,
		inputs: [
			{ type: "string", name: "symbol" },
			{ type: "string", name: "name" },
		],
	},
	{
		type: "function",
		name: "transferFrom",
		constant: false,
		payable: false,
		inputs: [
			{ type: "address", name: "from" },
			{ type: "address", name: "to" },
			{ type: "uint256", name: "value" },
		],
		outputs: [],
	},
	{
		type: "function",
		name: "balanceOf",
		constant: true,
		stateMutability: "view",
		payable: false,
		inputs: [{ type: "address", name: "owner" }],
		outputs: [{ type: "uint256" }],
	},
	{
		type: "event",
		anonymous: false,
		name: "Transfer",
		inputs: [
			{ type: "address", name: "from", indexed: true },
			{ type: "address", name: "to", indexed: true },
			{ type: "address", name: "value" },
		],
	},
	{
		type: "error",
		name: "InsufficientBalance",
		inputs: [
			{ type: "account", name: "owner" },
			{ type: "uint256", name: "balance" },
		],
	},
	{
		type: "function",
		name: "addPerson",
		constant: false,
		payable: false,
		inputs: [
			{
				type: "tuple",
				name: "person",
				components: [
					{ type: "string", name: "name" },
					{ type: "uint16", name: "age" },
				],
			},
		],
		outputs: [],
	},
	{
		type: "function",
		name: "addPeople",
		constant: false,
		payable: false,
		inputs: [
			{
				type: "tuple[]",
				name: "person",
				components: [
					{ type: "string", name: "name" },
					{ type: "uint16", name: "age" },
				],
			},
		],
		outputs: [],
	},
	{
		type: "function",
		name: "getPerson",
		constant: true,
		stateMutability: "view",
		payable: false,
		inputs: [{ type: "uint256", name: "id" }],
		outputs: [
			{
				type: "tuple",
				components: [
					{ type: "string", name: "name" },
					{ type: "uint16", name: "age" },
				],
			},
		],
	},
	{
		type: "event",
		anonymous: false,
		name: "PersonAdded",
		inputs: [
			{ type: "uint256", name: "id", indexed: true },
			{
				type: "tuple",
				name: "person",
				components: [
					{ type: "string", name: "name", indexed: false },
					{ type: "uint16", name: "age", indexed: false },
				],
			},
		],
	},
]
