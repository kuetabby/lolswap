import { PropsWithChildren } from "react"

import { EthereumClient, modalConnectors, walletConnectProvider } from "@web3modal/ethereum"
import { Web3Modal } from "@web3modal/react"

import { configureChains, createClient, WagmiConfig } from "wagmi"
import { arbitrum, mainnet, polygon } from "wagmi/chains"

const chains = [arbitrum, mainnet, polygon]
const clientId = "99d7248ea14db4b8caea932c407ea139"

// Wagmi client
const { provider } = configureChains(chains, [walletConnectProvider({ projectId: clientId })])
const wagmiClient = createClient({
	autoConnect: true,
	connectors: modalConnectors({
		projectId: clientId,
		version: "2", // or "2"
		appName: "web3Modal",
		chains,
	}),
	provider,
})

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains)

interface Props extends PropsWithChildren {}

export const WalletConnectConfig: React.FC<Props> = ({ children }) => {
	return (
		<>
			<WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
			<Web3Modal
				projectId={clientId}
				ethereumClient={ethereumClient}
				themeBackground="themeColor"
				themeColor="blue"
				themeMode="dark"
				themeZIndex={9999}
			/>
		</>
	)
}
