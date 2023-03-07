import { ReactNode } from "react"
import { Currency, TradeType } from "@uniswap/sdk-core"

import { TradeState, InterfaceTrade } from "#/redux/@models/Trade"

export function getIsValidSwapQuote(
	trade: InterfaceTrade<Currency, Currency, TradeType> | undefined,
	tradeState: TradeState,
	swapInputError?: ReactNode
): boolean {
	return !!swapInputError && !!trade && (tradeState === TradeState.VALID || tradeState === TradeState.SYNCING)
}
