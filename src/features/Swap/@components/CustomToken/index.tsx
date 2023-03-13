import React, { useEffect, useRef, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { useAppDispatch, useAppSelector } from "#/redux/store"
import { Input, List, InputRef, Button } from "antd"
import { CloseOutlined, LinkOutlined, SearchOutlined } from "@ant-design/icons"

// import { TokenWarningIcon } from "../SelectToken/Warning"
import { TokenImage } from "../TokenImage"

import useDebounce from "#/shared/hooks/useDebounce"

// import { checkWarning } from "#/@app/utility/Token/checkWarning"

import type { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

import "./style.css"
import "../SelectToken/style.css"
import { removeSerializedToken } from "#/redux/slices/User"

interface Props {}

const CustomToken: React.FC<Props> = () => {
	const { tokens } = useAppSelector((state) => state.user)

	const [searchValue, setSearchValue] = useState("")

	const debouncedValue = useDebounce(searchValue, 250)

	const { chainId } = useWeb3React()
	const dispatch = useAppDispatch()

	const nameInput = useRef<InputRef>(null)

	const totalTokens = chainId
		? Object.values(tokens[chainId]).filter((item) => item.name?.toLocaleLowerCase().includes(debouncedValue.toLowerCase())) ?? []
		: []

	useEffect(() => {
		if (nameInput.current) {
			nameInput.current.focus()
		}
	}, [])

	const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	const onRemoveToken = (address: string) => {
		chainId && dispatch(removeSerializedToken({ address, chainId }))
	}

	// const showWarning = useCallback((item: TokenUniswap, icon: JSX.Element) => {
	// 	const isNative = item?.isNative
	// 	if (isNative === false) {
	// 		return icon
	// 	}

	// 	return null
	// }, [])

	return (
		<>
			<Input
				className="py-2 mb-2"
				prefix={<SearchOutlined style={{ color: "gray", fontWeight: "bold", fontSize: "1.35em", marginRight: "0.25em" }} />}
				onChange={onChangeValue}
				value={searchValue}
				ref={nameInput}
				placeholder="Search by name"
			/>
			<List
				dataSource={totalTokens as TokenUniswap[]}
				className="custom-list-container"
				style={{ maxHeight: "350px", overflow: "auto" }}
				renderItem={(item: TokenUniswap, i) => {
					return (
						<List.Item className="custom-list-item">
							<List.Item.Meta
								className="!items-center"
								avatar={<TokenImage src={item.logoURI || `https://tokens.1inch.io/${item.id}.png`} alt={String(i)} />}
								title={
									<div className="flex justify-between">
										<div className="flex">
											<div className="text-white mr-4">{item.name}</div>
											{/* {showWarning(item, <TokenWarningIcon warning={checkWarning(item.id)} />)} */}
										</div>
										<div className="flex justify-between w-1/5">
											<Button
												type="link"
												size="small"
												className="delete-custom-token"
												onClick={() => onRemoveToken(item.id)}
												icon={<CloseOutlined style={{ color: "#6c86ad" }} />}
											/>
											<Button
												type="link"
												size="small"
												icon={<LinkOutlined />}
												target="_blank"
												href={`https://etherscan.io/token/${item.id}`}
											/>
										</div>
									</div>
								}
								description={<div className="text-white">{item.symbol}</div>}
							/>
						</List.Item>
					)
				}}
			/>
		</>
	)
}

export default CustomToken
