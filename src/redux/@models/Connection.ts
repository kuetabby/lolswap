import { ConnectionType } from "#/@app/utility/Connection"

export interface ConnectionState {
	errorByConnectionType: Record<ConnectionType, string | undefined>
}

export type ConnectionPayload = { connectionType: ConnectionType; error: string | undefined }
