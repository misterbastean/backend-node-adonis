import Joi from "joi"

export const createAccountRequestSchema = Joi.object({
  accountNumber: Joi.string().required().max(50),
  accountTypeId: Joi.string().required().guid(),
  amount: Joi.number().required().min(0),
  availableAmount: Joi.number().required(),
  currencyCode: Joi.string().required().length(3),
  name: Joi.string().required().max(50),
  routingNumber: Joi.string().required().length(9),
  userId: Joi.string().required().guid(),
})

export const updateAccountRequestSchema = Joi.object({
  accountNumber: Joi.string().required().max(50),
  accountTypeId: Joi.string().required().guid(),
  amount: Joi.number().required().min(0),
  availableAmount: Joi.number().required(),
  currencyCode: Joi.string().required().length(3),
  name: Joi.string().required().max(50),
  routingNumber: Joi.string().required().length(9),
})

export const createTranactionRequestSchema = Joi.object({
  accountId: Joi.string().required().guid(),
  amount: Joi.number().required().min(0),
  availableAmount: Joi.number().required(),
  merchant: Joi.string().required().max(50),
  operation: Joi.string().required().valid("credit", "debit"),
  status: Joi.string().required().valid("pending", "complete"),
  transactionTypeId: Joi.string().required().guid(),
  userId: Joi.string().required().guid(),
})

export const updateTransactionRequestSchema = Joi.object({
  amount: Joi.number().required().min(0),
  availableAmount: Joi.number().required(),
  merchant: Joi.string().required().max(50),
  operation: Joi.string().required().valid("credit", "debit"),
  status: Joi.string().required().valid("pending", "complete"),
  transactionTypeId: Joi.string().required().guid(),
})

export const createUserRequestSchema = Joi.object({
  email: Joi.string().required().email(),
  firstName: Joi.string().required().max(50),
  lastName: Joi.string().required().max(50),
  password: Joi.string().required().max(50),
  userName: Joi.string().required().max(50),
})

export const updateUserRequestSchema = Joi.object({
  email: Joi.string().required().email(),
  firstName: Joi.string().required().max(50),
  lastName: Joi.string().required().max(50),
  userName: Joi.string().required().max(50),
})
