import React from "react"
import { useWeb3React } from "@web3-react/core"
import { useAppSelector } from "#/redux/store"
import { Card, Spin } from "antd"
import { DownOutlined } from "@ant-design/icons"

import SelectToken from "../@components/SelectToken"
import { TokenImage } from "../@components/TokenImage"

import useToggle from "#/shared/hooks/useToggle"
import { useBalanceTokenBased } from "../@hooks/useBalances"

import { getChainInfo } from "#/shared/constants/chainInfo"

import { Swap1inchPrice } from "#/redux/@models/Swap"

import "./style.css"

interface Props {
	data?: Swap1inchPrice
	isFetching: boolean
}

const BuyCard: React.FC<Props> = ({ data, isFetching }) => {
	const { chainId } = useWeb3React()

	const currentTrade = useAppSelector((state) => state.swapTransaction.to)

	const info = chainId ? getChainInfo(chainId) : undefined
	const isSupported = !!info

	const [isSearchToken, toggleSearchToken] = useToggle()

	const [balance, isLoadingBalance] = useBalanceTokenBased(currentTrade, isSupported)

	return (
		<>
			<Card
				className="w-full h-28 mt-2 !p-0 border-none !rounded-xl"
				bodyStyle={{ padding: "1em" }}
				style={{ background: "transparent", boxShadow: "inset 0 0 0 1px #202835" }}
			>
				<div className="buy-container">
					<div className="w-full flex justify-between">
						<p className="buy-text-info">You Buy</p>
						<div className="flex justify-between h-4" style={{ minWidth: "22.5%", maxWidth: "33.33%" }}>
							{isLoadingBalance && <Spin className="mx-1" />}
							{!isLoadingBalance && <div className="font-semibold text-right w-36 mr-1">Balance: {isSupported ? balance : 0}</div>}
							{/* <div className="text-blue-500 cursor-pointer hover:bg-blue-400 hover:text-white px-1">MAX</div> */}
						</div>
					</div>
					<div className="buy-container-token">
						<div className="buy-wrapper-token" onClick={toggleSearchToken}>
							{!currentTrade.id && <div className="buy-select-token">Select Token</div>}
							{currentTrade.id && (
								<>
									<TokenImage
										src={data?.toToken.logoURI || currentTrade.logoURI || `https://tokens.1inch.io/${currentTrade.id}.png`}
										alt={currentTrade.id}
									/>
									<span className="buy-name-token">{currentTrade.symbol}</span>
								</>
							)}
							<DownOutlined />
						</div>
						<div className="w-1/2 flex items-center">
							{data?.toToken.address && !isFetching && (
								<div className="w-full text-sm text-right text-white font-semibold">
									{Number(currentTrade.amount).toLocaleString()}
								</div>
							)}
							{isFetching && (
								<div className="w-full flex items-end justify-end">
									<Spin className="mr-4" />
								</div>
							)}
						</div>
					</div>
					{currentTrade.id && (
						<div className="buy-wrapper-balance">
							<p className="buy-balance-info">{currentTrade.name || "-"}</p>
							{/* <p className="buy-total-balance">~$1 602.56</p> */}
						</div>
					)}
				</div>
			</Card>
			{isSearchToken && <SelectToken isOpen={isSearchToken} closeModal={toggleSearchToken} type="Buy" />}
		</>
	)
}

export default BuyCard
