import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'artists'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable()
      table.integer('popularity').nullable()
      table.integer('followers').nullable()
      table.string('provider_item_uri').notNullable()
      table.string('provider_item_image')
      table.string('provider_item_id').notNullable()
      table.integer('up_vote').nullable().defaultTo(0)
      table.integer('down_vote').nullable().defaultTo(0)

      table
        .uuid('provider_type_id')
        .notNullable()
        .references('id')
        .inTable('provider_types')
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
