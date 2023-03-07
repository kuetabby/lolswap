import { initializeConnector } from "@web3-react/core"
import { WalletConnect } from "@web3-react/walletconnect"

import { URLS } from "../chain"
// import { RPC_URLS } from "#/shared/constants/networks"
import { ConnectionType, Connection } from "#/@app/utility/Connection"

// export const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>((actions) => {
// 	// Avoid testing for the best URL by only passing a single URL per chain.
// 	// Otherwise, WC will not initialize until all URLs have been tested (see getBestUrl in web3-react).
// 	const RPC_URLS_WITHOUT_FALLBACKS = Object.entries(RPC_URLS).reduce(
// 		(map, [chainId, urls]) => ({
// 			...map,
// 			[chainId]: urls[0],
// 		}),
// 		{}
// 	)
// 	return new WalletConnect({
// 		actions,
// 		options: {
// 			rpc: RPC_URLS_WITHOUT_FALLBACKS,
// 			qrcode: true,
// 		},
// 		onError,
// 	})
// })

// new WalletConnect(actions, {
//   rpc: Object.keys(URLS).reduce((accumulator, chainId) => {
//     accumulator[chainId] = URLS[Number(chainId)][0];
//     return accumulator;
//   }, {})
// }),
//   Object.keys(URLS).map((chainId) => Number(chainId))

export const [walletConnect, walletConnectHooks] = initializeConnector<WalletConnect>(
	(actions) =>
		new WalletConnect({
			actions,
			options: {
				rpc: URLS,
			},
			onError,
		})
)
export const walletConnectConnection: Connection = {
	connector: walletConnect,
	hooks: walletConnectHooks,
	type: ConnectionType.WALLET_CONNECT,
}

function onError(error: Error) {
	console.debug(`web3-react error: ${error}`)
}
