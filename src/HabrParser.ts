import puppeteer, {
    BrowserLaunchArgumentOptions,
    ElementHandle,
    Page,
} from 'puppeteer';

import { getRandomInt } from './utils';
import puppeteerConfig from '../puppeteer-config.json';

type ArticleContent = {
    name: string;
    href: string;
};

const TARGET_URL = new URL('https://habr.com/ru/top/daily/');

class HabrParser {
    public static async parse(): Promise<ArticleContent> {
        const browser = await puppeteer.launch(
            <BrowserLaunchArgumentOptions>puppeteerConfig
        );

        const page = await browser.newPage();
        await page.goto(TARGET_URL.toString());

        const article = await HabrParser.getRandomArticle(page);
        const result = await article.evaluate(HabrParser.parseArticle);

        await browser.close();
        return result;
    }

    private static async getRandomArticle(page: Page): Promise<ElementHandle<Element>> {
        await page.waitForSelector('.tm-articles-list__item');
        const articles = await page.$$('.tm-articles-list__item');

        if (!articles.length) {
            throw new Error('Unable to retrieve article elements');
        }

        const randomArticleIndex = getRandomInt(0, articles.length - 1);
        const targetArticle = articles.at(randomArticleIndex);

        if (!targetArticle) {
            throw new Error('Unable to retrieve random article');
        }

        return targetArticle;
    }

    private static parseArticle(article: Element): ArticleContent {
        const title = article.querySelector('h2.tm-title span');
        const link = article.querySelector('.tm-title__link');

        return {
            name: title?.textContent ?? '<No title>',
            href: link?.getAttribute('href') ?? '<No link>',
        }
    }
}

export { TARGET_URL, HabrParser };