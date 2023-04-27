import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class UpdateCategoriesBlogs extends BaseSchema {
  protected tableName = "blogs";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.foreign("category_id").references("categories.id");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
