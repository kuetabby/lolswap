import React, { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { useAppDispatch, useAppSelector } from "#/redux/store"
import { Button } from "antd"
import { ArrowDownOutlined } from "@ant-design/icons"

import AppCard from "#/@app/core/AppCard"

import BuyCard from "./Buy"
import SellCard from "./Sell"
import GasPrice from "./GasPrice"
// import { CoinbaseWalletCard } from "./Connector/CoinbaseWallet"
// import { GnosisSafeCard } from "./Connector/GnosisSafe"
// import { MetaMaskCard } from "./Connector/Metamask"
// import { NetworkCard } from "./Connector/Network"
// import { WalletConnectCard } from "./Connector/WalletConnect"

import { get1inchSwap, useGet1inchTokenPrice } from "#/features/Swap/@hooks/useGetTokenPrice"
import { useAllowance } from "./@hooks/useAllowance"
import useDebounce from "#/shared/hooks/useDebounce"

import { resetGasPriceAmount, switchTrade } from "#/redux/slices/Swap"

import { WalletConnectConfig } from "../../library/ConfigWalletConnect"

interface Props {}

const Swap: React.FC<Props> = () => {
	const { from: currentSellToken, to: currentBuyToken } = useAppSelector((state) => state.swapTransaction)

	const numericCurrentDecimal = +currentSellToken.decimals
	const debounceCurrentAmount = useDebounce(currentSellToken.amount, 500)
	const calculatedCurrentAmount = +debounceCurrentAmount * 10 ** numericCurrentDecimal
	const stringifyCurrentAmount = calculatedCurrentAmount.toLocaleString().split(",").join("")

	const { account, provider } = useWeb3React()
	const dispatch = useAppDispatch()

	const signer = provider?.getSigner(account)

	useEffect(() => {
		dispatch(resetGasPriceAmount())
	}, [])

	const [dataAllowance] = useAllowance({ tokenAddress: currentSellToken.id, walletAddress: account })

	const {
		data: data1inch,
		isSuccess,
		isFetching,
	} = useGet1inchTokenPrice({
		fromToken: currentSellToken.id,
		sellAmount: stringifyCurrentAmount || "0",
		toToken: currentBuyToken.id,
	})

	// console.log(data1inch, "1inch")

	const onTrySwap = async () => {
		if (isSuccess && dataAllowance?.allowance && account) {
			try {
				const requestSwap = await get1inchSwap({
					amount: data1inch?.fromTokenAmount,
					fromAddress: account,
					fromTokenAddress: data1inch?.fromToken.address,
					gasLimit: String(data1inch?.estimatedGas),
					slippage: "1",
					toTokenAddress: data1inch?.toToken?.address,
				})
				const responseSwap = await requestSwap
				if (typeof responseSwap !== "string" && typeof responseSwap !== "undefined") {
					signer
						?.sendTransaction({
							to: responseSwap.tx.to,
							from: responseSwap.tx.from,
							value: responseSwap.tx.value,
							gasLimit: responseSwap.tx.gas,
							gasPrice: responseSwap.tx.gasPrice,
							data: responseSwap.tx.data,
						})
						.then((res) => {
							console.log(res.hash, "transaction sent")
							return res.wait()
						})
						.then((res) => {
							console.log("Transaction confirmed:", res.transactionHash)
						})
						.catch((err) => {
							console.log(err, "error")
						})
				}
			} catch (error) {}
		}
	}

	// console.log(account, "account")
	// console.log(data1inch, "data1inch")

	return (
		<WalletConnectConfig>
			<div className="flex flex-wrap justify-center w-full p-2 font-sans">
				<AppCard className="!text-white sm:w-full md:w-3/5 lg:w-2/4 xl:w-1/3 2xl:w-3/12 " style={{ background: "#131823" }}>
					<SellCard />
					<div className="relative z-10">
						<div className="text-center -my-4 mx-0">
							<div
								className="w-6 h-6 rounded-xl m-auto cursor-pointer hover:text-blue-500"
								onClick={() => dispatch(switchTrade())}
								style={{ background: "#324054" }}
							>
								<ArrowDownOutlined className="mt-1" style={{ fontSize: "1.25em" }} />
							</div>
						</div>
					</div>
					<BuyCard data={data1inch} isFetching={isFetching} />
					<GasPrice data={data1inch} />
					<Button
						onClick={onTrySwap}
						className="w-full h-auto mt-3 rounded-xl text-base disabled:text-gray-400 disabled:bg-slate-500 disabled:border-none"
						disabled={!account}
						type="primary"
					>
						{!account ? "Connect Wallet" : "Swap"}
					</Button>
				</AppCard>
				{/* <MetaMaskCard />
				<WalletConnectCard />
				<CoinbaseWalletCard />
				<NetworkCard />
				<GnosisSafeCard /> */}
			</div>
		</WalletConnectConfig>
	)
}

export default Swap
