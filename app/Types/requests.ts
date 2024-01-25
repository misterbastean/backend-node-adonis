export type CreateAccountRequest = {
  data: {
    accountNumber: string
    accountTypeId: string
    amount: number
    availableAmount: number
    currencyCode: string
    name: string
    routingNumber: string
    userId: string
  }
}

export type UpdateAccountRequest = {
  data: {
    accountNumber: string
    accountTypeId: string
    amount: number
    availableAmount: number
    currencyCode: string
    name: string
    routingNumber: string
  }
}

export type CreateTransactionRequest = {
  data: {
    accountId: string
    amount: number
    availableAmount: number
    merchant: string
    operation: string
    status: string
    transactionTypeId: string
    userId: string
  }
}

export type UpdateTransactionRequest = {
  data: {
    amount: number
    availableAmount: number
    merchant: string
    operation: string
    status: string
    transactionTypeId: string
  }
}

export type CreateUserRequest = {
  data: {
    email: string
    firstName: string
    lastName: string
    password: string
    userName: string
  }
}

export type UpdateUserRequest = {
  data: {
    email: string
    firstName: string
    lastName: string
    userName: string
  }
}
