import { Writable } from 'stream'

class StreamWithBuffer extends Writable {
  private chunks: Buffer[] = []
  buffer: Buffer

  constructor() {
    super()
    /**
     * @type {Buffer[]}
     */
    this.chunks = []
  }

  _write(chunk, encoding, next) {
    // console.log('chunk')
    this.chunks.push(chunk)
    next()
  }

  end() {
    this.buffer = Buffer.concat(this.chunks)
    super.end()
  }
}

export default StreamWithBuffer
