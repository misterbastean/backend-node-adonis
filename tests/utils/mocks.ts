const seedCategoryData = [
  {
    id: "739e94cb-0c71-4557-83d1-b30c8f705c67",
    name: "checking",
    type: "account",
    created_at: "2023-11-21 12:12:49.301124-05:00",
    updated_at: "2023-11-21 12:12:49.301124-05:00",
    deleted_at: null,
  },
  {
    id: "caa2c63d-1f5c-4e71-95be-cc1fddb6ff5e",
    name: "debit",
    type: "transaction",
    created_at: "2023-11-21 12:12:49.301124-05:00",
    updated_at: "2023-11-21 12:12:49.301124-05:00",
    deleted_at: null,
  },
]

const seedUserData = {
  id: "9b6677ee-0236-47da-b990-ad2721f1997a",
  email: "richard.mayert@test.com",
  first_name: "Richard",
  last_name: "Mayert",
  password:
    "JDJhJDEwJGVlZC9iS0dkcFB0RUZBRWhFWXJSQk9JekdxYXVFZ05zTWx3Zkt1Q0lncHpyVG9WTHRjYnVh",
  user_name: "richard.mayert",
  created_at: "2023-11-21 12:12:49.301124-05:00",
  updated_at: "2023-11-21 12:12:49.301124-05:00",
  deleted_at: null,
}

const seedAccountData = {
  id: "d6a87a8a-e446-4b8e-ac9d-9a2ab47c7b5b",
  user_id: "9b6677ee-0236-47da-b990-ad2721f1997a",
  category_id: "739e94cb-0c71-4557-83d1-b30c8f705c67",
  name: "Test Account",
  amount: 500,
  available_amount: 400,
  account_number: 1234567890,
  routing_number: 987654321,
  currency_code: "USD",
  created_at: "2023-11-21 12:12:49.301124-05:00",
  updated_at: "2023-11-21 12:12:49.301124-05:00",
  deleted_at: null,
}

const seedTransactionData = {
  id: "60010c33-9371-44b9-a890-7ad2dacccf81",
  user_id: "9b6677ee-0236-47da-b990-ad2721f1997a",
  account_id: "d6a87a8a-e446-4b8e-ac9d-9a2ab47c7b5b",
  category_id: "caa2c63d-1f5c-4e71-95be-cc1fddb6ff5e",
  amount: 10.5,
  status: "pending",
  merchant_name: "Test Merchant",
  created_at: "2023-11-21 12:12:49.301124-05:00",
  updated_at: "2023-11-21 12:12:49.301124-05:00",
  deleted_at: null,
}

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
  categoryId: "739e94cb-0c71-4557-83d1-b30c8f705c67",
  currencyCode: "USD",
  name: "Mock Account",
  routingNumber: 100492832467,
  userId: "9b6677ee-0236-47da-b990-ad2721f1997a",
}

const mockTransactionData = {
  accountId: "d6a87a8a-e446-4b8e-ac9d-9a2ab47c7b5b",
  amount: -10,
  categoryId: "caa2c63d-1f5c-4e71-95be-cc1fddb6ff5e",
  merchantName: "Mock Merchant",
  status: "pending",
  userId: "9b6677ee-0236-47da-b990-ad2721f1997a",
}

export const seeds = {
  categories: seedCategoryData,
  user: seedUserData,
  account: seedAccountData,
  transaction: seedTransactionData,
}

export const mocks = {
  user: mockUserData,
  account: mockAccountData,
  transaction: mockTransactionData,
}
