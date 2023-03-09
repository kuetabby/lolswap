import axios from "axios"
import { BigNumber, utils } from "ethers"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"

type ETHPriceResponse = {
	ethereum: {
		usd: number
	}
}

type Props = {
	gasPrice: string
	gasLimit: number
}

export const useGetETHPrice = ({ gasPrice, gasLimit }: Props) => {
	const [gasCost, setGasCost] = useState(0)

	useEffect(() => {
		if (!gasLimit) {
			setGasCost(0)
		}
	}, [gasLimit])

	useQuery([gasPrice, gasLimit], getEthPrice, {
		refetchOnMount: true,
		refetchOnReconnect: true,
		refetchOnWindowFocus: false,
		enabled: Boolean(gasLimit) && Boolean(+gasPrice),
		onError: () => {
			setGasCost(0)
		},
		onSuccess: (data) => {
			if (typeof data === "number") {
				calculateGasCost(data)
			}
		},
	})

	async function getEthPrice() {
		const request = await axios.get<ETHPriceResponse>("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
		const data = await request.data
		return data.ethereum.usd
	}

	async function calculateGasCost(ethPrice: number) {
		const gasCostInWei = +gasPrice * gasLimit
		const gasCostInBigInt = BigInt(gasCostInWei)
		const gasCostInBigNumber = BigNumber.from(gasCostInBigInt)
		const gasCostInEth = utils.formatEther(gasCostInBigNumber)
		const gasCostInUsd = +gasCostInEth * ethPrice
		setGasCost(gasCostInUsd)
	}

	return [gasCost]
}
