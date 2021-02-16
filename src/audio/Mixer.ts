import { Readable } from "stream";

import { Input } from "./Input";

// djs specific constants
const CHANNELS = 2,
	SAMPLE_BYTE_LENGTH = 2;

/**
 * Represents a mixer capable of mixing 16-bit LE PCM audio.
 */
export class Mixer extends Readable {
	inputs: Input[] = [];

	constructor() {
		super();
	}

	read() {
		let samples = Number.MAX_VALUE;

		// find the minimum available samples
		for (const input of this.inputs) {
			let as = input.availSamples();

			console.log(as);

			if (as < samples) {
				samples = as;
			}
		}

		if (samples <= 0 || samples == Number.MAX_VALUE) {
			setImmediate(this._read.bind(this));
		}

		const mixedBuffer = Buffer.alloc(samples * SAMPLE_BYTE_LENGTH * CHANNELS);
		mixedBuffer.fill(0);

		// write inputs to buffer
		for (const input of this.inputs) {
			const inputBuffer = input.readStereo(samples);
			for (var i = 0; i < samples * CHANNELS; i++) {
				const sample =
					mixedBuffer.readInt16LE(i * SAMPLE_BYTE_LENGTH) +
					Math.round(
						inputBuffer.readInt16LE(i * SAMPLE_BYTE_LENGTH) / this.inputs.length
					);
				mixedBuffer.writeInt16LE(sample, i * SAMPLE_BYTE_LENGTH);
			}
		}

		this.push(mixedBuffer);
	}

	/**
	 * Create a new audio input.
	 * @param stream
	 */
	createInput() {
		const input = new Input(this);
		this.inputs.push(input);
		return input;
	}
}
