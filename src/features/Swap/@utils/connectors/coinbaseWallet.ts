import { initializeConnector } from "@web3-react/core"
import { CoinbaseWallet } from "@web3-react/coinbase-wallet"

import { ConnectionType, Connection } from "#/@app/utility/Connection"
import { URLS } from "../chain"
// import { RPC_URLS } from "#/shared/constants/networks"
// import { SupportedChainId } from "@uniswap/sdk-core"

import UNISWAP_LOGO_URL from "#/assets/logo.svg"

export const [coinbaseWallet, coinbaseWalletHooks] = initializeConnector<CoinbaseWallet>(
	(actions) =>
		new CoinbaseWallet({
			actions,
			onError,
			options: {
				url: URLS[1][0],
				// url: RPC_URLS[SupportedChainId.MAINNET][0],
				appName: "web3-react",
				appLogoUrl: UNISWAP_LOGO_URL,
				reloadOnDisconnect: false,
			},
		})
)

export const coinbaseWalletConnection: Connection = {
	connector: coinbaseWallet,
	hooks: coinbaseWalletHooks,
	type: ConnectionType.COINBASE_WALLET,
}

function onError(error: Error) {
	console.debug(`web3-react error: ${error}`)
}
