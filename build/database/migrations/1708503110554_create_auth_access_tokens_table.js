import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'auth_access_tokens';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.uuid('tokenable_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
            table.string('type').notNullable();
            table.string('name').nullable();
            table.string('hash').notNullable();
            table.text('abilities').notNullable();
            table.timestamp('last_used_at').nullable();
            table.timestamp('expires_at').nullable();
            table.timestamp('created_at', { useTz: true }).notNullable();
            table.timestamp('updated_at', { useTz: true }).nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1708503110554_create_auth_access_tokens_table.js.map