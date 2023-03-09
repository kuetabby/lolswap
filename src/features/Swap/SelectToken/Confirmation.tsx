import React from "react"
import { useAppDispatch, useAppSelector } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"
import { Card, Modal, List, Button, Tooltip, message } from "antd"
import { CopyOutlined, LinkOutlined } from "@ant-design/icons"

import { TokenImage } from "../@components/TokenImage"

import { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

import { shortenAddress } from "#/@app/utility/Address"

import { fromTrade, switchFromTrade, switchToTrade, toTrade } from "#/redux/slices/Swap"
import { addSerializedToken } from "#/redux/slices/User"

import "./style.css"

interface Props {
	isOpen: boolean
	token: TokenUniswap
	type: "Sell" | "Buy"
	closeConfirmModal: () => void
	closeModal: () => void
}

export const Confirmation: React.FC<Props> = ({ closeModal, closeConfirmModal, type, isOpen, token }) => {
	const { from: currentTrade, to: destinationTrade } = useAppSelector((state) => state.swapTransaction)

	const { chainId } = useWeb3React()
	const dispatch = useAppDispatch()

	const copyContent = async (address: string) => {
		try {
			await navigator.clipboard.writeText(address)
			message.success("Copied!")
			/* Resolved - text copied to clipboard successfully */
		} catch (err) {
			console.error("Failed to copy: ", err)
			/* Rejected - text failed to copy to the clipboard */
		}
	}

	const onImportToken = () => {
		const trade = { ...token, amount: "0" }
		chainId && dispatch(addSerializedToken({ serializedToken: { ...trade, chainId } }))
		if (type === "Buy") {
			if (currentTrade.id === token.id) {
				dispatch(switchToTrade(trade))
				closeModal()
			} else {
				dispatch(toTrade(trade))
				closeModal()
			}
		} else {
			if (destinationTrade.id === token.id) {
				dispatch(switchFromTrade(trade))
				closeModal()
			} else {
				dispatch(fromTrade(trade))
				closeModal()
			}
		}
	}

	return (
		<Modal
			open={isOpen}
			onCancel={closeConfirmModal}
			className="confirmation-token-modal top-20"
			width={475}
			title={<div className="text-white text-center font-bold">Import a token</div>}
			footer={null}
		>
			<Card
				className="w-full h-full mt-4 mb-2 !p-0 border-white !rounded-xl"
				bodyStyle={{ padding: "0px" }}
				style={{ background: "#131823" }}
			>
				<List
					dataSource={[token]}
					className="custom-list-container"
					style={{ maxHeight: "350px", overflow: "auto" }}
					renderItem={(item: TokenUniswap, i) => {
						return (
							<List.Item className="!py-2 !px-4">
								<List.Item.Meta
									className="!items-baseline h-full"
									avatar={
										<TokenImage
											src={item.logoURI || `https://tokens.1inch.io/${item.id}.png`}
											alt={item.name ?? `undefined alt-${i}`}
										/>
									}
									title={
										<div className="flex text-white w-full">
											<div className="mr-4">{item.name}</div>
											<span className="bg-black mb-1 p-1" style={{ fontSize: "0.75em" }}>
												{item.symbol?.toLocaleUpperCase()}
											</span>
										</div>
									}
									description={
										<div className="flex justify-between mt-1" style={{ color: "#6C86AD" }}>
											<div className="text-xs pb-2">
												{item.id && shortenAddress(item.id)}
												<Tooltip placement="top" title="Copy">
													<CopyOutlined className="ml-2 cursor-pointer hover:!text-white" onClick={() => copyContent(item.id)} />
												</Tooltip>
											</div>
											<a
												className="text-xs font-semibold cursor-pointer hover:!text-white"
												target="_blank"
												href={`https://etherscan.io/token/${item.id}`}
												style={{ color: "#6C86AD" }}
											>
												Etherscan
												<LinkOutlined className="ml-2" />
											</a>
										</div>
									}
								/>
							</List.Item>
						)
					}}
				/>
			</Card>
			<Card
				className="w-full h-40 mt-2 opacity-75 !p-0 border-none !rounded-xl"
				bodyStyle={{ padding: "1em", color: "white" }}
				style={{ boxShadow: "inset 0 0 0 1px #202835", background: "rgba(193, 61, 84, .16)" }}
			>
				<div className="text-red-400 font-semibold text-lg">Trade at your own risk!</div>
				<div className="text-white font-semibold leading-5 mt-2" style={{ fontSize: "1em" }}>
					Anyone can create a token, including creating fake versions of existing tokens that claim to represent projects
					<div className="mt-4">If you purchase this token, you may not be able to sell it back</div>
				</div>
			</Card>
			<Button className="w-full mt-6 !rounded-xl" onClick={onImportToken} type="primary">
				Import
			</Button>
		</Modal>
	)
}
