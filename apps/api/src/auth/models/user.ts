import { v7 as uuidv7 } from "uuid";
import type { Selectable } from "kysely";

import type { DB } from "#types/db";
import type * as Data from "#types/data";
import { Entity } from "#core/contracts/entity";

type UserRow = Selectable<DB["users"]>;

export class User extends Entity<Data.Identity.User> {
  private constructor(
    readonly id: string,
    readonly fullName: string | null,
    readonly email: string,
    readonly password: string, // Password hash. Carried for authentication, never exposed by the DTO.
    readonly role: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {
    super();
  }

  static fromRow(row: UserRow): User {
    return new User(
      row.id,
      row.fullName,
      row.email,
      row.password,
      row.role,
      toDate(row.createdAt),
      toDate(row.updatedAt),
    );
  }

  static create(input: {
    email: string;
    password: string;
    fullName?: string | null;
    role?: number;
  }): User {
    const now = new Date();
    return new User(
      uuidv7(),
      input.fullName ?? null,
      input.email,
      input.password,
      input.role ?? 1,
      now,
      now,
    );
  }

  /**
   * Public HTTP representation: drops the password and
   * renders timestamps as ISO strings.
   */
  serialize(): Data.Identity.User {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}
