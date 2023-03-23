import React, { useState } from "react"
import { Card, Switch } from "antd"

import { useDarkTheme } from "#/shared/hooks/useDarkTheme"

import LightMode from "#/assets/light-mode.svg"
import NightMode from "#/assets/dark-mode.svg"

interface Props {}

export const ThemeCard: React.FC<Props> = () => {
	const [colorTheme, setTheme] = useDarkTheme()

	const [darkSide, setDarkSide] = useState(colorTheme === "light" ? false : true)

	const toggleDarkMode = () => {
		setTheme(colorTheme)
		setDarkSide((state) => !state)
	}

	return (
		<Card className="card-setting-container hover:cursor-auto" bodyStyle={{ padding: "0.5em 1em" }}>
			<div className="flex justify-between items-center h-8">
				<img src={darkSide ? LightMode : NightMode} alt="theme-mode" className="w-8 h-8 bg-transparent" />
				<Switch checked={!darkSide} onClick={toggleDarkMode} />
			</div>
			<div className="mt-1 sm:mt-4" />
			<div className="card-setting-title">{darkSide ? "Light" : "Dark"}</div>
			<div className="card-setting-subtitle">Theme for the web</div>
		</Card>
	)
}
