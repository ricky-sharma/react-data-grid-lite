export const applyTheme = (themeName) => {
    switch (themeName) {
        case "blue-core":
            return { grid: "theme-1", header: "theme-1-h", row: "theme-1-r" };

        case "dark-stack":
            return { grid: "theme-2", header: "theme-2-h", row: "theme-2-r" };

        case "medi-glow":
            return { grid: "theme-3", header: "theme-3-h", row: "theme-3-r" };

        default:
            return null;
    }
};
