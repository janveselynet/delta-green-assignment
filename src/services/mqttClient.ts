import mqtt, { MqttClient } from 'mqtt';
import { MQTT_BROKER_URL } from '../config';

export const getMqttClient = async (topicPattern: string) => {
    const client: MqttClient = mqtt.connect(MQTT_BROKER_URL);

    client.on('connect', () => {
        console.log('Connected to MQTT Broker');
        client.subscribe(topicPattern);
    });

    return {
        subscribe: (onMessage: (topic: string, payload: string) => void) => {
            client.on('message', (topic, message) => {
                onMessage(topic, message.toString());
            });
        },
    };
};