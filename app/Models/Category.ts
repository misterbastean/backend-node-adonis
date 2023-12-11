import { DateTime } from "luxon"
import { BaseModel, HasOne, column, hasOne } from "@ioc:Adonis/Lucid/Orm"
import { Transaction } from "App/Models"

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  // Establishes a One to One relationship with Transaction
  @hasOne(() => Transaction)
  public category: HasOne<typeof Transaction>
}
