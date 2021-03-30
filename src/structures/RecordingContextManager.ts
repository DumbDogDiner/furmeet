import { Collection, Guild } from "discord.js";
import { Context, Result } from "vixie";

import { RecordingContext } from "./RecordingContext";

export class RecordingContextManager extends Collection<
	Guild,
	RecordingContext
> {
	/**
	 * Create a new recording context from the target context.
	 */
	async create(ctx: Context): Promise<Result<RecordingContext, Error>> {
		// prevent context creation if the context is not in a guild.
		if (!ctx.guild) {
			return Result.err(
				new Error("You must be in a guild to create a new recording session!")
			);
		}
		// prevent context creation if the user is not in a voice channel.
		if (!ctx.message.member!.voice.channel) {
			return Result.err(
				new Error(
					"You must be in a voice channel to create a new recording session!"
				)
			);
		}
		// create the recording context.
		const rtx = new RecordingContext(ctx, ctx.message.member!.voice.channel);
		// attempt to initialize the rtx.
		const res = await rtx.initialize();
		// if it was unsuccessful, return the wrapped error object.
		if (res.error) {
			return res;
		}
		// store the rtx in memory.
		super.set(ctx.guild, rtx);
		// return the new rtx.
		return Result.ok(rtx);
	}

	/**
	 * Destroy the voice session for the target guild.
	 */
	async destroy(guild: Guild) {
		// catch-all just in case it fails.
		if (!this.has(guild)) {
			return;
		}
		// destroy the target session.
		await this.get(guild)!.destroy();
		super.delete(guild);
	}

	/**
	 * Return a promise that will resolve once all sessions are destroyed.
	 */
	destroyAll() {
		return Promise.all(this.map((v) => v.destroy()));
	}

	// prevent set from being used directly.
	set(guild: Guild, rtx: RecordingContext): this {
		throw new Error("RecordingContextManager.set cannot be used externally");
	}

	// prevent delete from being used directly.
	delete(guild: Guild): boolean {
		throw new Error("RecordingContextManager.delete cannot be used externally");
	}
}
