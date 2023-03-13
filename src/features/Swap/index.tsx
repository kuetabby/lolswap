import React, { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { useAppDispatch, useAppSelector } from "#/redux/store"
import { ArrowDownOutlined } from "@ant-design/icons"

import AppCard from "#/@app/core/AppCard"

import BuyCard from "./Buy"
import SellCard from "./Sell"
import GasPrice from "./GasPrice"
import HeaderSwapButton from "./Header"
import { FooterSwapButton } from "./Footer"

import { get1inchSwap, useGet1inchTokenPrice } from "#/features/Swap/@hooks/useGetTokenPrice"
import { useAllowance, useSpenderAllowance, usePermitAllowance } from "./@hooks/useAllowance"
import useDebounce from "#/shared/hooks/useDebounce"
import useToggle from "#/shared/hooks/useToggle"

import { resetGasPriceAmount, switchTrade } from "#/redux/slices/Swap"

import { WalletConnectConfig } from "../../library/ConfigWalletConnect"

interface Props {}

const Swap: React.FC<Props> = () => {
	const { from: currentSellToken, to: currentBuyToken } = useAppSelector((state) => state.swapTransaction)
	const { slippageAmount } = useAppSelector((state) => state.user)

	const numericCurrentDecimal = +currentSellToken.decimals
	const currentSellAmount = +currentSellToken.amount
	const debounceCurrentAmount = useDebounce(currentSellAmount, 500)
	const calculatedCurrentAmount = debounceCurrentAmount * 10 ** numericCurrentDecimal
	const stringifyCurrentAmount = calculatedCurrentAmount.toLocaleString().split(",").join("")

	const { account, provider } = useWeb3React()
	const dispatch = useAppDispatch()

	const signer = provider?.getSigner(account)

	useEffect(() => {
		dispatch(resetGasPriceAmount())
	}, [])

	const {
		data: data1inch,
		error: errorPrice,
		refetch: refetchPrice,
		isSuccess: isSuccessPrice,
		isFetching: isFetchingPrice,
		isError: isErrorPrice,
	} = useGet1inchTokenPrice({
		fromToken: currentSellToken.id,
		sellAmount: stringifyCurrentAmount || "0",
		toToken: currentBuyToken.id,
	})
	const {
		data: dataAllowance,
		isFetching: isFetchingAllowance,
		refetch: refetchAllowance,
	} = useAllowance({
		tokenAddress: currentSellToken.id,
		walletAddress: account,
	})
	const { data: dataSpender, isSuccess: isSuccessGetSpender } = useSpenderAllowance()
	const [tokenAllowance] = usePermitAllowance()

	const [isLoadingSwap, toggleLoadingSwap, finishedLoadingSwap] = useToggle()

	const onSwap = async () => {
		if (isSuccessPrice && dataAllowance?.allowance && account) {
			toggleLoadingSwap()
			try {
				const requestSwap = await get1inchSwap({
					amount: data1inch?.fromTokenAmount,
					fromAddress: account,
					fromTokenAddress: data1inch?.fromToken.address,
					gasLimit: String(data1inch?.estimatedGas),
					slippage: slippageAmount,
					toTokenAddress: data1inch?.toToken?.address,
				})
				const responseSwap = await requestSwap
				if (typeof responseSwap === "string" || typeof responseSwap === "undefined") {
					return
				}
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
						//message popup info sent
						console.log(res.hash, "transaction sent")
						return res.wait()
					})
					.then((res) => {
						//message popup success confirmed
						console.log("Transaction confirmed:", res.transactionHash)
					})
					.catch((err) => {
						//message popup error error.response
						console.log(err, "error")
					})
					.finally(() => {
						finishedLoadingSwap()
					})
			} catch (error) {
				finishedLoadingSwap()
			}
		}
	}

	const onTryAllowance = () => {
		if (isSuccessGetSpender && isSuccessPrice && account) {
			tokenAllowance(data1inch?.fromToken.address, data1inch?.fromTokenAmount, dataSpender.address).then((res) => {
				if (res.type === "success") {
					//message popup success
					refetchAllowance()
				}
			})
		}
	}

	return (
		<WalletConnectConfig>
			<div className="flex flex-wrap justify-center w-full p-2 font-sans">
				<AppCard className="!text-white sm:w-full md:w-2/4 lg:w-2/5 xl:w-1/3" style={{ background: "#131823" }}>
					<HeaderSwapButton isSuccessPrice={isSuccessPrice} isFetchingPrice={isFetchingPrice} refetchPrice={refetchPrice} />
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
					<BuyCard data={data1inch} isFetching={isFetchingPrice} />
					<GasPrice data={data1inch} />
					<FooterSwapButton
						isFetchingAllowance={isFetchingAllowance}
						isFetchingPrice={isFetchingPrice}
						isLoadingSwap={isLoadingSwap}
						isErrorPrice={isErrorPrice}
						sellAmount={currentSellAmount}
						allowance={dataAllowance?.allowance}
						errorPrice={errorPrice}
						onSwap={onSwap}
						onAllowance={onTryAllowance}
					/>
				</AppCard>
			</div>
		</WalletConnectConfig>
	)
}

export default Swap
