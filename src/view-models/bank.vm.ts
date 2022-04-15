export interface BankPost {
    userId: number
    identityCard: string
    password: string
    code: string
    accountNumber: string
}

export interface BankGet {
    id: string
    dateCreated: string
    dateUpdated: string
    userId: number
    identityCard: string
    password: string
    code: string
    accountNumber: string
}