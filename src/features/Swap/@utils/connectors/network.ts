import { initializeConnector } from "@web3-react/core"
import { Network } from "@web3-react/network"

import { ConnectionType, Connection } from "#/@app/utility/Connection"

import { URLS } from "../chain"

export const [network, networkHooks] = initializeConnector<Network>((actions) => new Network({ actions, urlMap: URLS }))
export const networkConnection: Connection = {
	connector: network,
	hooks: networkHooks,
	type: ConnectionType.INJECTED,
}
