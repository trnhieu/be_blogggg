import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UpdateUsers extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign('role_id').references('roles.id')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
