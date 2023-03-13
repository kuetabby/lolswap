import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { UserState } from "#/redux/@models/User"
import { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

const currentTimestamp = () => new Date().getTime()

const initialState: UserState = {
	selectedWallet: undefined,
	tokens: {},
	slippageAmount: "0.5",
	slippageType: "button",
	timestamp: currentTimestamp(),
}

export const userSlice = createSlice({
	name: "user",
	initialState: initialState,
	reducers: {
		addSerializedToken(state, action: PayloadAction<{ serializedToken: { chainId: number } & TokenUniswap }>) {
			const { serializedToken } = action.payload
			if (!state.tokens) {
				state.tokens = {}
			}
			state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
			state.tokens[serializedToken.chainId][serializedToken.id] = serializedToken
			state.timestamp = currentTimestamp()
		},
		removeSerializedToken: (state, action: PayloadAction<{ chainId: number; address: string }>) => {
			const { chainId, address } = action.payload
			const nextState = { ...state }
			delete nextState.tokens[chainId][address]
		},
		setSlippageAmount: (state, action: PayloadAction<string>) => {
			return {
				...state,
				slippageAmount: action.payload,
			}
		},
		setSlippageType: (state, action: PayloadAction<"button" | "input">) => {
			return {
				...state,
				slippageType: action.payload,
			}
		},
		updateSelectedWallet(state, { payload: { wallet } }) {
			return {
				...state,
				selectedWallet: wallet,
			}
		},
		resetSelectedWallet: () => {
			return initialState
		},
	},
})

export const {
	addSerializedToken,
	removeSerializedToken,
	setSlippageAmount,
	setSlippageType,
	updateSelectedWallet,
	resetSelectedWallet,
} = userSlice.actions
