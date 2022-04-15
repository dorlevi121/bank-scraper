import { BankGet } from "./bank.vm"
import { TransactionGet } from "./transaction.vm"

export interface UserGet {
    id: number
    dateCreated: string
    dateUpdated: string
    lastTransactionRequest: string
    email: string
    phone: string
    firstName: string
    lastName: string
    hashedPassword: string
    status: any
    transaction: TransactionGet[]
    bank: BankGet  
}

export interface UserPost {
    lastTransactionRequest: string
    email: string
    phone: string
    firstName: string
    lastName: string
    hashedPassword: string
    status: any
}