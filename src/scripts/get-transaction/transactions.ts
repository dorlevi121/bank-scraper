import moment from "moment";
import { Page } from "puppeteer";
import { PrismaClient, TransactionCard } from "@prisma/client";
import { CardDebitsTransactionEntry, TransactionBankCardJson } from "../../models/transaction-bank-card.model";
import { TransactionBankJson } from "../../models/transaction-bank.model";
import { getData } from "../../utils/get-data.utils";
import { MerchantSectorPost } from "../../view-models/merchant-sector.vm";
import { MerchantPost } from "../../view-models/merchant.vm";
import { TransactionPost } from "../../view-models/transaction.vm";

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

    // from date example - 20210510 - YYYYMMDD
    public async getTransactionsBankCard() {
        let transactionsBankCards: CardDebitsTransactionEntry[] = [];
        let fromDate: string = '';
        let monthDifference: number = 0;
        const urlsRequest = [];

        await this.page.waitForSelector("#balance-block-first-line-0");

        const lastedTransaction = await this.getLastedTransaction();

        if (lastedTransaction) {
            const fromDay = Number(moment(lastedTransaction.date, "YYYYMMDD").get('D'));
            fromDate = moment(lastedTransaction.date, "YYYYMMDD").format("MMYYYY");
            // Month difference between todat to last transaction month
            monthDifference = moment(moment().format("MMYYYY"), "MMYYYY").diff(moment(fromDate, "MMYYYY").
                add(fromDay > 6 ? 1 : 0, 'month'), 'months', true);
            monthDifference = monthDifference > 12 ? 12 : monthDifference;
        }

        if (fromDate.length && monthDifference > 0) {
            for (let i = monthDifference; i > 0; i--) {
                const startDateStr = moment().subtract(i, 'months').format('MMYYYY');
                const url = this.BASE_URL + "Titan/gatewayAPI/creditCards/cardPastDebitTransactions/" +
                    this.accountNumber + '/' + startDateStr + "/A";
                urlsRequest.push(url);
            }
        }

        const url = this.BASE_URL + "Titan/gatewayAPI/creditCards/cardCurrentDebitTransactions/" +
            this.accountNumber + "/A";
        urlsRequest.push(url);

        let i = 0;
        for (const url of urlsRequest) {
            const data: TransactionBankCardJson = await getData(this.page, url);
            if (data.CardCurrentDebitTransactions) {
                transactionsBankCards = transactionsBankCards
                    .concat(data.CardCurrentDebitTransactions.CardDebitsTransactionsBlock.CardDebitsTransactionEntry)
            }
            else if (data.CardPastDebitTransactions) {
                transactionsBankCards = transactionsBankCards
                    .concat(data.CardPastDebitTransactions.CardDebitsTransactionsBlock.CardDebitsTransactionEntry)
            }
            if (i++ === 0 && lastedTransaction) {
                const lastTransactions: number = transactionsBankCards.findIndex(t =>
                    t.PurchaseDate === lastedTransaction?.date && t.PurchaseAmount === Number(lastedTransaction.amount)
                    && t.MerchantName === lastedTransaction.merchantName);
                if (lastTransactions)
                    transactionsBankCards.splice(lastTransactions);
            }
        }
        this.createTransaction(transactionsBankCards.reverse());
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
            await this.prisma.merchant.createMany({
                data: merchants,
                skipDuplicates: true
            })
                .catch(err => {
                    success = false;
                });
        }

        // const transactionModel: TransactionPost[] = await transaction.map(t => {
        //     return {
        //         userId: Number(this.user.id),
        //         amount: t?.PurchaseAmount?.toString() || "0",
        //         date: t?.PurchaseDate || "",
        //         description: t?.PurchaseTypeDescription || "",
        //         merchantName: t?.MerchantName.length ? t.MerchantName : "אין סוחר"
        //     }
        // });
        // console.log(transactionModel);

        // if (transactionModel.length) {
        //     const a = await this.prisma.transactionCard.createMany({
        //         data: transactionModel
        //     })
        //         .catch(err => {
        //             console.log(err);
        //             success = false;
        //         });
        //     console.log(a);
        // }


        return success;
    }

    private async getLastedTransaction(): Promise<{ date: string, merchantName: string, amount: string } | null> {
        const lastedTransaction = await this.prisma.transactionCard.findMany({
            where: { userId: this.user.id },
            select: { date: true, merchantName: true, amount: true },
            orderBy: { date: 'asc' },
            take: 1
        })
            .catch(err => {
                console.log(err);
            });

        if (lastedTransaction?.length)
            return lastedTransaction[0];

        return null;
    }
}