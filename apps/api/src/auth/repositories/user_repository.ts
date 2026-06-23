import { db } from "#core/services/db";
import { User } from "#auth/models/user";

/**
 * Encapsulates all the database access for the "users" table using Kysely.
 */
export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const row = await db.selectFrom("users").selectAll().where("id", "=", id).executeTakeFirst();

    return row ? User.fromRow(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();

    return row ? User.fromRow(row) : null;
  }

  async add(user: User): Promise<User> {
    const row = await db
      .insertInto("users")
      .values({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return User.fromRow(row);
  }
}
