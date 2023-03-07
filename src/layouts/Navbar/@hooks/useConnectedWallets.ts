import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "#/redux/store"

import { addConnectedWallet } from "#/redux/slices/Wallets"

import type { Wallet } from "#/redux/@models/Wallets"

export function useConnectedWallets(): [Wallet[], (wallet: Wallet) => void] {
	const dispatch = useAppDispatch()
	const connectedWallets = useAppSelector((state) => state.wallets.connectedWallets)
	const addWallet = useCallback(
		(wallet: Wallet) => {
			dispatch(addConnectedWallet(wallet))
		},
		[dispatch]
	)
	return [connectedWallets, addWallet]
}
