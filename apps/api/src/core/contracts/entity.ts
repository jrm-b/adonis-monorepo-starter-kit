import { Serializable } from "./serializable.ts";

/**
 * Base class for domain entities that are exposed over HTTP. Subclasses must
 * implement `serialize()` to return their public DTO (`Data`), keeping the
 * internal shape (e.g. password hashes, persistence types) out of responses.
 *
 * @typeParam Data - the public JSON shape returned by `serialize()`.
 */
export abstract class Entity<Data> implements Serializable<Data> {
  abstract serialize(): Data;
}
