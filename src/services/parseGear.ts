export const parseGear = (gearAsString: string): number => {
    if (gearAsString === 'N') {
        return 0;
    }

    const parsed = parseInt(gearAsString);
    return isNaN(parsed) ? 0 : parsed;
};