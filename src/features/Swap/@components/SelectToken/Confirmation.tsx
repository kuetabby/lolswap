import React from "react"
import { Card, Modal, List, Button, Tooltip, message } from "antd"
import { CopyOutlined, LinkOutlined } from "@ant-design/icons"

import { TokenImage } from "../TokenImage"

import { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

import { shortenAddress } from "#/@app/utility/Address"

import "./style.css"

interface Props {
	isOpen: boolean
	token: TokenUniswap
	onImportToken: (token: TokenUniswap) => void
	closeConfirmModal: () => void
}

export const Confirmation: React.FC<Props> = ({ closeConfirmModal, onImportToken, isOpen, token }) => {
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

	return (
		<Modal
			open={isOpen}
			onCancel={closeConfirmModal}
			className="confirmation-token-modal top-20"
			width={475}
			title={<div className="text-black dark:text-white text-center font-bold">Import a token</div>}
			footer={null}
		>
			<Card className="confirmation-card-container" bodyStyle={{ padding: "0px" }}>
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
										<div className="flex text-black dark:text-white w-full">
											<div className="mr-4">{item.name}</div>
											<span className="bg-slate-100 dark:bg-black mb-1 p-1" style={{ fontSize: "0.75em" }}>
												{item.symbol?.toLocaleUpperCase()}
											</span>
										</div>
									}
									description={
										<div
											className="flex justify-between mt-1 text-gray-500"
											// style={{ color: "#6C86AD" }}
										>
											<div className="text-xs pb-2">
												{item.id && shortenAddress(item.id)}
												<Tooltip placement="top" title="Copy">
													<CopyOutlined
														className="ml-2 cursor-pointer hover:!text-black hover:dark:!text-white"
														onClick={() => copyContent(item.id)}
													/>
												</Tooltip>
											</div>
											<a
												className="text-xs font-semibold cursor-pointer text-gray-500 hover:!text-black hover:dark:!text-white"
												target="_blank"
												href={`https://etherscan.io/token/${item.id}`}
												// style={{ color: "#6C86AD" }}
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
			<Card className="confirmation-warning-card-container" bodyStyle={{ padding: "1em" }}>
				<div className="text-red-500 font-semibold text-lg">Trade at your own risk!</div>
				<div className="text-black dark:text-white font-semibold leading-5 mt-2" style={{ fontSize: "1em" }}>
					Anyone can create a token, including creating fake versions of existing tokens that claim to represent projects
					<div className="mt-4">If you purchase this token, you may not be able to sell it back</div>
				</div>
			</Card>
			<Button className="w-full mt-6 !rounded-xl" onClick={() => onImportToken(token)} type="primary">
				Import
			</Button>
		</Modal>
	)
}
