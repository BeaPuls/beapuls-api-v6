import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'albums'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name', 255).notNullable()
      table.string('artist_name', 255).notNullable()
      table.string('provider_item_uri', 2048).notNullable()
      table.string('provider_item_image', 2048).nullable()
      table.string('provider_item_id', 255).notNullable()
      table.integer('up_vote').nullable().defaultTo(0)
      table.integer('down_vote').nullable().defaultTo(0)

      /**
       * Provider Type relation
       */
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
