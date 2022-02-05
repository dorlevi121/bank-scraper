import puppeteer, { Browser, Page } from "puppeteer";

export class BrowserScraper {
    public browser!: Browser;
    public page!: Page;

    constructor() {}

    public async init() {
        this.browser = await puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1200, height: 720 });
        await this.page.goto('https://start.telebank.co.il/login/#/LOGIN_PAGE', { waitUntil: 'networkidle0' }); // wait until page load
    }
}