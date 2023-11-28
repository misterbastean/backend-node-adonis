import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  HasOne,
  belongsTo,
  column,
  hasOne,
} from "@ioc:Adonis/Lucid/Orm";
import Account from "./Account";
import Category from "./Category";

export default class Transaction extends BaseModel {
  static get table() {
    return "transaction"; // Specify the actual table name in the database
  }
  public static selfAssignPrimaryKey = true; // We will be assigning primary keys, not autoincrementing

  @column({ isPrimary: true })
  public id: string;

  @column()
  public userId: string;

  @column()
  public accountId: string;

  @column()
  public categoryId: string;

  @column()
  public amount: number;

  @column()
  public status: string;

  @column()
  public merchantName: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column.dateTime()
  public deletedAt: DateTime;

  // Establishes a Many to One relationship with Account
  @belongsTo(() => Account)
  public account: BelongsTo<typeof Account>;

  // Establishes a One to One relationship with Category
  @hasOne(() => Category)
  public category: HasOne<typeof Category>;
}
