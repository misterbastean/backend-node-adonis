import seeds from "./seeds"

const mockUserData = {
  email: "mock.user@test.com",
  firstName: "Mock",
  lastName: "User",
  password: "Password1!",
  userName: "mock.user",
}

const mockAccountData = {
  accountNumber: "2345769324576982345697",
  amount: 100,
  availableAmount: 50,
  accountTypeId: seeds.accountTypes[0].id,
  currencyCode: "USD",
  name: "Mock Account",
  routingNumber: 100492832467,
  userId: seeds.users[0].id,
}

const mockTransactionData = {
  userId: seeds.users[0].id,
  accountId: seeds.accounts[0].id,
  transactionTypeId: seeds.transactionTypes[0].id,
  amount: 10,
  status: "pending",
  operation: "debit",
  merchant: "Mock Merchant",
}

const mocks = {
  user: mockUserData,
  account: mockAccountData,
  transaction: mockTransactionData,
}

export default mocks
