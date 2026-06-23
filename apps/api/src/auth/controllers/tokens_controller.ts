import type { HttpContext } from "@adonisjs/core/http";

export default class TokensController {
  /**
   * Issue a new access token for the authenticated user. The plain-text
   * token value is only returned here and never stored, so the client
   * must persist it.
   */
  async store({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail();
    const token = await auth.use("api").createToken(user, ["*"]);

    return response.created(token);
  }

  /**
   * Revoke the access token used to authenticate the current request.
   */
  async destroy({ auth, response }: HttpContext) {
    await auth.use("api").invalidateToken();
    return response.ok({ message: "Token revoked" });
  }
}
