import { Connector } from "@web3-react/types"

import { ConnectionType } from "."

import { metaMaskConnection } from "#/features/Swap/@utils/connectors/metaMask"
import { walletConnectConnection } from "#/features/Swap/@utils/connectors/walletConnect"
import { coinbaseWalletConnection } from "#/features/Swap/@utils/connectors/coinbaseWallet"
import { networkConnection } from "#/features/Swap/@utils/connectors/network"
import { gnosisSafeConnection } from "#/features/Swap/@utils/connectors/gnosisIsSafe"

const CONNECTIONS = [gnosisSafeConnection, metaMaskConnection, coinbaseWalletConnection, walletConnectConnection, networkConnection]

export function getIsInjected(): boolean {
	return Boolean(window.ethereum)
}

export function getIsBraveWallet(): boolean {
	return window.ethereum?.isBraveWallet ?? false
}

export function getIsCoinbaseWallet(): boolean {
	return window.ethereum?.isCoinbaseWallet ?? false
}

export function getIsMetaMaskWallet(): boolean {
	// When using Brave browser, `isMetaMask` is set to true when using the built-in wallet
	// This function should return true only when using the MetaMask extension
	// https://wallet-docs.brave.com/ethereum/wallet-detection#compatability-with-metamask
	return (window.ethereum?.isMetaMask ?? false) && !getIsBraveWallet()
}

export function getConnection(c: Connector | ConnectionType) {
	if (c instanceof Connector) {
		const connection = CONNECTIONS.find((connection) => connection.connector === c)
		if (!connection) {
			throw Error("unsupported connector")
		}
		return connection
	} else {
		switch (c) {
			case ConnectionType.COINBASE_WALLET:
				return coinbaseWalletConnection
			case ConnectionType.WALLET_CONNECT:
				return walletConnectConnection
			case ConnectionType.NETWORK:
				return networkConnection
			case ConnectionType.GNOSIS_SAFE:
				return gnosisSafeConnection
			default:
				return metaMaskConnection
		}
	}
}

export function getConnectionName(connectionType: ConnectionType, hasMetaMaskExtension: boolean = getIsMetaMaskWallet()) {
	switch (connectionType) {
		case ConnectionType.INJECTED:
			return hasMetaMaskExtension ? "MetaMask" : "Browser Wallet"
		case ConnectionType.COINBASE_WALLET:
			return "Coinbase Wallet"
		case ConnectionType.WALLET_CONNECT:
			return "WalletConnect"
		case ConnectionType.NETWORK:
			return "Network"
		case ConnectionType.GNOSIS_SAFE:
			return "Gnosis Safe"
		default:
			return
	}
}
