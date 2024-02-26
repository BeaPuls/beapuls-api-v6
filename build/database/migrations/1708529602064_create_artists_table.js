import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'artists';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary();
            table.string('name').notNullable();
            table.string('popularity').notNullable();
            table.string('followers').notNullable();
            table.string('spotify_uri').notNullable();
            table.string('spotify_id').notNullable();
            table.string('spotify_image');
            table
                .uuid('profile_id')
                .notNullable()
                .references('id')
                .inTable('profiles')
                .onDelete('CASCADE');
            table.timestamp('created_at', { useTz: true });
            table.timestamp('updated_at', { useTz: true });
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1708529602064_create_artists_table.js.map