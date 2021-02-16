import { Readable } from "stream";

/**
 * Represents a stream that just outputs zero. That's all it does.
 */
export class SilentSource extends Readable {
	_read(size: number) {
		return Buffer.alloc(size);
	}
}
