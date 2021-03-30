import { config } from "dotenv";

import { Ping } from "./commands/Ping";
import { Record } from "./commands/Record";
import { Furmeet } from "./Furmeet";
import { VcStateListener } from "./listeners/VcStateListener";

// load environment config
config();

const client: Furmeet = new Furmeet()
	.on("ready", () => client.logger.info("Connected to Discord."))
	.registerCommand(Ping, Record)
	.registerListener(VcStateListener);

// log into discord.
client.login(process.env.ACCESS_TOKEN!);

// add sigint handler
process.on("SIGINT", async () => {
	client.logger.info("Gracefully closing active recording sessions...");
	// kill all active voice sessions before exiting.
	await client.rtxManager.destroyAll();
	// remove event listeners before destroying to prevent things from breaking.
	client.removeAllListeners();
	// destroy the client.
	client.destroy();
});
