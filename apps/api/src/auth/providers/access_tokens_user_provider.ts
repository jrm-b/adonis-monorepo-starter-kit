import { v7 as uuidv7 } from "uuid";
import { symbols } from "@adonisjs/auth";
import type { Secret } from "@adonisjs/core/helpers";
import { AccessToken } from "@adonisjs/auth/access_tokens";
import type {
  AccessTokensGuardUser,
  AccessTokensUserProviderContract,
} from "@adonisjs/auth/types/access_tokens";

import { db } from "#core/services/db";
import type { User } from "#auth/models/user";
import { UserRepository } from "#auth/repositories/user_repository";

const TOKEN_TYPE = "auth_token";
const TOKEN_PREFIX = "oat_";
const TOKEN_SECRET_LENGTH = 40;

/**
 * Bridges the AdonisJS access tokens guard to our Kysely-backed
 * "auth_access_tokens" table. This is a port of the built-in Lucid
 * `DbAccessTokensProvider` using Kysely queries instead.
 */
export class AccessTokensUserProvider implements AccessTokensUserProviderContract<User> {
  declare [symbols.PROVIDER_REAL_USER]: User;

  #userRepository = new UserRepository();

  async createUserForGuard(user: User): Promise<AccessTokensGuardUser<User>> {
    return {
      getId() {
        return user.id;
      },
      getOriginal() {
        return user;
      },
    };
  }

  async findById(
    identifier: string | number | bigint,
  ): Promise<AccessTokensGuardUser<User> | null> {
    const user = await this.#userRepository.findById(String(identifier));

    if (!user) {
      return null;
    }

    return this.createUserForGuard(user);
  }

  async createToken(
    user: User,
    abilities: string[] = ["*"],
    options?: { name?: string; expiresIn?: string | number },
  ): Promise<AccessToken> {
    const transientToken = AccessToken.createTransientToken(
      user.id,
      TOKEN_SECRET_LENGTH,
      options?.expiresIn,
    );

    const id = uuidv7();
    const createdAt = new Date();

    await db
      .insertInto("authAccessTokens")
      .values({
        id,
        tokenableId: String(transientToken.userId),
        type: TOKEN_TYPE,
        name: options?.name ?? null,
        hash: transientToken.hash,
        abilities: JSON.stringify(abilities),
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
        lastUsedAt: null,
        expiresAt: transientToken.expiresAt ? transientToken.expiresAt.toISOString() : null,
      })
      .execute();

    return new AccessToken({
      identifier: id,
      tokenableId: transientToken.userId,
      type: TOKEN_TYPE,
      hash: transientToken.hash,
      prefix: TOKEN_PREFIX,
      secret: transientToken.secret,
      name: options?.name ?? null,
      abilities,
      createdAt,
      updatedAt: createdAt,
      lastUsedAt: null,
      expiresAt: transientToken.expiresAt ?? null,
    });
  }

  async verifyToken(tokenValue: Secret<string>): Promise<AccessToken | null> {
    const decoded = AccessToken.decode(TOKEN_PREFIX, tokenValue.release());

    if (!decoded) {
      return null;
    }

    const row = await db
      .selectFrom("authAccessTokens")
      .selectAll()
      .where("id", "=", decoded.identifier)
      .where("type", "=", TOKEN_TYPE)
      .executeTakeFirst();

    if (!row) {
      return null;
    }

    const lastUsedAt = new Date();
    await db
      .updateTable("authAccessTokens")
      .set({ lastUsedAt: lastUsedAt.toISOString() })
      .where("id", "=", row.id)
      .execute();

    const token = new AccessToken({
      identifier: row.id,
      tokenableId: row.tokenableId,
      type: row.type,
      name: row.name,
      hash: row.hash,
      abilities: JSON.parse(row.abilities) as string[],
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      lastUsedAt,
      expiresAt: row.expiresAt ? new Date(row.expiresAt) : null,
    });

    if (!token.verify(decoded.secret) || token.isExpired()) {
      return null;
    }

    return token;
  }

  async invalidateToken(tokenValue: Secret<string>): Promise<boolean> {
    const decoded = AccessToken.decode(TOKEN_PREFIX, tokenValue.release());

    if (!decoded) {
      return false;
    }

    const result = await db
      .deleteFrom("authAccessTokens")
      .where("id", "=", decoded.identifier)
      .where("type", "=", TOKEN_TYPE)
      .executeTakeFirst();

    return result.numDeletedRows > BigInt(0);
  }
}
