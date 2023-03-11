import { Warning, WARNING_LEVEL } from "#/@app/utility/Token/checkWarning"
import { StopOutlined, WarningOutlined } from "@ant-design/icons"

export function TokenWarningIcon({ warning }: { warning: Warning | null }) {
	switch (warning?.level) {
		case WARNING_LEVEL.BLOCKED:
			return (
				<div className="text-red-600">
					<StopOutlined />
				</div>
			)
		case WARNING_LEVEL.UNKNOWN:
			return (
				<div className="text-yellow-500">
					<WarningOutlined />
				</div>
			)
		default:
			return null
	}
}
