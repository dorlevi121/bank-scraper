import { Transactions } from "./get-transaction/transactions";
import { BrowserScraper } from "./init/browser-scraper";
import { ConnectAccount } from "./init/connect-account";

const getUserTransaction = async () => {

    const bs = new BrowserScraper();
    const ca = new ConnectAccount();
  
  
    await bs.init();
    await ca.connectToAccount(bs.page);
  
    const tb = new Transactions(bs.page);
    await tb.getTransactionsBank("10/01/2022");
    await tb.getTransactionsBankCard();
  
  
  
    // const cardListUrl = "https://start.telebank.co.il/Titan/gatewayAPI/creditCards/cardList/0126681262";
    // const cardList: CardList = await getData(bs.page, cardListUrl);
    
  
  
  }