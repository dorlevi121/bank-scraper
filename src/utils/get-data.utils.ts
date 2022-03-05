import { Page } from "puppeteer";

export async function getData(page: Page, url: string) {
    const data = await page.evaluate((url) => {

        return new Promise<any>((resolve, reject) => {
            fetch(url, {
                credentials: 'include',
            }).then((result) => {
                if (result.status === 204) {
                    resolve(null);
                } else {
                    resolve(result.json());
                }
            }).catch((e) => {
                reject(e);
            });
        });
    }, url);

    return data;
}


