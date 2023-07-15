import { TelegramBot } from './src/TelegramBot';
import 'dotenv/config';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

(function bootstrap() {
    const bot = new TelegramBot(TELEGRAM_TOKEN);
})();
