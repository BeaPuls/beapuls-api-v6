import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('role_id').notNullable().references('id').inTable('roles').onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')

      table.primary(['role_id', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
