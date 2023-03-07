import { useState, useCallback } from "react"

const useToggle = () => {
	const [toggle, setToggle] = useState(false)

	const onChangeToggle = useCallback(() => {
		setToggle((state) => !state)
	}, [])

	const onCloseToggle = useCallback(() => {
		setToggle(false)
	}, [])

	return [toggle, onChangeToggle, onCloseToggle] as const
}

export default useToggle
