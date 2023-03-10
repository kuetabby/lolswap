import React from "react"
import { useAppSelector } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"
import { Button } from "antd"

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
	const { requirement, from: fromToken, to: toToken } = useAppSelector((state) => state.swapTransaction)

	const { tokenBalance } = requirement
	const { id: fromId, amount: fromAmount } = fromToken
	const { id: toId } = toToken

	const { account } = useWeb3React()

	const isCurrentSellAmountEmpty = sellAmount === 0
	const isAmountExceedBalance = sellAmount > +tokenBalance

	if (allowance !== "0") {
		if (account) {
			if (!fromId || !toId) {
				return (
					<Button className={className} type="primary" disabled>
						Select Token
					</Button>
				)
			} else if (isAmountExceedBalance || !Boolean(+fromAmount)) {
				return (
					<Button className={className} type="primary" disabled>
						{!Boolean(+fromAmount) && "Input Amount of Token"}
						{isAmountExceedBalance && "Insufficient Balance"}
					</Button>
				)
			} else {
				return (
					<Button onClick={onSwap} className={className} disabled={isCurrentSellAmountEmpty} type="primary" loading={isLoadingSwap}>
						Swap
					</Button>
				)
			}
		}

		return (
			<Button disabled className={className} type="primary" loading={isLoadingSwap}>
				Connect Wallet
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
				Condition isn't match
			</Button>
		)
	}
}
