import { useCallback } from "react"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { arrayify, parseBytes32String } from "ethers/lib/utils"
import { Token as NewToken } from "@uniswap/sdk-core"

import { ERC20 } from "#/features/Swap/@hooks/useTrySwap"
import { getInitialUrl } from "#/shared/hooks/useGetLogo"

import type { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

export const useGetToken = (address: string) => {
	const { provider, chainId } = useWeb3React()

	const searchToken = useCallback(
		async (value: string) => {
			try {
				const contract = new ethers.Contract(value, ERC20, provider)
				const decimals = await contract?.decimals()
				const name = await contract?.name()
				const symbol = await contract?.symbol()

				const contractBytes32 = new ethers.Contract(value, ERC20_BYTES32_ABI, provider)
				const nameBytes32 = await contractBytes32?.name()
				const symbolBytes32 = await contractBytes32?.symbol()

				const parsedDecimals = decimals ?? 18
				const parsedSymbol = parseStringOrBytes32(symbol, symbolBytes32, "UNKNOWN")
				const parsedName = parseStringOrBytes32(name, nameBytes32, "UNKNOWN TOKEN")

				const tokenSDK = new NewToken(chainId || 0, address, parsedDecimals, parsedSymbol, parsedName)
				const token = await tokenSDK
				const logoUrl = getInitialUrl(address, chainId, tokenSDK.isNative)
				const uniswap: TokenUniswap = {
					decimals: String(token.decimals),
					id: token.address,
					isNative: token.isNative,
					isToken: token.isToken,
					logoURI: logoUrl,
					name: token.name,
					symbol: token.symbol,
				}
				return uniswap
			} catch (error) {
				console.log("unknown error", error)
			}
		},
		[chainId, address]
	)

	return [searchToken] as const
}

function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
	return str && str.length > 0
		? str
		: // need to check for proper bytes string and valid terminator
		bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
		? parseBytes32String(bytes32)
		: defaultValue
}

const ERC20_BYTES32_ABI = [
	{
		constant: true,
		inputs: [],
		name: "name",
		outputs: [
			{
				name: "",
				type: "bytes32",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
	{
		constant: true,
		inputs: [],
		name: "symbol",
		outputs: [
			{
				name: "",
				type: "bytes32",
			},
		],
		payable: false,
		stateMutability: "view",
		type: "function",
	},
]
