import moment from "moment";
import { Page } from "puppeteer";
import { PrismaClient } from "@prisma/client";
import { CardDebitsTransactionEntry, TransactionBankCardJson } from "../../models/transaction-bank-card.model";
import { TransactionBankJson } from "../../models/transaction-bank.model";
import { getData } from "../../utils/get-data.utils";
import { MerchantSectorPost } from "../../view-models/merchant-sector.vm";
import { MerchantPost } from "../../view-models/merchant.vm";
import { TransactionPost } from "../../view-models/transaction.vm";
import { UserGet } from "../../view-models/user.vm";

export class Transactions {

    private prisma = new PrismaClient();
    private BASE_URL = 'https://start.telebank.co.il/';
    private accountNumber = "";
    private page: Page
    private user: UserGet;
    private lastTransactionRequest: string;

    constructor(page: Page, user: any) {
        this.page = page;
        this.user = user;
        this.accountNumber = this.user.bank.accountNumber;
        this.lastTransactionRequest = this.user.lastTransactionRequest;
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

    // from date example - 20210510 - YYYYMMDD
    public async getTransactionsBankCard() {
        let transactionsBankCards: CardDebitsTransactionEntry[] = [];
        let lastedTransaction: { date: string; merchantName: string; amount: string; } | null = null;
        let fromDate: string = '';
        let monthDifference: number = 0;
        const urlsRequest: { url: string, date: string }[] = [];
        const currentMonthUrl = this.BASE_URL + "Titan/gatewayAPI/creditCards/cardCurrentDebitTransactions/" +
            this.accountNumber + "/A";

        await this.page.waitForSelector("#balance-block-first-line-0");

        const currentMonthRequest: TransactionBankCardJson = await getData(this.page, currentMonthUrl);
        const currentMonthTransaction: CardDebitsTransactionEntry[] = currentMonthRequest.CardCurrentDebitTransactions.CardDebitsTransactionsBlock.CardDebitsTransactionEntry;

        if (this.user.lastTransactionRequest) {
            lastedTransaction = await this.getLastedTransaction(moment(this.user.lastTransactionRequest, "DDMMYYY").format("MMYY"));
        }
        // It's mean that the last trnsaction its from the cuurent month if true
        const isSameMonth: number = currentMonthTransaction.findIndex(t =>
            t.PurchaseDate === lastedTransaction?.date && t.PurchaseAmount === Number(lastedTransaction?.amount)
            && t.MerchantName === lastedTransaction?.merchantName);

        if (lastedTransaction && isSameMonth === -1) {
            const fromDay = Number(moment(lastedTransaction.date, "YYYYMMDD").get('D'));
            fromDate = moment(lastedTransaction.date, "YYYYMMDD").format("MMYYYY");
            // Month difference between todat to last transaction month
            monthDifference = moment(moment().format("MMYYYY"), "MMYYYY").diff(moment(fromDate, "MMYYYY"), 'months', true);
            monthDifference = monthDifference > 12 ? 12 : monthDifference;

            if (monthDifference > 0) {
                for (let i = monthDifference; i > 0; i--) {
                    const startDateStr = moment().subtract(i, 'months').format('MMYYYY');
                    const url = this.BASE_URL + "Titan/gatewayAPI/creditCards/cardPastDebitTransactions/" +
                        this.accountNumber + '/' + startDateStr + "/A";
                    urlsRequest.push({ url, date: moment(startDateStr).format('MMYY') });
                }
            }
        }

        urlsRequest.push({ url: currentMonthUrl, date: moment(currentMonthTransaction.at(-1)?.PurchaseDate).format('MMYY') });

        let i = 0;
        for (const url of urlsRequest) {
            const lastedMonthTransactions = await this.prisma.transaction.findMany({
                where: { userId: this.user.id, transactionMonth: url.date },
                select: { date: true, merchantName: true, amount: true },
            })
            if (i === urlsRequest.length - 1) {
                const withMonthTransaction = currentMonthTransaction.map(t =>
                    ({ ...t, TransactionMonth: url.date }));;
                const newTransactions = this.getNotExistTransaction(withMonthTransaction, lastedMonthTransactions);
                transactionsBankCards = transactionsBankCards.concat(newTransactions);
            }
            else {
                const data: TransactionBankCardJson = await getData(this.page, url.url);
                const withMonthTransaction = data.CardCurrentDebitTransactions.CardDebitsTransactionsBlock.CardDebitsTransactionEntry.map(t =>
                    ({ ...t, TransactionMonth: url.date }));;
                const newTransactions = this.getNotExistTransaction(withMonthTransaction, lastedMonthTransactions);

                transactionsBankCards = transactionsBankCards.concat(newTransactions)
            }
            i++;
        }
        // transactionsBankCards = transactionsBankCards.slice(2);


        this.createTransaction(transactionsBankCards.reverse());

        await this.prisma.user.update({
            where: { id: this.user.id },
            data: { lastTransactionRequest: moment().format('DDMMYYYY') }
        });
    }


    private async createTransaction(transaction: CardDebitsTransactionEntry[]): Promise<boolean> {
        let success = true;
        const sectors: MerchantSectorPost[] = [], merchants: MerchantPost[] = [];
        await transaction.forEach(t => {
            if (t?.MerchantSector && t?.MerchantSector?.length) {
                sectors.push(
                    {
                        name: t?.MerchantSector,
                        englishName: '',
                    }
                )
            }
        });
        if (sectors.length) {
            await this.prisma.merchantSector.createMany({
                data: sectors,
                skipDuplicates: true
            })
                .catch(err => {
                    success = false;
                });
        }

        // Merchant
        transaction.map(t => {
            if (t?.MerchantName && t?.MerchantName?.length) {
                merchants.push(
                    {
                        name: t?.MerchantName,
                        address: t?.MerchantFullAddress || "",
                        city: t?.MerchantCity || "",
                        phone: t?.MerchantPhoneNumber || "",
                        categoryId: 1,
                        sectorName: t?.MerchantSector?.length ? t.MerchantSector : "אין סקטור"
                    }
                )
            }
        });

        if (merchants?.length) {
            const a = await this.prisma.merchant.createMany({
                data: merchants,
                skipDuplicates: true
            })
                .catch(err => {
                    success = false;
                });
        }

        // Transaction
        const transactionModel: TransactionPost[] = await transaction.map(t => {
            let amount: number;
            if (t?.DebitCurrencyCode === "ILS")
                amount = t?.DebitAmount
            else
                amount = t?.PurchaseAmount

            return {
                userId: Number(this.user.id),
                amount: amount.toString() || "0",
                date: t?.PurchaseDate || "",
                description: t?.PurchaseTypeDescription || "",
                transactionMonth: t?.TransactionMonth ? t?.TransactionMonth : "",
                merchantName: t?.MerchantName.length ? t.MerchantName : "אין סוחר"
            }
        });

        if (transactionModel.length) {
            const a = await this.prisma.transaction.createMany({
                data: transactionModel
            })
                .catch(err => {
                    console.log(err);
                    success = false;
                });
        }


        return success;
    }

    private async getLastedTransaction(transactionMonth: string): Promise<{ date: string, merchantName: string, amount: string } | null> {
        const lastedTransaction = await this.prisma.transaction.findMany({
            where: { userId: this.user.id, transactionMonth },
            select: { date: true, merchantName: true, amount: true },
            orderBy: { date: 'desc' },
            take: 1
        })
            .catch(err => {
                console.log(err);
            });

        if (lastedTransaction?.length)
            return lastedTransaction[0];

        return null;
    }

    private getNotExistTransaction(bankTransaction: CardDebitsTransactionEntry[], dbTransaction: { date: string; merchantName: string; amount: string; }[]): CardDebitsTransactionEntry[] {
        const transactions = [];
        for (let i = 0; i < bankTransaction.length; i++) {
            const isExist = dbTransaction.find(tran =>
                bankTransaction[i].PurchaseDate.toString() === tran.date.toString() &&
                tran.amount.toString() === (bankTransaction[i]?.DebitCurrencyCode === "ILS" ? bankTransaction[i].DebitAmount.toString() : bankTransaction[i].PurchaseAmount.toString()));

            if (!isExist) {
                transactions.push(bankTransaction[i])
            }
        }
        console.log(transactions.length);

        return transactions;
    }
}