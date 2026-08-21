export const parseGear = (gearStr: string): number => {
    if (gearStr === 'N') {
        return 0;
    }

    const parsed = parseInt(gearStr);
    return isNaN(parsed) ? 0 : parsed;
};