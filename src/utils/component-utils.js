import { Desktop_Button_Column_Width, Mobile_Column_Width } from "../constants";
import { isNull } from "../helper/common";

export function calColWidth(colWidthArray, currentColKey, buttonColEnabled = false, isMobile = false) {
    let widthNotSetColCount = 0;
    colWidthArray.forEach(item => {
        if (isNull(item)) {
            widthNotSetColCount++;
        }
    });

    const colWidthCal = widthNotSetColCount > 0
        ? (buttonColEnabled
            ? ((100 - parseFloat(Desktop_Button_Column_Width.replace('%', ''))) / widthNotSetColCount)
            : (100 / widthNotSetColCount))
        : 0;

    const colWidthSet = !isNull(colWidthArray) && !isNull(colWidthArray[currentColKey])
        ? colWidthArray[currentColKey]
        : null;

    return isMobile ? (colWidthSet ?? Mobile_Column_Width) : (colWidthSet ?? `${colWidthCal}%`);
}
