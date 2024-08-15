import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profile_tracks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name', 255)
      table.string('album_name', 255)
      table.string('artist_name', 255)
      table.string('provider_item_uri', 2048)
      table.string('provider_item_image', 2048)
      table.string('provider_item_id', 255)

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

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
