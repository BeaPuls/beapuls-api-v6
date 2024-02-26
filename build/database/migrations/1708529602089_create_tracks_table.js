import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'tracks';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary();
            table.string('name', 255);
            table.string('album_name', 255);
            table.string('artist_name', 255);
            table.string('spotify_uri', 2048);
            table.string('spotify_image', 2048);
            table.string('spotify_id', 255);
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
//# sourceMappingURL=1708529602089_create_tracks_table.js.map