import React from "react"

import PegaSwapLogo from "#/assets/logo-pegasus.png"

import "./style.css"

interface Props {}

const SwitchLoader: React.FC<Props> = () => {
	return (
		<div className="switch-loader-container">
			<img src={PegaSwapLogo} alt="pega-logo" className="switch-image" />
		</div>
	)
}

export default SwitchLoader
