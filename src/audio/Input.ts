import { Writable } from "stream";

export class Input extends Writable {
	public volume = 1;
	public hasData = false;
	private buffer = Buffer.alloc(0);

	/**
	 * Reads the specified number of samples into a buffer
	 * @param samples The number of samples to read
	 */
	public read(samples: number) {
		let bytes = samples * 2;
		if (this.buffer.length < bytes) {
			bytes = this.buffer.length;
		}
		// write buffer
		let sample = this.buffer.slice(0, bytes);
		this.buffer = this.buffer.slice(bytes);
		// read the target number of bytes
		for (let i = 0; i < bytes; i++) {
			sample.writeInt16LE(Math.floor(this.volume * sample.readInt16LE(i)), i);
		}
		// return the read sample
		return sample;
	}

	/**
	 * Gets the number of available samples in the buffer
	 * @param length The length to get the number of samples for
	 */
	public availableSamples() {
		return Math.floor(this.buffer.length / 2);
	}

	// TODO: Add explicit types
	public _write(chunk: any, encoding: any, next: any) {
		if (!this.hasData) {
			this.hasData = true;
		}

		this.buffer = Buffer.concat([this.buffer, chunk]);
		next();
	}

	/**
	 * Clear the buffer of this input.
	 */
	public clear() {
		this.buffer = Buffer.alloc(0);
	}
}
