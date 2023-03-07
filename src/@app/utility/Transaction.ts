import { TransactionDetails } from "#/redux/@models/Transaction"

export function isTransactionRecent(tx: TransactionDetails): boolean {
	return new Date().getTime() - tx.addedTime < 86_400_000
}

export function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
	return b.addedTime - a.addedTime
}
