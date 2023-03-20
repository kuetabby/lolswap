import { useCallback } from "react"
import { useAppDispatch } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"
import { Network } from "@web3-react/network"
import { message } from "antd"

import { SupportedChainId } from "#/shared/constants/chains"

import { getAddChainParameters } from "#/features/Swap/@utils/chain"
import { toggleSwitchChain } from "#/redux/slices/Application"

export interface CancelResponse {
	code: number
	message: string
	data: Data
}

export interface Data {
	method: string
}

export default function useSelectChain() {
	const { connector, provider, chainId } = useWeb3React()
	const dispatch = useAppDispatch()

	return useCallback(
		async (targetChain: SupportedChainId) => {
			if (targetChain === chainId) {
				console.log("return none")
				return
			}

			if (+targetChain === -1 && chainId !== undefined) {
				console.log("return none")
				return
			}

			if (!connector) {
				console.log("return none")
				return
			}

			if (connector instanceof WalletConnect || connector instanceof Network) {
				const desiredChain = +targetChain === -1 ? undefined : +targetChain
				await connector.activate(desiredChain)
			} else {
				dispatch(toggleSwitchChain(true))
				await provider
					?.send("wallet_switchEthereumChain", [getAddChainParameters(targetChain)])
					.then((res) => {
						if (!res) {
							// dispatch(updateChainId({ chainId: targetChain }))
						} else {
							const switchResponse = res as CancelResponse
							if (switchResponse?.code !== 4001) {
								provider?.send("wallet_addEthereumChain", [getAddChainParameters(targetChain)])
								// .then((resAdd) => {
								// 	// if (!resAdd) {
								// 	// 	dispatch(updateChainId({ chainId: targetChain }))
								// 	// }
								// })
							}
						}
					})
					.catch((err) => {
						console.log(err, "err")
						message.error("Failed to switch networks", 5)
					})
					.finally(() => {
						dispatch(toggleSwitchChain(false))
					})
			}
		},
		[connector, dispatch, getAddChainParameters, provider, chainId]
	)
}
