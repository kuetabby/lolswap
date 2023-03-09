export type ApiRequest = {
	queryParams: string | string[][] | Record<string, string> | URLSearchParams | undefined
	apiBaseUrl: string
	methodName: string
}

export type Allowance = {
	tokenAddress: string
	walletAddress: string | undefined
}

export type AllowanceResponse = {
	allowance: string
}

export type SpenderResponse = {
	address: string
}

export type TransactionResponse = {
	data: string
	gasPrice: string
	to: string
	value: string
}

// success approve
export interface ApproveResponse {
	hash: string
	type: number
	accessList: any[]
	blockHash?: string
	blockNumber?: number
	transactionIndex?: number
	confirmations: number
	from: string
	gasPrice: GasPrice
	maxPriorityFeePerGas: MaxPriorityFeePerGas
	maxFeePerGas: MaxFeePerGas
	gasLimit: GasLimit
	to: string
	value: Value
	nonce: number
	data: string
	r: string
	s: string
	v: number
	creates?: any
	chainId: number
}

interface GasPrice {
	type: string
	hex: string
}

interface MaxPriorityFeePerGas {
	type: string
	hex: string
}

interface MaxFeePerGas {
	type: string
	hex: string
}

interface GasLimit {
	type: string
	hex: string
}

interface Value {
	type: string
	hex: string
}

//Failed when to approve
export interface ApproveCancelled {
	code: number
	data: Data
}

interface OriginalError {
	code: number
}

interface Data {
	method: string
	origin: string
	originalError: OriginalError
}
