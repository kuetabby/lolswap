import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "#/redux/store"
import { Connector } from "@web3-react/types"

import { updateSelectedWallet } from "#/redux/slices/User"

import { Connection } from "#/@app/utility/Connection"
import { getConnection } from "#/@app/utility/Connection/utils"

import { gnosisSafeConnection } from "#/features/Swap/@utils/connectors/gnosisIsSafe"
import { networkConnection } from "#/features/Swap/@utils/connectors/network"

async function connect(connector: Connector) {
	try {
		if (connector.connectEagerly) {
			await connector.connectEagerly()
		} else {
			await connector.activate()
		}
	} catch (error) {
		console.debug(`web3-react eager connection error: ${error}`)
	}
}

export default function useEagerlyConnect() {
	const selectedWallet = useAppSelector((state) => state.user.selectedWallet)

	const dispatch = useAppDispatch()

	let selectedConnection: Connection | undefined
	if (selectedWallet) {
		try {
			selectedConnection = getConnection(selectedWallet)
		} catch {
			dispatch(updateSelectedWallet({ wallet: undefined }))
		}
	}

	useEffect(() => {
		connect(gnosisSafeConnection.connector)
		connect(networkConnection.connector)

		if (selectedConnection) {
			connect(selectedConnection.connector)
		} // The dependency list is empty so this is only run once on mount
	}, [selectedConnection]) // eslint-disable-line react-hooks/exhaustive-deps
}
