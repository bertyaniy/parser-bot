import 'dotenv/config';
import { TelegramBot } from './src/TelegramBot';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bootstrap = async () => {
    const bot = new TelegramBot(TELEGRAM_TOKEN);
    bot.start();
}

bootstrap().catch(console.error);
