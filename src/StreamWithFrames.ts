import { Writable } from 'stream'

const JPG_START = Buffer.from('FFD8FF', 'hex')
const JPG_END = Buffer.from('FFD9', 'hex')

function getEnd(currentBuffer: Buffer, start: number) {
  // const originalEnd = currentBuffer.indexOf(JPG_DELIMITER, start + JPG_DELIMITER.length)
  // if (originalEnd > -1) {
  //   return originalEnd
  // }
  const alternativeEnd = currentBuffer.indexOf(JPG_END, start + JPG_START.length)
  return alternativeEnd > -1
    ? alternativeEnd + JPG_END.length
    // : originalEnd
    : alternativeEnd
}

class StreamWithFrames extends Writable {
  readonly #rate: number
  readonly #buffers: Buffer[] = []
  #currentBuffer = Buffer.alloc(0)
  #counter = 1

  constructor(rate = 1) {
    super({
      // @ts-ignore
      readableObjectMode: true,
    })
    this.#rate = rate
  }

  get buffers() {
    return this.#buffers
  }

  _write(data: Buffer, enc: string, cb: () => void) {
    // Add new data to buffer
    this.#currentBuffer = Buffer.concat([this.#currentBuffer, data])
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const start = this.#currentBuffer.indexOf(JPG_START)
      if (start < 0) {
        // there's no frame data at all
        break
      }
      const end = getEnd(this.#currentBuffer, start)
      if (end < 0) {
        // we haven't got the whole frame yet
        break
      }

      this.pushFrame(start, end)
      this.#currentBuffer = this.#currentBuffer.slice(end) // remove frame data from buffer
      if (start > 0) {
        console.error(`Discarded ${start} bytes of invalid data`)
      }
    }
    cb()
  }

  private pushFrame(start: number, end: number) {
    const chunk = this.#currentBuffer.slice(start, end)
    if (this.#counter >= 1) {
      --this.#counter
      // emit a frame
      this.#buffers.push(chunk)
    }
    this.#counter += this.#rate
  }

  end() {
    super.end()
  }
}

export default StreamWithFrames
