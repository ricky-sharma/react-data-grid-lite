import { Container_Identifier } from "../constants";
import { getContainerWidthInPixels } from "../helpers/common";


export const gridWidthType = (windowWidth, gridID) => {
    const containerWidth = getContainerWidthInPixels(`#${gridID} ${Container_Identifier}`, windowWidth);
    const isXSWidth = containerWidth <= 350;
    const isSmallWidth = containerWidth < 500;
    const isMobileWidth = containerWidth >= 500 && containerWidth < 701;
    const isTabletWidth = containerWidth >= 701 && containerWidth < 1025;
    const isMediumWidth = containerWidth >= 1025 && containerWidth <= 1200;
    const isLargeWidth = containerWidth > 1200;

    return {
        isXSWidth,
        isSmallWidth,
        isMobileWidth,
        isTabletWidth,
        isMediumWidth,
        isLargeWidth
    }
};