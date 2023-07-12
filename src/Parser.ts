import puppeteer, { Browser, BrowserLaunchArgumentOptions, Page } from "puppeteer";

type Content = {
    name: string | null | undefined;
    text: string | null | undefined;
    href: string | null | undefined;
};

export class Parser {
    private browser: Browser | null;
    private page: Page | null;

    constructor(private url: string, private browserLaunchArgumentOptions: BrowserLaunchArgumentOptions) {
        this.browser = null;
        this.page = null;
    }

    public async init(): Promise<Content> {
        this.browser = await puppeteer.launch(this.browserLaunchArgumentOptions);
        this.page = await this.browser.newPage();
        return this.loadPage(this.url);
    }

    private async loadPage(url: string): Promise<Content> {
        if (!this.browser) {
            throw new Error("Puppeteer instance not initialized");
        };
        await this.page?.goto(url);
        const content = await this.parse();
        return content;
    }

    public async parse(): Promise<Content> {
        await this.page?.waitForSelector('.tm-articles-list__item');
        const articleElements = await this.page?.$$('.tm-articles-list__item');
        if (articleElements === undefined) {
            throw new Error('Unable to retrieve article elements');
        } else {
            const randomIndex = Math.floor(Math.random() * articleElements?.length);
            const randomArticle = articleElements[randomIndex];
            const content = await randomArticle.evaluate((article) => {
                const title = article.querySelector('h2.tm-title span');
                const text = article.querySelector('.article-formatted-body br');
                const href = article.querySelector('.tm-title__link');
                return {
                    name: title?.textContent,
                    text: text?.textContent,
                    href: href?.getAttribute('href'),
                }
            });

            if (content === undefined) {
                throw new Error('Unable to parse content');
            }
            this.close();
            return content;
        }
    }

    private async close(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}