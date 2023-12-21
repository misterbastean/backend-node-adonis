import bcrypt from "bcrypt"

// Hashes a given password, then converts to a base64 string in order to store in DB.
async function hashPassword(password: string): Promise<string> {
  if (!password) throw new Error("Password is required")
  const hash = await bcrypt.hash(password, 10)
  return Buffer.from(hash).toString("base64")
}

// Checks a given password against a base64-encoded hash.
async function checkPassword(
  encodedHash: string,
  password: string,
): Promise<boolean> {
  const decodedHash = Buffer.from(encodedHash, "base64").toString("utf-8")
  return await bcrypt.compare(password, decodedHash)
}

export { hashPassword, checkPassword }
