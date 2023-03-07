import React, { PropsWithChildren } from "react"
import { Web3ReactProvider } from "@web3-react/core"
// import { Web3Provider } from "@ethersproject/providers"

import useEagerlyConnect from "#/layouts/Navbar/@hooks/useEagerlyConnect"

import { connectors } from "./@utils"
// import { ethers } from "ethers";

// import { createClient, WagmiConfig } from "wagmi"
// import { getDefaultProvider } from "ethers"

interface Props extends PropsWithChildren {}

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
			{children}
			{/* </WagmiConfig> */}
		</Web3ReactProvider>
	)
}

// const Child = () => {
// 	const { connector } = useWeb3React()
// 	console.log(`Priority Connector is: ${getName(connector)}`)
// 	return null
// }

export default Web3SwapProvider
