import React, { useMemo } from "react"
import { Modal, Card } from "antd"
import { Connector } from "@web3-react/types"

import AppCard from "#/@app/core/AppCard"

import { coinbaseWalletConnection } from "#/features/Swap/@utils/connectors/coinbaseWallet"
import { metaMaskConnection } from "#/features/Swap/@utils/connectors/metaMask"
import { walletConnectConnection } from "#/features/Swap/@utils/connectors/walletConnect"

import METAMASK_ICON_URL from "#/assets/metamask.png"
import COINBASE_ICON_URL from "#/assets/coinbaseWalletIcon.svg"
import WALLET_CONNECT_ICON_URL from "#/assets/walletConnectIcon.svg"
import BROWSER_WALLET_ICON_URL from "#/assets/arrow-right.svg"

import { getIsMetaMaskWallet } from "#/@app/utility/Connection/utils"

interface Props {
	isOpenModal: boolean
	isPending: boolean
	onCloseModal: () => void
	tryActivation: (connector: Connector) => Promise<void>
}

const { Meta } = Card

export const SelectWallet: React.FC<Props> = ({ isOpenModal, isPending, onCloseModal, tryActivation }) => {
	const hasMetaMaskExtension = getIsMetaMaskWallet()

	const metaMaskWallet = hasMetaMaskExtension
		? {
				connector: metaMaskConnection.connector,
				title: "MetaMask",
				imageUrl: METAMASK_ICON_URL,
		  }
		: {
				connector: metaMaskConnection.connector,
				title: "Browser Wallet",
				imageUrl: BROWSER_WALLET_ICON_URL,
		  }

	const walletList = useMemo(
		() => [
			{
				connector: coinbaseWalletConnection.connector,
				title: "Coinbase Wallet",
				imageUrl: COINBASE_ICON_URL,
			},
			{
				connector: walletConnectConnection.connector,
				title: "WalletConnect",
				imageUrl: WALLET_CONNECT_ICON_URL,
			},
		],
		[hasMetaMaskExtension]
	)

	const displayWallet = () => {
		return walletList.map((item) => {
			return (
				<AppCard
					key={item.title}
					bordered
					className="bg-gray-100 !my-3 h-14 !rounded-xl !shadow-none hover:cursor-pointer hover:bg-gray-50"
					onClick={() => {
						tryActivation(item.connector)
					}}
				>
					<Meta
						avatar={<img src={item.imageUrl} className="w-7 h-7" />}
						description={<div className="font-bold text-black text-base mt-1">{item.title}</div>}
					/>
				</AppCard>
			)
		})
	}

	return (
		<Modal
			open={isOpenModal}
			onCancel={onCloseModal}
			title={<div className="font-bold text-base">Connect a wallet</div>}
			width={450}
			footer={null}
		>
			{isPending && (
				<div className="flex items-center justify-center h-32">
					<div
						className="inline-block h-8 w-8 text-blue-500 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
						role="status"
					>
						<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
							Loading...
						</span>
					</div>
				</div>
			)}
			{!isPending && (
				<>
					<AppCard
						key={metaMaskWallet.title}
						bordered
						className="bg-gray-100 !my-3 h-14 !rounded-xl !shadow-none hover:cursor-pointer hover:bg-gray-50"
						onClick={() => {
							tryActivation(metaMaskWallet.connector)
						}}
					>
						<Meta
							avatar={<img src={metaMaskWallet.imageUrl} className="w-7 h-7" />}
							description={<div className="font-bold text-black text-base mt-1">{metaMaskWallet.title}</div>}
						/>
					</AppCard>
					{displayWallet()}
					<div className="text-gray-400 text-base font-medium">
						By connecting a wallet, you agree to Lolswap Labs’ <a href="https://uniswap.org/terms-of-service/">Terms of Service</a> and
						consent to its <a href="https://uniswap.org/privacy-policy">Privacy Policy</a>.
					</div>
				</>
			)}
		</Modal>
	)
}
