/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from "@adonisjs/core/services/router";

import { middleware } from "#start/kernel";

const AuthController = () => import("#auth/controllers/auth_controller");
const TokensController = () => import("#auth/controllers/tokens_controller");

router.get("/", async () => "It works!");

/**
 * Session based authentication.
 */
router.post("/register", [AuthController, "register"]).use(middleware.guest());
router.post("/login", [AuthController, "login"]).use(middleware.guest());
router.post("/logout", [AuthController, "logout"]).use(middleware.auth({ guards: ["web"] }));

/**
 * Reachable with either a session cookie or a bearer token.
 */
router.get("/me", [AuthController, "getMe"]).use(middleware.auth({ guards: ["web", "api"] }));

/**
 * Open endpoint reporting whether the caller is authenticated.
 */
router.get("/is-authenticated", [AuthController, "isAuthenticated"]);

/**
 * Access token management. Tokens are issued from an authenticated
 * session and revoked using the token itself.
 */
router.post("/tokens", [TokensController, "store"]).use(middleware.auth({ guards: ["web"] }));
router.delete("/tokens", [TokensController, "destroy"]).use(middleware.auth({ guards: ["api"] }));
