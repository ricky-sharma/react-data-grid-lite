import { useContext } from "react";
import { GridConfigContext } from "../context/grid-config-context";

export const useGridConfig = () => {
    return useContext(GridConfigContext);
};