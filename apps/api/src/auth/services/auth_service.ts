import { inject } from "@adonisjs/core";
import hash from "@adonisjs/core/services/hash";

import { User } from "#auth/models/user";
import { UserRepository } from "#auth/repositories/user_repository";

@inject()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Verify a set of credentials and return the matching user, or `false`
   * when the credentials are invalid.
   */
  async attempt(email: string, password: string): Promise<User | false> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      // Hash a dummy password to mitigate timing attacks that could be used
      // to enumerate registered email addresses.
      await hash.use("scrypt").make("password");
      return false;
    }

    const hasValidPassword = await hash.verify(user.password, password);

    if (!hasValidPassword) {
      return false;
    }

    return user;
  }

  /**
   * Find a user by email, or `null` when none matches.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  /**
   * Register a new user with a hashed password.
   */
  async register(payload: {
    fullName?: string | null;
    email: string;
    password: string;
  }): Promise<User> {
    const user = User.create({
      email: payload.email,
      fullName: payload.fullName ?? null,
      password: await hash.make(payload.password),
    });

    return this.userRepository.add(user);
  }
}
