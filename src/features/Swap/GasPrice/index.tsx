import React from "react"
import { useAppSelector } from "#/redux/store"
import { Card, Tooltip } from "antd"
// import { DownOutlined } from "@ant-design/icons"

import { useGetGasPrice } from "#/shared/hooks/useGetGasCost"
import { useGetTokenAggregator } from "../@hooks/useGetTokenPriceAggregator"

import type { Swap1inchPrice } from "#/redux/@models/Swap"

import "./style.css"
interface Props {
	data?: Swap1inchPrice
}

const GasPrice: React.FC<Props> = ({ data }) => {
	const { from: fromTrade, to: toTrade, requirement } = useAppSelector((state) => state.swapTransaction)

	const { gasPrice } = requirement
	const gasLimit = data?.estimatedGas || 0

	const [gasCost, isFetching] = useGetGasPrice({ gasPrice, gasLimit })
	const [formattedPrice] = useGetTokenAggregator()

	const text = `${"1 " + toTrade.symbol + " = " + formattedPrice ?? "-"} ${fromTrade.symbol}`

	const displayGasCost = () => {
		if (!isFetching) {
			return (
				<>
					<img
						src="https://app.1inch.io/assets/images/gasless/regular-night_2-1.png"
						className="w-4 h-4 md:w-5 md:h-5"
						alt="gas-icon"
					/>
					<div className="w-full ml-1 flex items-center">
						<span className="text-xs md:text-sm font-semibold" style={{ color: "#6C86AD" }}>
							$ {gasCost.toFixed(2)}
						</span>
						{/* <DownOutlined style={{ marginTop: "0.25em", marginLeft: "0.5em", color: "white" }} /> */}
					</div>
				</>
			)
		}

		return <div className="w-full h-3 m-auto animate-pulse bg-slate-700 rounded" />
	}

	return (
		<Card
			className="card-gas-container"
			bodyStyle={{
				padding: "0px 0.5em",
			}}
		>
			<div className="gas-container">
				{(!Boolean(formattedPrice) || !gasLimit) && <div className="w-2/3 h-3 animate-pulse bg-slate-700 rounded mr-2" />}
				{Boolean(formattedPrice) && Boolean(gasLimit) && (
					<div className="w-2/3 flex text-black dark:text-white font-semibold text-xs md:text-sm">{text}</div>
				)}
				<Tooltip placement="topLeft" title="Estimated Gas">
					<div className="w-auto flex justify-end">{displayGasCost()}</div>
				</Tooltip>
			</div>
		</Card>
	)
}

export default GasPrice
