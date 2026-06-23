import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "uuid", col => col.primaryKey().notNull())
    .addColumn("full_name", "text")
    .addColumn("email", "text", col => col.notNull().unique())
    .addColumn("password", "text", col => col.notNull())
    .addColumn("role", "integer", col => col.notNull().defaultTo(1))
    .addColumn("created_at", "timestamp", col => col.notNull())
    .addColumn("updated_at", "timestamp", col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
}
