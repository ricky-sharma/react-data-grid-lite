import {
    Border_Padding_Margin_Width,
    Button_Column_Width,
    Container_Identifier,
    Default_Grid_Width_VW,
    Fallback_Column_Width,
    Selection_Column_Width
} from "../constants";
import {
    convertViewportUnitToPixels,
    getContainerWidthInPixels,
    isNull,
    normalize
} from "../helpers/common";
import { format as formatVal } from "../helpers/format";

export function calculateColumnWidth(
    columns,
    currentColumn,
    buttonColEnabled = false,
    gridID,
    enableRowSelection
) {
    if (!Array.isArray(columns)) return '100%';
    const containerWidth = getContainerWidthInPixels(`#${gridID} ${Container_Identifier}`,
        convertViewportUnitToPixels(Default_Grid_Width_VW));
    const buttonColumnWidth = parseFloat(Button_Column_Width?.replace?.('px', ''));
    const selectionColumnWidth = parseFloat(Selection_Column_Width?.replace?.('px', ''));
    const fallbackWidth = parseFloat(Fallback_Column_Width?.replace?.('px', ''));
    const controlColumnsWidth =
        (buttonColEnabled ? buttonColumnWidth : 0) +
        (enableRowSelection ? selectionColumnWidth : 0);
    const spacing = parseFloat(Border_Padding_Margin_Width ?? 0) || 0;
    const netContainerWidth = containerWidth - spacing - controlColumnsWidth;
    let fixedWidthTotal = 0;
    let fixedWidthColCount = 0;
    let nonFixedWidthColCount = 0;

    columns.forEach((col, index) => {
        if (col?.hidden === true || col?.hideable === true) return;
        if (col?.width == null || col?.width === '') {
            nonFixedWidthColCount++;
            return;
        }
        const pixelValue = tryParseValue(col?.width, containerWidth);
        if (isNaN(pixelValue) || pixelValue <= 0) {
            nonFixedWidthColCount++;
        } else {
            fixedWidthColCount++;
            fixedWidthTotal += pixelValue;
        }
    });

    const totalVisibleColumns = fixedWidthColCount + nonFixedWidthColCount;
    if (totalVisibleColumns === 0) return '100%';

    let parsedWidth = tryParseValue(currentColumn?.width ?? 0, containerWidth);

    const isValidWidth = !isNaN(parsedWidth) && parsedWidth > 0;
    const safeColWidth = isValidWidth ? `${parsedWidth}px` : Fallback_Column_Width;
    const nonFixedColumnComputedValue = nonFixedWidthColCount > 0 ?
        ((netContainerWidth - fixedWidthTotal) / nonFixedWidthColCount) : 0;

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
        return currentColumn?.width != null && currentColumn?.width !== '' ? safeColWidth :
            (nonFixedColumnComputedValue > fallbackWidth ?
                `${nonFixedColumnComputedValue}px` : Fallback_Column_Width);
    }

    // SCENARIO 3: All flexible, fixedWidthColCount === 0 && nonFixedWidthColCount > 0
    return (netContainerWidth / totalVisibleColumns) > fallbackWidth
        ? `${(netContainerWidth / totalVisibleColumns)}px`
        : Fallback_Column_Width;
}

export const tryParseValue = (val, total = 0) => {
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.endsWith('%')) {
            const percent = parseFloat(trimmed);
            return isNaN(percent) ? 0 : (percent * total) / 100;
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
    const normalizedRow = normalizeRowKeys(row);
    columns?.forEach((column) => {
        const value = resolveFormattedValue(normalizedRow, column);
        keyMap[column?.name?.toLowerCase()] = value;
    });

    return keyMap;
}

export function resolveFormattedValue(row, column) {
    const valueFromRow = row[column?.name?.toLowerCase()];
    const conValue = getConcatValue(row, column?.concatColumns);
    const value = getFormattedValue(conValue || valueFromRow, column?.formatting);
    return value;
}

export function normalizeRowKeys(row) {
    return Object.fromEntries(
        Object.entries(row).map(([k, v]) => [k?.toLowerCase(), v])
    );
}

const getConcatValue = (row, concatColumns) => {
    const conCols = concatColumns?.columns || [];
    const conSep = concatColumns?.separator || ' ';
    return conCols
        .map(conName => {
            const matchedKey = Object.keys(row).find(
                key => key?.toLowerCase() === conName?.toLowerCase()
            );
            return matchedKey ? row[matchedKey] : '';
        })
        .filter(Boolean)
        .join(conSep);
};

const getFormattedValue = (value, formatting) => {
    if (!isNull(value) && formatting?.type) {
        return formatVal(value, formatting.type, formatting.format);
    }
    return value;
};

export const getNormalizedCombinedValue = (obj, keys, formatType, type, format, separator = ' ') => {
    return keys
        .map(k => {
            const val = obj[k];
            return formatType.includes(type?.toLowerCase())
                ? formatVal(val, type?.toLowerCase(), format)
                : val;
        })
        .filter(v => !isNull(v))
        .map(normalize)
        .join(separator);
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