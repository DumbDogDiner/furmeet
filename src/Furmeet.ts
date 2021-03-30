import { Readable } from "stream";
import { VixieClient } from "vixie";

import { RecordingContextManager } from "./structures/RecordingContextManager";

/**
 * Top-level furmeet client.
 */
export class Furmeet extends VixieClient {
	public rtxManager = new RecordingContextManager();
}
