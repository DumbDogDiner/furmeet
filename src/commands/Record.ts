import { ApplyPrecondition, Command, Context } from "vixie";

import { Furmeet } from "../Furmeet";
import { GuildedContext, isGuild } from "../preconditions/isGuild";

@ApplyPrecondition(isGuild)
export class Record extends Command {
	constructor(readonly client: Furmeet) {
		super(client, { name: "record", aliases: ["r"] });
	}

	async run(ctx: GuildedContext) {
		const res = await this.client.rtxManager.create(ctx);
		// if the session creation was unsuccessful
		if (res.error) {
			await ctx.reply(res.error.message);
		}
	}
}
