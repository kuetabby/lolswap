import React, { useCallback, useEffect, useRef, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { useAppSelector, useAppDispatch } from "#/redux/store"
// import InfiniteScroll from "react-infinite-scroll-component"
import VirtualList from "rc-virtual-list"
import { Modal, Input, List, Button, InputRef } from "antd"
import { SearchOutlined } from "@ant-design/icons"

import { TokenWarningIcon } from "./Warning"
import { Confirmation } from "./Confirmation"
import { TokenImage } from "../TokenImage"

import { toTrade, fromTrade, switchToTrade, switchFromTrade } from "#/redux/slices/Swap"
import { addSerializedToken } from "#/redux/slices/User"

import useDebounce from "#/shared/hooks/useDebounce"
import useToggle from "#/shared/hooks/useToggle"
import { useSearchTokens } from "#/shared/hooks/useSearchTokens"

import { checkWarning } from "#/@app/utility/Token/checkWarning"

import type { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

import "./style.css"

interface Props {
	isOpen: boolean
	type: "Sell" | "Buy"
	closeModal: () => void
}

const initialConfirmationToken: TokenUniswap = {
	decimals: "",
	id: "",
	isNative: false,
	isToken: true,
	logoURI: "",
	name: "",
	symbol: "",
}

const scrollHeight = 400

const SelectToken: React.FC<Props> = ({ closeModal, isOpen, type }) => {
	const { from: currentTrade, to: destinationTrade } = useAppSelector((state) => state.swapTransaction)

	const [searchValue, setSearchValue] = useState("")
	const [confirmationToken, setConfirmationToken] = useState(initialConfirmationToken)

	const debouncedValue = useDebounce(searchValue, 1000)

	const [data, isLoadingData, validatingListToken, sizeData, loadMoreToken] = useSearchTokens(debouncedValue)
	const [isOpenConfirmation, toggleConfirmation, closeConfirmation] = useToggle()

	const dispatch = useAppDispatch()
	const { chainId } = useWeb3React()

	const tokenInput = useRef<InputRef>(null)

	useEffect(() => {
		if (tokenInput.current) {
			tokenInput.current.focus()
		}
	}, [])

	const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	const onConfirm = (item: { amount: string } & TokenUniswap, onClose: () => void) => {
		if (type === "Buy") {
			if (currentTrade.id === item.id) {
				dispatch(switchToTrade(item))
				onClose()
			} else {
				dispatch(toTrade(item))
				onClose()
			}
		} else {
			if (destinationTrade.id === item.id) {
				dispatch(switchFromTrade(item))
				onClose()
			} else {
				dispatch(fromTrade(item))
				onClose()
			}
		}
	}

	const onSelectToken = (item: TokenUniswap) => {
		const trade = { ...item, amount: "0" }
		const isShowModalConfirmation = showConfirmationModal(item)
		if (!isShowModalConfirmation) {
			onConfirm(trade, closeModal)
		}
		item && setConfirmationToken(item)
		toggleConfirmation()
	}

	const onImportToken = (item: TokenUniswap) => {
		const trade = { ...item, amount: "0" }
		chainId && dispatch(addSerializedToken({ serializedToken: { ...trade, chainId } }))
		onConfirm(trade, onCloseConfirmation)
	}

	const showConfirmationModal = useCallback(
		(item: TokenUniswap) => {
			const isNative = item?.isNative
			if (isNative === false) {
				const isTokenOnTheList = validatingListToken(item.id)
				if (isTokenOnTheList) {
					return false
				}

				return true
			}

			return false
		},
		[validatingListToken]
	)

	const showWarning = useCallback(
		(item: TokenUniswap, icon: JSX.Element) => {
			const isNative = item?.isNative
			if (isNative === false) {
				const isTokenOnTheList = validatingListToken(item.id)
				if (isTokenOnTheList) {
					return null
				}
				return icon
			}

			return null
		},
		[data, checkWarning, validatingListToken]
	)

	const onCloseConfirmation = () => {
		closeConfirmation()
		closeModal()
	}

	const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
		if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === scrollHeight) {
			loadMoreToken()
		}
	}

	return (
		<>
			<Modal
				open={isOpen}
				onCancel={closeModal}
				className="search-token-modal top-20"
				width={450}
				title={<div className="text-white text-center font-semibold mb-4">Select a token</div>}
				footer={null}
			>
				<Input
					className="py-2 mb-2"
					prefix={<SearchOutlined style={{ color: "gray", fontWeight: "bold", fontSize: "1.35em", marginRight: "0.25em" }} />}
					onChange={onChangeValue}
					value={searchValue}
					ref={tokenInput}
					placeholder="Search by name or paste address"
				/>
				<List loading={isLoadingData}>
					<VirtualList
						data={data.slice(0, sizeData)}
						height={scrollHeight}
						itemHeight={40}
						itemKey="id"
						onScroll={onScroll}
						className="custom-list-container"
						style={{ overflow: "auto", maxHeight: "400px" }}
					>
						{(item: TokenUniswap, i) => (
							<List.Item className="custom-list-item" onClick={() => onSelectToken(item)}>
								<List.Item.Meta
									className="!items-center"
									avatar={<TokenImage src={item.logoURI || `https://tokens.1inch.io/${item.id}.png`} alt={String(i)} />}
									title={
										<div className="flex justify-between">
											<div className="flex">
												<div className="text-white mr-4">{item.name}</div>
												{showWarning(item, <TokenWarningIcon warning={checkWarning(item.id)} />)}
											</div>
											{showWarning(
												item,
												<Button size="small" type="primary">
													Import
												</Button>
											)}
										</div>
									}
									description={<div className="text-white">{item.symbol}</div>}
								/>
							</List.Item>
						)}
					</VirtualList>
				</List>
			</Modal>
			{isOpenConfirmation && (
				<Confirmation
					isOpen={isOpenConfirmation}
					token={confirmationToken}
					onImportToken={onImportToken}
					closeConfirmModal={closeConfirmation}
				/>
			)}
		</>
	)
}

export default SelectToken
