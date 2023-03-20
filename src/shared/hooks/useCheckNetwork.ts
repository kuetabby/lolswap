import { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { useAppDispatch } from "#/redux/store"

import { resetConnectionError } from "#/redux/slices/Connection"
import { resetSelectedWallet } from "#/redux/slices/User"

export const useCheckNetwork = () => {
	const { connector, account, chainId } = useWeb3React()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (chainId && account && connector) {
			if (connector?.deactivate) {
				void connector.deactivate()
			} else {
				void connector.resetState()
			}
			dispatch(resetSelectedWallet())
			dispatch(resetConnectionError())
		}
	}, [chainId, account, connector, dispatch])

	return null
}
