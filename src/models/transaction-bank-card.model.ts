export interface TransactionBankCardJson {
    CardPastDebitTransactions: CardCurrentDebitTransactions
    CardCurrentDebitTransactions: CardCurrentDebitTransactions
  }
  
  export interface CardCurrentDebitTransactions {
    CardDebitsTransactionsBlock: CardDebitsTransactionsBlock
    DiscountKeyTotalsBlock: DiscountKeyTotalsBlock
    NISTotalDebit: number
    USDTotalDebit: number
    EURTotalDebit: number
    NISTotalsEmmediateBill: number
    USDTotalsEmmediateBill: number
    EURTotalsEmmediateBill: number
    NISTotalEstimatedOnlineDebit: number
    USDTotalEstimatedOnlineDebit: number
    EURTotalEstimatedOnlineDebit: number
  }
  
  export interface CardDebitsTransactionsBlock {
    CardDebitsTransactionEntry: CardDebitsTransactionEntry[]
  }
  
  export interface CardDebitsTransactionEntry {
    PurchaseDate: string
    MerchantName: string
    MerchantSector: string
    PurchaseTypeDescription: string
    PurchaseLocationCode: string
    PurchaseLocationDescription: string
    PurchaseComments: string
    PurchaseAmount?: number
    CalPurchaseCurrencySymbol: string
    DebitDate: string
    DebitAmount: number
    DebitCurrencySymbol: string
    CurrencyExchangeRateAmountGap: number
    CurrencyExchangeRate: number
    ForeignCashWithdrawalCommissionAmount: number
    ForeignCashWithdrawalAmount: number
    Comments: string
    MerchantFullAddress: string
    MerchantCity: string
    MerchantZipCode: string
    MerchantPhoneNumber: string
    MerchantFaxNumber: string
    MerchantSectorCodeDescription: string
    PurchaseTime: string
    ClubDiscountAmount: number
    ClubDiscountPercent: number
    ClubName: string
    TaxAmount: number
    PurchaseMethodType: string
    MerchantAddressXcoordinate: string
    MerchantAddressYcoordinate: string
    DigitalWalletType: number
    DescriptionOfDigitalWalletType: string
    Last4DigitsOfToken: string
    CardNumber: string
    CardFamilyDescription: string
    CardName: string
    OrderNumerator: number
    PurchaseDescription: string
    IssuingCompanyName: string
    IssuerCode: string
    GoogleAPIKey: string
    CardValidityDate: string
    BankIssueFlag: string
    IsIssuedByCal: string
  }
  
  export interface DiscountKeyTotalsBlock {
    TotalRoundedDebits: number
    TotalDiscountDebits: number
    TotalKeySavings: number
    TotalCredit: number
    CardKeyStatus: string
  }
  