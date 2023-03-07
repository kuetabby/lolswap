import { initializeConnector } from "@web3-react/core"
import { GnosisSafe } from "@web3-react/gnosis-safe"

import { ConnectionType, Connection } from "#/@app/utility/Connection"

export const [gnosisSafe, gnosisSafeHooks] = initializeConnector<GnosisSafe>((actions) => new GnosisSafe({ actions }))
export const gnosisSafeConnection: Connection = {
	connector: gnosisSafe,
	hooks: gnosisSafeHooks,
	type: ConnectionType.GNOSIS_SAFE,
}
