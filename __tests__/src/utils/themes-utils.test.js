import { applyTheme } from './../../../src/utils/themes-utils';

describe('applyTheme', () => {
    it('returns correct theme object for "blue-core"', () => {
        expect(applyTheme('blue-core')).toEqual({
            grid: 'theme-1',
            header: 'theme-1-h',
            row: 'theme-1-r',
        });
    });

    it('returns correct theme object for "dark-stack"', () => {
        expect(applyTheme('dark-stack')).toEqual({
            grid: 'theme-2',
            header: 'theme-2-h',
            row: 'theme-2-r',
        });
    });

    it('returns correct theme object for "medi-glow"', () => {
        expect(applyTheme('medi-glow')).toEqual({
            grid: 'theme-3',
            header: 'theme-3-h',
            row: 'theme-3-r',
        });
    });

    it('returns null for unknown theme name', () => {
        expect(applyTheme('unknown-theme')).toBeNull();
    });

    it('returns null if themeName is undefined', () => {
        expect(applyTheme(undefined)).toBeNull();
    });

    it('returns null if themeName is null', () => {
        expect(applyTheme(null)).toBeNull();
    });

    it('returns null if themeName is an empty string', () => {
        expect(applyTheme('')).toBeNull();
    });
});
