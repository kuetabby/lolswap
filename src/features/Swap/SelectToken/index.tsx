import React, { useCallback, useMemo, useState } from "react"
import { useAppSelector, useAppDispatch } from "#/redux/store"
import { Modal, Input, List, Avatar } from "antd"
import { WORKER_STATUS } from "@koale/useworker"

import { toTrade, fromTrade, switchToTrade, switchFromTrade } from "#/redux/slices/Swap"

import useDebounce from "#/shared/hooks/useDebounce"
import { TokenUniswap, useSearchTokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

import "./style.css"
// import { useExchangeToken } from "../@hooks/useExchangeToken"
import { checkWarning } from "#/@app/utility/Token/checkWarning"
import { TokenWarningIcon } from "./Warning"
import useToggle from "#/shared/hooks/useToggle"
import { Confirmation } from "./Confirmation"
// import { isAddress } from "#/@app/utility/Address"

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

const SelectToken: React.FC<Props> = ({ closeModal, isOpen, type }) => {
	const [searchValue, setSearchValue] = useState("")
	const [confirmationToken, setConfirmationToken] = useState(initialConfirmationToken)

	const { from: currentTrade, to: destinationTrade } = useAppSelector((state) => state.swapTransaction)

	const debouncedValue = useDebounce(searchValue, 1000)
	const [data, isLoadingData, workerStatus, validatingListToken] = useSearchTokenUniswap(debouncedValue)
	const [isOpenConfirmation, toggleConfirmation, closeConfirmation] = useToggle()
	// const { mutate } = useExchangeToken()

	const dispatch = useAppDispatch()

	const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	const onSelectToken = (item: TokenUniswap) => {
		const trade = { ...item, amount: "0" }
		const isShowModalConfirmation = showConfirmationModal(item)
		// console.log("should we show the modal confirmation ?", isShowModalConfirmation)
		if (!isShowModalConfirmation) {
			if (type === "Buy") {
				// mutate(item)
				if (currentTrade.id === item.id) {
					dispatch(switchToTrade(trade))
					closeModal()
				} else {
					dispatch(toTrade(trade))
					closeModal()
				}
			} else {
				if (destinationTrade.id === item.id) {
					dispatch(switchFromTrade(trade))
					closeModal()
				} else {
					dispatch(fromTrade(trade))
					closeModal()
				}
			}
		}
		toggleConfirmation()
		item && setConfirmationToken(item)
	}

	const dataSource = useMemo(() => {
		switch (workerStatus) {
			case WORKER_STATUS.SUCCESS:
				return data
			default:
				return []
		}
	}, [workerStatus, data])

	const isLoadingWorker = useMemo(() => {
		switch (workerStatus) {
			case WORKER_STATUS.SUCCESS:
				return false
			case WORKER_STATUS.ERROR:
				return false
			case WORKER_STATUS.TIMEOUT_EXPIRED:
				return false
			default:
				return true
		}
	}, [workerStatus])

	const showConfirmationModal = useCallback(
		(item: TokenUniswap) => {
			const isNative = item?.isNative
			// const isToken = item?.isToken

			if (isNative === false) {
				const isTokenOnTheList = validatingListToken(item.id)
				// console.log(isTokenOnTheList, "is token on the list")
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
		(item: TokenUniswap) => {
			const isNative = item?.isNative
			if (isNative === false) {
				const isTokenOnTheList = validatingListToken(item.id)
				// console.log(isTokenOnTheList, "is token on the list")
				if (isTokenOnTheList) {
					return null
				}
				return <TokenWarningIcon warning={checkWarning(item.id)} />
			}

			return null
		},
		[dataSource, checkWarning, validatingListToken]
	)

	const onCloseConfirmation = () => {
		closeConfirmation()
		closeModal()
	}

	console.log(dataSource, "data source")

	return (
		<>
			<Modal
				open={isOpen}
				onCancel={closeModal}
				className="search-token-modal top-20"
				width={450}
				title={<div className="text-white">Select a token</div>}
				footer={null}
			>
				<Input.Search
					size="large"
					className="py-4"
					onChange={onChangeValue}
					value={searchValue}
					placeholder="Search by name or paste address"
					enterButton
				/>
				<List
					loading={isLoadingWorker || isLoadingData}
					dataSource={dataSource as TokenUniswap[]}
					className="custom-list-container"
					style={{ maxHeight: "350px", overflow: "auto" }}
					renderItem={(item: TokenUniswap, i) => {
						return (
							<List.Item className="custom-list-item" onClick={() => onSelectToken(item)}>
								<List.Item.Meta
									className="!items-center"
									avatar={
										<Avatar src={item.logoURI || `https://tokens.1inch.io/${item.id}.png`} alt={item.name ?? `undefined alt-${i}`} />
									}
									title={
										<div className="flex">
											<div className="text-white mr-4">{item.name}</div>
											{showWarning(item)}
										</div>
									}
									description={<div className="text-white">{item.symbol}</div>}
								/>
							</List.Item>
						)
					}}
				/>
			</Modal>
			{isOpenConfirmation && (
				<Confirmation
					isOpen={isOpenConfirmation}
					token={confirmationToken}
					type={type}
					closeModal={onCloseConfirmation}
					closeConfirmModal={closeConfirmation}
				/>
			)}
		</>
	)
}

export default SelectToken
