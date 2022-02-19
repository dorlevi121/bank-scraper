import { Prisma, PrismaClient, User } from "@prisma/client";
import { Transactions } from "./get-transaction/transactions";
import { BrowserScraper } from "./init/browser-scraper";
import { ConnectAccount } from "./init/connect-account";

export class Scraper {

  private prismaClient = Prisma;
  private prisma = new PrismaClient();
  private browser = new BrowserScraper();
  private account = new ConnectAccount();
  private userId: number;
  private user: User;

  constructor(userId: number) {
    this.userId = userId;
  }

  public async start() {
    const userExist = await this.getUser();

    if (!userExist)
      return false;

    await this.browser.init();
    const connect = await this.account.connectToAccount(this.browser.page, this.user);

    if (connect) {
      // const tb = new Transactions(this.browser.page);
      // await tb.getTransactionsBank();
      // await tb.getTransactionsBankCard();
    }
    else {
      return false;
    }

    return true;

    // const cardListUrl = "https://start.telebank.co.il/Titan/gatewayAPI/creditCards/cardList/0126681262";
    // const cardList: CardList = await getData(bs.page, cardListUrl);
  }

  private async getUser(): Promise<boolean> {

    const user: any = await this.prisma.user.findUnique({
      where: { id: this.userId },
      include: {
        bank: true
      }
    })
      .catch(err => {
        return false;
      });;

    if (user?.bank) {
      this.user = user;
      return true;
    }
    return false;
  }


} 