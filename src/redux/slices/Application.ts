import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"

import {
	ApplicationState,
	// ApplicationModal,
	Popup,
} from "../@models/Application"

const DEFAULT_TXN_DISMISS_MS = 25000

const initialState: ApplicationState = {
	fiatOnramp: { available: false, availabilityChecked: false },
	chainId: null,
	openModal: false,
	popupList: [],
}

export const applicationSlice = createSlice({
	name: "application",
	initialState,
	reducers: {
		setFiatOnrampAvailability: (state, action: PayloadAction<{ available: boolean }>) => {
			return {
				...state,
				fiatOnramp: {
					available: action.payload.available,
					availabilityChecked: true,
				},
			}
		},
		updateChainId: (state, action: PayloadAction<{ chainId: number | null }>) => {
			return {
				...state,
				chainId: action.payload.chainId,
			}
		},
		setOpenModal: (state) => {
			return {
				...state,
				openModal: true,
			}
		},
		setToggleModal: (state) => {
			return {
				...state,
				openModal: !state.openModal,
			}
		},
		setCloseModal: (state) => {
			return {
				...state,
				openModal: false,
			}
		},
		addPopup: (state, action: PayloadAction<Popup>) => {
			const { content, key, removeAfterMs = DEFAULT_TXN_DISMISS_MS } = action.payload
			return {
				...state,
				popupList: (key ? state.popupList.filter((popup) => popup.key !== key) : state.popupList).concat([
					{
						key: key || nanoid(),
						show: true,
						content,
						removeAfterMs,
					},
				]),
			}
		},
		removePopup: (state, action: PayloadAction<{ key: string | number }>) => {
			const { key } = action.payload
			if (Boolean(state.popupList.length)) {
				const popup = state.popupList.map((item) => {
					if (item.key === key) {
						return {
							...item,
							show: false,
						}
					}
					return item
				})
				return {
					...state,
					popupList: popup,
				}
			}
		},
	},
})

export const { addPopup, removePopup, setFiatOnrampAvailability, setOpenModal, setToggleModal, setCloseModal, updateChainId } =
	applicationSlice.actions
