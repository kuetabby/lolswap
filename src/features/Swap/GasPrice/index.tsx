import React from "react"
import { useAppSelector } from "#/redux/store"
import { Card, Tooltip } from "antd"
// import { DownOutlined } from "@ant-design/icons"

import { useGetETHPrice } from "#/shared/hooks/useGetETHPrice"

import type { Swap1inchPrice } from "#/redux/@models/Swap"

interface Props {
	data?: Swap1inchPrice
}

const GasPrice: React.FC<Props> = ({ data }) => {
	const { gasPrice } = useAppSelector((state) => state.swapTransaction.requirement)

	const gasLimit = data?.estimatedGas || 0

	const [gasCost, isFetching] = useGetETHPrice({ gasPrice, gasLimit })

	return (
		<Card
			className="w-full h-10 mt-4 flex justify-between items-center !p-0 border-none !rounded-xl"
			bodyStyle={{ padding: "1em", width: "100%" }}
			style={{ background: "#06070A", boxShadow: "inset 0 0 0 1px #202835" }}
		>
			<Tooltip placement="topLeft" title="Estimated Gas">
				<div className="w-1/3 flex">
					<img src="https://app.1inch.io/assets/images/gasless/regular-night_2-1.png" className="w-5 h-5" alt="gas-icon" />
					<div className="w-2/4 ml-1 flex items-center">
						{isFetching && <div className="w-full h-3 animate-pulse bg-slate-700 rounded" />}
						{!isFetching && (
							<span className="text-sm font-semibold" style={{ color: "#6C86AD" }}>
								$ {gasCost.toFixed(2) || 0}
							</span>
						)}
						{/* <DownOutlined style={{ marginTop: "0.25em", marginLeft: "0.5em", color: "white" }} /> */}
					</div>
				</div>
			</Tooltip>
		</Card>
	)
}

export default GasPrice
