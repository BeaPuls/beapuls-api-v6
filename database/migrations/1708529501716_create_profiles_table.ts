import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()

      table.date('date_of_birth').nullable()
      table.text('description').nullable()
      table.text('avatar').nullable()

      // table
      //   .integer('prefered_gender_id')
      //   .unsigned()
      //   .references('id')
      //   .inTable('genders')
      //   .onDelete('RESTRICT')
      table.integer('gender_id').unsigned().references('id').inTable('genders').onDelete('RESTRICT')

      table
        .uuid('user_id')
        .unique()
        .notNullable()
        .references('id')
        .inTable('users')
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
