import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { SwapState, BaseSwapState } from "../@models/Swap"

import { defaultCollection } from "#/@app/utility/Collection"

const initialFromState = {
	...defaultCollection,
	amount: "",
}

const initialToState = {
	id: "",
	decimals: "",
	logoURI: "",
	name: "",
	symbol: "",
	amount: "",
}

const initialState: SwapState = {
	from: initialFromState,
	to: initialToState,
	requirement: {
		gasPrice: "0",
		tokenAmount: "",
		tokenBalance: "",
	},
}

export const swapSlice = createSlice({
	name: "swapTransaction",
	initialState,
	reducers: {
		// setFromTradeAddress: (state, action: PayloadAction<string>) => {
		// 	return {
		// 		...state,
		// 		from: { ...state.from, id: action.payload },
		// 	}
		// },
		setGasPriceAmount: (state, action: PayloadAction<string>) => {
			return {
				...state,
				requirement: {
					...state.requirement,
					gasPrice: action.payload,
				},
			}
		},
		setTokenAmount: (state, action: PayloadAction<string>) => {
			return {
				...state,
				requirement: {
					...state.requirement,
					tokenAmount: action.payload,
				},
			}
		},
		setTokenBalance: (state, action: PayloadAction<string>) => {
			return {
				...state,
				requirement: {
					...state.requirement,
					tokenBalance: action.payload,
				},
			}
		},
		// setTrade: (state, action: PayloadAction<{ to: BaseSwapState; from: BaseSwapState; gasPrice?: string }>) => {
		// 	return {
		// 		...state,
		// 		from: action.payload.from,
		// 		to: action.payload.to,
		// 		requirement: {
		// 			gasPrice: action.payload.gasPrice || "0",
		// 		},
		// 	}
		// },
		setSellTradeAmount: (state, action: PayloadAction<string>) => {
			return {
				...state,
				from: {
					...state.from,
					amount: action.payload,
				},
			}
		},
		setBuyTradeAmount: (state, action: PayloadAction<string>) => {
			return {
				...state,
				to: {
					...state.to,
					amount: action.payload,
				},
			}
		},
		fromTrade: (state, action: PayloadAction<BaseSwapState>) => {
			return {
				...state,
				from: action.payload,
			}
		},
		toTrade: (state, action: PayloadAction<BaseSwapState>) => {
			return {
				...state,
				to: action.payload,
			}
		},
		switchFromTrade: (state, action: PayloadAction<BaseSwapState>) => {
			return {
				...state,
				to: state.from,
				from: action.payload,
			}
		},
		switchToTrade: (state, action: PayloadAction<BaseSwapState>) => {
			return {
				...state,
				from: state.to,
				to: action.payload,
			}
		},
		switchTrade: (state) => {
			// console.log(+state.to.amount / 10 ** +state.to.decimals, "to amount")
			return {
				...state,
				from: {
					...state.to,
					amount: Number(state.to.amount).toLocaleString().split(",").join("") || "0",
				},
				to: {
					...state.from,
					amount: Number(state.from.amount).toLocaleString().split(",").join("") || "0",
				},
			}
		},
		resetTrade: () => {
			return initialState
		},
		resetGasPriceAmount: (state) => {
			return {
				...state,
				requirement: initialState.requirement,
			}
		},
	},
})

export const {
	fromTrade,
	toTrade,
	setSellTradeAmount,
	setBuyTradeAmount,
	switchFromTrade,
	switchToTrade,
	switchTrade,
	setGasPriceAmount,
	setTokenAmount,
	setTokenBalance,
	resetGasPriceAmount,
} = swapSlice.actions
