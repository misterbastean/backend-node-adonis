import { DateTime } from "luxon"
import {
  BelongsTo,
  HasOne,
  beforeCreate,
  beforeUpdate,
  belongsTo,
  column,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm"
import { Account, Category } from "App/Models"
import { formatDateTimeToISO } from "App/Utils"
import { v4 as uuid } from "uuid"
import Base from "App/Models/Base"

export default class Transaction extends Base {
  static get table() {
    return "transaction" // Specify the actual table name in the database
  }
  public static selfAssignPrimaryKey = true // We will be assigning primary keys, not autoincrementing

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public accountId: string

  @column()
  public transactionTypeId: string

  @column()
  public amount: number

  @column()
  public status: string

  @column()
  public operation: string

  @column()
  public merchant: string

  @column.dateTime()
  public createdAt: DateTime

  @column.dateTime()
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  // Establishes a Many to One relationship with Account
  @belongsTo(() => Account)
  public account: BelongsTo<typeof Account>

  // Establishes a One to One relationship with Category
  @hasOne(() => Category)
  public category: HasOne<typeof Category>

  @beforeCreate()
  public static setCreateTimestampFormat(transaction: Transaction) {
    const newDate = formatDateTimeToISO(DateTime.local())
    transaction.updatedAt = newDate
    transaction.createdAt = newDate
    const id = uuid()
    transaction.id = id
  }

  @beforeUpdate()
  public static setUpdateTimestampFormat(transaction: Transaction) {
    const newDate = formatDateTimeToISO(DateTime.local())
    transaction.updatedAt = newDate
  }
}
