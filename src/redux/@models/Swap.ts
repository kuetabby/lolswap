import { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

export type BaseSwapState = {
	amount: string
} & TokenUniswap

export interface SwapState {
	to: BaseSwapState
	from: BaseSwapState
	requirement: {
		gasPrice: string
	}
}

export type GetPriceParams = {
	fromToken: string
	toToken: string
	sellAmount: string
}

export type SwapPrice = {
	chainId: number
	price: string
	estimatedPriceImpact: string
	value: string
	gasPrice: string
	gas: string
	estimatedGas: string
	protocolFee: string
	minimumProtocolFee: string
	buyTokenAddress: string
	buyAmount: string
	sellTokenAddress: string
	sellAmount: string
	allowanceTarget: string
	sellTokenToEthRate: string
	buyTokenToEthRate: string
	sources: { name: string; proportion: string }[]
	expectedSlippage?: string | null
}

export type Swap1inchPrice = {
	fromToken: {
		symbol: string
		name: string
		address: string
		decimals: number
		logoURI: string
	}
	toToken: {
		symbol: string
		name: string
		address: string
		decimals: number
		logoURI: string
	}
	toTokenAmount: string
	fromTokenAmount: string
	protocols: [
		{
			name: string
			part: number
			fromTokenAddress: string
			toTokenAddress: string
		}
	]
	estimatedGas: number
}

interface Source {
	name: string
	proportion: string
}

interface FillData {
	tokenAddressPath: string[]
	router: string
}

interface Order {
	makerToken: string
	takerToken: string
	makerAmount: string
	takerAmount: string
	fillData: FillData
	source: string
	sourcePathId: string
	type: number
}

export type SwapQuote = {
	chainId: number
	price: string
	guaranteedPrice: string
	estimatedPriceImpact: string
	to: string
	data: string
	value: string
	gas: string
	estimatedGas: string
	gasPrice: string
	protocolFee: string
	minimumProtocolFee: string
	buyTokenAddress: string
	sellTokenAddress: string
	buyAmount: string
	sellAmount: string
	sources: Source[]
	orders: Order[]
	allowanceTarget: string
	sellTokenToEthRate: string
	buyTokenToEthRate: string
}
