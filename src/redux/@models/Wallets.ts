export interface Wallet {
	walletType: string
	account: string
}

export interface WalletState {
	connectedWallets: Wallet[]
}
