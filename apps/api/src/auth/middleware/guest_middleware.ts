import type { HttpContext } from "@adonisjs/core/http";
import type { NextFn } from "@adonisjs/core/types/http";
import type { Authenticators } from "@adonisjs/auth/types";

/**
 * Guest middleware is used to deny access to routes that should
 * be accessed by unauthenticated users only. For example, the
 * login route should not be accessible once the user is logged in.
 */
export default class GuestMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[];
    } = {},
  ) {
    for (const guard of options.guards ?? [ctx.auth.defaultGuard]) {
      if (await ctx.auth.use(guard).check()) {
        return ctx.response.conflict({
          message: "You are already authenticated",
        });
      }
    }

    return next();
  }
}
