import React from "react"
import { useWeb3React } from "@web3-react/core"
import { Button } from "antd"
import { useAppSelector } from "#/redux/store"

interface Props {
	allowance?: string
	sellAmount: number
	isLoadingSwap: boolean
	isFetchingAllowance: boolean
	onSwap: () => Promise<void>
	onAllowance: () => void
}

const className = "w-full h-auto mt-3 rounded-xl text-base disabled:text-gray-400 disabled:bg-slate-500 disabled:border-none"

export const FooterSwapButton: React.FC<Props> = ({
	sellAmount,
	allowance,
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

		if (!isAmountExceedBalance) {
			return (
				<Button onClick={onSwap} className={className} disabled={swapValidation} type="primary" loading={isLoadingSwap}>
					{!account ? "Connect Wallet" : "Swap"}
				</Button>
			)
		}

		return (
			<Button className={className} type="primary" disabled>
				Insufficient Balance
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
