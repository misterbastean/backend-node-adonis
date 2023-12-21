import { test } from "@japa/runner"
import sinon from "sinon"
import bcrypt from "bcrypt"
import { hashPassword } from "App/Utils"

test.group("Hashing", () => {
  const mockPassword = "Password123!"

  test("hashPassword produces expected base64-encoded hash with controlled salt", async ({
    assert,
  }) => {
    const mockHash =
      "$2b$10$PZ3Yw4vXypxNfQ1p7s2vVu/HzKR02ntW37HcLt2FmRDIK2hF1GhJu"
    const encodedHash = Buffer.from(mockHash).toString("base64")

    // Mock bcrypt.hash to always return the same hashed value
    const bcryptStub = sinon.stub(bcrypt, "hash")
    bcryptStub.resolves(mockHash)

    const result = await hashPassword(mockPassword)

    assert.equal(result, encodedHash)

    bcryptStub.restore()
  })

  test("hashPassword produces different hashes from the same given password due to unique salt", async ({
    assert,
  }) => {
    const hash1 = hashPassword(mockPassword)
    const hash2 = hashPassword(mockPassword)

    assert.notEqual(hash1, hash2)
  })

  test("hashPassword throws an error if empty string supplied", async ({
    assert,
  }) => {
    try {
      await hashPassword("")
      assert.fail("Expected an error to be thrown")
    } catch (err) {
      assert.equal(err.message, "Password is required")
    }
  })
})
