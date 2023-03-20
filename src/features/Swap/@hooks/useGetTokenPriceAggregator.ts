import { useEffect, useState } from "react"
import { useAppSelector } from "#/redux/store"
import { useWeb3React } from "@web3-react/core"
import { BigNumber, ethers } from "ethers"

import { priceToPreciseFloat, formatTransactionAmount } from "../@utils"
import { SupportedChainId } from "#/shared/constants/chains"

const offChainOracleAddress = {
	[SupportedChainId.MAINNET]: "0x07D91f5fb9Bf7798734C3f606dB065549F6893bb",
	[SupportedChainId.ARBITRUM_ONE]: "0x735247fb0a604c0adC6cab38ACE16D0DbA31295F",
	[SupportedChainId.BNB]: "0xfbD61B037C325b959c0F6A7e69D8f37770C2c550",
}

const nativeCurrencySymbol = {
	[SupportedChainId.MAINNET]: ["ETH", "WETH"],
	[SupportedChainId.ARBITRUM_ONE]: ["ETH", "WETH"],
	[SupportedChainId.BNB]: ["BNB", "WBNB"],
}

export const useGetTokenAggregator = () => {
	const { from: fromTrade, to: toTrade } = useAppSelector((state) => state.swapTransaction)

	const [trxRate, setTrxRate] = useState("")

	const { provider, chainId } = useWeb3React()

	const isNative = chainId && nativeCurrencySymbol[chainId as keyof typeof nativeCurrencySymbol]

	const isFromNative =
		!!isNative && nativeCurrencySymbol[chainId as keyof typeof nativeCurrencySymbol]?.includes(fromTrade?.symbol ?? "")
	const isToNative = !!isNative && nativeCurrencySymbol[chainId as keyof typeof nativeCurrencySymbol]?.includes(toTrade?.symbol ?? "")

	const isNativeToNative = isFromNative && isToNative
	const isEthers = isFromNative || isToNative

	useEffect(() => {
		if (chainId) {
			findBestRate()
		}
	}, [chainId, fromTrade.id, toTrade.id])

	const findBestRate = () => {
		if (fromTrade.id && toTrade.id) {
			if (isNativeToNative) {
				setTrxRate("1")
			} else if (isEthers) {
				const address = isToNative ? fromTrade?.id : toTrade.id
				const decimals = isToNative ? fromTrade?.decimals : toTrade.decimals
				calculateEthRate(isToNative, address, decimals)
			} else {
				calculateERC20Rate()
			}
		}
	}

	const calculateEthRate = async (isRevert: boolean, address: string, decimals: string) => {
		setTrxRate("")
		const contract = new ethers.Contract(
			offChainOracleAddress[chainId as keyof typeof offChainOracleAddress],
			JSON.parse(OffChainOracleAbi),
			provider
		)
		const contractRate = await contract.getRateToEth(address, true)
		const numerator = BigNumber.from(10).pow(+decimals)
		const denominator = BigNumber.from(10).pow(18)
		const price = BigNumber.from(contractRate).mul(numerator).div(denominator)
		const rate = +price / 10 ** 18
		const preciseFloat = priceToPreciseFloat(+rate)

		if (isRevert) {
			const preciseRevert = (1 / Number(preciseFloat)).toLocaleString("en-US")
			setTrxRate(preciseRevert)
			return preciseRevert
		}
		setTrxRate(formatTransactionAmount(Number(preciseFloat)).substring(0, 9))
		// setTrxRate(Number(preciseFloat).toFixed(+decimals / 2))
		return preciseFloat
	}

	const calculateERC20Rate = async () => {
		setTrxRate("")
		const contract = new ethers.Contract(
			offChainOracleAddress[chainId as keyof typeof offChainOracleAddress],
			JSON.parse(OffChainOracleAbi),
			provider
		)
		const contractRate = await contract.getRate(toTrade.id, fromTrade.id, true)
		const rate = BigNumber.from(contractRate)
		const result = +rate / 10 ** +fromTrade.decimals
		setTrxRate(formatTransactionAmount(result).substring(0, 9))
		return result
	}

	return [trxRate]
}

// eslint-disable-next-line max-len
const OffChainOracleAbi =
	'[{"inputs":[{"internalType":"contract MultiWrapper","name":"_multiWrapper","type":"address"},{"internalType":"contract IOracle[]","name":"existingOracles","type":"address[]"},{"internalType":"enum OffchainOracle.OracleType[]","name":"oracleTypes","type":"uint8[]"},{"internalType":"contract IERC20[]","name":"existingConnectors","type":"address[]"},{"internalType":"contract IERC20","name":"wBase","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IERC20","name":"connector","type":"address"}],"name":"ConnectorAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IERC20","name":"connector","type":"address"}],"name":"ConnectorRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract MultiWrapper","name":"multiWrapper","type":"address"}],"name":"MultiWrapperUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IOracle","name":"oracle","type":"address"},{"indexed":false,"internalType":"enum OffchainOracle.OracleType","name":"oracleType","type":"uint8"}],"name":"OracleAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IOracle","name":"oracle","type":"address"},{"indexed":false,"internalType":"enum OffchainOracle.OracleType","name":"oracleType","type":"uint8"}],"name":"OracleRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"contract IERC20","name":"connector","type":"address"}],"name":"addConnector","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IOracle","name":"oracle","type":"address"},{"internalType":"enum OffchainOracle.OracleType","name":"oracleKind","type":"uint8"}],"name":"addOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"connectors","outputs":[{"internalType":"contract IERC20[]","name":"allConnectors","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"contract IERC20","name":"dstToken","type":"address"},{"internalType":"bool","name":"useWrappers","type":"bool"}],"name":"getRate","outputs":[{"internalType":"uint256","name":"weightedRate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"srcToken","type":"address"},{"internalType":"bool","name":"useSrcWrappers","type":"bool"}],"name":"getRateToEth","outputs":[{"internalType":"uint256","name":"weightedRate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"multiWrapper","outputs":[{"internalType":"contract MultiWrapper","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oracles","outputs":[{"internalType":"contract IOracle[]","name":"allOracles","type":"address[]"},{"internalType":"enum OffchainOracle.OracleType[]","name":"oracleTypes","type":"uint8[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"connector","type":"address"}],"name":"removeConnector","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IOracle","name":"oracle","type":"address"},{"internalType":"enum OffchainOracle.OracleType","name":"oracleKind","type":"uint8"}],"name":"removeOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract MultiWrapper","name":"_multiWrapper","type":"address"}],"name":"setMultiWrapper","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
