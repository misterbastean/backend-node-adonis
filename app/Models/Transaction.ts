import { DateTime } from "luxon"
import {
  BaseModel,
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

export default class Transaction extends BaseModel {
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
  public categoryId: string

  @column()
  public amount: number

  @column()
  public status: string

  @column()
  public merchantName: string

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
  public static setCreateTimestampFormat(value: Transaction) {
    const newDate = formatDateTimeToISO(DateTime.local())
    value.updatedAt = newDate
    value.createdAt = newDate
    const id = uuid()
    value.id = id
  }

  @beforeUpdate()
  public static setUpdateTimestampFormat(value: Transaction) {
    const newDate = formatDateTimeToISO(DateTime.local())
    value.updatedAt = newDate
  }
}
