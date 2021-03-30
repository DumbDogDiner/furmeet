import { Command, Context } from "vixie";

import { Furmeet } from "../Furmeet";

export class Ping extends Command {
	constructor(readonly client: Furmeet) {
		super(client, { name: "ping", aliases: ["p"] });
	}

	async run(ctx: Context) {
		ctx.reply(`Pong! \`${this.client.ws.ping}ms\``);
	}
}
