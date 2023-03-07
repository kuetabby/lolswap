import { combineReducers } from "@reduxjs/toolkit"

import { applicationSlice } from "./slices/Application"
import { connectionSlice } from "./slices/Connection"
import { userSlice } from "./slices/User"
import { transactionSlice } from "./slices/Transaction"
import { walletsSlice } from "./slices/Wallets"
import { swapSlice } from "./slices/Swap"
import { listsSlice } from "./slices/Lists"

export const appReducer = combineReducers({
	[applicationSlice.name]: applicationSlice.reducer,
	[userSlice.name]: userSlice.reducer,
	[listsSlice.name]: listsSlice.reducer,
	[connectionSlice.name]: connectionSlice.reducer,
	[transactionSlice.name]: transactionSlice.reducer,
	[walletsSlice.name]: walletsSlice.reducer,
	[swapSlice.name]: swapSlice.reducer,
})
