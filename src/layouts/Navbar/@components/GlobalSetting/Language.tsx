import React from "react"
import { Card } from "antd"
import { RightOutlined } from "@ant-design/icons"

import USFlag from "#/assets/en-US.webp"

interface Props {}

export const LanguageCard: React.FC<Props> = () => {
	return (
		<Card className="card-setting-container pointer-events-none" bodyStyle={{ padding: "0.5em 1em" }}>
			<div className="flex justify-between items-center h-8">
				<img src={USFlag} alt="theme-mode" className="w-8 h-8 bg-transparent" />
				<RightOutlined className="text-slate-400 text-sm" />
			</div>
			<div className="mt-1 sm:mt-4" />
			<div className="card-setting-title">English</div>
			<div className="card-setting-subtitle">COMING SOON</div>
			{/* <div className="card-setting-subtitle">Choose Language</div> */}
		</Card>
	)
}
