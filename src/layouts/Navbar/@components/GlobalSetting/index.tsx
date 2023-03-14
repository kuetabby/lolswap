import React from "react"
import { Button } from "antd"
import { SettingOutlined } from "@ant-design/icons"

import "./style.css"
import clsx from "clsx"

interface Props {
	containerClass: string
}

const GlobalSetting: React.FC<Props> = ({ containerClass }) => {
	return (
		<Button className={clsx("global-setting-container cursor-pointer dark", containerClass)} type="ghost">
			<div className="w-full h-auto pt-1 px-auto">
				<SettingOutlined className="!text-base sm:!text-lg xl:!text-xl" />
			</div>
		</Button>
	)
}

export default GlobalSetting
