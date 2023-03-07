import { SupportedChainId } from "#/shared/constants/chains"

export type PopupContent =
	| {
			txn: {
				hash: string
			}
	  }
	| {
			failedSwitchNetwork: SupportedChainId
	  }

export enum ApplicationModal {
	ADDRESS_CLAIM,
	BLOCKED_ACCOUNT,
	CLAIM_POPUP,
	DELEGATE,
	EXECUTE,
	FEATURE_FLAGS,
	FIAT_ONRAMP,
	MENU,
	METAMASK_CONNECTION_ERROR,
	NETWORK_FILTER,
	NETWORK_SELECTOR,
	POOL_OVERVIEW_OPTIONS,
	PRIVACY_POLICY,
	QUEUE,
	SELF_CLAIM,
	SETTINGS,
	SHARE,
	TIME_SELECTOR,
	VOTE,
	WALLET,
	WALLET_DROPDOWN,
	UNISWAP_NFT_AIRDROP_CLAIM,
}

export type Popup = { key: string; show?: boolean; content: PopupContent; removeAfterMs?: number | null }
export type PopupList = Array<Popup>

export interface ApplicationState {
	readonly chainId: number | null
	readonly fiatOnramp: { available: boolean; availabilityChecked: boolean }
	readonly openModal: boolean
	readonly popupList: PopupList
}
