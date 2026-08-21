import { CarDataBuffer } from './types';
import { getQueue } from './services/queue';
import { getMqttClient } from './services/mqttClient';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { parseGear } from './services/parseGear';
import { computeWeightedStateOfCharge } from './services/computeWeightedStateOfCharge';
import { convertSpeedFromMsToKmh } from './services/convertSpeedFromMsToKmh';

const argv = yargs(hideBin(process.argv))
    .option('carId', {
        type: 'number',
        default: 1,
        description: 'ID of the car to collect data for',
    })
    .option('tickIntervalMs', {
        type: 'number',
        default: 5000,
        description: 'Interval in ms for sending car state to queue',
    })
    .option('maxDataAgeMs', {
        type: 'number',
        default: 15000,
        description: 'Max allowed age of data before considering it stale',
    })
    .parseSync();

const CAR_ID = argv.carId;
const TICK_INTERVAL_MS = argv.tickIntervalMs;
const MAX_DATA_AGE_MS = argv.maxDataAgeMs;

const BATTERY_CAPACITIES: Record<number, number> = {
    0: 0,
    1: 0,
};

const carDataBuffer: CarDataBuffer = {
    latitude: null,
    longitude: null,
    speed: null,
    gear: null,
    batteries: {},
};

async function main() {
    const queue = await getQueue();
    const mqttClient = await getMqttClient(`car/${CAR_ID}/#`);

    mqttClient.subscribe((topic, message) => {
        const payload = JSON.parse(message);
        const now = Date.now();
        const parts = topic.split('/');

        if (topic.endsWith('/location/latitude')) {
            carDataBuffer.latitude = { value: parseFloat(payload.value), updatedAt: now };
        }
        else if (topic.endsWith('/location/longitude')) {
            carDataBuffer.longitude = { value: parseFloat(payload.value), updatedAt: now };
        }
        else if (topic.endsWith('/speed')) {
            carDataBuffer.speed = { value: parseFloat(payload.value), updatedAt: now };
        }
        else if (topic.endsWith('/gear')) {
            carDataBuffer.gear = { value: parseGear(payload.value), updatedAt: now };
        }
        else if (topic.includes('/battery/') && topic.endsWith('/soc')) {
            const bIndex = parseInt(parts[3], 10);
            carDataBuffer.batteries[bIndex] = {
                ...carDataBuffer.batteries[bIndex],
                stateOfCharge: parseFloat(payload.value),
                capacity: carDataBuffer.batteries[bIndex]?.capacity || BATTERY_CAPACITIES[bIndex] || 0,
                updatedAt: now,
            };
        }
        else if (topic.includes('/battery/') && topic.endsWith('/capacity')) {
            const bIndex = parseInt(parts[3], 10);
            const cap = parseFloat(payload.value);
            BATTERY_CAPACITIES[bIndex] = cap;
            if (carDataBuffer.batteries[bIndex]) {
                carDataBuffer.batteries[bIndex].capacity = cap;
            }
        }
    });

    setInterval(() => {
        const now = Date.now();

        const isStale = (updatedAt?: number) => !updatedAt || now - updatedAt > MAX_DATA_AGE_MS;

        if (
            !carDataBuffer.latitude || isStale(carDataBuffer.latitude.updatedAt) ||
            !carDataBuffer.longitude || isStale(carDataBuffer.longitude.updatedAt) ||
            !carDataBuffer.speed || isStale(carDataBuffer.speed.updatedAt)
        ) {
            console.warn('⚠️ Data source is unstable or stopped sending updates. Skipping frame.');
            return;
        }

        queue.publish({
            carId: CAR_ID,
            time: new Date().toISOString(),
            stateOfCharge: computeWeightedStateOfCharge(carDataBuffer.batteries),
            latitude: carDataBuffer.latitude.value,
            longitude: carDataBuffer.longitude.value,
            gear: carDataBuffer.gear ? carDataBuffer.gear.value : 0,
            speed: convertSpeedFromMsToKmh(carDataBuffer.speed.value),
        });
    }, TICK_INTERVAL_MS);
}

main().catch(console.error);
