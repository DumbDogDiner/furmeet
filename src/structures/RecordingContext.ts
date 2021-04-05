import { Collection, GuildMember, VoiceChannel } from "discord.js";
import { createWriteStream } from "fs";
import { resolve } from "path";
import { Context, Result } from "vixie";

import { Input } from "../audio/Input";
import { Mixer } from "../audio/Mixer";

/**
 * Represents a recording context.
 */
export class RecordingContext extends Context {
	constructor(ctx: Context, readonly vc: VoiceChannel) {
		super(ctx.message);
	}

	get guild() {
		return this.message.guild!;
	}

	get voice() {
		return this.guild.voice!;
	}

	get connection() {
		return this.voice.connection!;
	}

	protected inputs = new Collection<GuildMember, Input>();

	/**
	 * Initialize the recording context.
	 */
	async initialize(): Promise<Result<RecordingContext, Error>> {
		// check that the bot has permissions to access the voice channel.
		if (!this.vc.joinable) {
			return Result.err(
				new Error("Cannot create session - your voice channel is not joinable!")
			);
		}
		// connect to voice channel - fail safely.
		try {
			await this.vc.join();
		} catch (err) {
			return Result.err(
				new Error("Cannot create session - failed to join your voice channel!")
			);
		}

		const mixer = new Mixer();
		// create readables for people in the vc.
		this.vc.members
			.filter((v) => v.id != this.guild.client.user!.id)
			.forEach((v) => {
				const input = mixer.fromReadable(
					this.connection.receiver.createStream(v, {
						mode: "pcm",
						end: "manual",
					})
				);
				this.inputs.set(v, input);
			});
		// create the output write stream.
		createWriteStream(resolve(process.cwd(), "out/output.raw"));
		// inform the user their session has started.
		await this.reply("Successfully connected! Recording has begun...");

		return Result.ok(this);
	}

	async destroy() {
		// leave the vc.
		this.vc.leave();
	}
}
