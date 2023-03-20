import React, { PropsWithChildren, useEffect } from "react"
import { useAppDispatch } from "#/redux/store"
import { useWeb3React, Web3ReactProvider } from "@web3-react/core"

import useEagerlyConnect from "#/layouts/Navbar/@hooks/useEagerlyConnect"

import { resetTrade } from "#/redux/slices/Swap"

import { connectors } from "./@utils"
import { isSupportedChain } from "#/shared/constants/chains"
import { RPC_PROVIDERS } from "#/shared/constants/providers"

interface Props extends PropsWithChildren {}

export interface DetectNetwork {
	name: string
	chainId: number
	ensAddress: string
}

// const client = createClient({
// 	autoConnect: true,
// 	provider: getDefaultProvider(),
// })

// const INFURA_KEY = import.meta.env.VITE_INFURA_KEY

// let url = `https://mainnet.infura.io/v3/${INFURA_KEY}`;
//  let customHttpProvider = new ethers.providers.JsonRpcProvider(url);
// customHttpProvider.getBlockNumber().then((result) => {
//     console.log("Current block number: " + result);
// });

const Web3SwapProvider: React.FC<Props> = ({ children }) => {
	useEagerlyConnect()
	return (
		<Web3ReactProvider connectors={connectors}>
			{/* <WagmiConfig client={client}> */}
			{/* <Child /> */}
			<Tracer />
			{children}
			{/* </WagmiConfig> */}
		</Web3ReactProvider>
	)
}

function Tracer() {
	const { chainId, provider } = useWeb3React()

	const networkProvider = isSupportedChain(chainId) ? RPC_PROVIDERS[chainId] : undefined
	// const shouldTrace = useTraceJsonRpcFlag() === TraceJsonRpcVariant.Enabled

	const dispatch = useAppDispatch()

	useEffect(() => {
		provider?.on("debug", trace)

		if (provider !== networkProvider) {
			networkProvider?.on("debug", trace)
		}

		return () => {
			provider?.off("debug", trace)
			networkProvider?.off("debug", trace)
		}
	}, [networkProvider, provider])

	useEffect(() => {
		getNetwork().then((res) => {
			if (res.status === "success" && chainId) {
				dispatch(resetTrade(chainId))
			}
		})
		provider?.detectNetwork().then(() => {
			// const networkResponse = response as DetectNetwork
			console.log("network changed")
		})
	}, [provider, chainId])

	const getNetwork = async () => {
		try {
			const request = await provider?.detectNetwork()
			const response = await request
			return { status: "success", response }
		} catch (error) {
			return { status: "error", error }
		}
	}

	return null
}

function trace(event: any) {
	if (event.action === "request") {
		const { method, id, params } = event.request
		console.groupCollapsed(method, id)
		console.debug(params)
		console.groupEnd()
	}
}

// const Child = () => {
// 	const { connector } = useWeb3React()
// 	console.log(`Priority Connector is: ${getName(connector)}`)
// 	return null
// }

export default Web3SwapProvider
