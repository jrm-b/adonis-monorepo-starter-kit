import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import { AuthService } from "#auth/services/auth_service";

@inject()
export default class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Authenticate a user with their credentials and open a session.
   */
  async login({ auth, request, response }: HttpContext) {
    const { email, password } = request.only(["email", "password"]);

    if (!email || !password) {
      return response.badRequest({ message: "Email and password are required" });
    }

    const user = await this.authService.attempt(email, password);

    if (!user) {
      return response.unauthorized({ message: "Invalid credentials" });
    }

    await auth.use("web").login(user);

    return response.ok(user.serialize());
  }

  /**
   * Register a new user and open a session for them.
   */
  async register({ auth, request, response }: HttpContext) {
    const { fullName, email, password } = request.only(["fullName", "email", "password"]);

    if (!email || !password) {
      return response.badRequest({ message: "Email and password are required" });
    }

    const existing = await this.authService.findByEmail(email);

    if (existing) {
      return response.conflict({ message: "Email is already registered" });
    }

    const user = await this.authService.register({ fullName, email, password });

    await auth.use("web").login(user);

    return response.created(user.serialize());
  }

  /**
   * Destroy the current session.
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use("web").logout();
    return response.ok({ message: "Logged out" });
  }

  /**
   * Return the currently authenticated user. Reachable with either a
   * session cookie or a bearer token. The value is returned directly so
   * Tuyau can infer the response type on the client.
   */
  async getMe({ auth }: HttpContext) {
    const user = auth.getUserOrFail();
    return user.serialize();
  }

  /**
   * Report whether the current request carries a valid session or token,
   * without failing when unauthenticated.
   */
  async isAuthenticated({ auth }: HttpContext) {
    const authenticated = await auth.use("web").check();
    return { isAuthenticated: authenticated };
  }
}
