import { Command, Context } from "vixie";

import { Furmeet } from "../Furmeet";

export class Record extends Command {
	constructor(readonly client: Furmeet) {
		super(client, { name: "record", aliases: ["r"] });
	}

	async run(ctx: Context) {
		const res = await this.client.rtxManager.create(ctx);
		// if the session creation was unsuccessful
		if (res.error) {
			await ctx.reply(res.error.message);
		}
	}
}
