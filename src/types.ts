export interface BatteryData {
    stateOfCharge: number;
    capacity: number;
    updatedAt: number;
}

export interface CarDataBuffer {
    latitude: { value: number; updatedAt: number } | null;
    longitude: { value: number; updatedAt: number } | null;
    speed: { value: number; updatedAt: number } | null; // v m/s
    gear: { value: number; updatedAt: number } | null;  // 0-6
    batteries: Record<number, BatteryData>;
}

export interface CarState {
    carId: number;
    time: string;
    stateOfCharge: number | null;
    latitude: number;
    longitude: number;
    gear: number;
    speed: number;
}
