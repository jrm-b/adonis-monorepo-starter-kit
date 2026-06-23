import { v7 as uuidv7 } from "uuid";
import hash from "@adonisjs/core/services/hash";
import { BaseCommand } from "@adonisjs/core/ace";
import type { CommandOptions } from "@adonisjs/core/types/ace";

import { db } from "#core/services/db";

export default class CreateUser extends BaseCommand {
  static commandName = "create:user";
  static description = "Create a new user";
  static options: CommandOptions = {
    startApp: true,
  };

  async run() {
    const fullName = await this.prompt.ask("What is the user's name?");
    const email = await this.prompt.ask("What is the user's email?");
    const password = await this.prompt.secure("What is the user's password?");
    const role = await this.prompt.choice("What is the user's role?", [
      { name: "1", message: "User" },
      { name: "2", message: "Admin" },
    ]);

    const now = new Date().toISOString();

    await db
      .insertInto("users")
      .values({
        id: uuidv7(),
        fullName: fullName,
        email,
        password: await hash.make(password),
        role: Number(role),
        createdAt: now,
        updatedAt: now,
      })
      .execute();

    this.logger.success(`User "${email}" created successfully`);
  }

  async completed() {
    await db.destroy();
  }
}
