import React from "react"
import { useWeb3React } from "@web3-react/core"
import { Layout } from "antd"
import clsx from "clsx"

import Navbar from "./Navbar"
import AccountWallet from "./Navbar/@components/Account"
import Web3Connect from "./Navbar/@components/Web3Connect"
import GlobalSetting from "./Navbar/@components/GlobalSetting"

import Swap from "#/features/Swap"

import "./index.css"

interface Props {}

const { Content, Footer } = Layout

const AppLayout: React.FC<Props> = () => {
	const { account } = useWeb3React()

	return (
		<Layout className="app-layout dark-navbar">
			<Navbar />
			<Content className="app-main">
				<Swap />
			</Content>
			<Footer className={clsx("app-footer")} style={{ background: "rgb(19, 24, 35)" }}>
				<GlobalSetting containerClass="flex sm:hidden" />
				{account ? <AccountWallet containerClass="flex sm:hidden" /> : <Web3Connect containerClass="flex sm:hidden" />}
			</Footer>
		</Layout>
	)
}

export default AppLayout
