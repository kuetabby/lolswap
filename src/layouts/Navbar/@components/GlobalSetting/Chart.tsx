import React from "react"
import { Card, Switch } from "antd"
import { LineChartOutlined } from "@ant-design/icons"

interface Props {}

export const ChartCard: React.FC<Props> = () => {
	return (
		<Card className="card-setting-container pointer-events-none" bodyStyle={{ padding: "0.5em 1em" }}>
			<div className="flex justify-between items-center h-8">
				<LineChartOutlined className="text-slate-400 text-xl" />
				<Switch disabled />
			</div>
			<div className="mt-1 sm:mt-4" />
			<div className="card-setting-title">Show Chart</div>
			<div className="card-setting-subtitle">COMING SOON</div>
			{/* <div className="card-setting-subtitle">Show trading chart</div> */}
		</Card>
	)
}
