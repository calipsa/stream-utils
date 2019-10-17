import { Writable } from 'stream'

const JPG_DELIMITER = Buffer.from('FFD8FF', 'hex')

class StreamWithFrames extends Writable {
  rate: number
  currentBuffer = Buffer.alloc(0)
  buffers: Buffer[] = []
  counter = 1

  constructor(rate = 1) {
    super({
      // @ts-ignore
      readableObjectMode: true,
    })
    this.rate = rate
  }

  _write(data: Buffer, enc: string, cb: () => void) {
    // Add new data to buffer
    this.currentBuffer = Buffer.concat([this.currentBuffer, data])
    while (true) {
      const start = this.currentBuffer.indexOf(JPG_DELIMITER)
      if (start < 0) {
        // there's no frame data at all
        break
      }
      const end = this.currentBuffer.indexOf(JPG_DELIMITER, start + JPG_DELIMITER.length)
      if (end < 0) {
        // we haven't got the whole frame yet
        break
      }

      this.pushFrame(start, end)
      this.currentBuffer = this.currentBuffer.slice(end) // remove frame data from buffer
      if (start > 0) {
        console.error(`Discarded ${start} bytes of invalid data`)
      }
    }
    cb()
  }

  private pushFrame(start: number, end: number) {
    const chunk = this.currentBuffer.slice(start, end)
    if (this.counter >= 1) {
      --this.counter
      // emit a frame
      this.buffers.push(chunk)
    }
    this.counter += this.rate
  }

  end() {
    super.end()
  }
}

export default StreamWithFrames
