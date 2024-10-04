'use client'
export const breakpoints = {
    smallDesktop: 1440,
    mobile: 768,
}

const media = {
    smallDesktop: "max-width:" + (breakpoints.smallDesktop-1) + "px",
    mobile: "max-width:" + (breakpoints.mobile-1) + "px",
}

export default media