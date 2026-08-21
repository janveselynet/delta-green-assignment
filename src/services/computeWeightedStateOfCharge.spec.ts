import { computeWeightedStateOfCharge } from './computeWeightedStateOfCharge'
import { BatteryData } from '../types'

describe(computeWeightedStateOfCharge.name, () => {
    it('should calculate correct weighted average for multiple batteries', () => {
        const batteries: Record<number, BatteryData> = {
            0: { stateOfCharge: 80, capacity: 50, updatedAt: Date.now() },
            1: { stateOfCharge: 40, capacity: 100, updatedAt: Date.now() },
        };

        expect(computeWeightedStateOfCharge(batteries)).toBe(53);
    });

    it('should return null when input batteries object is empty', () => {
        expect(computeWeightedStateOfCharge({})).toBeNull();
    });

    it('should return null when total capacity is 0', () => {
        const batteries: Record<number, BatteryData> = {
            0: { stateOfCharge: 80, capacity: 0, updatedAt: Date.now() },
        };

        expect(computeWeightedStateOfCharge(batteries)).toBeNull();
    });

    it('should correctly handle stateOfCharge equal to 0', () => {
        const batteries: Record<number, BatteryData> = {
            0: { stateOfCharge: 0, capacity: 50, updatedAt: Date.now() },
        };

        expect(computeWeightedStateOfCharge(batteries)).toBe(0);
    });
});