import React from "react"
import { useWeb3React } from "@web3-react/core"
import { Button, Dropdown, MenuProps } from "antd"
import { CheckOutlined, DownOutlined, WarningOutlined } from "@ant-design/icons"
import clsx from "clsx"

import useSelectChain from "../../@hooks/useSelectChain"
import useToggle from "#/shared/hooks/useToggle"

import { SupportedChainId } from "#/shared/constants/chains"
import { getChainInfo } from "#/shared/constants/chainInfo"

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
	SupportedChainId.BNB,
	// SupportedChainId.POLYGON,
	// SupportedChainId.OPTIMISM,
	SupportedChainId.ARBITRUM_ONE,
	// SupportedChainId.CELO,
]

export const Chain: React.FC<Props> = () => {
	const [isPendingChain, togglePendingChain, finishedPendingChain] = useToggle()

	const { chainId } = useWeb3React()
	const selectChain = useSelectChain()

	const onSelectChain = async (item: MenuInfo) => {
		togglePendingChain()
		try {
			const targetChainId = +item.key as SupportedChainId
			await selectChain(targetChainId)
		} catch (error) {
		} finally {
			finishedPendingChain()
		}
	}

	const chainDropdown = (id: number) => {
		const info = id ? getChainInfo(id) : undefined
		const isSupported = !!info
		if (isSupported) {
			const infoChain = info
			return (
				<div className="chain-dropdown-item">
					<img src={infoChain.logoUrl} alt={infoChain.label} className="!h-5 !w-5 mr-2" />
					<div className={clsx("chain-label", chainId === id ? "!text-white" : "!text-gray-500")}>{infoChain.label}</div>
					{chainId === id && <CheckOutlined className="!text-blue-500 text-base ml-1" />}
				</div>
			)
		}

		return (
			<div className="chain-dropdown-item">
				<WarningOutlined className="!text-red-500 text-base mt-1" />
				<span className="text-red-400 mx-1 leading-5">Unsupported</span>
			</div>
		)
	}

	const chainList: MenuProps["items"] = NETWORK_SELECTOR_CHAINS.map((chain) => ({
		key: chain,
		label: chainDropdown(chain),
		disabled: !getChainInfo(chain),
	}))

	const chainDisplay = (id: number) => {
		const info = id ? getChainInfo(id) : undefined
		const isSupported = !!info
		if (isSupported) {
			const infoChain = info
			return (
				<div className="chain-display-item">
					<img src={infoChain.logoUrl} alt={infoChain.label} className="!h-5 !w-5" />
					<div className="chain-display-label">{infoChain.label}</div>
				</div>
			)
		}

		return (
			<div className="chain-display-item">
				<WarningOutlined className="!text-red-500 text-base mt-1" />
				<span className="text-red-400 mx-1 leading-5">Unsupported</span>
			</div>
		)
	}

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
					{chainDisplay(chainId)}
					<DownOutlined className="mx-1 pt-1 text-white" style={{ fontSize: "1.15em", fontWeight: "bold" }} />
				</Button>
			</Dropdown>
		)
	}

	return null
}
