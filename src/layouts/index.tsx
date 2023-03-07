import React from "react"
import { Layout } from "antd"

import Navbar from "./Navbar"

import Swap from "#/features/Swap"

interface Props {}

const { Footer, Content } = Layout

const AppLayout: React.FC<Props> = () => {
	return (
		<Layout className="app-layout">
			<Navbar />
			<Content>
				<Swap />
			</Content>
			<Footer>Footer</Footer>
		</Layout>
	)
}

export default AppLayout
