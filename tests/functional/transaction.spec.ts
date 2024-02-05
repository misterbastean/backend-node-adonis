import { test } from "@japa/runner"
import mocks from "Tests/utils/mocks"
import seeds from "Tests/utils/seeds"

let userToken: string
let adminToken: string
const unauthorizedBody = {
  code: 401,
  error: "Unauthorized",
}

test.group("transactions", () => {
  test("it should successfully authenticate as normal user", async ({
    client,
  }) => {
    const response = await client.post("/api/v1/auth/login").json({
      data: {
        email: seeds.users[0].email,
        password: "Test123!",
      },
    })
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        tokenType: "Bearer",
        expiresIn: 3600,
      },
    })

    userToken = response.body().data.accessToken
  })

  test("it should successfully authenticate as admin user", async ({
    client,
  }) => {
    const response = await client.post("/api/v1/auth/login").json({
      data: {
        email: seeds.users[1].email,
        password: "Test123!",
      },
    })
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        tokenType: "Bearer",
        expiresIn: 3600,
      },
    })

    adminToken = response.body().data.accessToken
  })

  test("it should not create a new transaction if unauthenticated", async ({
    client,
  }) => {
    const response = await client
      .post(`/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}`)
      .json({ data: mocks.transaction })

    response.assertStatus(401)
    response.assertBodyContains(unauthorizedBody)
  })

  test("it should not create a new transaction if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .post(`/api/v1/transaction/${seeds.users[1].id}/${seeds.accounts[0].id}`)
      .json({ data: mocks.transaction })
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not create a new transaction with invalid data", async ({
    client,
  }) => {
    const invalidData = { ...mocks.transaction, amount: undefined }
    const response = await client
      .post(`/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}`)
      .json({ data: invalidData })
      .header("Authorization", userToken)
    response.assertStatus(400)
  })

  test("it should create a new transaction", async ({ client }) => {
    const response = await client
      .post(`/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}`)
      .json({ data: mocks.transaction })
      .header("Authorization", userToken)
    response.assertStatus(201)
    const expectedBody = { ...mocks.transaction, availableAmount: undefined }
    response.assertBodyContains({
      code: 201,
      data: expectedBody,
    })
  })

  test("it should not list all transactions if unauthenticated", async ({
    client,
  }) => {
    const response = await client.get(
      `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}`,
    )
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not list all transactions if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .get(`/api/v1/transaction/${seeds.users[1].id}/${seeds.accounts[0].id}`)
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should return an empty array if no transactions found for account", async ({
    client,
  }) => {
    const response = await client
      .get(`/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[1].id}`)
      .header("Authorization", userToken)
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: [],
    })
  })

  test("it should return a 404 if user not found", async ({ client }) => {
    const response = await client
      .get(`/api/v1/transaction/invalidUserId/${seeds.accounts[1].id}`)
      .header("Authorization", adminToken)
    response.assertStatus(404)
    response.assertBody({
      code: 404,
      data: null,
    })
  })

  test("it should return a 404 if account not found", async ({ client }) => {
    const response = await client
      .get(`/api/v1/transaction/${seeds.users[0].id}/invalidAccountId`)
      .header("Authorization", adminToken)
    response.assertStatus(404)
    response.assertBody({
      code: 404,
      data: null,
    })
  })

  test("it should list all transactions for a single account", async ({
    client,
  }) => {
    const response = await client
      .get(`/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}`)
      .header("Authorization", userToken)
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: [
        {
          userId: seeds.users[0].id,
          accountId: seeds.accounts[0].id,
        },
      ],
    })
  })

  test("it should not get a transaction if unauthenticated", async ({
    client,
  }) => {
    const response = await client.get(
      `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
    )
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not get a transaction if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .get(
        `/api/v1/transaction/${seeds.users[1].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
      )
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should return a 404 if a transaction not found", async ({
    client,
  }) => {
    const response = await client
      .get(
        `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[1].id}/${seeds.transactions[0].id}`,
      )
      .header("Authorization", userToken)
    response.assertStatus(404)
    response.assertBody({
      code: 404,
      data: null,
    })
  })

  test("it should get a single transaction", async ({ client }) => {
    const response = await client
      .get(
        `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
      )
      .header("Authorization", userToken)
    response.assertStatus(200)
    response.assertBodyContains({
      code: 200,
      data: {
        id: seeds.transactions[0].id,
        userId: seeds.users[0].id,
        accountId: seeds.accounts[0].id,
      },
    })
  })

  test("it should not update a transaction if unauthenticated", async ({
    client,
  }) => {
    const updateTransactionData = {
      accountId: "100009",
      amount: 200,
      merchant: "Updated Merchant",
      operation: "debit",
      status: "complete",
      transactionTypeId: seeds.transactionTypes[0].id,
    }
    const response = await client
      .put(
        `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
      )
      .json({
        data: updateTransactionData,
        userId: seeds.users[0].id,
      })
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not update a transaction if authenticated as another normal user", async ({
    client,
  }) => {
    const updateTransactionData = {
      accountId: "100009",
      amount: 200,
      merchant: "Updated Merchant",
      operation: "debit",
      status: "complete",
      transactionTypeId: seeds.transactionTypes[0].id,
    }
    const response = await client
      .put(
        `/api/v1/transaction/${seeds.users[1].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
      )
      .json({
        data: updateTransactionData,
        userId: seeds.users[0].id,
      })
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not update a single transaction with invalid data", async ({
    client,
  }) => {
    const invalidData = {
      availableAmount: 50,
      merchant: "Updated Merchant",
      operation: "debit",
      status: "complete",
      transactionTypeId: seeds.transactionTypes[0].id,
    }
    const response = await client
      .put(
        `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
      )
      .json({
        data: invalidData,
        userId: seeds.users[0].id,
      })
      .header("Authorization", userToken)
    response.assertStatus(400)
  })

  test("it should return a 404 if no transaction found to update", async ({
    client,
  }) => {
    const updateTransactionData = {
      amount: 200,
      availableAmount: 50,
      merchant: "Updated Merchant",
      operation: "debit",
      status: "complete",
      transactionTypeId: seeds.transactionTypes[0].id,
    }
    const response = await client
      .put(
        `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[1].id}/${seeds.transactions[0].id}`,
      )
      .json({
        data: updateTransactionData,
        userId: seeds.users[0].id,
      })
      .header("Authorization", userToken)
    response.assertStatus(404)
    response.assertBody({
      code: 404,
      data: null,
    })
  })

  test("it should update a single transaction", async ({ client }) => {
    const updateTransactionData = {
      amount: 200,
      availableAmount: 50,
      merchant: "Updated Merchant",
      operation: "debit",
      status: "complete",
      transactionTypeId: seeds.transactionTypes[0].id,
    }
    const response = await client
      .put(
        `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[0].id}`,
      )
      .json({
        data: updateTransactionData,
        userId: seeds.users[0].id,
      })
      .header("Authorization", userToken)
    response.assertStatus(200)
    const expectedBody = {
      ...updateTransactionData,
      availableAmount: undefined,
    }
    response.assertBodyContains({
      code: 200,
      data: expectedBody,
    })
  })

  test("it should not mark an account as deleted if unauthenticated", async ({
    client,
  }) => {
    const response = await client.delete(
      `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[8].id}`,
    )
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should not mark an account as deleted if authenticated as another normal user", async ({
    client,
  }) => {
    const response = await client
      .delete(
        `/api/v1/transaction/${seeds.users[1].id}/${seeds.accounts[0].id}/${seeds.transactions[8].id}`,
      )
      .header("Authorization", userToken)
    response.assertStatus(401)
    response.assertBody(unauthorizedBody)
  })

  test("it should mark an account as deleted with the current timestamp", async ({
    client,
  }) => {
    const response = await client
      .delete(
        `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[0].id}/${seeds.transactions[8].id}`,
      )
      .header("Authorization", userToken)
    response.assertStatus(200)
    response.assertBody({
      code: 200,
      data: {
        id: seeds.transactions[8].id,
      },
    })
  })

  test("it should return a 404 if no transaction found to delete", async ({
    client,
  }) => {
    const response = await client
      .delete(
        `/api/v1/transaction/${seeds.users[0].id}/${seeds.accounts[1].id}/${seeds.transactions[8].id}`,
      )
      .header("Authorization", userToken)
    response.assertStatus(404)
    response.assertBody({
      code: 404,
      data: null,
    })
  })
})
