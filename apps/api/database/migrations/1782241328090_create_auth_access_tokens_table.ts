import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("auth_access_tokens")
    .addColumn("id", "uuid", col => col.primaryKey().notNull())
    .addColumn("tokenable_id", "uuid", col =>
      col.notNull().references("users.id").onDelete("cascade"),
    )
    .addColumn("type", "text", col => col.notNull())
    .addColumn("name", "text")
    .addColumn("hash", "text", col => col.notNull())
    .addColumn("abilities", "text", col => col.notNull())
    .addColumn("created_at", "timestamp", col => col.notNull())
    .addColumn("updated_at", "timestamp", col => col.notNull())
    .addColumn("last_used_at", "timestamp")
    .addColumn("expires_at", "timestamp")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("auth_access_tokens").execute();
}
