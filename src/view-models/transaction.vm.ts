export interface TransactionPost {
    userId: number
    amount: string
    date: string
    description: string
    merchantName: string
    transactionMonth: string
}

export interface TransactionGet {
    id: string
    dateCreated: string
    dateUpdated: string
    userId: number
    amount: string
    date: string
    description: string
    merchantName: string
    transactionMonth: string
}