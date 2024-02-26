import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'profiles';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary();
            table.date('date_of_birth').nullable();
            table.text('description').nullable();
            table.text('avatar').nullable();
            table.integer('gender_id').unsigned().references('id').inTable('genders').onDelete('RESTRICT');
            table
                .uuid('user_id')
                .unique()
                .notNullable()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1708529501716_create_profiles_table.js.map