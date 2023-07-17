import { Context, Telegraf } from 'telegraf';
import { HabrParser, TARGET_URL } from './HabrParser';

export class TelegramBot {
    private bot: Telegraf<Context>;

    constructor(token?: string) {
        if (!token) {
            throw new Error('Telegram bot token not found');
        }
        
        this.bot = new Telegraf(token);
    }

    public start(): void {
        this.bot.launch();

        this.bot.start((ctx) => {
            ctx.reply(
                'Welcome to the parse / post bot. ' +
                'Type /parse to start bot work'
            );
        });
        
        this.bot.command('parse', async (ctx) => {
            const { name, href } = await HabrParser.parse();

            ctx.reply(
                name +
                '\n\n' +
                `${TARGET_URL.hostname}${href}`
            );
        });
    }
}