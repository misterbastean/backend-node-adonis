import { DateTime } from "luxon"
import {
  BaseModel,
  BelongsTo,
  HasMany,
  beforeCreate,
  beforeUpdate,
  belongsTo,
  column,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm"
import { User, Transaction } from "App/Models"
import { formatDateTimeToISO } from "App/Utils"
import { v4 as uuid } from "uuid"

export default class Account extends BaseModel {
  static get table() {
    return "account" // Specify the actual table name in the database
  }
  public static selfAssignPrimaryKey = true // We will be assigning primary keys, not autoincrementing

  @column({ isPrimary: true })
  public id: string

  @column()
  public userId: string

  @column()
  public categoryId: string

  @column()
  public name: string

  @column()
  public amount: number

  @column()
  public availableAmount: number

  @column()
  public accountNumber: string

  @column()
  public routingNumber: number

  @column()
  public currencyCode: string

  @column.dateTime()
  public createdAt: DateTime

  @column.dateTime()
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  // Establishes Many to One relationship with User
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  // Establishes a One to Many relationship with Transaction
  @hasMany(() => Transaction)
  public transaction: HasMany<typeof Transaction>

  @beforeCreate()
  public static setCreateTimestampFormat(value: Account) {
    const newDate = formatDateTimeToISO(DateTime.local())
    value.updatedAt = newDate
    value.createdAt = newDate
    const id = uuid()
    value.id = id
  }

  @beforeUpdate()
  public static setUpdateTimestampFormat(value: Account) {
    const newDate = formatDateTimeToISO(DateTime.local())
    value.updatedAt = newDate
  }
}
