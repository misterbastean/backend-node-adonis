import { DateTime } from "luxon";
import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Account from "./Account";

export default class User extends BaseModel {
  static get table() {
    return "user"; // Specify the actual table name in the database
  }

  @column({ isPrimary: true })
  public id: string;

  @column()
  public userName: string;

  @column()
  public firstName: string;

  @column()
  public lastName: string;

  @column()
  public email: string;

  @column()
  public password: string;

  // TODO: Fix DateTime formatting to match DB

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column.dateTime()
  public deletedAt: DateTime;

  // Establishes a One to Many relationship with Account
  @hasMany(() => Account)
  public account: HasMany<typeof Account>;
}
