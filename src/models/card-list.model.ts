export interface CardList {
    CardList: Cards
}

export interface Cards {
    AccountCreditFramework: number
    AccountFrameworkNotUsed: number
    ToGoCardExist: string
    AccountFrameworkUsed: number
    CardsBlock: CardsBlock
    IssuerFrameworkEntry: IssuerFrameworkEntry[]
}

export interface CardsBlock {
    CardEntry: CardEntry[]
}

export interface CardEntry {
    CardTypeCode: string
    CardTypeDescription: string
    CardFamilyCode: string
    CardFamilyDescription: string
    CardNumber: string
    IdentityNumber: string
    CardStatusCode: number
    FreezingExpiriationDate: string
    CardValidityDate: string
    IsIssuedByCal: string
    BankIssueFlag: string
    CardFramework: number
    DateOfUpcomingDebit: string
    IssuerCode: string
    WalletCardID: string
    WalletsBlock: WalletsBlock
    ForeignAccountDebitCurrencySymbol: string
    CardHolderFirstName: string
    CardHolderLastName: string
    CardFrameworkExpirationDate: string
    CardFrameworkUsed: number
    IssuingCompanyName: string
    IssuingCompanyHomePage: string
    IssuingCompanyRestoreCode: string
    CardNameForDisplay: string
    IssuerURLsBlock: IssuerUrlsBlock
    CardName?: string
}

export interface WalletsBlock {
    WalletEntry: WalletEntry[]
}

export interface WalletEntry {
    WalletID: string
    WalletDescription: string
}

export interface IssuerUrlsBlock {
    IssuerURLsEntry: IssuerUrlsEntry[]
}

export interface IssuerUrlsEntry {
    PageCode: string
    PageURL: string
}

export interface IssuerFrameworkEntry {
    IssuerCode: string
    IssuerFramework: number
    IssuerFrameworkUsed: number
    IssuerFrameworkNotUsed: number
    IssuerLastUpdateDate: string
    IssuingCompanyName: string
}
