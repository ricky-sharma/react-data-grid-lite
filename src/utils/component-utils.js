import { Button_Column_Key, Button_Column_Width, Default_Grid_Width_VW, Mobile_Column_Width } from "../constants";
import { convertViewportUnitToPixels, getContainerWidthInPixels, isNull } from "../helper/common";

export function calculateColumnWidth(
    colWidthArray,
    hiddenCols,
    currentColKey,
    buttonColEnabled = false,
    isMobile = false
) {
    if (!Array.isArray(colWidthArray)) return '0%';

    const containerWidthFallback = convertViewportUnitToPixels(Default_Grid_Width_VW);
    const containerWidth = getContainerWidthInPixels('.react-data-grid-lite-component', containerWidthFallback);
    const avoidingBelowHundredPercent = 5; // extra buffer to avoid layout shrinkage
    const buttonColumnWidth = parseFloat(Button_Column_Width?.replace?.('px', '') || '0');
    const mobileColumnWidth = parseFloat(Mobile_Column_Width?.replace?.('px', '') || '0');

    let fixedWidthTotal = 0;
    let fixedWidthColCount = 0;
    let nonFixedWidthColCount = 0;

    colWidthArray.forEach((width, index) => {
        if (!hiddenCols?.includes(index)) {
            const numeric = parseFloat(width);
            if (isNull(width)) {
                nonFixedWidthColCount++;
            } else if (!isNaN(numeric)) {
                fixedWidthColCount++;
                fixedWidthTotal += numeric;
            }
        }
    });

    const totalVisibleColumns = fixedWidthColCount + nonFixedWidthColCount;
    if (totalVisibleColumns === 0) return '100%';

    if (currentColKey === Button_Column_Key) {
        return Button_Column_Width;
    }

    const netContainerWidth = buttonColEnabled ? containerWidth - buttonColumnWidth : containerWidth;
    const colWidthSet = colWidthArray?.[currentColKey] ?? null;
    const parsedColWidthSet = parseFloat(colWidthSet?.replace?.('px', '') || '0');

    // MOBILE FIRST
    if (isMobile) {
        const totalMobileRequired = totalVisibleColumns * mobileColumnWidth;
        return totalMobileRequired >= netContainerWidth
            ? (parsedColWidthSet > mobileColumnWidth ? colWidthSet : Mobile_Column_Width)
            : `${(netContainerWidth / totalVisibleColumns)}px`;
    }

    // DESKTOP LOGIC

    //  SCENARIO 1: All columns fixed width
    if (fixedWidthColCount > 0 && nonFixedWidthColCount === 0) {
        if (fixedWidthTotal >= netContainerWidth) {
            return colWidthSet ?? 'auto';
        } else {
            // Rebalance: stretch fixed cols using % to fill grid
            return `${(netContainerWidth / totalVisibleColumns)}px`;
        }
    }

    // SCENARIO 2: Mixed fixed and flexible columns
    if (nonFixedWidthColCount > 0 && fixedWidthColCount > 0) {
        const usedPercent = ((fixedWidthTotal + (buttonColEnabled ? buttonColumnWidth : 0)) * 100) / containerWidth;
        const remainingPercent = 100 + avoidingBelowHundredPercent - usedPercent;
        const colPercentWidth = remainingPercent / nonFixedWidthColCount;

        return colWidthSet ?? `${colPercentWidth}%`;
    }

    // SCENARIO 3: All columns flexible (your missing case)
    if (fixedWidthColCount === 0 && nonFixedWidthColCount > 0) {
        const colWidthCal = (100 + avoidingBelowHundredPercent) / nonFixedWidthColCount;
        const colPixelEstimate = (colWidthCal * containerWidth) / 100;

        const nonFixedWidth = colPixelEstimate * nonFixedWidthColCount;

        if (nonFixedWidth >= netContainerWidth) {
            return `${colWidthCal}%`;
        } else {
            return `${(netContainerWidth / totalVisibleColumns)}px`;
        }
    }

    // 3. Fallback
    return `${(netContainerWidth / totalVisibleColumns)}px`;
}
