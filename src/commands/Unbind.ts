import { ApplyPrecondition, Command, Context } from "vixie";

import { Furmeet } from "../Furmeet";

/**
 * Joins the bot to the current user channel.
 */
@ApplyPrecondition((ctx) => ctx.author.id == "210118905006522369")
export class Unbind extends Command {
	constructor(readonly client: Furmeet) {
		super(client, { name: "unbind", aliases: [] });
	}

	async run(ctx: Context, ...args: string[]) {
		if (!ctx.guild?.voice?.channel) {
			return ctx.reply(
				":x: Cannot unbind from channel - not currently in one!"
			);
		}
		ctx.guild.voice.channel.leave();
		return ctx.reply(":ok_hand: Unbound from channel!");
	}
}
