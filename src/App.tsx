// import { useEffect } from "react"
// import { useAppDispatch } from "./redux/store"
// import { useWeb3React } from "@web3-react/core"

import "./App.css"

import AppLayout from "./layouts"
import { useStoreToken } from "./shared/hooks/useSessionToken"

// import { setFromTradeAddress } from "#/redux/slices/Swap"

function App() {
	useStoreToken()
	// const { account } = useWeb3React()

	// const dispatch = useAppDispatch()

	// useEffect(() => {
	// 	if (account) {
	// 		dispatch(setFromTradeAddress(account))
	// 	}
	// }, [account])

	return <AppLayout />
}

export default App
