import { useState } from "react"

import { gnosisSafe, gnosisSafeHooks } from "../@utils/connectors/gnosisIsSafe"
import { CardSwap } from "../@components/Card"

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = gnosisSafeHooks

export function GnosisSafeCard() {
	const chainId = useChainId()
	const accounts = useAccounts()
	const isActivating = useIsActivating()

	const isActive = useIsActive()

	const provider = useProvider()
	const ENSNames = useENSNames(provider)

	const [error, setError] = useState<Error | undefined>(undefined)

	// attempt to connect eagerly on mount
	// useEffect(() => {
	// 	void gnosisSafe.connectEagerly().catch(() => {
	// 		console.debug("Failed to connect eagerly to gnosis safe")
	// 	})
	// }, [])

	return (
		<CardSwap
			connector={gnosisSafe}
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
