import { useCallback } from "react"
import { useAppDispatch } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"
import { message } from "antd"

import { getConnection } from "#/@app/utility/Connection/utils"
import { switchChain } from "#/@app/utility/switchChain"
import { SupportedChainId } from "#/shared/constants/chains"

import { updateConnectionError } from "#/redux/slices/Connection"
import { addPopup, toggleSwitchChain } from "#/redux/slices/Application"
import { resetTrade } from "#/redux/slices/Swap"

export default function useSelectChain() {
	const { connector } = useWeb3React()

	const dispatch = useAppDispatch()

	return useCallback(
		async (targetChain: SupportedChainId) => {
			if (!connector) return

			const connectionType = getConnection(connector).type

			dispatch(toggleSwitchChain(true))
			try {
				dispatch(updateConnectionError({ connectionType, error: undefined }))
				await switchChain(connector, targetChain)
				dispatch(resetTrade())
			} catch (error) {
				message.error("Failed to switch networks", 5)
				dispatch(updateConnectionError({ connectionType, error: "Failed to switch networks" }))
				dispatch(addPopup({ content: { failedSwitchNetwork: targetChain, txn: { hash: "" } }, key: `failed-network-switch` }))
			} finally {
				dispatch(toggleSwitchChain(false))
			}
		},
		[connector, dispatch]
	)
}
