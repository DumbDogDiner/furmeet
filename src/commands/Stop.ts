import { ApplyPrecondition, Command, Context } from "vixie";

import { Furmeet } from "../Furmeet";

/**
 * Joins the bot to the current user channel.
 */
@ApplyPrecondition((ctx) => ctx.author.id == "210118905006522369")
export class Stop extends Command {
	constructor(readonly client: Furmeet) {
		super(client, { name: "stop", aliases: [] });
	}

	async run(ctx: Context, ...args: string[]) {
		this.client.voiceStream.destroy();
	}
}
