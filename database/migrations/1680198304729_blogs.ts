import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Blogs extends BaseSchema {
  protected tableName = 'blogs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title',255).notNullable()
      table.string('content',255).notNullable()
      table.string('image',255)
      table.enum('status',['draft','pending','ative','deactive']).defaultTo('draft')
      table.integer('user_id').unsigned().references('users.id')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
