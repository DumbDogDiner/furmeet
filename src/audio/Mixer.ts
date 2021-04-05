import { Readable } from "stream";

import { Input } from "./Input";

export class Mixer extends Readable {
	public inputs: Input[] = [];

	protected needReadable = true;
	protected timer!: NodeJS.Immediate;

	/**
	 * Gets the max number of samples from all inputs
	 */
	protected getMaxSamples() {
		let samples = 0;
		// iterate over inputs and check their available samples.
		this.inputs.forEach((input) => {
			const available = input.availableSamples();
			if (input.hasData && available > samples) {
				samples = available;
			}
		});
		return samples;
	}

	/**
	 * Called when this stream is read from
	 */
	public _read() {
		// get the maximum number of available samples.
		let samples = this.getMaxSamples();

		if (samples > 0) {
			// samples are 16-bit, so must allocate 2 bytes.
			const outputBuffer = Buffer.alloc(samples * 2);
			outputBuffer.fill(0);
			// iterate over every input and sum its sample buffer to the mixed buffer.
			for (const input of this.inputs) {
				// don't write if the input has no data to read.
				if (!input.hasData) {
					continue;
				}
				// read the target number of samples
				const inputBuffer = input.read(samples);
				for (let i = 0; i < samples; i++) {
					const sample =
						outputBuffer.readInt16LE(i * 2) + inputBuffer.readInt16LE(i * 2);
					outputBuffer.writeInt16LE(
						// clamp the output sample within the 16 bit limit
						Math.max(Math.min(sample, 32767), -32768),
						i * 2
					);
				}
			}
			// output the mixed buffer.
			this.push(outputBuffer);
		} else if (this.needReadable) {
			clearImmediate(this.timer);
			this.timer = setImmediate(this._read.bind(this));
		}
		// clear input buffers ready for next sample.
		this.clearBuffers();
	}

	/**
	 * Close this mixer. It will continue reading until all inputs are silent.
	 */
	public close() {
		this.needReadable = false;
	}

	/**
	 * Clears all of the input's buffers
	 */
	protected clearBuffers() {
		// zero all input buffers
		this.inputs.forEach((input) => input.clear());
	}
	/**
	 * Create a new input from the target readable.
	 * @param stream
	 * @returns A new input.
	 */
	public fromReadable(stream: Readable) {
		// create a new input wrapping the stream
		const input = new Input();
		// pipe the stream into the input
		stream.pipe(input);
		// ad the input to the mixer
		this.inputs.push(input);
		return input;
	}
}
