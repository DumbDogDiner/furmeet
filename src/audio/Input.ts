import { Writable } from "stream";

import { Mixer } from "./Mixer";

const CHANNELS = 2,
	BIT_DEPTH = 16,
	SAMPLE_BYTE_LENGTH = 2;

export class Input extends Writable {
	volume = 100;
	buffer = Buffer.alloc(0);

	getMoreData: ((err: Error | null | undefined) => void) | null;

	constructor(readonly mixer: Mixer) {
		super();

		this.getMoreData = null;
	}

	/**
	 * Read in the specified number of samples.
	 * @param samples
	 */
	read(samples: number) {
		let bytes = samples * (BIT_DEPTH / 8) * CHANNELS;
		if (this.buffer.length < bytes) {
			bytes = this.buffer.length;
		}
		let r = this.buffer.slice(0, bytes);
		this.buffer = this.buffer.slice(bytes);

		if (this.buffer.length <= 131072 && this.getMoreData !== null) {
			let getMoreData = this.getMoreData;
			this.getMoreData = null;
			process.nextTick(getMoreData);
		}

		for (let i = 0; i < r.length; i += 2) {
			r.writeInt16LE(Math.round((this.volume * r.readInt16LE(i)) / 100), i);
		}

		return r;
	}

	/**
	 * Read in the specified number of stereo samples.
	 * @param samples
	 */
	readStereo(samples: number) {
		// This function will be overridden by this.read, if input already is stereo.
		const monoBuffer = this.read(samples);
		const stereoBuffer = Buffer.alloc(monoBuffer.length * 2);
		const s = this.availSamples(monoBuffer.length);

		for (let i = 0; i < s; i++) {
			const m = monoBuffer.readInt16LE(i * SAMPLE_BYTE_LENGTH);
			stereoBuffer.writeInt16LE(m, i * SAMPLE_BYTE_LENGTH * 2);
			stereoBuffer.writeInt16LE(
				m,
				i * SAMPLE_BYTE_LENGTH * 2 + SAMPLE_BYTE_LENGTH
			);
		}
		return stereoBuffer;
	}

	/**
	 * Fetch the number of available samples ready to read.
	 * @param length
	 */
	availSamples(length = this.buffer.length) {
		return Math.floor(length / ((BIT_DEPTH / 8) * CHANNELS));
	}

	_write(chunk: any, encoding: BufferEncoding, next: () => void) {
		this.buffer = Buffer.concat([this.buffer, chunk]);
		if (this.buffer.length > 2 ** 17) {
			this.getMoreData = next;
		} else {
			next();
		}
	}

	/**
	 * Set the volume of this stream.
	 * @param volume
	 */
	setVolume(volume: number) {
		this.volume = Math.max(Math.min(volume, 100), 0);
	}
}
