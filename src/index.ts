import { config } from "dotenv";

import { Bind } from "./commands/Bind";
import { Record } from "./commands/Record";
import { Stop } from "./commands/Stop";
import { Unbind } from "./commands/Unbind";
import { Furmeet } from "./Furmeet";
import { VcStateListener } from "./listeners/VcStateListener";

// load environment config
config();

const client: Furmeet = new Furmeet()
	.on("ready", () => client.logger.info("Connected to Discord."))
	.registerListener(VcStateListener)
	.registerCommand(Bind, Unbind, Record, Stop);

client.login(process.env.ACCESS_TOKEN!);
