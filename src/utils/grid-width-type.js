export const gridWidthType = (windowWidth) => {
    const isXSWidth = windowWidth <= 350;
    const isSmallWidth = windowWidth < 500;
    const isMobileWidth = windowWidth >= 500 && windowWidth < 701;
    const isTabletWidth = windowWidth >= 701 && windowWidth < 1025;
    const isMediumWidth = windowWidth >= 1025 && windowWidth <= 1200;
    const isLargeWidth = windowWidth > 1200;

    return {
        isXSWidth,
        isSmallWidth,
        isMobileWidth,
        isTabletWidth,
        isMediumWidth,
        isLargeWidth
    }
};