import {
    Border_Padding_Margin_Width,
    Button_Column_Key,
    Button_Column_Width,
    Container_Identifier,
    Default_Grid_Width_VW,
    Fallback_Column_Width,
    Mobile_Column_Width
} from "../constants";
import {
    convertViewportUnitToPixels,
    getContainerWidthInPixels,
    isNull
} from "../helpers/common";
import { format } from "../helpers/format";

export function calculateColumnWidth(
    colWidthArray,
    hiddenCols,
    currentColKey,
    buttonColEnabled = false,
    isMobile = false
) {
    if (!Array.isArray(colWidthArray)) return '100%';
    const containerWidth = getContainerWidthInPixels(Container_Identifier,
        convertViewportUnitToPixels(Default_Grid_Width_VW));
    const buttonColumnWidth = parseFloat(Button_Column_Width?.replace?.('px', '') || '0');
    const mobileColumnWidth = parseFloat(Mobile_Column_Width?.replace?.('px', '') || '0');
    const fallbackWidth = parseFloat(Fallback_Column_Width?.replace?.('px', '') || '0');
    const netContainerWidth = buttonColEnabled ?
        containerWidth - buttonColumnWidth - parseFloat(Border_Padding_Margin_Width ?? 0)
        : containerWidth - parseFloat(Border_Padding_Margin_Width ?? 0);
    let fixedWidthTotal = 0;
    let fixedWidthColCount = 0;
    let nonFixedWidthColCount = 0;

    colWidthArray.forEach((width, index) => {
        if (hiddenCols?.includes(index)) return;
        if (width == null) {
            nonFixedWidthColCount++;
            return;
        }
        const pixelValue = tryParseWidth(width, containerWidth);
        if (isNaN(pixelValue) || pixelValue <= 0) {
            nonFixedWidthColCount++;
        } else {
            fixedWidthColCount++;
            fixedWidthTotal += pixelValue;
        }
    });

    const totalVisibleColumns = fixedWidthColCount + nonFixedWidthColCount;
    if (totalVisibleColumns === 0) return '100%';

    // Handle button column
    if (currentColKey === Button_Column_Key) {
        return Button_Column_Width;
    }

    let parsedWidth = tryParseWidth(colWidthArray?.[currentColKey] ?? 0, containerWidth);

    const isValidWidth = !isNaN(parsedWidth) && parsedWidth > 0;
    const safeColWidth = isValidWidth ? `${parsedWidth}px` : Fallback_Column_Width;
    const nonFixedColumnComputedValue = nonFixedWidthColCount > 0 ?
        ((netContainerWidth - fixedWidthTotal) / nonFixedWidthColCount) : 0;
    // MOBILE LOGIC
    if (isMobile) {
        const totalMobileRequired = totalVisibleColumns * mobileColumnWidth;
        return totalMobileRequired >= netContainerWidth
            ? (parsedWidth > mobileColumnWidth ? safeColWidth : Mobile_Column_Width)
            : `${(netContainerWidth / totalVisibleColumns)}px`;
    }

    // DESKTOP LOGIC

    // SCENARIO 1: All fixed columns
    if (fixedWidthColCount > 0 && nonFixedWidthColCount === 0) {
        if (fixedWidthTotal >= netContainerWidth) {
            return safeColWidth;
        } else {
            return `${(netContainerWidth / totalVisibleColumns)}px`;
        }
    }

    // SCENARIO 2: Mixed fixed + flexible
    if (nonFixedWidthColCount > 0 && fixedWidthColCount > 0) {
        return colWidthArray?.[currentColKey] ? safeColWidth :
            (nonFixedColumnComputedValue > fallbackWidth ? `${nonFixedColumnComputedValue}px` : Fallback_Column_Width);
    }

    // SCENARIO 3: All flexible
    if (fixedWidthColCount === 0 && nonFixedWidthColCount > 0) {
        return (netContainerWidth / totalVisibleColumns) > fallbackWidth ?
            `${(netContainerWidth / totalVisibleColumns)}px` : Fallback_Column_Width;
    }

    // Fallback
    return `${(netContainerWidth / totalVisibleColumns)}px`;
}

export const tryParseWidth = (val, totalWidth = 0) => {
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.endsWith('%')) {
            const percent = parseFloat(trimmed);
            return isNaN(percent) ? 0 : (percent * totalWidth) / 100;
        }
        if (trimmed.endsWith('px')) {
            const px = parseFloat(trimmed);
            return isNaN(px) ? 0 : px;
        }
        const num = parseFloat(trimmed);
        return isNaN(num) ? 0 : num;
    }
    if (typeof val === 'number') {
        return val;
    }
    return 0;
};

export function formatRowData(row, columns) {
    const keyMap = {};
    const normalizedRow = Object.fromEntries(
        Object.entries(row).map(([k, v]) => [k.toLowerCase(), v])
    );
    columns?.forEach((column) => {
        const colName = column.name;
        const valueFromRow = normalizedRow[colName.toLowerCase()];
        const conValue = getConcatValue(normalizedRow, columns, column.concatColumns);
        const value = getFormattedValue(conValue || valueFromRow, column.formatting);
        keyMap[colName.toLowerCase()] = value;
    });

    return keyMap;
}

const getConcatValue = (row, columns, concatColumns) => {
    const conCols = concatColumns?.columns || [];
    const conSep = concatColumns?.separator || ' ';
    return conCols
        .map(conName => {
            const colDef = columns.find(c => c?.name?.toUpperCase() === conName?.toUpperCase());
            return colDef ? row[colDef.name.toLowerCase()] : '';
        })
        .filter(Boolean)
        .join(conSep);
};

const getFormattedValue = (value, formatting) => {
    if (!isNull(value) && formatting?.type) {
        return format(value, formatting.type, formatting.format);
    }
    return value;
};

export const resolveColumnType = (concatType, baseType) => {
    return (
        typeof concatType === "string" ? concatType :
            typeof concatType?.type === "string" ? concatType.type :
                typeof baseType === "string" ? baseType :
                    typeof baseType?.type === "string" ? baseType.type :
                        'text'
    );
}

export const resolveColumnItems = (concatType, baseType) => {
    return (
        Array.isArray(concatType?.values) ? concatType.values :
            Array.isArray(baseType?.values) ? baseType.values :
                []
    );
}