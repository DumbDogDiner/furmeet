import { Listener } from "vixie";

import { Furmeet } from "../Furmeet";

/**
 * Listens for VC state changes.
 */
export class VcStateListener extends Listener<"voiceStateUpdate"> {
	constructor(readonly client: Furmeet) {
		super(client, { event: "voiceStateUpdate" });
	}

	run() {
		this.logger.info("VC state update detected!");
	}
}
