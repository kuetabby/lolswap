import React from "react"
import { Select } from "antd"

import type { Web3ReactHooks } from "@web3-react/core"

import { CHAINS } from "../@utils/chain"

interface Props {
	chainId: ReturnType<Web3ReactHooks["useChainId"]>
}

const { Option } = Select

export const ChainSwap: React.FC<Props> = ({ chainId }) => {
	if (chainId) {
		const name = chainId ? CHAINS[chainId]?.name : undefined
		if (name) {
			return (
				<div>
					Chain:{" "}
					<b>
						{name} ({chainId})
					</b>
				</div>
			)
		}
		return (
			<div>
				Chain Id: <b>{chainId}</b>
			</div>
		)
	}
	return null
}

interface ChainSelectProps {
	chainId: number | undefined
	switchChain: ((desiredChainId: number) => void) | undefined
	displayDefault: boolean
	chainIds: number[]
}

export const ChainSelect: React.FC<ChainSelectProps> = ({ chainId, switchChain, displayDefault, chainIds }) => {
	if (chainId) {
		return (
			<Select
				value={chainId}
				onChange={(value) => {
					switchChain?.(value)
				}}
				disabled={switchChain === undefined}
			>
				{displayDefault ? <Option value={-1}>Default Chain</Option> : null}
				{chainIds.map((chainId) => (
					<Option key={chainId} value={chainId}>
						{CHAINS[chainId]?.name || chainId || "-"}
					</Option>
				))}
			</Select>
		)
	}
	return null
}
