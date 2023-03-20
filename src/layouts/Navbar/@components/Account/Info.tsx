import React, { useEffect, useState } from "react"
import { useAppDispatch } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"
import { Button, Modal, Spin, Tooltip } from "antd"
import { LogoutOutlined } from "@ant-design/icons"
import { formatEther } from "@ethersproject/units"

import useToggle from "#/shared/hooks/useToggle"

import { updateSelectedWallet } from "#/redux/slices/User"

import { getChainInfo } from "#/shared/constants/chainInfo"

interface Props {
	isOpenAccount: boolean
	toggleOpenAccount: () => void
}

export const AccountInfo: React.FC<Props> = ({ isOpenAccount, toggleOpenAccount }) => {
	const { account, chainId, connector, provider } = useWeb3React()

	const [isLoadingBalance, toggleLoadingBalance, finishedLoadingBalance] = useToggle()

	const [balance, setBalance] = useState("0")

	const dispatch = useAppDispatch()

	const info = chainId ? getChainInfo(chainId) : undefined
	const isSupported = !!info

	useEffect(() => {
		if (isOpenAccount && isSupported && account) {
			displayBalance(account)
		}
	}, [account, isOpenAccount, isSupported])

	const displayBalance = async (acc: string) => {
		toggleLoadingBalance()
		try {
			const request = await provider?.getBalance(acc)
			const response = request
			if (response) {
				const etherBalance = formatEther(response)
				const price = parseFloat(etherBalance).toFixed(5).toString()
				setBalance(price)
				return etherBalance
			}
			return "0"
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message)
			}
		} finally {
			finishedLoadingBalance()
		}
	}

	const onDisconnect = () => {
		if (connector && connector?.deactivate) {
			void connector.deactivate()
		} else {
			void connector.resetState()
		}
		dispatch(updateSelectedWallet({ wallet: undefined }))
		toggleOpenAccount()
	}

	return (
		<Modal
			open={isOpenAccount}
			className="account-modal"
			width={325}
			closable={false}
			footer={null}
			maskStyle={{
				background: "none",
				boxShadow: "none",
			}}
			onCancel={toggleOpenAccount}
			title={
				<div className="flex justify-end items-center">
					<Tooltip placement="bottom" title="Disconnect" color="blue">
						<Button size="small" className="px-2 bg-slate-500 border-none hover:bg-blue-500" onClick={onDisconnect}>
							<LogoutOutlined className="text-white text-lg" />
						</Button>
					</Tooltip>
				</div>
			}
		>
			<div className="flex flex-col justify-center items-center">
				<div className="font-medium text-sm text-gray-400">{isSupported ? `${info.nativeCurrency.symbol} Balance` : "-"}</div>
				{isLoadingBalance && <Spin className="mt-4" />}
				{!isLoadingBalance && (
					<div className="font-semibold text-3xl text-white">{isSupported ? `${balance} ${info.nativeCurrency.symbol}` : "-"}</div>
				)}
			</div>
		</Modal>
	)
}
