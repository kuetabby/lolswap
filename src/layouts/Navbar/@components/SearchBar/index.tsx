import React, { useState } from "react"
import { AutoComplete, Input } from "antd"

import { renderTitle } from "./utils"

import { useSearchTokens } from "../../@hooks/useSearchTokens"
import useDebounce from "#/shared/hooks/useDebounce"

import "../../style.css"

interface Props {}

const { Search } = Input

const SearchTabs: React.FC<Props> = () => {
	const [value, setValue] = useState("")

	const debouncedValue = useDebounce(value, 1000)

	const [listTokens, isFetching, error] = useSearchTokens(debouncedValue)

	const options = [
		{
			label: renderTitle("Tokens"),
			options: listTokens.map((item, i) => ({
				label: (
					<div className="search-label" key={i}>
						<img src={item.logoURI} className="!w-8 !h-8" style={{ objectFit: "contain" }} alt={item.name || `image-${item.name}`} />
						<div className="flex flex-col ml-2">
							<div>{item.name}</div>
							<div>{item.symbol}</div>
						</div>
					</div>
				),
			})),
		},
	]

	console.log(listTokens, isFetching, error)

	return (
		<div className="search-container hidden md:flex">
			<AutoComplete
				className="searchbar"
				popupClassName="certain-category-search-dropdown"
				dropdownMatchSelectWidth={400}
				dropdownStyle={{
					background: "rgb(6, 7, 10)",
				}}
				options={options}
				disabled={isFetching}
			>
				<Search size="large" placeholder="input here" enterButton onChange={(e) => setValue(e.target.value)} />
			</AutoComplete>
		</div>
	)
}

export default SearchTabs
