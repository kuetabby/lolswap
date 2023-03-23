import { useEffect, useState } from "react"

export const useDarkTheme = () => {
	const [theme, setTheme] = useState(localStorage.getItem("theme"))
	const colorTheme = theme === "dark" ? "light" : "dark"

	useEffect(() => {
		const root = window.document.documentElement
		root.classList.remove(colorTheme)
		root.classList.add(String(theme))
		localStorage.setItem("theme", String(theme))
	}, [theme, colorTheme])

	return [colorTheme, setTheme] as const
}
