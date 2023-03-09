import React from "react"
import { useAppSelector } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"
import { Button } from "antd"

import type { Swap1inchPrice } from "#/redux/@models/Swap"

interface Props {
	allowance?: string
	sellAmount: number
	data?: Swap1inchPrice
	isLoadingSwap: boolean
	isFetchingAllowance: boolean
	onSwap: () => Promise<void>
	onAllowance: () => void
}

const className = "w-full h-auto mt-3 rounded-xl text-base disabled:text-gray-400 disabled:bg-slate-500 disabled:border-none"

export const FooterSwapButton: React.FC<Props> = ({
	sellAmount,
	allowance,
	data,
	isFetchingAllowance,
	isLoadingSwap,
	onSwap,
	onAllowance,
}) => {
	const { tokenBalance } = useAppSelector((state) => state.swapTransaction.requirement)

	const { account } = useWeb3React()

	const isCurrentSellAmountEmpty = sellAmount === 0
	const isAmountExceedBalance = sellAmount > +tokenBalance

	if (allowance !== "0") {
		const swapValidation = !account || isCurrentSellAmountEmpty

		if (!data?.fromToken.address || !data?.toToken.address) {
			return (
				<Button className={className} type="primary" disabled>
					Select Token
				</Button>
			)
		}

		if (isAmountExceedBalance) {
			return (
				<Button className={className} type="primary" disabled>
					Insufficient Balance
				</Button>
			)
		}

		return (
			<Button onClick={onSwap} className={className} disabled={swapValidation} type="primary" loading={isLoadingSwap}>
				{!account ? "Connect Wallet" : "Swap"}
			</Button>
		)
	} else if (allowance === "0") {
		return (
			<Button className={className} type="primary" loading={isFetchingAllowance} onClick={onAllowance}>
				Approve
			</Button>
		)
	} else {
		return (
			<Button className={className} type="primary" loading={isFetchingAllowance}>
				???
			</Button>
		)
	}
}
