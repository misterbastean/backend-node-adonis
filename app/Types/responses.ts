type BaseResponseData = {
  createdAt: string
  updatedAt: string
  id: string
}

export type AccountResponseData = BaseResponseData & {
  accountNumber: string
  accountTypeId: string
  amount: number
  availableAmount: number
  currencyCode: string
  name: string
  routingNumber: string
  userId: string
}

export type ListAccountsResponse = {
  code: 200
  data: AccountResponseData[]
}

export type CreateAccountResponse = {
  code: 201
  data: AccountResponseData
}

export type ShowAccountResponse = {
  code: 200
  data: AccountResponseData
}

export type UpdateAccountResponse = ShowAccountResponse

export type DeleteAccountResponse = {
  code: 200
  data: {
    id: string
  }
}

export type TransactionResponseData = BaseResponseData & {
  accountId: string
  amount: number
  merchant: string
  operation: string
  status: string
  transactionTypeId: string
  userId: string
}

export type ListTransactionsResponse = {
  code: 200
  data: TransactionResponseData[]
}

export type CreateTransactionResponse = {
  code: 201
  data: TransactionResponseData
}

export type ShowTransactionResponse = {
  code: 200
  data: TransactionResponseData
}

export type UpdateTransactionResponse = ShowTransactionResponse

export type DeleteTransactionResponse = {
  code: 200
  data: {
    id: string
  }
}

export type UserResponseData = BaseResponseData & {
  email: string
  firstName: string
  lastName: string
  role: string
  userName: string
}

export type ListUsersResponse = {
  code: 200
  data: UserResponseData[]
}

export type CreateUserResponse = {
  code: 201
  data: UserResponseData
}

export type ShowUserResponse = {
  code: 200
  data: UserResponseData
}

export type UpdateUserResponse = ShowUserResponse

export type DeleteUserResponse = {
  code: 200
  data: {
    id: string
  }
}
