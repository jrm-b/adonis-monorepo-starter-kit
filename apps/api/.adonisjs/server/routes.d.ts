import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.get_me': { paramsTuple?: []; params?: {} }
    'auth.is_authenticated': { paramsTuple?: []; params?: {} }
    'tokens.store': { paramsTuple?: []; params?: {} }
    'tokens.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.get_me': { paramsTuple?: []; params?: {} }
    'auth.is_authenticated': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.get_me': { paramsTuple?: []; params?: {} }
    'auth.is_authenticated': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'tokens.store': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'tokens.destroy': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}