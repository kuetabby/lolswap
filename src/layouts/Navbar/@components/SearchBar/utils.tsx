import { UserOutlined } from "@ant-design/icons"

export const renderTitle = (title: string) => (
	<span className="text-white">
		{title}
		<a style={{ float: "right" }} href="https://www.google.com/search?q=antd" target="_blank" rel="noopener noreferrer">
			more
		</a>
	</span>
)

export const renderItem = (title: string, count: number) => ({
	value: title,
	label: (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
			}}
		>
			{title}
			<span>
				<UserOutlined /> {count}
			</span>
		</div>
	),
})
