/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    logout: typeof routes['auth.logout']
    getMe: typeof routes['auth.get_me']
    isAuthenticated: typeof routes['auth.is_authenticated']
  }
  tokens: {
    store: typeof routes['tokens.store']
    destroy: typeof routes['tokens.destroy']
  }
}
