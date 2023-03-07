import { useCallback, useState } from "react"
import { useAppDispatch } from "#/redux/store"
import { Button } from "antd"

import { CHAINS, URLS, getAddChainParameters } from "../@utils/chain"

import { ChainSelect } from "./Chain"
import { getConnection } from "#/@app/utility/Connection/utils"

import { updateSelectedWallet } from "#/redux/slices/User"

import { GnosisSafe } from "@web3-react/gnosis-safe"
import { Network } from "@web3-react/network"
import { WalletConnect } from "@web3-react/walletconnect"
import type { CoinbaseWallet } from "@web3-react/coinbase-wallet"
import type { Web3ReactHooks } from "@web3-react/core"
import type { MetaMask } from "@web3-react/metamask"

interface Props {
	connector: MetaMask | WalletConnect | CoinbaseWallet | Network | GnosisSafe
	chainId: ReturnType<Web3ReactHooks["useChainId"]>
	isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>
	isActive: ReturnType<Web3ReactHooks["useIsActive"]>
	error: Error | undefined
	setError: (error: Error | undefined) => void
}

export const ConnectWithSelect: React.FC<Props> = ({ connector, chainId, isActivating, isActive, error, setError }) => {
	const isNetwork = connector instanceof Network
	const displayDefault = !isNetwork
	const chainIds = (isNetwork ? Object.keys(URLS) : Object.keys(CHAINS)).map((chainId) => Number(chainId))

	const [desiredChainId, setDesiredChainId] = useState<number>(isNetwork ? 1 : -1)

	const dispatch = useAppDispatch()

	const switchChain = useCallback(
		(desiredChainId: number) => {
			setDesiredChainId(desiredChainId)
			// if we're already connected to the desired chain, return
			if (desiredChainId === chainId) {
				setError(undefined)
				return
			}

			// if they want to connect to the default chain and we're already connected, return
			if (desiredChainId === -1 && chainId !== undefined) {
				setError(undefined)
				return
			}

			if (connector instanceof WalletConnect || connector instanceof Network) {
				connector
					.activate(desiredChainId === -1 ? undefined : desiredChainId)
					.then(() => setError(undefined))
					.catch(setError)
			} else {
				connector
					.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
					.then(() => setError(undefined))
					.catch(setError)
			}
		},
		[connector, chainId, setError]
	)

	const onClick = useCallback((): void => {
		setError(undefined)
		if (connector instanceof GnosisSafe) {
			connector
				.activate()
				.then(() => setError(undefined))
				.catch(setError)
		} else if (connector instanceof WalletConnect || connector instanceof Network) {
			connector
				.activate(desiredChainId === -1 ? undefined : desiredChainId)
				.then(() => setError(undefined))
				.catch(setError)
		} else {
			connector
				.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
				.then(() => setError(undefined))
				.catch(setError)
		}
	}, [connector, desiredChainId, setError])

	const onConnect = () => {
		if (isActivating) {
			return undefined
		} else {
			const connectionType = getConnection(connector).type
			if (connector instanceof GnosisSafe) {
				return void connector
					.activate()
					.then(() => {
						dispatch(updateSelectedWallet({ wallet: connectionType }))
						setError(undefined)
					})
					.catch(setError)
			} else if (connector instanceof Network) {
				return connector
					.activate(desiredChainId === -1 ? undefined : desiredChainId)
					.then(() => {
						dispatch(updateSelectedWallet({ wallet: connectionType }))
						setError(undefined)
					})
					.catch(setError)
			} else if (connector instanceof WalletConnect) {
				return (
					connector
						// .activate(desiredChainId === -1 ? undefined : desiredChainId)
						.activate()
						.then(() => {
							dispatch(updateSelectedWallet({ wallet: connectionType }))
							setError(undefined)
						})
						.catch(setError)
				)
			} else {
				return connector
					.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
					.then(() => {
						dispatch(updateSelectedWallet({ wallet: connectionType }))
						setError(undefined)
					})
					.catch(setError)
			}
		}
	}

	const onDisconnect = () => {
		if (connector?.deactivate) {
			void connector.deactivate()
		} else {
			void connector.resetState()
		}
		dispatch(updateSelectedWallet({ wallet: undefined }))
	}

	if (!error) {
		if (isActive) {
			return (
				<div className="flex flex-col">
					{!(connector instanceof GnosisSafe) && (
						<ChainSelect
							chainId={desiredChainId === -1 ? -1 : chainId}
							switchChain={switchChain}
							displayDefault={displayDefault}
							chainIds={chainIds}
						/>
					)}
					<div className="mb-4" />
					<Button onClick={onDisconnect}>Disconnect</Button>
				</div>
			)
		}
		return (
			<div className="flex flex-col">
				{!(connector instanceof GnosisSafe) && (
					<ChainSelect
						chainId={desiredChainId}
						switchChain={isActivating ? undefined : switchChain}
						displayDefault={displayDefault}
						chainIds={chainIds}
					/>
				)}
				<div className="mb-4" />
				<Button onClick={onConnect} disabled={isActivating}>
					Connect
				</Button>
			</div>
		)
	}

	return (
		<div className="flex flex-col">
			{!(connector instanceof GnosisSafe) && (
				<ChainSelect chainId={desiredChainId} switchChain={switchChain} displayDefault={displayDefault} chainIds={chainIds} />
			)}
			<div className="mb-4" />
			<Button onClick={onClick}>Try Again?</Button>
		</div>
	)
}
