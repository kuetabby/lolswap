import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { QueryClient, QueryClientProvider } from "react-query"

import "./index.css"

import App from "./App"
import { store, persistedStore } from "./redux/store"

// import Web3Provider from "./@app/core/Web3Provider"
import Web3SwapProvider from "./features/Swap/Provider"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<PersistGate persistor={persistedStore} loading={null}>
					<Web3SwapProvider>
						<App />
					</Web3SwapProvider>
				</PersistGate>
			</Provider>
		</QueryClientProvider>
	</React.StrictMode>
)
