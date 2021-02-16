import { Readable } from "stream";
import { VixieClient } from "vixie";

/**
 * Top-level furmeet client.
 */
export class Furmeet extends VixieClient {
	voiceStream!: Readable;
}
