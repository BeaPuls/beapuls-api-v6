import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'track_comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.uuid('track_id').notNullable().references('id').inTable('tracks')

      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')

      table.string('comment', 2048).notNullable()

      table.integer('up_vote').nullable().defaultTo(0)
      table.integer('down_vote').nullable().defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
