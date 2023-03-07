// import { useWeb3React } from "@web3-react/core"

import { getChainInfo, L1ChainInfo } from "#/shared/constants/chainInfo"
// import { SupportedChainId } from "#/shared/constants/chains"

import type { MenuProps } from "antd"

import "./style.css"

type MenuItem = Required<MenuProps>["items"][number]

export function getItem(
	// label: React.ReactNode,
	key: React.Key,
	// icon?: React.ReactNode | string,
	children?: MenuItem[],
	type?: "group"
): MenuItem {
	const chainInfo = getChainInfo(Number(key)) as L1ChainInfo
	const chainLabel = chainInfo.label ?? ""
	const logoUrl = chainInfo.logoUrl ?? ""

	return {
		key,
		icon: <img className="!w-5 !h-5 !mr-3" src={logoUrl} alt={chainLabel} />,
		children,
		label: chainLabel,
		type,
	} as MenuItem
}

// interface Props {
// 	targetChain: SupportedChainId
// 	// onSelectChain: (targetChain: number) => void
// 	// isPending: boolean
// }

// const chainSelectorRow = ({ targetChain }: Props) => {
// 	// const { chainId } = useWeb3React()

// 	// const active = chainId === targetChain

// 	// console.log(active, "active")

// return (
//     <Container onClick={() => onSelectChain(targetChain)} data-testid={`chain-selector-option-${label.toLowerCase()}`}>
//         <Logo src={logoUrl} alt={label} />
//         <Label>{label}</Label>
//         {isPending && <ApproveText>Approve in wallet</ApproveText>}
//         <Status>
//             {active && <CheckMarkIcon width={LOGO_SIZE} height={LOGO_SIZE} color={theme.accentActive} />}
//             {isPending && <Loader width={LOGO_SIZE} height={LOGO_SIZE} />}
//         </Status>
//     </Container>
// )
// return getItem(label, targetChain, <img className="logo" src={logoUrl} alt={label} />)

// }

// export default chainSelectorRow
