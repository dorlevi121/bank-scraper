export interface TransactionBank {
    CurrentAccountLastTransactions: CurrentAccountLastTransactions
  }
  
  export interface CurrentAccountLastTransactions {
    LastTransactionsOrder: string
    CurrentAccountInfo: CurrentAccountInfo
    AdditionalTransactions: string
    OperationEntry: OperationEntry[]
    FutureTransactionsBlock: FutureTransactionsBlock
    TotalFutureTransactionsBalance: number
    BalanceAfterOperationFrequency: string
    TotalOperation: number
    TotalNumberFutureTransaction: number
  }
  
  export interface CurrentAccountInfo {
    AccountBalance: number
    AccountCurrencyCode: string
    AccountCurrencyDescription: AccountCurrencyDescription
    CommissionFlag: string
  }
  
  export interface AccountCurrencyDescription {
    Value: string
    C: string
  }
  
  export interface OperationEntry {
    OperationDate: string
    ValueDate: string
    OperationCode: string
    OperationDescription: string
    OperationDescription2: string
    OperationDescription3: string
    OperationBranch: string
    OperationBank: string
    Channel: string
    ChannelName: string
    InstituteCode: string
    OperationAmount: number
    BalanceAfterOperation: number
    OperationNumber: number
    BranchTreasuryNumber: string
    Urn: string
    OperationDetailsServiceName: string
    CommissionChannelCode: string
    CommissionChannelName: string
    CommissionTypeName: string
    BusinessDayDate: string
    EventName: string
    CategoryCode: number
    CategoryDescCode: number
    CategoryDescription: string
    OperationDescriptionToDisplay: string
    OperationOrder: number
    IsLastSeen: boolean
    CheckNumber?: number
    DepositNumber?: number
  }
  
  export interface FutureTransactionsBlock {
    FutureTransactionStatus: string
    FutureTransactionEntry: FutureTransactionEntry[]
  }
  
  export interface FutureTransactionEntry {
    OperationDate: string
    OperationCode: string
    OperationDescription: string
    OperationDescription2: string
    OperationDescription3: string
    OperationAmount: number
    EstimatedBalance: number
    ValueDate: string
    Urn: string
    CategoryCode: number
    CategoryDescCode: number
    CategoryDescription: string
    Comments: string
    OperationDescriptionToDisplay: string
    OperationOrder: number
  }
  