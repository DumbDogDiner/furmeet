import { Guild, Message, VoiceChannel } from "discord.js";
import { Context, Result } from "vixie";

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
		// inform the user their session has started.
		await this.reply("Successfully connected! Recording has begun...");
		return Result.ok(this);
	}

	async destroy() {
		// leave the vc.
		await this.vc.leave();
	}
}
