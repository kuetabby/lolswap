import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"
import { NumberFormatValues, NumericFormat } from "react-number-format"
import { Button, Card, Modal } from "antd"
import { AimOutlined, ControlOutlined, DownOutlined, LeftOutlined, RightOutlined, UpOutlined } from "@ant-design/icons"
import clsx from "clsx"

import CustomToken from "../@components/CustomToken"

import useToggle from "#/shared/hooks/useToggle"

import { setSlippageAmount, setSlippageType } from "#/redux/slices/User"

import "./style.css"

interface Props {
	isOpen: boolean
	closeModal: () => void
}

const Settings: React.FC<Props> = ({ closeModal, isOpen }) => {
	const { tokens, slippageAmount, slippageType } = useAppSelector((state) => state.user)

	const [isOpenCustomToken, toggleCustomToken, closeCustomToken] = useToggle()
	const [isCollapseSlippage, toggleCollapseSlippage] = useToggle()

	const { chainId } = useWeb3React()
	const dispatch = useAppDispatch()

	const totalTokens = chainId ? Object.values(tokens[chainId] ?? []).length ?? 0 : 0
	const isSlippageButton = slippageType === "button"
	const isSlippageFrontrun = +slippageAmount > 0.63

	useEffect(() => {
		if (!slippageAmount) {
			dispatch(setSlippageType("button"))
			dispatch(setSlippageAmount("0.5"))
		}
	}, [slippageAmount])

	const onChangeSlippageAmount = (values: NumberFormatValues) => {
		slippageType === "button" && dispatch(setSlippageType("input"))
		dispatch(setSlippageAmount(values.formattedValue))
	}

	const onSetSlippageAmount = (value: React.MouseEvent<HTMLAnchorElement> & React.MouseEvent<HTMLButtonElement>) => {
		dispatch(setSlippageAmount(value.currentTarget.id))
		dispatch(setSlippageType("button"))
	}

	return (
		<>
			<Modal
				open={isOpen}
				onCancel={closeModal}
				className="search-token-modal top-20"
				width={450}
				title={
					<div className="header-settings-title-container">
						<div style={{ width: "2.5%" }}>{isOpenCustomToken && <LeftOutlined onClick={closeCustomToken} />}</div>
						<div className="text-center text-lg m-auto">{isOpenCustomToken ? "Custom tokens" : "Swap settings"}</div>
					</div>
				}
				footer={null}
			>
				{isOpenCustomToken && <CustomToken />}
				{!isOpenCustomToken && (
					<div className="header-settings-body-container">
						<div className="header-settings-wrapper" onClick={toggleCollapseSlippage} style={{ transition: "all 0.2s ease-in-out" }}>
							<div className="header-settings-left-wrapper">
								<ControlOutlined style={{ fontSize: "1.35em" }} />
							</div>
							<div className="header-settings-center-wrapper">Slippage tolerance</div>
							<div className="header-settings-right-wrapper">
								<span className={clsx("mr-3 hover:!text-black hover:dark:!text-white", isSlippageFrontrun && "text-red-400")}>
									{slippageAmount}% {!isSlippageButton && <span className="text-sm">Custom</span>}
								</span>
								{isCollapseSlippage ? <UpOutlined /> : <DownOutlined />}
							</div>
						</div>
						<div
							className={clsx("header-slippage-container", isCollapseSlippage ? "!h-8" : "!h-0 overflow-hidden")}
							style={{ transition: "all 0.2s ease-in-out" }}
						>
							<Button
								className={clsx(
									"sm:px-6 bg-blue-900 text-blue-500 opacity-90 hover:text-transparent",
									String(slippageAmount) === "0.5" && isSlippageButton && "!bg-blue-600 text-white opacity-100"
								)}
								id="0.5"
								onClick={onSetSlippageAmount}
								type="link"
							>
								Auto
							</Button>
							<div className="header-slippage-list-container">
								<Button
									className={clsx(
										"header-slippage-button",
										String(slippageAmount) === "0.1" && isSlippageButton && "!bg-blue-500 !text-white"
									)}
									onClick={onSetSlippageAmount}
									id="0.1"
									style={{ color: "#6c86ad" }}
								>
									0.1%
								</Button>
								<Button
									className={clsx(
										"header-slippage-button",
										String(slippageAmount) === "0.5" && isSlippageButton && "!bg-blue-500 !text-white"
									)}
									onClick={onSetSlippageAmount}
									id="0.5"
									style={{ color: "#6c86ad" }}
								>
									0.5%
								</Button>
								<Button
									className={clsx(
										"header-slippage-button",
										String(slippageAmount) === "1" && isSlippageButton && "!bg-blue-500 !text-white"
									)}
									onClick={onSetSlippageAmount}
									id="1"
									style={{ color: "#6c86ad" }}
								>
									1%
								</Button>
								<NumericFormat
									className={clsx("header-slippage-input", !isSlippageButton && "!border-solid !border-2 !border-blue-500")}
									value={!isSlippageButton ? slippageAmount : ""}
									onValueChange={onChangeSlippageAmount}
									decimalSeparator="."
									decimalScale={6}
									allowNegative={false}
									maxLength={6}
									placeholder="Custom"
									isAllowed={(values) => {
										const { floatValue } = values
										if (floatValue) {
											return floatValue < 50
										}
										return true
									}}
								/>
							</div>
						</div>
						{isCollapseSlippage && isSlippageFrontrun && (
							<Card className="frontrun-slippage-container" bodyStyle={{ padding: "1em" }}>
								<div className="text-black dark:text-white text-base">
									Transaction might be frontrun because of high slippage tolerance.
								</div>
							</Card>
						)}
						<div className="header-settings-wrapper" onClick={toggleCustomToken}>
							<div className="header-settings-left-wrapper">
								<AimOutlined style={{ fontSize: "1.35em" }} />
							</div>
							<div className="header-settings-center-wrapper">Custom tokens</div>
							<div className="header-settings-right-wrapper">
								<span className="mr-5">{totalTokens}</span>
								<RightOutlined />
							</div>
						</div>
					</div>
				)}
			</Modal>
		</>
	)
}

export default Settings
