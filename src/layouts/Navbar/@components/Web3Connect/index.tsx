import React, { useCallback, useEffect } from "react"
import { useAppDispatch } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"
import { GnosisSafe } from "@web3-react/gnosis-safe"
import { WalletConnect } from "@web3-react/walletconnect"
import { Network } from "@web3-react/network"
import { MetaMask } from "@web3-react/metamask"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"
// import { Connector } from "@web3-react/types"
import { Button } from "antd"
import { DownOutlined, UpOutlined } from "@ant-design/icons"
import clsx from "clsx"

import useToggle from "#/shared/hooks/useToggle"

import { getConnection } from "#/@app/utility/Connection/utils"
import { SelectWallet } from "./SelectWallet"
import { networkConnection } from "#/features/Swap/@utils/connectors/network"

import { updateConnectionError } from "#/redux/slices/Connection"
import { updateSelectedWallet } from "#/redux/slices/User"

import "./style.css"

interface Props {
	containerClass: string
}

const Web3Connect: React.FC<Props> = ({ containerClass }) => {
	const [isOpenWallet, toggleWallet, closeWallet] = useToggle()
	const [isPending, togglePending, closePending] = useToggle()

	const { chainId, connector } = useWeb3React()
	const dispatch = useAppDispatch()

	const connectionType = getConnection(connector).type

	useEffect(() => {
		if (chainId && connector !== networkConnection.connector) {
			networkConnection.connector.activate(chainId)
		}
	}, [chainId, connector])

	const tryActivation = useCallback(
		(connector: unknown) => {
			togglePending()
			dispatch(updateConnectionError({ connectionType, error: undefined }))
			if (connector instanceof GnosisSafe) {
				// console.log("this 1 instances")
				connector
					.activate()
					.then((res) => {
						console.log(res, "res")
						closeWallet()
					})
					.catch((err) => {
						console.log(err, "catch")
						closePending()
						dispatch(updateConnectionError({ connectionType, error: `Can't Connect to Network` }))
					})
			} else if (
				connector instanceof WalletConnect ||
				connector instanceof Network ||
				connector instanceof MetaMask ||
				connector instanceof CoinbaseWallet
			) {
				console.log("this 4 instances")
				connector
					.activate()
					// .activate(Number(chainId))
					.then((res) => {
						console.log(res, "res")
						dispatch(updateSelectedWallet({ wallet: connectionType }))
						closeWallet()
					})
					.catch((err) => {
						console.log(err, "catch")
						closePending()
						dispatch(updateConnectionError({ connectionType, error: `Can't Connect to Network` }))
					})
			} else {
				closePending()
				dispatch(updateConnectionError({ connectionType, error: `Can't Connect to Network` }))
			}
			// //   // log selected wallet
			// //   sendEvent({
			// // 	category: 'Wallet',
			// // 	action: 'Change Wallet',
			// // 	label: connectionType,
			// //   })
			// togglePending()

			// try {
			// 	dispatch(updateConnectionError({ connectionType, error: undefined }))
			// 	// await connector.provider?.request({
			// 	// 	method: "wallet_switchEthereumChain",
			// 	// 	params: [
			// 	// 		{
			// 	// 			chainId: `0x${chainId}`,
			// 	// 		},
			// 	// 	],
			// 	// })
			// 	// console.log("active error")
			// 	await connector.activate(chainId)
			// 	dispatch(updateSelectedWallet({ wallet: connectionType }))
			// 	closeWallet()
			// } catch (error) {
			// 	dispatch(updateConnectionError({ connectionType, error: `Can't Connect to Network` }))
			// 	// sendAnalyticsEvent(InterfaceEventName.WALLET_CONNECT_TXN_COMPLETED, {
			// 	//   result: WalletConnectionResult.FAILED,
			// 	//   wallet_type: getConnectionName(connectionType),
			// 	// })
			// } finally {
			// 	closePending()
			// }
		},
		[closeWallet, closePending]
	)

	const onCloseWallet = () => {
		if (isPending) {
			return false
		}
		return toggleWallet()
	}

	if (!chainId) {
		return null
	}

	return (
		<>
			<Button className={clsx("connect-container", containerClass)} onClick={toggleWallet}>
				<div className="connect-title">Connect</div>
				<div className="h-5 mx-2 bg-blue-300" style={{ width: "1px" }} />
				{isOpenWallet ? (
					<UpOutlined className="text-blue-500 mt-1" style={{ fontSize: "1.15em", fontWeight: "bold" }} />
				) : (
					<DownOutlined className="text-blue-500 mt-1" style={{ fontSize: "1.15em", fontWeight: "bold" }} />
				)}
			</Button>
			{isOpenWallet && (
				<SelectWallet isOpenModal={isOpenWallet} isPending={isPending} onCloseModal={onCloseWallet} tryActivation={tryActivation} />
			)}
		</>
	)
}

export default Web3Connect
