import { formatEther } from "@ethersproject/units"

import { useBalances } from "../@hooks/useBalances"

import type { Web3ReactHooks } from "@web3-react/core"

export function Accounts({
	accounts,
	provider,
	ENSNames,
}: {
	accounts: ReturnType<Web3ReactHooks["useAccounts"]>
	provider: ReturnType<Web3ReactHooks["useProvider"]>
	ENSNames: ReturnType<Web3ReactHooks["useENSNames"]>
}) {
	const balances = useBalances(provider, accounts)

	if (accounts === undefined) return null

	return (
		<div>
			Accounts:{" "}
			<b>
				{Boolean(accounts.length)
					? accounts?.map((account, i) => (
							<ul key={account} style={{ margin: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
								{ENSNames?.[i] ?? account}
								{balances?.[i] ? ` ($${formatEther(balances[i])})` : null}
							</ul>
					  ))
					: "None"}
			</b>
		</div>
	)
}
