import moment from "moment";
import { Page } from "puppeteer";
import { TransactionBankCard } from "../../models/transaction-bank-card.model";
import { TransactionBank } from "../../models/transaction-bank.model";
import { getData } from "../../utils/get-data.helper";

export class Transactions {

    private BASE_URL = 'https://start.telebank.co.il/';
    private accountNumber = "0126681262";
    private page: Page

    constructor(page: Page) {
        this.page = page;
    }

    // from date example - 10/05/2021 - DD/MM/yyyy
    public async getTransactionsBank(fromDate?: string) {

        await this.page.waitForSelector("#current-balance-container");
        await this.page.click('#current-balance-container');

        const apiSiteUrl = `${this.BASE_URL}/Titan/gatewayAPI/`;


        // Take transaction of the last 1 year
        // const defaultStartMoment = moment().subtract(1, 'years').add(1, 'day');
        // const startDate = defaultStartMoment.toDate();
        // const startMoment = moment.max(defaultStartMoment, moment(startDate));
        // Format date
        // const startDateStr = startMoment.format("YYYYMMDD");
        let url: string;

        if (fromDate) {
            const startDateStr = moment(fromDate, "DD-MM-YYYY").format("YYYYMMDD");
            const endDateStr = moment().format("YYYYMMDD");
            url = apiSiteUrl + "lastTransactions/transactions/" + this.accountNumber +
                "/ByDate?FromDate=" + startDateStr + "&ToDate=" + endDateStr
                + "&IsTransactionDetails=True&IsFutureTransactionFlag=True&IsEventNames=True&IsCategoryDescCode=True";
        }
        else {
            // Take transaction of the last 1 year
            url = `${apiSiteUrl}lastTransactions/transactions/${this.accountNumber}/ByLastYear?IsTransactionDetails=True&IsFutureTransactionFlag=True&IsEventNames=True&IsCategoryDescCode=True`;
        }

        const transaction: TransactionBank = await getData(this.page, url);
    }

    // from date example - 05/2021 - MM/yyyy
    public async getTransactionsBankCard(fromDate?: string) {
        await this.page.waitForSelector("#balance-block-first-line-0");

        let transactionsBankCardsUrl: string;
        if (fromDate) {
            const startDateStr = moment(fromDate, "MM-YYYY").format("MMYYYY");
            transactionsBankCardsUrl = this.BASE_URL + "Titan/gatewayAPI/creditCards/cardPastDebitTransactions/" +
                this.accountNumber + startDateStr;
        }
        else {
            transactionsBankCardsUrl = this.BASE_URL + "Titan/gatewayAPI/creditCards/cardCurrentDebitTransactions/" +
                this.accountNumber + "/A";
        }
        const transactionsBankCards: TransactionBankCard = await getData(this.page, transactionsBankCardsUrl);

    }
}