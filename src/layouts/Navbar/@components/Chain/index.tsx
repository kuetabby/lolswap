import React from "react"
import { useWeb3React } from "@web3-react/core"
import { Button } from "antd"
import { DownOutlined, WarningOutlined } from "@ant-design/icons"

import { getChainInfo, L1ChainInfo } from "#/shared/constants/chainInfo"

import "./style.css"

interface Props {}

export const Chain: React.FC<Props> = () => {
	const { chainId } = useWeb3React()

	const isChainSupported = () => {
		const info = chainId ? getChainInfo(chainId) : undefined
		const isSupported = !!info
		if ((info as L1ChainInfo)?.label !== undefined && isSupported) {
			const infoChain = info as L1ChainInfo
			return (
				<div className="flex w-full justify-center items-center">
					<img src={infoChain.logoUrl} alt={infoChain.label} className="!h-5 !w-5" />
					<span className="chain-label">{infoChain.label}</span>
				</div>
			)
		}

		return (
			<div className="flex items-center w-full">
				<WarningOutlined size={24} className="!text-red-500" />
				<span className="text-red-500 mx-2" style={{ lineHeight: "20px" }}>
					Unsupported
				</span>
			</div>
		)
	}

	// console.log(`Priority Connector is: ${getName(connector)}`, connector)
	if (chainId) {
		return (
			<Button className="chain-container">
				{isChainSupported()}
				<DownOutlined className="mr-1 sm:mr-0 pt-1 text-blue-500" style={{ fontSize: "1.15em", fontWeight: "bold" }} />
			</Button>
		)
	}

	return null
}
