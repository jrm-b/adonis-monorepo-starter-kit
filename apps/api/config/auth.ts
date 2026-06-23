import { defineConfig } from "@adonisjs/auth";
import { configProvider } from "@adonisjs/core";
import { sessionGuard } from "@adonisjs/auth/session";
import { tokensGuard } from "@adonisjs/auth/access_tokens";
import type { Authenticators, InferAuthenticators, InferAuthEvents } from "@adonisjs/auth/types";

const authConfig = defineConfig({
  default: "web",
  guards: {
    /**
     * Session based authentication, backed by a Kysely user provider.
     */
    web: sessionGuard({
      useRememberMeTokens: false,
      provider: configProvider.create(async () => {
        const { SessionUserProvider } = await import("#auth/providers/session_user_provider");
        return new SessionUserProvider();
      }),
    }),

    /**
     * Opaque access token based authentication, backed by a Kysely
     * token + user provider.
     */
    api: tokensGuard({
      provider: configProvider.create(async () => {
        const { AccessTokensUserProvider } =
          await import("#auth/providers/access_tokens_user_provider");
        return new AccessTokensUserProvider();
      }),
    }),
  },
});

export default authConfig;

/**
 * Inferring types for the list of guards you have configured
 * in your application.
 */
declare module "@adonisjs/auth/types" {
  export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}

declare module "@adonisjs/core/types" {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
