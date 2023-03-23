import React from "react"
import { Button, Modal } from "antd"
import { SettingOutlined } from "@ant-design/icons"
import clsx from "clsx"

import { Settings } from "./Settings"

import useToggle from "#/shared/hooks/useToggle"

import "./style.css"

interface Props {
	containerClass: string
}

const GlobalSetting: React.FC<Props> = ({ containerClass }) => {
	const [isSettingOpened, toggleSetting, closeSetting] = useToggle()

	return (
		<>
			<Button className={clsx("global-setting-container cursor-pointer", containerClass)} type="ghost" onClick={toggleSetting}>
				<div className="w-full h-auto pt-1 px-auto">
					<SettingOutlined className="!text-base sm:!text-lg xl:!text-xl text-black dark:text-white" />
				</div>
			</Button>
			{isSettingOpened && <Settings isOpen={isSettingOpened} closeModal={closeSetting} />}
		</>
	)
}

export default GlobalSetting
