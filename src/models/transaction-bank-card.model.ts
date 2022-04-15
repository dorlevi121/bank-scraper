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
    PurchaseTypeCode: number
    PurchaseTypeDescription: string
    PurchaseLocationCode: string
    PurchaseLocationDescription: string
    InstallmentsNumber: string
    InstallmentNumber: string
    TotalNumberOfInstallments: string
    PurchaseAmount: number
    CalPurchaseCurrencySymbol: string
    PurchaseCurrencyCode: string
    DebitDate: string
    DebitAmount: number
    CalDebitCurrencySymbol: string
    DebitCurrencyCode: string
    TotalNumberOfPayments: number
    PurchaseLinkageCode: string
    PurchaseBaseExchangeRate: number
    PurchaseExchangeRate: number
    IssuerCode: string
    StandingOrderFlag: string
    CardPresentedFlag: string
    CurrencyConversionDate: string
    CurrencyConversionRate: number
    InternationalClearingConversionAmount: number
    InternationalClearingCurrency: string
    InternationalClearingCurrencyConversionRate: number
    ConversionRateCommission: number
    ConversionRateCommissionPercent: string
    ConversionRateCommissionAmount: number
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
    TaxAmount: number
    MerchantAddressXcoordinate: string
    MerchantAddressYcoordinate: string
    TempPurchaseFlag: string
    DigitalWalletType: number
    DescriptionOfDigitalWalletType: string
    Last4DigitsOfToken: string
    CardNumber: string
    IssuingCompanyName: string
    CardFamilyDescription: string
    CardName: string
    OrderNumerator: number
    ImmediateDebit: string
    DiscountClubAmount: number
    DiscountClubPercent: number
    DiscountClubName: string
    GoogleAPIKey: string
    PurchaseType: string
    BankIssueFlag: string
    IsIssuedByCal: string
    CardValidityDate: string
    TransactionMonth: string //MMYY
  }
  
  export interface DiscountKeyTotalsBlock {
    TotalRoundedDebits: number
    TotalDiscountDebits: number
    TotalKeySavings: number
    TotalCredit: number
    CardKeyStatus: string
  }
  