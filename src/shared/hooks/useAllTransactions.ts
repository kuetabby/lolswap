import { useAppSelector } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"

import { TransactionDetails } from "#/redux/@models/Transaction"

// returns all the transactions for the current chain
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
	const { chainId } = useWeb3React()

	const state = useAppSelector((state) => state.transaction)

	return chainId ? state[chainId] ?? {} : {}
}
