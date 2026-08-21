import { getDatabase } from './services/database';
import { getQueue } from './services/queue';

async function main() {
    const database = await getDatabase();
    const queue = await getQueue();

    await queue.consume(async (carState) => {
        await database.insertCarState(carState);
    });
}

main().catch(console.error);
