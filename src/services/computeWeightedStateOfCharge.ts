import { BatteryData } from '../types';

export const computeWeightedStateOfCharge = (batteries: Record<number, BatteryData>): number | null => {
    let totalWeightedStateOfCharge = 0;
    let totalCapacity = 0;

    for (const battery of Object.values(batteries)) {
        if (battery.capacity > 0) {
            totalWeightedStateOfCharge += battery.stateOfCharge * battery.capacity;
            totalCapacity += battery.capacity;
        }
    }

    if (totalCapacity === 0) {
        return null;
    }

    return Math.round(totalWeightedStateOfCharge / totalCapacity);
};