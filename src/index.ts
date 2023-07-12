import { bot_token } from './config.json';
import { TelegramBot } from './TelegramBot';

(function bootstrap() {
    const bot = new TelegramBot(bot_token);
})();
