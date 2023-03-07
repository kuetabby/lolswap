import { initializeConnector } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"

import { ConnectionType, Connection } from "#/@app/utility/Connection"

export const [metaMask, metaMaskHooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions, onError }))
export const metaMaskConnection: Connection = {
	connector: metaMask,
	hooks: metaMaskHooks,
	type: ConnectionType.INJECTED,
}

function onError(error: Error) {
	console.debug(`web3-react error: ${error}`)
}
