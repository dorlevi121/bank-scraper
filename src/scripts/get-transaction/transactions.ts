import moment from "moment";
import { Page } from "puppeteer";
import { PrismaClient, TransactionCard } from "@prisma/client";
import { TransactionBankCardJson } from "../../models/transaction-bank-card.model";
import { TransactionBankJson } from "../../models/transaction-bank.model";
import { getData } from "../../utils/get-data.utils";

export class Transactions {

    private prisma = new PrismaClient();
    private BASE_URL = 'https://start.telebank.co.il/';
    private accountNumber = "";
    private page: Page
    private user: any;

    constructor(page: Page, user: any) {
        this.page = page;
        this.user = user;
        this.accountNumber = this.user.bank.accountNumber;
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
        else { // Take transaction of the last 1 year
            url = `${apiSiteUrl}lastTransactions/transactions/${this.accountNumber}/ByLastYear?IsTransactionDetails=True&IsFutureTransactionFlag=True&IsEventNames=True&IsCategoryDescCode=True`;
        }

        const transaction = await getData(this.page, url);
        const transactionJson: TransactionBankJson = JSON.parse(transaction);

        const transactionViewModel: any[] = [];
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
        const transactionsBankCards: TransactionBankCardJson = await getData(this.page, transactionsBankCardsUrl);

        await this.prisma.merchant.createMany({
            data: transactionsBankCards.CardCurrentDebitTransactions
                .CardDebitsTransactionsBlock.CardDebitsTransactionEntry.map(transaction => {
                    return {
                        name: transaction.MerchantName,
                        address: transaction?.MerchantFullAddress,
                        city: transaction.MerchantCity,
                        phone: transaction.MerchantPhoneNumber
                    }
                }),
            skipDuplicates: true
        });

        await this.prisma.transactionCard.createMany({
            data: transactionsBankCards.CardCurrentDebitTransactions
                .CardDebitsTransactionsBlock.CardDebitsTransactionEntry.map(transaction => {
                    return {
                        userId: this.user.id,
                        amount: transaction.PurchaseAmount.toString(),
                        currencyCode: transaction.PurchaseCurrencyCode,
                        date: transaction.PurchaseDate,
                        description: transaction.PurchaseTypeDescription,
                        merchantName: transaction.MerchantName
                    }
                }),
            skipDuplicates: true
        })
        .catch(err => {
            console.log(err);
            
        });
    }
}