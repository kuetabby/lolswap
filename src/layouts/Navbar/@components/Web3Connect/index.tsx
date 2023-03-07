import React, { useCallback } from "react"
import { useAppDispatch } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"
import { Connector } from "@web3-react/types"
import { Button } from "antd"
import { DownOutlined } from "@ant-design/icons"

import useToggle from "#/shared/hooks/useToggle"

import { getConnection } from "#/@app/utility/Connection/utils"
import { SelectWallet } from "./SelectWallet"

import { updateConnectionError } from "#/redux/slices/Connection"
import { updateSelectedWallet } from "#/redux/slices/User"

interface Props {}

const Web3Connect: React.FC<Props> = () => {
	const [isOpenWallet, toggleWallet, closeWallet] = useToggle()
	const [isPending, togglePending, closePending] = useToggle()

	const { chainId } = useWeb3React()
	const dispatch = useAppDispatch()

	const tryActivation = useCallback(
		async (connector: Connector) => {
			const connectionType = getConnection(connector).type
			//   // log selected wallet
			//   sendEvent({
			// 	category: 'Wallet',
			// 	action: 'Change Wallet',
			// 	label: connectionType,
			//   })
			togglePending()

			try {
				dispatch(updateConnectionError({ connectionType, error: undefined }))
				await connector.provider?.request({
					method: "wallet_switchEthereumChain",
					params: [
						{
							chainId: "0x1",
						},
					],
				})
				await connector.activate()
				dispatch(updateSelectedWallet({ wallet: connectionType }))
				closeWallet()
			} catch (error) {
				dispatch(updateConnectionError({ connectionType, error: `Can't Connect to Network` }))
				// sendAnalyticsEvent(InterfaceEventName.WALLET_CONNECT_TXN_COMPLETED, {
				//   result: WalletConnectionResult.FAILED,
				//   wallet_type: getConnectionName(connectionType),
				// })
			} finally {
				closePending()
			}
		},
		[dispatch]
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
			<Button
				className="flex justify-between items-center w-32 h-10 px-3 py-3  bg-gray-100 rounded-3xl"
				type="ghost"
				onClick={toggleWallet}
			>
				<div className="font-bold text-base text-blue-500 m-0 hover:opacity-50">Connect</div>
				<div className="h-5 mx-2 bg-blue-300" style={{ width: "1px" }} />
				<DownOutlined className="text-blue-500 mt-1 ml-3" style={{ fontSize: "1.15em", fontWeight: "bold" }} />
			</Button>
			{isOpenWallet && (
				<SelectWallet isOpenModal={isOpenWallet} isPending={isPending} onCloseModal={onCloseWallet} tryActivation={tryActivation} />
			)}
		</>
	)
}

export default Web3Connect
