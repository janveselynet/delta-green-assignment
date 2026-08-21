import { convertSpeedFromMsToKmh } from './convertSpeedFromMsToKmh'

describe(convertSpeedFromMsToKmh.name, () => {
    it('should correctly convert m/s to km/h', () => {
        expect(convertSpeedFromMsToKmh(10)).toBe(36);
        expect(convertSpeedFromMsToKmh(0)).toBe(0);
    });
});
