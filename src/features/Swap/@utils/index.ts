import { Web3ReactHooks } from "@web3-react/core"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { GnosisSafe } from "@web3-react/gnosis-safe"
import { MetaMask } from "@web3-react/metamask"
import { Network } from "@web3-react/network"
import { WalletConnect } from "@web3-react/walletconnect"

import { metaMask, metaMaskHooks } from "./connectors/metaMask"
import { walletConnect, walletConnectHooks } from "./connectors/walletConnect"
import { coinbaseWallet, coinbaseWalletHooks } from "./connectors/coinbaseWallet"
import { network, networkHooks } from "./connectors/network"

import type { Connector } from "@web3-react/types"

export function getName(connector: Connector) {
	if (connector instanceof MetaMask) return "MetaMask"
	if (connector instanceof WalletConnect) return "WalletConnect"
	if (connector instanceof CoinbaseWallet) return "Coinbase Wallet"
	if (connector instanceof Network) return "Network"
	if (connector instanceof GnosisSafe) return "Gnosis Safe"
	return "Unknown"
}

export const connectors: [MetaMask | WalletConnect | CoinbaseWallet | Network, Web3ReactHooks][] = [
	[metaMask, metaMaskHooks],
	[walletConnect, walletConnectHooks],
	[coinbaseWallet, coinbaseWalletHooks],
	[network, networkHooks],
]

export const priceToPreciseFloat = (price: number | undefined) => {
	if (!price) return undefined
	const floatForLargerNumbers = parseFloat(price.toFixed(9))
	if (floatForLargerNumbers < 0.1) {
		return parseFloat(price.toPrecision(6))
	}
	return floatForLargerNumbers
}

export const formatTransactionAmount = (num: number | undefined | null, maxDigits = 9) => {
	if (num === 0) return "0.00"
	if (!num) return ""
	if (num < 0.00001) {
		return "<0.00001"
	}
	if (num >= 0.00001 && num < 1) {
		// console.log("< 1")
		return `${Number(num.toFixed(6)).toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 6,
		})}`
	}
	if (num >= 1 && num < 10000) {
		// console.log("< 10000")
		return `${Number(num.toPrecision(6)).toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 6,
		})}`
	}
	if (num >= 10000 && num < 1000000) {
		// console.log("< 1000000")
		return `${Number(num.toFixed(2)).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
	}
	// For very large numbers, switch to scientific notation and show as much precision
	// as permissible by maxDigits param.
	if (num >= Math.pow(10, maxDigits - 1)) {
		// console.log(Math.pow(10, maxDigits - 1), "math pow")
		return `${num.toExponential(maxDigits - 3)}`
	}
	// console.log("fixed 2")
	return `${Number(num.toFixed(2)).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
}

export const formatTokenAmount = (value: string) => {
	if (!!value) {
		return value.split(" ").join("")
	}

	return value
}
