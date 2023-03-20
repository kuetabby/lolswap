import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { useQuery } from "react-query"
import { BigNumber, utils } from "ethers"
import axios from "axios"

import { getChainInfo } from "../constants/chainInfo"
// type ETHPriceResponse = {
// 	ethereum: {
// 		usd: number
// 	}
// }
type ETHPriceResponse = {
	USD: number
}

type Props = {
	gasPrice: string
	gasLimit: number
}

const CRYPTO_COMPARE_KEY = import.meta.env.VITE_CRYPTO_COMPARE_KEY

export const useGetGasPrice = ({ gasPrice, gasLimit }: Props) => {
	const [gasCost, setGasCost] = useState(0)

	const { chainId } = useWeb3React()

	const info = getChainInfo(chainId)

	const isSupported = !!info

	useEffect(() => {
		if (!gasLimit) {
			setGasCost(0)
		}
	}, [gasLimit])

	const { isFetching } = useQuery([gasPrice, gasLimit], getNativePrice, {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: false,
		enabled: isSupported && Boolean(gasLimit) && Boolean(+gasPrice),
		onError: () => {
			setGasCost(0)
		},
		onSuccess: (data) => {
			if (typeof data === "number") {
				calculateGasCost(data)
			}
		},
	})

	async function getNativePrice() {
		const request = await axios.get<ETHPriceResponse>(
			`https://min-api.cryptocompare.com/data/price?fsym=${info?.nativeCurrency.symbol}&tsyms=USD`,
			{
				headers: {
					Authorization: CRYPTO_COMPARE_KEY,
				},
			}
		)
		const data = await request.data
		return data.USD
	}

	// async function getNativePrice() {
	// 	const request = await axios.get<ETHPriceResponse>("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
	// 	const data = await request.data
	// 	return data.ethereum.usd
	// }

	async function calculateGasCost(ethPrice: number) {
		const gasCostInWei = +gasPrice * gasLimit
		const gasCostInBigInt = BigInt(gasCostInWei)
		const gasCostInBigNumber = BigNumber.from(gasCostInBigInt)
		const gasCostInEth = utils.formatEther(gasCostInBigNumber)
		const gasCostInUsd = +gasCostInEth * ethPrice
		setGasCost(gasCostInUsd)
	}

	return [gasCost, isFetching] as const
}
