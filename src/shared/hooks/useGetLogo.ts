// import { useState, useEffect } from "react"

import { isAddress } from "#/@app/utility/Address"

import ethereumLogoUrl from "#/assets/ethereum-logo.png"

export function getInitialUrl(address: string, chainId?: number | null, isNative?: boolean) {
	if (chainId && isNative) return ethereumLogoUrl

	// const networkName = "ethereum"
	// const networkName = chainId ? chainIdToNetworkName(chainId) : 'ethereum'
	const checksummedAddress = isAddress(address)
	if (checksummedAddress) {
		// return `https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/${networkName}/assets/${address}/logo.png`
		return `https://tokens.1inch.io/${address}.png`
	} else {
		return undefined
	}
}

export function prioritizeLogoSources(uris: string[]) {
	const parsedUris = uris.map((uri) => uriToHttp(uri)).flat(1)
	const preferredUris: string[] = []

	// Consolidate duplicate coingecko urls into one fallback source
	let coingeckoUrl: string | undefined = undefined

	parsedUris.forEach((uri) => {
		if (uri.startsWith("https://assets.coingecko")) {
			if (!coingeckoUrl) {
				coingeckoUrl = uri.replace(/small|thumb/g, "large")
			}
		} else {
			preferredUris.push(uri)
		}
	})
	// Places coingecko urls in the back of the source array
	return coingeckoUrl ? [...preferredUris, coingeckoUrl] : preferredUris
}

export default function uriToHttp(uri: string): string[] {
	const protocol = uri.split(":")[0].toLowerCase()
	switch (protocol) {
		case "data":
			return [uri]
		case "https":
			return [uri]
		case "http":
			return ["https" + uri.substring(0, 4), uri]
		case "ipfs": {
			const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2]
			return [`https://cloudflare-ipfs.com/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`]
		}
		case "ipns": {
			const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2]
			return [`https://cloudflare-ipfs.com/ipns/${name}/`, `https://ipfs.io/ipns/${name}/`]
		}
		case "ar": {
			const tx = uri.match(/^ar:(\/\/)?(.*)$/i)?.[2]
			return [`https://arweave.net/${tx}`]
		}
		default:
			return []
	}
}

//   export const useGetLogo = () => {
//     const [current, setCurrent] = useState<string | undefined>(getInitialUrl(address, chainId, isNative))
//     const [fallbackSrcs, setFallbackSrcs] = useState<string[] | undefined>(undefined)

//     useEffect(() => {
//       setCurrent(getInitialUrl(address, chainId, isNative))
//       setFallbackSrcs(undefined)
//     }, [address, chainId, isNative])

//     const nextSrc = useCallback(() => {
//       if (current) {
//         BAD_SRCS[current] = true
//       }
//       // Parses and stores logo sources from tokenlists if assets repo url fails
//       if (!fallbackSrcs) {
//         const uris = TokenLogoLookupTable.getIcons(address, chainId) ?? []
//         if (backupImg) uris.push(backupImg)
//         const tokenListIcons = prioritizeLogoSources(parseLogoSources(uris))

//         setCurrent(tokenListIcons.find((src) => !BAD_SRCS[src]))
//         setFallbackSrcs(tokenListIcons)
//       } else {
//         setCurrent(fallbackSrcs.find((src) => !BAD_SRCS[src]))
//       }
//     }, [current, fallbackSrcs, address, chainId, backupImg])

//     return [current, nextSrc]
//   }

//   export function getNativeLogoURI(chainId: SupportedChainId = SupportedChainId.MAINNET): string {
//     switch (chainId) {
//       case SupportedChainId.POLYGON:
//       case SupportedChainId.POLYGON_MUMBAI:
//         return MaticLogo
//       case SupportedChainId.CELO:
//       case SupportedChainId.CELO_ALFAJORES:
//         return CeloLogo
//       default:
//         return EthereumLogo
//     }
//   }
