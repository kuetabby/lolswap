import { useState } from "react"

import { coinbaseWallet, coinbaseWalletHooks } from "../@utils/connectors/coinbaseWallet"
import { CardSwap } from "../@components/Card"

const { useChainId, useAccounts, useIsActivating, useIsActive, useProvider, useENSNames } = coinbaseWalletHooks

export const CoinbaseWalletCard: React.FC = () => {
	const chainId = useChainId()
	const accounts = useAccounts()
	const isActivating = useIsActivating()

	const isActive = useIsActive()

	const provider = useProvider()
	const ENSNames = useENSNames(provider)

	const [error, setError] = useState<Error | undefined>(undefined)

	// attempt to connect eagerly on mount
	// useEffect(() => {
	// 	void coinbaseWallet.connectEagerly().catch(() => {
	// 		console.debug("Failed to connect eagerly to coinbase wallet")
	// 	})
	// }, [])

	return (
		<CardSwap
			connector={coinbaseWallet}
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
