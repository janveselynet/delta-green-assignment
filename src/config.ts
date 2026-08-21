export const MQTT_BROKER_URL = process.env.MQTT_URL || 'mqtt://localhost:51883';

export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:55672';
export const RABBITMQ_QUEUE_NAME = process.env.RABBITMQ_QUEUE || 'car_telemetry';

export const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || '55432');
export const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
export const POSTGRES_DATABASE = process.env.POSTGRES_DB || 'postgres';
