// import { useAppDispatch } from "./redux/store"
// import { useWeb3React } from "@web3-react/core"

import AppLayout from "./layouts"
import { useDarkTheme } from "./shared/hooks/useDarkTheme"
import { useStoreToken } from "./shared/hooks/useSessionToken"

import "./App.css"
// import { setFromTradeAddress } from "#/redux/slices/Swap"

function App() {
	useStoreToken()
	useDarkTheme()
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
