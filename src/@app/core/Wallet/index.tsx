import React, { useState, useCallback, useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { CustomUserProperties, InterfaceEventName, WalletConnectionResult } from "@uniswap/analytics-events"
import { sendAnalyticsEvent, user } from "@uniswap/analytics"
import { useAppDispatch, useAppSelector } from "#/redux/store"
import { Modal, Row } from "antd"
import { Connector } from "@web3-react/types"
import { ArrowLeftOutlined, CloseCircleOutlined } from "@ant-design/icons"

import { useConnectedWallets } from "#/layouts/Navbar/@hooks/useConnectedWallets"
import usePrevious from "#/shared/hooks/usePrevious"

import { networkConnection } from "#/@app/utility/Connection"
import {
	getConnection,
	getConnectionName,
	getIsCoinbaseWallet,
	getIsInjected,
	getIsMetaMaskWallet,
} from "#/@app/utility/Connection/utils"
import { isMobile } from "#/@app/utility/UserAgent"

import { setToggleModal } from "#/redux/slices/Application"
import { updateConnectionError } from "#/redux/slices/Connection"
// import { updateSelectedWallet } from "#/redux/slices/User"

import "./style.css"

// import { sendEvent } from 'components/analytics'
// import { AutoColumn } from 'components/Column'
// import { ArrowLeft } from 'react-feather'
// import { useLocation, useNavigate } from 'react-router-dom'
// import styled from 'styled-components/macro'
// import { flexColumnNoWrap, flexRowNoWrap } from 'theme/styles'

// import { ReactComponent as Close } from '../../assets/images/x.svg'
// import { useModalIsOpen, useToggleWalletModal } from '../../state/application/hooks'
// import { ApplicationModal } from '../../state/application/reducer'
// import { ExternalLink, ThemedText } from '../../theme'

// To be Continued
// import AccountDetails from '../AccountDetails'
// import { CoinbaseWalletOption, OpenCoinbaseWalletOption } from './CoinbaseWalletOption'
// import { WalletConnectOption } from './WalletConnectOption'
// import { InjectedOption, InstallMetaMaskOption, MetaMaskOption } from './InjectedOption'
// import PendingView from './PendingView'

interface Props {
	pendingTransactions: string[] // hashes of pending
	confirmedTransactions: string[] // hashes of confirmed
	ENSName?: string
}

const WALLET_VIEWS = {
	OPTIONS: "options",
	ACCOUNT: "account",
	PENDING: "pending",
}

const sendAnalyticsEventAndUserInfo = (account: string, walletType: string, chainId: number | undefined, isReconnect: boolean) => {
	sendAnalyticsEvent(InterfaceEventName.WALLET_CONNECT_TXN_COMPLETED, {
		result: WalletConnectionResult.SUCCEEDED,
		wallet_address: account,
		wallet_type: walletType,
		is_reconnect: isReconnect,
	})
	user.set(CustomUserProperties.WALLET_ADDRESS, account)
	user.set(CustomUserProperties.WALLET_TYPE, walletType)
	if (chainId) {
		user.postInsert(CustomUserProperties.ALL_WALLET_CHAIN_IDS, chainId)
	}
	user.postInsert(CustomUserProperties.ALL_WALLET_ADDRESSES_CONNECTED, account)
}

const WalletModal: React.FC<Props> = ({ pendingTransactions, confirmedTransactions, ENSName }) => {
	const { connector, account, chainId } = useWeb3React()
	const previousAccount = usePrevious(account)

	const { openModal: isModalOpen } = useAppSelector((state) => state.application)

	const dispatch = useAppDispatch()
	// const location = useLocation()
	// const navigate = useNavigate()

	console.log(pendingTransactions, confirmedTransactions, ENSName, "props")

	const [connectedWallets, addWalletToConnectedWallets] = useConnectedWallets()

	const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
	const [lastActiveWalletAddress, setLastActiveWalletAddress] = useState<string | undefined>(account)

	const [pendingConnector, setPendingConnector] = useState<Connector | undefined>()
	const pendingError = useAppSelector((state) =>
		pendingConnector ? state.connection.errorByConnectionType[getConnection(pendingConnector).type] : undefined
	)

	// const openOptions = useCallback(() => {
	// 	setWalletView(WALLET_VIEWS.OPTIONS)
	// }, [setWalletView])

	const toggleModal = useCallback(() => {
		dispatch(setToggleModal())
	}, [])

	useEffect(() => {
		if (isModalOpen) {
			setWalletView(account ? WALLET_VIEWS.ACCOUNT : WALLET_VIEWS.OPTIONS)
		}
	}, [isModalOpen, setWalletView, account])

	useEffect(() => {
		if (account && account !== previousAccount && isModalOpen) {
			toggleModal()
			// if (location.pathname === '/') {
			//   navigate('/swap')
			// }
		}
	}, [
		account,
		previousAccount,
		toggleModal,
		isModalOpen,
		location.pathname,
		// navigate
	])

	useEffect(() => {
		if (pendingConnector && walletView !== WALLET_VIEWS.PENDING) {
			updateConnectionError({ connectionType: getConnection(pendingConnector).type, error: undefined })
			setPendingConnector(undefined)
		}
	}, [pendingConnector, walletView])

	// Keep the network connector in sync with any active user connector to prevent chain-switching on wallet disconnection.
	useEffect(() => {
		if (chainId && connector !== networkConnection.connector) {
			networkConnection.connector.activate(chainId)
		}
	}, [chainId, connector])

	// When new wallet is successfully set by the user, trigger logging of Amplitude analytics event.
	useEffect(() => {
		if (account && account !== lastActiveWalletAddress) {
			const walletType = getConnectionName(getConnection(connector).type)
			if (walletType) {
				const isReconnect =
					connectedWallets.filter((wallet) => wallet.account === account && wallet.walletType === walletType).length > 0
				sendAnalyticsEventAndUserInfo(account, walletType, chainId, isReconnect)
				if (!isReconnect) addWalletToConnectedWallets({ account, walletType })
			}
		}
		setLastActiveWalletAddress(account)
	}, [connectedWallets, addWalletToConnectedWallets, lastActiveWalletAddress, account, connector, chainId])

	// const tryActivation = useCallback(
	// 	async (connector: Connector) => {
	// 		const connectionType = getConnection(connector).type

	// 		// log selected wallet
	// 		// sendEvent({
	// 		//   category: 'Wallet',
	// 		//   action: 'Change Wallet',
	// 		//   label: connectionType,
	// 		// })

	// 		try {
	// 			setPendingConnector(connector)
	// 			setWalletView(WALLET_VIEWS.PENDING)
	// 			dispatch(updateConnectionError({ connectionType, error: undefined }))

	// 			await connector.activate()

	// 			dispatch(updateSelectedWallet({ wallet: connectionType }))
	// 		} catch (error) {
	// 			//   console.debug(`web3-react connection error: ${error}`)
	// 			dispatch(updateConnectionError({ connectionType, error: "web3-react connection error" }))

	// 			sendAnalyticsEvent(InterfaceEventName.WALLET_CONNECT_TXN_COMPLETED, {
	// 				result: WalletConnectionResult.FAILED,
	// 				wallet_type: getConnectionName(connectionType),
	// 			})
	// 		}
	// 	},
	// 	[dispatch]
	// )

	function getOptions() {
		const isInjected = getIsInjected()
		const hasMetaMaskExtension = getIsMetaMaskWallet()
		const hasCoinbaseExtension = getIsCoinbaseWallet()

		const isCoinbaseWalletBrowser = isMobile && hasCoinbaseExtension
		const isMetaMaskBrowser = isMobile && hasMetaMaskExtension
		const isInjectedMobileBrowser = isCoinbaseWalletBrowser || isMetaMaskBrowser

		console.log(isInjected, isInjectedMobileBrowser)

		let injectedOption
		//   if (!isInjected) {
		//     if (!isMobile) {
		//       injectedOption = <InstallMetaMaskOption />
		//     }
		//   } else if (!hasCoinbaseExtension) {
		//     if (hasMetaMaskExtension) {
		//       injectedOption = <MetaMaskOption tryActivation={tryActivation} />
		//     } else {
		//       injectedOption = <InjectedOption tryActivation={tryActivation} />
		//     }
		//   }

		let coinbaseWalletOption
		//   if (isMobile && !isInjectedMobileBrowser) {
		//     coinbaseWalletOption = <OpenCoinbaseWalletOption />
		//   } else if (!isMobile || isCoinbaseWalletBrowser) {
		//     coinbaseWalletOption = <CoinbaseWalletOption tryActivation={tryActivation} />
		//   }

		//   const walletConnectionOption =
		//     (!isInjectedMobileBrowser && <WalletConnectOption tryActivation={tryActivation} />) ?? null

		return (
			<>
				{injectedOption}
				{coinbaseWalletOption}
				{/* {walletConnectionOption} */}
			</>
		)
	}

	function getModalContent() {
		//   if (walletView === WALLET_VIEWS.ACCOUNT) {
		//     return (
		//       <AccountDetails
		//         toggleWalletModal={toggleModal}
		//         pendingdivactions={pendingdivactions}
		//         confirmeddivactions={confirmeddivactions}
		//         ENSName={ENSName}
		//         openOptions={openOptions}
		//       />
		//     )
		//   }

		let headerRow
		if (walletView === WALLET_VIEWS.PENDING || walletView === WALLET_VIEWS.ACCOUNT || !!account) {
			headerRow = (
				<Row className="header text-blue-500">
					<div className="hover-text" onClick={() => setWalletView(account ? WALLET_VIEWS.ACCOUNT : WALLET_VIEWS.OPTIONS)}>
						<ArrowLeftOutlined />
					</div>
				</Row>
			)
		} else {
			headerRow = (
				<Row className="header text-transparent">
					<div className="hover-text">
						<div>Connect a wallet</div>
					</div>
				</Row>
			)
		}

		function getTermsOfService(walletView: string) {
			if (walletView === WALLET_VIEWS.PENDING) return null

			const content = (
				<div>
					By connecting a wallet, you agree to Uniswap Labs’ <a href="https://uniswap.org/terms-of-service/">Terms of Service</a> and
					consent to its <a href="https://uniswap.org/privacy-policy">Privacy Policy</a>.
				</div>
			)
			return (
				<Row style={{ flexWrap: "nowrap", padding: "4px 16px" }}>
					<div className="text-base text-green-500">{content}</div>
				</Row>
			)
		}

		return (
			<div className="upper-section">
				<div className="close-icon" data-testid="wallet-modal-close" onClick={toggleModal}>
					<CloseCircleOutlined />
				</div>
				{headerRow}
				<div className="content-wrapper">
					<div className="grid gap-4 auto-rows-auto">
						{/* {walletView === WALLET_VIEWS.PENDING && pendingConnector && (
                <PendingView
                  openOptions={openOptions}
                  connector={pendingConnector}
                  error={!!pendingError}
                  tryActivation={tryActivation}
                />
              )} */}
						{walletView !== WALLET_VIEWS.PENDING && <div className="grid gap-3 grid-cols-1">{getOptions()}</div>}
						{!pendingError && getTermsOfService(walletView)}
					</div>
				</div>
			</div>
		)
	}

	return (
		<Modal open={isModalOpen} onCancel={toggleModal}>
			<Row className="modal-body-wrapper" data-testid="wallet-modal">
				{getModalContent()}
			</Row>
		</Modal>
	)
}

export default WalletModal
