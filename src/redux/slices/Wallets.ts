import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { shallowEqual } from "react-redux"

import { Wallet, WalletState } from "../@models/Wallets"

const initialState: WalletState = {
	connectedWallets: [],
}

export const walletsSlice = createSlice({
	name: "wallets",
	initialState,
	reducers: {
		addConnectedWallet: (state, action: PayloadAction<Wallet>) => {
			const existsAlready = state.connectedWallets.find((wallet) => shallowEqual(action.payload, wallet))
			if (!existsAlready) {
				return {
					...state,
					connectedWallets: [...state.connectedWallets, action.payload],
				}
			}
		},
		removeConnectedWallet: (state, action: PayloadAction<Wallet>) => {
			return {
				...state,
				connectedWallets: state.connectedWallets.filter((wallet) => !shallowEqual(wallet, action.payload)),
			}
		},
	},
})

export const { addConnectedWallet, removeConnectedWallet } = walletsSlice.actions
