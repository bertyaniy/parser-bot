import { Context, Telegraf } from "telegraf";
import { Parser } from "./Parser";
import { puppeteer_config, url } from './config.json'

export class TelegramBot {
    private bot: Telegraf<Context>;
    private parse: Parser;

    constructor(private botToken: string) {
        this.parse = new Parser(url, puppeteer_config);
        this.bot = new Telegraf(botToken);
        this.registerCommands();
        this.startPolling();
    }

    private registerCommands() {
        this.bot.start((ctx) => ctx.reply("Welcome to the parse/post bot. Type /parse to start bot work."));
        this.bot.command('parse', async (ctx) => {
            const result = this.parser();
            const resolvedContent = await result;
            ctx.reply(`${resolvedContent.name}\n\nhttps://habr.com${resolvedContent.href}`);
        });
    }

    private startPolling() {
        this.bot.launch();
    }

    private parser() {
        return this.parse.init();
    }
}