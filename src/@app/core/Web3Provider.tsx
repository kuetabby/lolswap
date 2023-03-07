import React, { PropsWithChildren, useMemo, useEffect } from "react"
import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from "@web3-react/core"
import { Connector } from "@web3-react/types"

import useOrderedConnections from "#/layouts/Navbar/@hooks/useOrderedConnections"
import useEagerlyConnect from "#/layouts/Navbar/@hooks/useEagerlyConnect"

import { Connection } from "../utility/Connection"
import { getConnectionName } from "#/@app/utility/Connection/utils"
import { isSupportedChain } from "#/shared/constants/chains"
import { RPC_PROVIDERS } from "#/shared/constants/providers"

interface Props extends PropsWithChildren {}

const Web3Provider: React.FC<Props> = ({ children }) => {
	useEagerlyConnect()
	const connections = useOrderedConnections()
	const connectors: [Connector, Web3ReactHooks][] = connections.map(({ hooks, connector }) => [connector, hooks])

	const key = useMemo(() => connections.map(({ type }: Connection) => getConnectionName(type)).join("-"), [connections])

	console.log(connectors, "connector")
	return (
		<Web3ReactProvider connectors={connectors} key={key}>
			<Tracer />
			{children}
		</Web3ReactProvider>
	)
}

function Tracer() {
	const { chainId, provider } = useWeb3React()
	const networkProvider = isSupportedChain(chainId) ? RPC_PROVIDERS[chainId] : undefined
	// const shouldTrace = useTraceJsonRpcFlag() === TraceJsonRpcVariant.Enabled

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

	return null
}

function trace(event: any) {
	if (event.action !== "request") return
	const { method, id, params } = event.request
	console.groupCollapsed(method, id)
	console.debug(params)
	console.groupEnd()
}

export default Web3Provider
