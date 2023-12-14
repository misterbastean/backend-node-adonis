import { DateTime } from "luxon"
import {
  BaseModel,
  HasMany,
  beforeCreate,
  beforeUpdate,
  column,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm"
import { Account } from "App/Models"
import { formatDateTimeToISO } from "App/Utils"
import { v4 as uuid } from "uuid"

export default class User extends BaseModel {
  static get table() {
    return "user" // Specify the actual table name in the database
  }
  public static selfAssignPrimaryKey = true // We will be assigning primary keys, not autoincrementing

  @column({ isPrimary: true })
  public id: string

  @column()
  public userName: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column()
  public password: string

  @column.dateTime()
  public createdAt: DateTime

  @column.dateTime()
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  // Establishes a One to Many relationship with Account
  @hasMany(() => Account)
  public account: HasMany<typeof Account>

  @beforeCreate()
  public static setCreateTimestampFormat(value: User) {
    const newDate = formatDateTimeToISO(DateTime.local())
    value.updatedAt = newDate
    value.createdAt = newDate
    const id = uuid()
    value.id = id
  }

  @beforeUpdate()
  public static setUpdateTimestampFormat(value: User) {
    const newDate = formatDateTimeToISO(DateTime.local())
    value.updatedAt = newDate
  }
}
