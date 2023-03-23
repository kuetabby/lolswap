import React from "react"
import { Modal } from "antd"

import { ChartCard } from "./Chart"
import { LanguageCard } from "./Language"
import { ThemeCard } from "./Theme"

interface Props {
	isOpen: boolean
	closeModal: () => void
}

export const Settings: React.FC<Props> = ({ isOpen, closeModal }) => {
	return (
		<Modal
			open={isOpen}
			onCancel={closeModal}
			className="top-20 global-setting-modal"
			width={500}
			title={<div className="global-setting-modal-title">Global Setting</div>}
			footer={null}
		>
			<div className="flex flex-wrap justify-between w-full h-full">
				<ThemeCard />
				<LanguageCard />
				<ChartCard />
			</div>
		</Modal>
	)
}
