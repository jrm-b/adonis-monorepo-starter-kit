/**
 * A domain object that knows how to render its public representation (the JSON
 * shape exposed over HTTP). Implementers return their DTO from `serialize()`,
 * which the compiler forces to match `T`.
 */
export interface Serializable<T> {
  serialize(): T;
}
