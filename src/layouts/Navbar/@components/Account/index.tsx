import React from "react"
import { useWeb3React } from "@web3-react/core"
import { Button } from "antd"
import { DownOutlined, UpOutlined } from "@ant-design/icons"

import { AccountInfo } from "./Info"

import useToggle from "#/shared/hooks/useToggle"

import { shortenAddress } from "#/@app/utility/Address"

import "./style.css"

interface Props {}

const AccountWallet: React.FC<Props> = () => {
	const { account, ENSName } = useWeb3React()

	const [isOpenAccount, toggleOpenAccount] = useToggle()

	if (!account) {
		return null
	}

	return (
		<>
			<Button className="account-container relative" onClick={toggleOpenAccount}>
				<div className="account-label">{ENSName || shortenAddress(account)}</div>
				{isOpenAccount ? (
					<UpOutlined className="text-blue-500 font-bold mt-1" style={{ fontSize: "1.15em" }} />
				) : (
					<DownOutlined className="text-blue-500 font-bold mt-1" style={{ fontSize: "1.15em" }} />
				)}
			</Button>
			{isOpenAccount && <AccountInfo isOpenAccount={isOpenAccount} toggleOpenAccount={toggleOpenAccount} />}
		</>
	)
}

export default AccountWallet
