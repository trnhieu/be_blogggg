import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Category from "./Category";
import User from "./User";

export default class Blog extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public content: string;

  @column()
  public category_id: number;

  @column()
  public image: string;

  @column()
  public user_id: number;

  @column()
  public status: status;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User, {
    foreignKey: "user_id",
  })
  public user: BelongsTo<typeof User>;

  @belongsTo(() => Category, {
    foreignKey: "category_id",
  })
  public category: BelongsTo<typeof Category>;

  // public get full_image() {
  //   return await Drive.getUrl(this.image);
  // }
}

enum status {
  draft,
  pending,
  active,
  deactive,
}
