import React from "react"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import { Web3ReactHooks } from "@web3-react/core"
import { GnosisSafe } from "@web3-react/gnosis-safe"
import { MetaMask } from "@web3-react/metamask"
import { Network } from "@web3-react/network"
import { WalletConnect } from "@web3-react/walletconnect"

import AppCard from "#/@app/core/AppCard"

import { ChainSwap } from "./Chain"

import { getName } from "../@utils"
import { Status } from "./Status"
import { Accounts } from "./Account"
import { ConnectWithSelect } from "./ConnectWithSelect"

interface Props {
	connector: MetaMask | WalletConnect | CoinbaseWallet | Network | GnosisSafe
	chainId: ReturnType<Web3ReactHooks["useChainId"]>
	isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>
	isActive: ReturnType<Web3ReactHooks["useIsActive"]>
	error: Error | undefined
	setError: (error: Error | undefined) => void
	ENSNames: ReturnType<Web3ReactHooks["useENSNames"]>
	provider?: ReturnType<Web3ReactHooks["useProvider"]>
	accounts?: string[]
}

export const CardSwap: React.FC<Props> = ({
	ENSNames,
	chainId,
	connector,
	error,
	isActivating,
	isActive,
	setError,
	accounts,
	provider,
}) => {
	return (
		<AppCard heightFull className="w-2/5 m-4 min-h-full">
			<b>{getName(connector)}</b>
			<div className="mb-4">
				<Status isActivating={isActivating} isActive={isActive} error={error} />
			</div>
			<ChainSwap chainId={chainId} />
			<div className="mb-4">
				<Accounts ENSNames={ENSNames} accounts={accounts} provider={provider} />
			</div>
			<ConnectWithSelect
				connector={connector}
				chainId={chainId}
				isActivating={isActivating}
				isActive={isActive}
				error={error}
				setError={setError}
			/>
		</AppCard>
	)
}
