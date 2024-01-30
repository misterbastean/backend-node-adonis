import seeds from "./seeds"

const mockUserData = {
  email: "mock.user@test.com",
  firstName: "Mock",
  lastName: "User",
  password: "Password1!",
  userName: "mock.user",
}

const mockAccountData = {
  accountNumber: "123456",
  accountTypeId: seeds.accountTypes[0].id,
  amount: 100,
  availableAmount: 50,
  currencyCode: "USD",
  name: "Mock Account",
  routingNumber: "123456789",
  userId: seeds.users[0].id,
}

const mockTransactionData = {
  accountId: seeds.accounts[0].id,
  amount: 10,
  availableAmount: 500,
  merchant: "Mock Merchant",
  operation: "debit",
  status: "pending",
  transactionTypeId: seeds.transactionTypes[0].id,
  userId: seeds.users[0].id,
}

const mocks = {
  user: mockUserData,
  account: mockAccountData,
  transaction: mockTransactionData,
}

export default mocks
