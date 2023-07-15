import { Context, Telegraf } from 'telegraf';
import { BrowserLaunchArgumentOptions } from 'puppeteer';

import { Parser } from './Parser';
import puppeteerConfig from '../puppeteer-config.json';

const TARGET_URL = 'https://habr.com/ru/top/daily/';

export class TelegramBot {
    private bot: Telegraf<Context>;
    private parse: Parser;

    constructor(token?: string) {
        if (!token) {
            throw new Error('Telegram bot token not found');
        }
        
        this.parse = new Parser(TARGET_URL, <BrowserLaunchArgumentOptions>puppeteerConfig);
        this.bot = new Telegraf(token);
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