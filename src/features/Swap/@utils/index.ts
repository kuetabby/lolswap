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
