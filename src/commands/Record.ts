import { createWriteStream } from "fs";
import { ApplyPrecondition, Command, Context } from "vixie";

import { Mixer } from "../audio/Mixer";
import { Furmeet } from "../Furmeet";

/**
 * Joins the bot to the current user channel.
 */
@ApplyPrecondition((ctx) => ctx.author.id == "210118905006522369")
export class Record extends Command {
	constructor(readonly client: Furmeet) {
		super(client, { name: "record", aliases: [] });
	}

	async run(ctx: Context, ...args: string[]) {
		if (!ctx.guild?.voice?.channel) {
			return ctx.reply(":x: Cannot start recording - not bound to channel!");
		}

		const mixer = new Mixer();
		const voice = ctx.guild.voice;

		if (!voice.connection || !voice.connection.channel) {
			return;
		}

		// iterate over every member and create an audio input for them
		voice.connection.channel.members
			.filter((v) => v.id != this.client.user?.id)
			.forEach((member) => {
				voice.connection?.receiver
					.createStream(member, {
						mode: "pcm",
						end: "manual",
					})
					.pipe(mixer.createInput());
			});

		await ctx.reply(":ok_hand: Opened voice stream.");

		const out = createWriteStream("out.pcm");
		mixer.pipe(out);
	}
}
