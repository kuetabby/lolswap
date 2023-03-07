import { useMemo, useRef } from "react"
import { useWeb3React } from "@web3-react/core"
// import { useAppDispatch, useAppSelector } from '#/redux/store'

import { Web3StatusInner } from "./StatusInner"
import WalletModal from "../Wallet"

import { useAllTransactions } from "#/shared/hooks/useAllTransactions"
import { isTransactionRecent } from "#/@app/utility/Transaction"
import { TransactionDetails } from "#/redux/@models/Transaction"

// import { FiatOnrampAnnouncement } from 'components/FiatOnrampAnnouncement'
// import WalletDropdown from 'components/WalletDropdown'
// import { Portal } from 'nft/components/common/Portal'

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
	return b.addedTime - a.addedTime
}

export default function Web3Status() {
	const { ENSName } = useWeb3React()

	const allTransactions = useAllTransactions()
	const ref = useRef<HTMLDivElement>(null)
	//   const walletRef = useRef<HTMLDivElement>(null)

	const sortedRecentTransactions = useMemo(() => {
		const txs = Object.values(allTransactions)
		return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
	}, [allTransactions])

	const pending = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
	const confirmed = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

	return (
		<span ref={ref}>
			<Web3StatusInner />
			{/* <FiatOnrampAnnouncement /> */}
			<WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
			{/* <Portal>
        <span ref={walletRef}>
          <WalletDropdown />
        </span>
      </Portal> */}
		</span>
	)
}
