import { Writable } from 'stream'

class StreamWithBuffer extends Writable {
  chunks: Buffer[] = []
  buf: Buffer

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
    this.buf = Buffer.concat(this.chunks)
    super.end()
  }
}

export default StreamWithBuffer
