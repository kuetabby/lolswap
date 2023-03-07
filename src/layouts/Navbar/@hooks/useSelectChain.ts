import { useCallback } from "react"
import { useAppDispatch } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"

import { getConnection } from "#/@app/utility/Connection/utils"
import { switchChain } from "#/@app/utility/switchChain"
import { SupportedChainId } from "#/shared/constants/chains"

import { updateConnectionError } from "#/redux/slices/Connection"
import { addPopup } from "#/redux/slices/Application"

export default function useSelectChain() {
	const { connector } = useWeb3React()

	const dispatch = useAppDispatch()

	return useCallback(
		async (targetChain: SupportedChainId) => {
			if (!connector) return

			const connectionType = getConnection(connector).type

			try {
				dispatch(updateConnectionError({ connectionType, error: undefined }))
				await switchChain(connector, targetChain)
			} catch (error) {
				console.error("Failed to switch networks", error)

				dispatch(updateConnectionError({ connectionType, error: "Failed to switch networks" }))
				dispatch(addPopup({ content: { failedSwitchNetwork: targetChain, txn: { hash: "" } }, key: `failed-network-switch` }))
			}
		},
		[connector, dispatch]
	)
}
