import { Button_Column_Key, Button_Column_Width, Selection_Column_Key, Selection_Column_Width } from "../constants";
import { tryParseValue } from "./component-utils";

export function getActionColumnStyle(
    header,
    isActionColumnLeft,
    isActionColumnRight,
    isSelectionColumnLeft,
    isSelectionColumnRight,
    isMobile,
    enableRtl,
    withLightBoxShadow = false
) {
    const selectionColLeft = isActionColumnLeft && isSelectionColumnLeft && !isMobile
        ? Button_Column_Width
        : (!isActionColumnLeft && isSelectionColumnLeft && !isMobile ? 0 : '');

    const buttonColLeft = isActionColumnLeft && !isMobile ? 0 : '';

    const selectionColRight = isActionColumnRight && isSelectionColumnRight && !isMobile
        ? `${tryParseValue(Button_Column_Width) - 0.5}px`
        : (!isActionColumnRight && isSelectionColumnRight && !isMobile ? '-0.5px' : '');

    const buttonColRight = isActionColumnRight && !isMobile ? '-0.5px' : '';

    const width = header === Button_Column_Key ? Button_Column_Width : Selection_Column_Width;

    const baseStyle = {
        width,
        maxWidth: width,
        minWidth: width,
        left: enableRtl
            ? (header === Button_Column_Key ? buttonColRight : selectionColRight)
            : (header === Button_Column_Key ? buttonColLeft : selectionColLeft),
        right: enableRtl
            ? (header === Button_Column_Key ? buttonColLeft : selectionColLeft)
            : (header === Button_Column_Key ? buttonColRight : selectionColRight),
        position: (isActionColumnRight || isActionColumnLeft || isSelectionColumnLeft || isSelectionColumnRight) && !isMobile
            ? 'sticky'
            : '',
        zIndex: (isActionColumnRight || isActionColumnLeft || isSelectionColumnLeft || isSelectionColumnRight) && !isMobile
            ? 10
            : '',
        backgroundColor: (isActionColumnRight || isActionColumnLeft || isSelectionColumnLeft || isSelectionColumnRight)
            ? 'inherit'
            : '',
        contain: 'layout paint'
    };

    if (!isMobile) {
        let shadowSize = withLightBoxShadow ? "0.2px" : "0.6px";

        if ((header === Button_Column_Key && isActionColumnLeft) ||
            (header === Selection_Column_Key && isSelectionColumnLeft)) {
            baseStyle.boxShadow = enableRtl
                ? `#e0e0e0 ${shadowSize} 0 0 0 inset`
                : `#e0e0e0 -${shadowSize} 0 0 0 inset`;
        } else if ((header === Button_Column_Key && isActionColumnRight) ||
            (header === Selection_Column_Key && isSelectionColumnRight)) {
            baseStyle.boxShadow = enableRtl
                ? `#e0e0e0 -${shadowSize} 0 0 0 inset`
                : `#e0e0e0 ${shadowSize} 0 0 0 inset`;
        } else {
            baseStyle.boxShadow = '';
        }
    }

    return baseStyle;
}

export function getHeaderCellStyles(
    header,
    width,
    enableColumnResize,
    enableRtl,
    isMobile,
    computedColumnWidths = []
) {
    const colResizable = typeof header?.resizable === "boolean"
        ? header?.resizable : enableColumnResize;
    const fixed = header?.fixed && !isMobile;

    return {
        width,
        maxWidth: colResizable ? undefined : width,
        minWidth: colResizable ? undefined : width,
        left: fixed === true && !enableRtl
            ? computedColumnWidths.find(i => i.name === header.name)?.leftPosition ?? ''
            : '',
        right: fixed === true && enableRtl
            ? computedColumnWidths.find(i => i.name === header.name)?.leftPosition ?? ''
            : '',
        position: fixed === true ? 'sticky' : '',
        zIndex: fixed === true ? 10 : '',
        backgroundColor: 'inherit',
        contain: 'layout paint',
        ...(typeof header?.headerStyle === 'object' && !Array.isArray(header?.headerStyle)
            ? header.headerStyle
            : {})
    };
}