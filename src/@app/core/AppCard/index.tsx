import React, { ReactNode } from "react"
import { Card, CardProps } from "antd"
import clsx from "clsx"

import "./style.css"

interface Props extends CardProps {
	children: ReactNode
	className?: string
	extra?: ReactNode
	bordered?: boolean
	heightFull?: boolean
}

const AppCard: React.FC<Props> = ({ extra, children, className, bordered = false, heightFull, ...rest }) => {
	return (
		<Card className={clsx("card", { heightFull: heightFull }, className)} extra={extra ? extra : null} bordered={bordered} {...rest}>
			{children}
		</Card>
	)
}

export default AppCard
