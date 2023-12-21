import { DateTime } from "luxon"
import {
  HasMany,
  beforeCreate,
  beforeSave,
  beforeUpdate,
  column,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm"
import { Account } from "App/Models"
import { formatDateTimeToISO, hashPassword } from "App/Utils"
import { v4 as uuid } from "uuid"
import Base from "App/Models/Base"

export default class User extends Base {
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
  public static setCreateTimestampFormat(user: User) {
    const newDate = formatDateTimeToISO(DateTime.local())
    user.updatedAt = newDate
    user.createdAt = newDate
    const id = uuid()
    user.id = id
  }

  @beforeUpdate()
  public static setUpdateTimestampFormat(user: User) {
    const newDate = formatDateTimeToISO(DateTime.local())
    user.updatedAt = newDate
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hashPassword(user.password)
    }
  }
}
