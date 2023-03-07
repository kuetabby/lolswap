import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { ConnectionType } from "#/@app/utility/Connection"
import type { ConnectionState, ConnectionPayload } from "../@models/Connection"

const initialState: ConnectionState = {
	errorByConnectionType: {
		[ConnectionType.INJECTED]: undefined,
		[ConnectionType.WALLET_CONNECT]: undefined,
		[ConnectionType.COINBASE_WALLET]: undefined,
		[ConnectionType.NETWORK]: undefined,
		[ConnectionType.GNOSIS_SAFE]: undefined,
	},
}

export const connectionSlice = createSlice({
	name: "connection",
	initialState,
	reducers: {
		updateConnectionError(state, { payload: { connectionType, error } }: PayloadAction<ConnectionPayload>) {
			state.errorByConnectionType[connectionType] = error
		},
		resetConnectionError: () => {
			return initialState
		},
	},
})

export const { updateConnectionError, resetConnectionError } = connectionSlice.actions
