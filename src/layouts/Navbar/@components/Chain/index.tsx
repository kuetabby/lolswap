import React from "react"
import { useWeb3React } from "@web3-react/core"
import { Button, Dropdown, MenuProps } from "antd"
import { DownOutlined, WarningOutlined } from "@ant-design/icons"

import useSelectChain from "../../@hooks/useSelectChain"
import useToggle from "#/shared/hooks/useToggle"

import { SupportedChainId } from "#/shared/constants/chains"
import { getChainInfo, L1ChainInfo } from "#/shared/constants/chainInfo"

import "./style.css"

interface Props {}
interface MenuInfo {
	key: string
	keyPath: string[]
	/** @deprecated This will not support in future. You should avoid to use this */
	item: React.ReactInstance
	domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
}

const NETWORK_SELECTOR_CHAINS = [
	SupportedChainId.MAINNET,
	// SupportedChainId.POLYGON,
	// SupportedChainId.OPTIMISM,
	SupportedChainId.ARBITRUM_ONE,
	// SupportedChainId.CELO,
]

export const Chain: React.FC<Props> = () => {
	const { chainId } = useWeb3React()

	const [isPendingChain, togglePendingChain, finishedPendingChain] = useToggle()

	const selectChain = useSelectChain()

	const onSelectChain = async (item: MenuInfo) => {
		const targetChainId = +item.key as SupportedChainId
		togglePendingChain()
		await selectChain(targetChainId)
		finishedPendingChain()
	}

	const isChainSupported = (id: number) => {
		const info = id ? getChainInfo(id) : undefined
		const isSupported = !!info
		if (isSupported) {
			const infoChain = info as L1ChainInfo
			return (
				<div className="chain-dropdown-item">
					<img src={infoChain.logoUrl} alt={infoChain.label} className="!h-5 !w-5" />
					<span className="chain-label">{infoChain.label}</span>
				</div>
			)
		}

		return (
			<div className="chain-dropdown-item">
				<WarningOutlined className="!text-red-500 text-base" />
				<span className="text-red-500 ml-2 leading-5">Unsupported</span>
			</div>
		)
	}

	const chainList: MenuProps["items"] = NETWORK_SELECTOR_CHAINS.map((chain) => ({
		key: chain,
		label: isChainSupported(chain),
		disabled: !getChainInfo(chain),
	}))

	// console.log(`Priority Connector is: ${getName(connector)}`, connector)
	if (chainId) {
		return (
			<Dropdown
				disabled={isPendingChain}
				menu={{ items: chainList, onClick: (item) => onSelectChain(item) }}
				trigger={["click"]}
				placement="bottom"
				overlayClassName="chain-dropdown-container"
			>
				<Button className="chain-container" shape="round">
					{isChainSupported(chainId)}
					<DownOutlined className="mr-1 sm:mr-0 pt-1 text-white" style={{ fontSize: "1.15em", fontWeight: "bold" }} />
				</Button>
			</Dropdown>
		)
	}

	return null
}
