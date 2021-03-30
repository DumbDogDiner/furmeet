import { Command, Context } from "vixie";

import { Furmeet } from "../Furmeet";

export class Stop extends Command {
	constructor(readonly client: Furmeet) {
		super(client, { name: "stop", aliases: ["s"] });
	}

	async run(ctx: Context) {
		// if there isn't a voice session for the target guild, error.
		if (this.client.rtxManager.has(ctx.guild)) {
			return ctx.reply(
				"Cannot destroy session - there is no session to destroy!"
			);
		}
		// destroy the session.
		this.client.rtxManager.destroy(ctx.guild);
	}
}
