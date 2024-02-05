import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { Account, Transaction, User } from "App/Models"
import {
  AccountResponseData,
  TransactionResponseData,
  UserResponseData,
} from "App/Types/responses"

export type DataResponse<T> = {
  code: number
  data: T
}

export type ErrorResponse = {
  code: number
  error: string
}

type PossibleEntityTypes =
  | Account
  | Account[]
  | Transaction
  | Transaction[]
  | User
  | User[]

type PossibleResponseDataTypes =
  | AccountResponseData
  | AccountResponseData[]
  | TransactionResponseData
  | TransactionResponseData[]
  | UserResponseData
  | UserResponseData[]

function parseAccountForResponse(data: Account): AccountResponseData {
  return {
    accountNumber: data.$attributes.accountNumber,
    accountTypeId: data.$attributes.accountTypeId,
    amount: data.$attributes.amount,
    availableAmount: data.$attributes.availableAmount,
    createdAt: data.$attributes.createdAt,
    currencyCode: data.$attributes.currencyCode,
    id: data.$attributes.id,
    name: data.$attributes.name,
    routingNumber: data.$attributes.routingNumber,
    updatedAt: data.$attributes.updatedAt,
    userId: data.$attributes.userId,
  }
}

function parseTransactionForResponse(
  data: Transaction,
): TransactionResponseData {
  return {
    accountId: data.$attributes.accountId,
    amount: data.$attributes.amount,
    createdAt: data.$attributes.createdAt,
    id: data.$attributes.id,
    merchant: data.$attributes.merchant,
    operation: data.$attributes.operation,
    status: data.$attributes.status,
    transactionTypeId: data.$attributes.transactionTypeId,
    updatedAt: data.$attributes.updatedAt,
    userId: data.$attributes.userId,
  }
}

function parseUserForResponse(data: User): UserResponseData {
  return {
    createdAt: data.$attributes.createdAt,
    email: data.$attributes.email,
    firstName: data.$attributes.firstName,
    id: data.$attributes.id,
    lastName: data.$attributes.lastName,
    role: data.$attributes.role,
    updatedAt: data.$attributes.updatedAt,
    userName: data.$attributes.userName,
  }
}

function parseAccountArray(data: Account[]): AccountResponseData[] {
  return data.map((acct) => {
    return parseAccountForResponse(acct)
  })
}

function parseTransactionArray(data: Transaction[]): TransactionResponseData[] {
  return data.map((txn) => {
    return parseTransactionForResponse(txn)
  })
}

function parseUserArray(data: User[]): UserResponseData[] {
  return data.map((user) => {
    return parseUserForResponse(user)
  })
}

function ParseEntityForResponse(data: Account | Transaction | User) {
  if ("transactionTypeId" in data.$attributes) {
    return parseTransactionForResponse(data as Transaction)
  } else if ("accountTypeId" in data.$attributes) {
    return parseAccountForResponse(data as Account)
  } else {
    return parseUserForResponse(data as User)
  }
}

function parseArrayForResponse(data: Account[] | Transaction[] | User[]) {
  if ("transactionTypeId" in data[0].$attributes) {
    return parseTransactionArray(data as Transaction[])
  } else if ("accountTypeId" in data[0].$attributes) {
    return parseAccountArray(data as Account[])
  } else {
    return parseUserArray(data as User[])
  }
}

function parseEntitiesForResponse(
  data: PossibleEntityTypes,
): PossibleResponseDataTypes {
  if (Array.isArray(data)) {
    return parseArrayForResponse(data)
  } else {
    return ParseEntityForResponse(data)
  }
}

function createDataResponse<T extends PossibleEntityTypes>(
  code: number,
  entity: T,
) {
  const data = parseEntitiesForResponse(entity)
  return {
    code,
    data,
  }
}

function createErrorResponse(code: number, error: string) {
  return {
    code,
    error,
  }
}

// =================================
// createErrorOrResponse Overloads
// =================================
export function createErrorOrResponse(
  ctx: HttpContextContract,
  code: number,
  data: Account,
): DataResponse<AccountResponseData>
export function createErrorOrResponse(
  ctx: HttpContextContract,
  code: number,
  data: Account[],
): DataResponse<AccountResponseData[]>
export function createErrorOrResponse(
  ctx: HttpContextContract,
  code: number,
  data: Transaction,
): DataResponse<TransactionResponseData>
export function createErrorOrResponse(
  ctx: HttpContextContract,
  code: number,
  data: Transaction[],
): DataResponse<TransactionResponseData[]>
export function createErrorOrResponse(
  ctx: HttpContextContract,
  code: number,
  data: User,
): DataResponse<UserResponseData>
export function createErrorOrResponse(
  ctx: HttpContextContract,
  code: number,
  data: User[],
): DataResponse<UserResponseData[]>
export function createErrorOrResponse(
  ctx: HttpContextContract,
  code: number,
  message: string,
): ErrorResponse
export function createErrorOrResponse(
  ctx: HttpContextContract,
  code: number,
  dataOrMsg: PossibleEntityTypes | string,
) {
  ctx.response.status(code)

  if (typeof dataOrMsg === "string") {
    if (code >= 400) {
      return createErrorResponse(code, dataOrMsg)
    } else {
      throw new Error("Invalid status code provided for error response")
    }
  } else if (Array.isArray(dataOrMsg)) {
    if (dataOrMsg.length === 0) {
      return {
        code: 200,
        data: [],
      }
    }
    if ("transactionTypeId" in dataOrMsg[0].$attributes) {
      return createDataResponse<Transaction[]>(code, dataOrMsg as Transaction[])
    } else if ("accountTypeId" in dataOrMsg[0].$attributes) {
      return createDataResponse<Account[]>(code, dataOrMsg as Account[])
    } else {
      return createDataResponse<User[]>(code, dataOrMsg as User[])
    }
  } else {
    if ("transactionTypeId" in dataOrMsg.$attributes) {
      return createDataResponse<Transaction>(code, dataOrMsg as Transaction)
    } else if ("accountTypeId" in dataOrMsg.$attributes) {
      return createDataResponse<Account>(code, dataOrMsg as Account)
    } else {
      return createDataResponse<User>(code, dataOrMsg as User)
    }
  }
}

export function createUnauthorizedError(ctx: HttpContextContract) {
  ctx.response.status(401)
  return createErrorResponse(401, "Unauthorized")
}

export function createNotFoundError(ctx: HttpContextContract) {
  ctx.response.status(404)
  return {
    code: 404,
    data: null,
  }
}

export function createDeletedResponse<T extends Account | Transaction | User>(
  ctx: HttpContextContract,
  entity: T,
) {
  ctx.response.status(200)
  return {
    code: 200,
    data: {
      id: entity.$attributes.id,
    },
  }
}
