/**
 * Ambient AdonisJS augmentations required to type-check the generated Tuyau
 * registry from a consumer (e.g. the web app). The registry's `schema.d.ts`
 * references this file via `/// <reference path="../manifest.d.ts" />`.
 *
 * Loading the auth middleware augments `HttpContext` with the `auth` property,
 * which the controllers rely on; referencing `config/auth.ts` provides the
 * `Authenticators` interface it depends on.
 */

/// <reference path="../../config/auth.ts" />

import "@adonisjs/auth/initialize_auth_middleware";
