import { useState } from "react"

import { metaMask, metaMaskHooks } from "../@utils/connectors/metaMask"
import { CardSwap } from "../@components/Card"

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = metaMaskHooks

export function MetaMaskCard() {
	const chainId = useChainId()
	const accounts = useAccounts()
	const isActivating = useIsActivating()

	const isActive = useIsActive()

	const provider = useProvider()
	const ENSNames = useENSNames(provider)

	const [error, setError] = useState<Error | undefined>(undefined)

	// attempt to connect eagerly on mount
	// useEffect(() => {
	// 	void metaMask.connectEagerly().catch(() => {
	// 		console.debug("Failed to connect eagerly to metamask")
	// 	})
	// }, [])

	return (
		<CardSwap
			connector={metaMask}
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
