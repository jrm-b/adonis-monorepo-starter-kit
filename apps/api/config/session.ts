import app from "@adonisjs/core/services/app";
import { defineConfig, stores } from "@adonisjs/session";

const sessionConfig = defineConfig({
  enabled: true,
  cookieName: "adonis-session",

  /**
   * When set to true, the session id cookie will be removed
   * after the browser is closed.
   */
  clearWithBrowser: false,

  /**
   * Define how long to keep the session data alive without any
   * activity.
   */
  age: "2h",

  /**
   * Configuration for session cookie and the cookie store.
   */
  cookie: {
    path: "/",
    httpOnly: true,
    secure: app.inProduction,
    sameSite: "lax",
  },

  /**
   * The store to use for persisting the session data. We keep it
   * simple here by encrypting the session data inside a cookie.
   */
  store: "cookie",
  stores: {
    cookie: stores.cookie(),
  },
});

export default sessionConfig;
