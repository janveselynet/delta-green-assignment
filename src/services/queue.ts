import amqp from 'amqplib';
import { RABBITMQ_QUEUE_NAME, RABBITMQ_URL } from '../config';
import { ConsumeMessage } from 'amqplib/properties';
import { CarState } from '../types';

export const getQueue = async () => {
    const rabbitConn = await amqp.connect(RABBITMQ_URL);
    const channel = await rabbitConn.createChannel();
    await channel.assertQueue(RABBITMQ_QUEUE_NAME, { durable: true });
    console.log('Connected to RabbitMQ');

    return {
        publish: (data: CarState) => {
            channel.sendToQueue(
                RABBITMQ_QUEUE_NAME,
                Buffer.from(JSON.stringify(data)),
                { persistent: true },
            );

            console.log('Published to RabbitMQ:', data);
        },
        consume: async (onMessage: (data: CarState) => Promise<void>) => {
            await channel.prefetch(1);
            console.log('Writer is waiting for messages in queue:', RABBITMQ_QUEUE_NAME);

            await channel.consume(RABBITMQ_QUEUE_NAME, async (msg: ConsumeMessage | null) => {
                if (!msg) {
                    return;
                }

                try {
                    const parsedData: CarState = JSON.parse(msg.content.toString());
                    await onMessage(parsedData);
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error processing message from queue:', error);
                    channel.nack(msg, false, true);
                }
            });
        },
    };
};
