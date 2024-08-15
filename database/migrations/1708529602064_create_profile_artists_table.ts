import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profile_artists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.string('popularity').notNullable()
      table.string('followers').notNullable()
      table.string('provider_item_uri').notNullable()
      table.string('provider_item_image')
      table.string('provider_item_id').notNullable()

      table
        .uuid('provider_type_id')
        .notNullable()
        .references('id')
        .inTable('provider_types')
        .onDelete('CASCADE')

      table
        .uuid('profile_id')
        .notNullable()
        .references('id')
        .inTable('profiles')
        .onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
