import Hash from "@ioc:Adonis/Core/Hash";
import {
  BaseModel,
  BelongsTo,
  HasMany,
  beforeSave,
  belongsTo,
  column,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Blog from "./Blog";
import Role from "./Role";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public role_id: number;

  @column()
  public rememberMeToken?: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  //foreign key

  @belongsTo(() => Role, {
    foreignKey: "role_id",
  })
  public role: BelongsTo<typeof Role>;

  @hasMany(() => Blog, {
    foreignKey: "user_id",
  })
  public blog: HasMany<typeof Blog>;
}
