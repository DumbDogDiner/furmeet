import { Guild } from "discord.js";
import { Context } from "vixie";

/**
 * Precondition that ensures the guild exists.
 * @param ctx
 * @returns
 */
export const isGuild = (ctx: Context) => !!ctx.guild;

export type GuildedContext = Context & { guild: Guild };
