const breakpoints = {
    smallDesktop: 1440,
    tablet: 992,
    mobile: 768,
}

const media = {
    smallDesktop: "max-width:" + (breakpoints.smallDesktop-1) + "px",
    tablet: "max-width:" + (breakpoints.tablet-1) + "px",
    mobile: "max-width:" + (breakpoints.mobile-1) + "px",
}

export default media