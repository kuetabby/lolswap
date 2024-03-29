import { MixedRouteSDK, Trade } from "@uniswap/router-sdk"
import { Currency, CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core"
import { Route as V2Route } from "@uniswap/v2-sdk"
import { Route as V3Route } from "@uniswap/v3-sdk"

export enum TradeState {
	LOADING,
	INVALID,
	NO_ROUTE_FOUND,
	VALID,
	SYNCING,
}

export class InterfaceTrade<TInput extends Currency, TOutput extends Currency, TTradeType extends TradeType> extends Trade<
	TInput,
	TOutput,
	TTradeType
> {
	gasUseEstimateUSD: CurrencyAmount<Token> | null | undefined
	blockNumber: string | null | undefined

	constructor({
		gasUseEstimateUSD,
		blockNumber,
		...routes
	}: {
		gasUseEstimateUSD?: CurrencyAmount<Token> | undefined | null
		blockNumber?: string | null | undefined
		v2Routes: {
			routev2: V2Route<TInput, TOutput>
			inputAmount: CurrencyAmount<TInput>
			outputAmount: CurrencyAmount<TOutput>
		}[]
		v3Routes: {
			routev3: V3Route<TInput, TOutput>
			inputAmount: CurrencyAmount<TInput>
			outputAmount: CurrencyAmount<TOutput>
		}[]
		tradeType: TTradeType
		mixedRoutes?: {
			mixedRoute: MixedRouteSDK<TInput, TOutput>
			inputAmount: CurrencyAmount<TInput>
			outputAmount: CurrencyAmount<TOutput>
		}[]
	}) {
		super(routes)
		this.blockNumber = blockNumber
		this.gasUseEstimateUSD = gasUseEstimateUSD
	}
}
