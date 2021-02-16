import { ApplyPrecondition, Command, Context } from "vixie";

import { Furmeet } from "../Furmeet";

/**
 * Joins the bot to the current user channel.
 */
@ApplyPrecondition((ctx) => ctx.author.id == "210118905006522369")
export class Bind extends Command {
	constructor(readonly client: Furmeet) {
		super(client, { name: "bind", aliases: [] });
	}

	async run(ctx: Context, ...args: string[]) {
		const vc = ctx.message.member?.voice.channel;

		if (!vc) {
			return ctx.reply(":x: You are not in a voice channel!");
		}

		if (!vc.joinable) {
			return ctx.reply(":x: The target voice channel is not joinable!");
		}

		await vc.join();
		ctx.reply(":ok_hand: Joined your voice channel.");
	}
}
