import { useEffect, useState } from "react"

import { URI_AVAILABLE } from "@web3-react/walletconnect"

import { CardSwap } from "../@components/Card"

import { walletConnect, walletConnectHooks } from "../@utils/connectors/walletConnect"

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = walletConnectHooks

export function WalletConnectCard() {
	const chainId = useChainId()
	const accounts = useAccounts()
	const isActivating = useIsActivating()

	const isActive = useIsActive()

	const provider = useProvider()
	const ENSNames = useENSNames(provider)

	const [error, setError] = useState<Error | undefined>(undefined)

	// log URI when available
	useEffect(() => {
		walletConnect.events.on(URI_AVAILABLE, (uri: string) => {
			console.log(`uri: ${uri}`)
		})
	}, [])

	// attempt to connect eagerly on mount
	// useEffect(() => {
	// 	walletConnect.connectEagerly().catch(() => {
	// 		console.debug("Failed to connect eagerly to walletconnect")
	// 	})
	// }, [])

	return (
		<CardSwap
			connector={walletConnect}
			chainId={chainId}
			isActivating={isActivating}
			isActive={isActive}
			error={error}
			setError={setError}
			accounts={accounts}
			provider={provider}
			ENSNames={ENSNames}
		/>
	)
}
