import { createSlice } from "@reduxjs/toolkit"

import type { TransactionState } from "../@models/Transaction"

const initialState: TransactionState = {}

export const transactionSlice = createSlice({
	name: "transaction",
	initialState,
	reducers: {},
})

export const {} = transactionSlice.actions
