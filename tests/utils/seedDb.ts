import Database from "@ioc:Adonis/Lucid/Database"
import seeds from "./seeds"
const seedDb = async () => {
  await Database.from("transaction").delete()
  await Database.from("transaction_type").delete()
  await Database.from("account").delete()
  await Database.from("account_type").delete()
  await Database.from("user").delete()

  await Database.table("user").multiInsert(seeds.users)
  await Database.table("account_type").multiInsert(seeds.accountTypes)
  await Database.table("transaction_type").multiInsert(seeds.transactionTypes)
  await Database.table("account").multiInsert(seeds.accounts)
  await Database.table("transaction").multiInsert(seeds.transactions)
}

export default seedDb
