import { Pool } from 'pg';
import { POSTGRES_DATABASE, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from '../config';
import { CarState } from '../types';

const pool = new Pool({
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
});

export const getDatabase = async () => {
    const dbClient = await pool.connect();
    console.log('Connected to Postgres database');
    dbClient.release();

    return {
        insertCarState: async (data: CarState) => {
            const query = `
                INSERT INTO car_state (car_id, time, state_of_charge, latitude, longitude, gear, speed)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `;

            const values = [
                data.carId,
                data.time,
                data.stateOfCharge,
                data.latitude,
                data.longitude,
                data.gear,
                data.speed,
            ];

            await pool.query(query, values);
            console.log(`[DB] Inserted record for car ${data.carId} at ${data.time}`);
        },
    };
};
