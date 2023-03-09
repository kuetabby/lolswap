import React, { useEffect, useState } from "react"

import EMPTY_TOKEN_IMAGE from "#/assets/empty-token.webp"

interface Props {
	src: string
	alt: string
}

export const TokenImage: React.FC<Props> = ({ alt, src }) => {
	const [imageSrc, setImageSrc] = useState(src)

	useEffect(() => {
		setImageSrc(src)
	}, [src])

	function handleImageError() {
		setImageSrc(EMPTY_TOKEN_IMAGE)
	}

	return <img className="!w-7 !h-7" loading="lazy" src={imageSrc} alt={alt} onError={handleImageError} />
}
