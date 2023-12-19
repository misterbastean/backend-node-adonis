import Database from "@ioc:Adonis/Lucid/Database"
import { seeds } from "./mocks"

const seedDb = async () => {
  await Database.from("transaction").delete()
  await Database.from("account").delete()
  await Database.from("category").delete()
  await Database.from("user").delete()

  await Database.table("user").insert(seeds.user)
  await Database.table("category").multiInsert(seeds.categories)
  await Database.table("account").insert(seeds.account)
  await Database.table("transaction").insert(seeds.transaction)
}

export default seedDb
