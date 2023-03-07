import React from "react"
import { useAppSelector } from "#/redux/store"
import { Card, Spin } from "antd"
import { DownOutlined } from "@ant-design/icons"

import SelectToken from "../SelectToken"

import useToggle from "#/shared/hooks/useToggle"

import "./style.css"

import { Swap1inchPrice } from "#/redux/@models/Swap"

interface Props {
	data?: Swap1inchPrice
	isFetching: boolean
}

const BuyCard: React.FC<Props> = ({ data, isFetching }) => {
	const currentTrade = useAppSelector((state) => state.swapTransaction.to)

	const [isSearchToken, toggleSearchToken] = useToggle()

	return (
		<>
			<Card
				className="w-full h-28 mt-2 !p-0 border-none !rounded-xl"
				bodyStyle={{ padding: "1em" }}
				style={{ background: "transparent", boxShadow: "inset 0 0 0 1px #202835" }}
			>
				<div className="buy-container">
					<p className="buy-text-info">You Buy</p>
					<div className="buy-container-token">
						<div className="buy-wrapper-token" onClick={toggleSearchToken}>
							{!currentTrade.id && <div className="buy-select-token">Select Token</div>}
							{currentTrade.id && (
								<>
									<img
										src={data?.toToken.logoURI || `https://tokens.1inch.io/${currentTrade.id}.png`}
										alt={currentTrade.id}
										className="!h-6 !w-6"
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
