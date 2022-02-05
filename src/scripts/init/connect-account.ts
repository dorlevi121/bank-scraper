import { Page } from "puppeteer";

export class ConnectAccount {

    constructor() { }

    async connectToAccount(page: Page) {
        // Id
        await page.waitForSelector("#tzId");
        await page.type("#tzId", "203288139", { delay: 100 });
        // Password
        await page.waitForSelector("#tzPassword");
        await page.type("#tzPassword", "BHxhofraha12", { delay: 100 });
        // Code
        await page.waitForSelector("#aidnum");
        await page.type("#aidnum", "69FXPV", { delay: 1000 });
        // Connect button
        await page.waitForSelector(".sendBtn");
        await page.click('.sendBtn');
    }

}