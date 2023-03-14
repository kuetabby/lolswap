import React, { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Button, Spin } from "antd"
import clsx from "clsx"
import { formatEther } from "@ethersproject/units"

import { AccountInfo } from "./Info"

import useToggle from "#/shared/hooks/useToggle"

import { shortenAddress } from "#/@app/utility/Address"
import { getChainInfo } from "#/shared/constants/chainInfo"

import "./style.css"

interface Props {
	containerClass: string
}

const AccountWallet: React.FC<Props> = ({ containerClass }) => {
	const [balance, setBalance] = useState("0")

	const [isOpenAccount, toggleOpenAccount] = useToggle()
	const [isLoadingBalance, toggleLoadingBalance, finishedLoadingBalance] = useToggle()

	const { account, chainId, ENSName, provider } = useWeb3React()

	const info = chainId ? getChainInfo(chainId) : undefined
	const isSupported = !!info

	useEffect(() => {
		if (isSupported && account) {
			displayBalance(account)
		}
	}, [account, isSupported])

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

	if (!account) {
		return null
	}

	return (
		<>
			<Button className={clsx("account-container relative", containerClass)} onClick={toggleOpenAccount}>
				{isLoadingBalance && <Spin className="mt-1 mx-4" />}
				{!isLoadingBalance && <div className="font-semibold text-base text-white mr-2">{isSupported ? balance : null} ETH</div>}
				<div className="account-label">{ENSName || shortenAddress(account)}</div>
			</Button>
			{isOpenAccount && <AccountInfo isOpenAccount={isOpenAccount} toggleOpenAccount={toggleOpenAccount} />}
		</>
	)
}

export default AccountWallet
