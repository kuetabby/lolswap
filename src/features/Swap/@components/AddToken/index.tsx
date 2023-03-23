import React, { useCallback, useEffect, useRef, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { useAppDispatch } from "#/redux/store"
import { Modal, Input, List, Button, InputRef } from "antd"
import { SearchOutlined } from "@ant-design/icons"

import { TokenWarningIcon } from "../SelectToken/Warning"
import { Confirmation } from "../SelectToken/Confirmation"
import { TokenImage } from "../TokenImage"

import { addSerializedToken } from "#/redux/slices/User"

import useDebounce from "#/shared/hooks/useDebounce"
import useToggle from "#/shared/hooks/useToggle"
import { useSearchByAddress } from "#/shared/hooks/useSearchTokens"

import { checkWarning } from "#/@app/utility/Token/checkWarning"

import type { TokenUniswap } from "#/layouts/Navbar/@hooks/useSearchTokens"

import "../SelectToken/style.css"

interface Props {
	isOpen: boolean
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

const AddToken: React.FC<Props> = ({ closeModal, isOpen }) => {
	const [searchValue, setSearchValue] = useState("")
	const [confirmationToken, setConfirmationToken] = useState(initialConfirmationToken)

	const debouncedValue = useDebounce(searchValue, 1000)

	const [data, isLoadingData, validatingListToken] = useSearchByAddress(debouncedValue)

	const [isOpenConfirmation, toggleConfirmation, closeConfirmation] = useToggle()

	const dispatch = useAppDispatch()
	const { chainId } = useWeb3React()

	const addressInput = useRef<InputRef>(null)

	useEffect(() => {
		if (addressInput.current) {
			addressInput.current.focus()
		}
	}, [])

	const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value)
	}

	const onSelectToken = (item: TokenUniswap) => {
		const isShowModalConfirmation = showConfirmationModal(item)
		if (!isShowModalConfirmation) {
			closeModal()
		}
		item && setConfirmationToken(item)
		toggleConfirmation()
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
		(item: TokenUniswap, icon: JSX.Element, showImportIcon: boolean) => {
			const isNative = item?.isNative
			if (isNative === false) {
				const isTokenOnTheList = validatingListToken(item.id)
				if (isTokenOnTheList && showImportIcon) {
					return null
				}
				return icon
			}

			return null
		},
		[validatingListToken]
	)

	const onImportToken = (item: TokenUniswap) => {
		const trade = { ...item, amount: "0" }
		chainId && dispatch(addSerializedToken({ serializedToken: { ...trade, chainId } }))
		onCloseConfirmation()
	}

	const onCloseConfirmation = () => {
		closeConfirmation()
		closeModal()
	}

	return (
		<>
			<Modal
				open={isOpen}
				onCancel={closeModal}
				className="search-token-modal top-20"
				width={450}
				title={<div className="text-black dark:text-white text-center font-semibold mb-4">Add a token</div>}
				footer={null}
			>
				<Input
					className="py-2 mb-2"
					prefix={<SearchOutlined style={{ color: "gray", fontWeight: "bold", fontSize: "1.35em", marginRight: "0.25em" }} />}
					onChange={onChangeValue}
					value={searchValue}
					ref={addressInput}
					placeholder="Search by address"
				/>
				<List
					loading={debouncedValue ? isLoadingData : false}
					dataSource={data as TokenUniswap[]}
					className="custom-list-container"
					style={{ maxHeight: "350px", overflow: "auto" }}
					renderItem={(item: TokenUniswap, i) => {
						return (
							<List.Item className="custom-list-item" onClick={() => onSelectToken(item)}>
								<List.Item.Meta
									className="!items-center"
									avatar={<TokenImage src={item.logoURI || `https://tokens.1inch.io/${item.id}.png`} alt={String(i)} />}
									title={
										<div className="flex justify-between">
											<div className="flex">
												<div className="item-name mr-4">{item.name}</div>
												{showWarning(item, <TokenWarningIcon warning={checkWarning(item.id)} />, false)}
											</div>
											{showWarning(
												item,
												<Button size="small" type="primary">
													Import
												</Button>,
												true
											)}
										</div>
									}
									description={<div className="item-description">{item.symbol}</div>}
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
					onImportToken={onImportToken}
					closeConfirmModal={closeConfirmation}
				/>
			)}
		</>
	)
}

export default AddToken
