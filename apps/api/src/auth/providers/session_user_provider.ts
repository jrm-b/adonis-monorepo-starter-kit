import { symbols } from "@adonisjs/auth";
import type { SessionGuardUser, SessionUserProviderContract } from "@adonisjs/auth/types/session";

import type { User } from "#auth/models/user";
import { UserRepository } from "#auth/repositories/user_repository";

/**
 * Bridges the AdonisJS session guard to our Kysely-backed users table,
 * replacing the default Lucid user provider.
 */
export class SessionUserProvider implements SessionUserProviderContract<User> {
  declare [symbols.PROVIDER_REAL_USER]: User;

  #userRepository = new UserRepository();

  async createUserForGuard(user: User): Promise<SessionGuardUser<User>> {
    return {
      getId() {
        return user.id;
      },
      getOriginal() {
        return user;
      },
    };
  }

  async findById(identifier: string | number | bigint): Promise<SessionGuardUser<User> | null> {
    const user = await this.#userRepository.findById(String(identifier));

    if (!user) {
      return null;
    }

    return this.createUserForGuard(user);
  }
}
