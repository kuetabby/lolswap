import React, { useMemo, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "#/redux/store"
import { sendAnalyticsEvent, TraceEvent } from "@uniswap/analytics"
import { BrowserEvent, InterfaceElementName, InterfaceEventName } from "@uniswap/analytics-events"
import { useWeb3React } from "@web3-react/core"
import { Button, Row } from "antd"
import clsx from "clsx"
import { DownOutlined, LoadingOutlined, RiseOutlined, UpOutlined, WifiOutlined } from "@ant-design/icons"

import { useAllTransactions } from "#/shared/hooks/useAllTransactions"
import { isTransactionRecent, newTransactionsFirst } from "#/@app/utility/Transaction"

import { getConnection } from "#/@app/utility/Connection/utils"
// import { getIsValidSwapQuote } from '#/@app/utility/Swap'
import { shortenAddress } from "#/@app/utility/Address"
import { setToggleModal } from "#/redux/slices/Application"

interface Props {}

const CHEVRON_PROPS = {
	height: 20,
	width: 20,
}

export const Web3StatusInner: React.FC<Props> = () => {
	const { account, connector, chainId, ENSName } = useWeb3React()
	const connectionType = getConnection(connector).type

	const { openModal: isWalletOpen } = useAppSelector((state) => state.application)
	const error = useAppSelector((state) => state.connection.errorByConnectionType[connectionType])

	const allTransactions = useAllTransactions()

	const dispatch = useAppDispatch()

	const toggleWallet = () => {
		dispatch(setToggleModal())
	}

	// const {
	//   trade: { state: tradeState, trade },
	//   inputError: swapInputError,
	// } = useDerivedSwapInfo()
	// const validSwapQuote = getIsValidSwapQuote(trade, tradeState, swapInputError)
	const handleWalletDropdownClick = useCallback(() => {
		sendAnalyticsEvent(InterfaceEventName.ACCOUNT_DROPDOWN_BUTTON_CLICKED)
		toggleWallet()
	}, [])

	// const isClaimAvailable = useIsNftClaimAvailable((state) => state.isClaimAvailable)

	const sortedRecentTransactions = useMemo(() => {
		const txs = Object.values(allTransactions)
		return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
	}, [allTransactions])

	const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)

	const hasPendingTransactions = !!pending.length

	if (chainId) {
		if (account) {
			const chevronProps = {
				...CHEVRON_PROPS,
				color: "blue",
			}

			return (
				<div
					className={clsx("status-connected")}
					//   data-testid="web3-status-connected"
					onClick={handleWalletDropdownClick}
					//   pending={hasPendingTransactions}
					//   isClaimAvailable={isClaimAvailable}
				>
					{!hasPendingTransactions && (
						<>
							<RiseOutlined />
							{connectionType}
						</>
					)}
					{hasPendingTransactions ? (
						<Row justify="space-between">
							<p className="text">{pending?.length} Pending</p> <LoadingOutlined />
						</Row>
					) : (
						<div className="hidden lg:flex">
							<p className="text">{ENSName || shortenAddress(account)}</p>
							{isWalletOpen ? <UpOutlined {...chevronProps} /> : <DownOutlined {...chevronProps} />}
						</div>
					)}
				</div>
			)
		}

		if (error) {
			return (
				<Button className={clsx("status-generic", "status-error")} onClick={handleWalletDropdownClick}>
					<WifiOutlined />
					<p className="text">Error</p>
				</Button>
			)
		}

		const chevronProps = {
			...CHEVRON_PROPS,
			color: "blue",
			"data-testid": "navbar-wallet-dropdown",
		}
		return (
			<TraceEvent
				events={[BrowserEvent.onClick]}
				name={InterfaceEventName.CONNECT_WALLET_BUTTON_CLICKED}
				//   properties={{ received_swap_quote: validSwapQuote }}
				element={InterfaceElementName.CONNECT_WALLET_BUTTON}
			>
				<div
					className="status-connect-wrapper"
					//   faded={!account}
				>
					<Button className="button-connect" data-testid="navbar-connect-wallet" onClick={toggleWallet}>
						Connect
					</Button>
					<div className="vertical-divider" />
					<Button className="chevron-wrapper" onClick={handleWalletDropdownClick} data-testid="navbar-toggle-dropdown">
						{isWalletOpen ? <UpOutlined {...chevronProps} /> : <DownOutlined {...chevronProps} />}
					</Button>
				</div>
			</TraceEvent>
		)
	}

	return null
}
