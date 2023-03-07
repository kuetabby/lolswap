import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { UserState } from "#/redux/@models/User"
import { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

const currentTimestamp = () => new Date().getTime()

const initialState: UserState = {
	selectedWallet: undefined,
	tokens: {},
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

export const { addSerializedToken, updateSelectedWallet, resetSelectedWallet } = userSlice.actions
