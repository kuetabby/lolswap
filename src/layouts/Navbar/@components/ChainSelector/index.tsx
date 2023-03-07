import { useWeb3React } from "@web3-react/core"
import { DownOutlined, WarningOutlined } from "@ant-design/icons"
import { Dropdown, message, Space } from "antd"

import useSelectChain from "../../@hooks/useSelectChain"

import { getChainInfo, L1ChainInfo } from "#/shared/constants/chainInfo"
import { SupportedChainId } from "#/shared/constants/chains"
import { getItem } from "./ChainSelectorRow"

import type { MenuProps } from "antd"

// import useSyncChainQuery from 'hooks/useSyncChainQuery'

const NETWORK_SELECTOR_CHAINS = [
	SupportedChainId.MAINNET,
	// SupportedChainId.POLYGON,
	// SupportedChainId.OPTIMISM,
	// SupportedChainId.ARBITRUM_ONE,
	// SupportedChainId.CELO,
]

interface Props {}

const ChainSelector: React.FC<Props> = () => {
	const { chainId } = useWeb3React()

	const info = chainId ? getChainInfo(chainId) : undefined
	const isSupported = !!info

	const selectChain = useSelectChain()
	// useSyncChainQuery()

	const items: MenuProps["items"] = NETWORK_SELECTOR_CHAINS.map((item) => {
		return getItem(item)
	})

	const onClick: MenuProps["onClick"] = ({ key }) => {
		selectChain(Number(key))
		message.info(`Click on item ${key}`)
	}

	// const [pendingChainId, setPendingChainId] = useState<SupportedChainId | undefined>(undefined)

	// const onSelectChain = useCallback(
	//   async (targetChainId: SupportedChainId) => {
	//     // setPendingChainId(targetChainId)
	//     await selectChain(targetChainId)
	//     // setPendingChainId(undefined)
	//     // setIsOpen(false)
	//   },
	//   [selectChain, setIsOpen]
	// )

	const isChainSupported = () => {
		if ((info as L1ChainInfo).label !== undefined && isSupported) {
			const infoChain = info as L1ChainInfo
			return (
				<>
					<img src={infoChain.logoUrl} alt={infoChain.label} className="!image" />
					<span className="sm:hidden xxl:flex" style={{ lineHeight: "20px" }}>
						{infoChain.label}
					</span>
				</>
			)
		}

		return (
			<>
				<WarningOutlined size={24} />
				<span className="sm:hidden xxl:flex" style={{ lineHeight: "20px" }}>
					Unsupported
				</span>
			</>
		)
	}

	if (!chainId) {
		return null
	}

	return (
		<Dropdown menu={{ items, onClick }} className="chainSelector-container">
			<a onClick={(e) => e.preventDefault()}>
				<Space>
					Hover me, Click menu item
					<DownOutlined />
				</Space>
			</a>
			{isChainSupported()}
		</Dropdown>
	)
}

export default ChainSelector
