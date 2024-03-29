import React from "react"
import { useWeb3React } from "@web3-react/core"
import { Layout } from "antd"
import clsx from "clsx"

import AccountWallet from "./@components/Account"
import { Chain } from "./@components/Chain"
import GlobalSetting from "./@components/GlobalSetting"
import Web3Connect from "./@components/Web3Connect"

// import { useCheckNetwork } from "#/shared/hooks/useCheckNetwork"

import pegasusLogoUrl from "#/assets/logo-pegasus.png"

import "./style.css"

const { Header } = Layout

interface Props {}

const Navbar: React.FC<Props> = () => {
	const { account, isActive } = useWeb3React()
	// const navigate = useNavigate()
	// const isNftPage = useIsNftPage()

	// const sellPageState = useProfilePageState((state) => state.state)
	// const isNftListV2 = u	seNftListV2Flag() === NftListV2Variant.Enabled
	// useCheckNetwork()

	return (
		<Header className="!px-0 !h-20 !bg-white dark:!bg-dark-secondary">
			<nav className="base-nav-container md:!px-4">
				<div className={clsx("base-side-container", "left-side-container")}>
					<div className="logo-container text-white">
						<img src={pegasusLogoUrl} alt="pegasus-logo" className="w-12 h-12" />
					</div>
					{/* <PageTabs /> */}
				</div>
				{/* <SearchTabs /> */}
				<div className={clsx("base-side-container", "right-side-container")}>
					<div className="w-full flex justify-end lg:p-4">
						{/* <div className="flex xl:hidden relative">
							<SearchTabs />
						</div> */}
						{isActive && (
							<>
								<Chain />
								{account ? <AccountWallet containerClass="hidden sm:flex" /> : <Web3Connect containerClass="hidden sm:flex" />}
								<GlobalSetting containerClass="hidden sm:flex" />
							</>
						)}
						{!isActive && (
							<div className="w-4/5 sm:w-2/5 mr-2 sm:mr-0">
								<div className="w-full h-3 m-auto animate-pulse bg-slate-700 rounded" />
							</div>
						)}
					</div>
				</div>
			</nav>
		</Header>
	)
}

export default Navbar
