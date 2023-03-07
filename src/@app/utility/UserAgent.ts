const checkMobileDevice = /Mobi/.test(navigator.userAgent)
const checkTabletDevice = /Tablet|iPad/.test(navigator.userAgent)

const isMobileDevice = Boolean(checkMobileDevice)
const isTabletDevice = Boolean(checkTabletDevice)

export const isMobile = isMobileDevice || isTabletDevice
