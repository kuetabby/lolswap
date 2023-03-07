import { AddressZero } from "#/layouts/Navbar/@hooks/useSearchTokens"
import { NATIVE_CHAIN_ID } from "./TokenSafety"

import WarningCache, { TOKEN_LIST_TYPES } from "./TokenSafety"

export enum WARNING_LEVEL {
	MEDIUM,
	UNKNOWN,
	BLOCKED,
}

export type Warning = {
	level: WARNING_LEVEL
	message: string
	/* canProceed determines whether triangle/slash alert icon is used, and
      whether this token is supported/able to be traded */
	canProceed: boolean
}

const MediumWarning: Warning = {
	level: WARNING_LEVEL.MEDIUM,
	message: "Caution",
	canProceed: true,
}

const StrongWarning: Warning = {
	level: WARNING_LEVEL.UNKNOWN,
	message: "Warning",
	canProceed: true,
}

const BlockedWarning: Warning = {
	level: WARNING_LEVEL.BLOCKED,
	message: "Not Available",
	canProceed: false,
}

export function checkWarning(tokenAddress: string) {
	if (tokenAddress === NATIVE_CHAIN_ID || tokenAddress === AddressZero) {
		return null
	}
	switch (WarningCache.checkToken(tokenAddress.toLowerCase())) {
		case TOKEN_LIST_TYPES.UNI_DEFAULT:
			return null
		case TOKEN_LIST_TYPES.UNI_EXTENDED:
			return MediumWarning
		case TOKEN_LIST_TYPES.UNKNOWN:
			return StrongWarning
		case TOKEN_LIST_TYPES.BLOCKED:
			return BlockedWarning
		case TOKEN_LIST_TYPES.BROKEN:
			return BlockedWarning
	}
}
