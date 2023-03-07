// import { useWeb3React } from "@web3-react/core"
// import { NavLink } from "react-router-dom"

export const PageTabs = () => {
	// const { pathname } = useLocation()
	// const { chainId } = useWeb3React()
	// const chainName = chainIdToBackendName(connectedChainId)

	// const isPoolActive =
	//   pathname.startsWith('/pool') ||
	//   pathname.startsWith('/add') ||
	//   pathname.startsWith('/remove') ||
	//   pathname.startsWith('/increase')

	// const isNftPage = useIsNftPage()

	return (
		<div className="px-5 hidden md:flex md:w-full justify-between ">
			{/* <NavLink to="/swap"> */}
			<div className="text-white">Swap</div>
			{/* </NavLink> */}
			{/* <NavLink to={`/tokens/${chainName.toLowerCase()}`}> */}
			{/* <NavLink to={`/tokens`}> */}
			<div className="text-white">Tokens</div>
			{/* </NavLink> */}
			{/* <NavLink to="/nfts"> */}
			<div className="text-white">NFTs</div>
			{/* </NavLink> */}
			{/* <NavLink to="/pool" id="pool-nav-link"> */}
			<div className="text-white">Pool</div>
			{/* </NavLink> */}
		</div>
	)
}
