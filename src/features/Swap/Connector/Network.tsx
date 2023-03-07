import { useState } from "react"

import { network, networkHooks } from "../@utils/connectors/network"
import { CardSwap } from "../@components/Card"

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = networkHooks

export function NetworkCard() {
	const chainId = useChainId()
	const accounts = useAccounts()
	const isActivating = useIsActivating()

	const isActive = useIsActive()

	const provider = useProvider()
	const ENSNames = useENSNames(provider)

	const [error, setError] = useState<Error | undefined>(undefined)

	// attempt to connect eagerly on mount
	// useEffect(() => {
	// 	void network.activate().catch(() => {
	// 		console.debug("Failed to connect to network")
	// 	})
	// }, [])

	return (
		<CardSwap
			connector={network}
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
