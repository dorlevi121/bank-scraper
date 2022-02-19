import { Page } from "puppeteer";
import { Prisma, PrismaClient, User } from "@prisma/client";

export class ConnectAccount {

    private prismaClient = Prisma;
    private prisma = new PrismaClient();
    private BASE_URL = 'https://start.telebank.co.il/';
    private user: any;

    constructor() { }

    async connectToAccount(page: Page, user: any) {
        this.user = user;

        if (user?.bank) {
            // Id
            await page.waitForSelector("#tzId");
            await page.type("#tzId", user?.bank?.identityCard || '', { delay: 100 });
            // Password
            await page.waitForSelector("#tzPassword");
            await page.type("#tzPassword", user.bank?.password, { delay: 100 });
            // Code
            await page.waitForSelector("#aidnum");
            await page.type("#aidnum", user.bank?.code || '', { delay: 500 });
            // Connect button
            await page.waitForSelector(".sendBtn");
            await page.click('.sendBtn');

            const result = await this.checkIfConnect(page);

            if (result?.length)
                return false;

            if (!user.bank.accountNumber)
                await this.setAccountNumber(page);
        }
        else {
            return false;
        }

        return true;
    }

    private async checkIfConnect(page: Page) {
        try {
            await page.waitForNavigation({ timeout: 10000 });
        } catch (error) {
            return "Error Connection";
        }
        const currentUrl = page.url();

        const urls: any = {};
        urls['Success'] = [`${this.BASE_URL}/apollo/core/templates/RETAIL/masterPage.html#/MY_ACCOUNT_HOMEPAGE`];
        urls['InvalidPassword'] = [`${this.BASE_URL}/apollo/core/templates/lobby/masterPage.html#/LOGIN_PAGE`];
        urls['ChangePassword'] = [`${this.BASE_URL}/apollo/core/templates/lobby/masterPage.html#/PWD_RENEW`];

        for (const key of Object.keys(urls)) {
            // @ts-ignore
            const conditions = urls[key];

            for (const condition of conditions) {
                let result = false;
                result = currentUrl.toLowerCase() === condition.toLowerCase();

                if (result) {
                    // @ts-ignore
                    return Promise.resolve(key);
                }
            }
        }

    }

    private async setAccountNumber(page: Page) {
        const accountNumber = await page.$eval(".topComboLabel .comboHeaderAccountNumber", el => el.textContent);
        
        await this.prisma.bank.update({
            where: { userId: this.user.id },
            data: {
                accountNumber
            }
        })

    }

}