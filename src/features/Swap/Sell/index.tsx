import React, { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"
import { Card, InputNumber, Spin } from "antd"
import { DownOutlined } from "@ant-design/icons"

import SelectToken from "../@components/SelectToken"
import { TokenImage } from "../@components/TokenImage"

import useToggle from "#/shared/hooks/useToggle"
import { useBalanceTokenBased } from "../@hooks/useBalances"

import { setSellTradeAmount, setTokenBalance } from "#/redux/slices/Swap"

import { getChainInfo } from "#/shared/constants/chainInfo"

import "./style.css"

interface Props {}

const SellCard: React.FC<Props> = () => {
	const { chainId, account } = useWeb3React()

	const currentTrade = useAppSelector((state) => state.swapTransaction.from)

	const [isSearchToken, toggleSearchToken] = useToggle()

	const info = chainId ? getChainInfo(chainId) : undefined
	const isSupported = !!info

	const [balance, isLoadingBalance] = useBalanceTokenBased(currentTrade)

	const dispatch = useAppDispatch()

	useEffect(() => {
		if (isSupported) {
			dispatch(setTokenBalance(balance))
		}
	}, [balance, isSupported])

	const onChangeTokenAmount = (e: string | null) => {
		dispatch(setSellTradeAmount(String(e || 0)))
	}

	return (
		<>
			<Card
				className="w-full h-28 mb-2 !p-0 !border-none !rounded-xl"
				bodyStyle={{ padding: "1em" }}
				style={{ background: "#06070A" }}
			>
				<div className="sell-container">
					<div className="w-full flex justify-between">
						<p className="sell-text-info">You Sell</p>
						<div className="sell-text-balance">
							{isLoadingBalance && <Spin className="mx-1" />}
							{!isLoadingBalance && (
								<div className="font-semibold text-right w-36 mr-1">Balance: {isSupported && !!account ? balance : 0}</div>
							)}
							{/* <div className="text-blue-500 cursor-pointer hover:bg-blue-400 hover:text-white px-1">MAX</div> */}
						</div>
					</div>
					<div className="sell-container-token">
						<div className="sell-wrapper-token" onClick={toggleSearchToken}>
							{!currentTrade.name && <div className="sell-select-token">Select Token</div>}
							{currentTrade.name && (
								<>
									<TokenImage src={currentTrade.logoURI || `https://tokens.1inch.io/${currentTrade.id}.png`} alt={currentTrade.id} />
									<span className="sell-name-token">{currentTrade.symbol}</span>
								</>
							)}
							<DownOutlined />
						</div>
						<InputNumber
							className="w-6/12 sell-input-amount"
							decimalSeparator="."
							maxLength={10}
							bordered={false}
							formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
							parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
							stringMode
							value={currentTrade.amount}
							onChange={onChangeTokenAmount}
						/>
					</div>
					{currentTrade.name && (
						<div className="sell-wrapper-balance">
							<p className="sell-balance-info">{currentTrade.name}</p>
							{/* <p className="sell-total-balance">~$1 602.56</p> */}
						</div>
					)}
				</div>
			</Card>
			{isSearchToken && <SelectToken isOpen={isSearchToken} closeModal={toggleSearchToken} type="Sell" />}
		</>
	)
}

export default SellCard
