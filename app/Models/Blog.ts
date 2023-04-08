import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Blog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title:string

  @column()
  public content: string

  @column()
  public image:string

  @column()
  public user_id:number

  @column()
  public status: status

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(()=>User,{
    foreignKey:'user_id'
  })
  public user:BelongsTo<typeof User>
}
enum status{
  draft,
  pending,
  active,
  deactive
}
