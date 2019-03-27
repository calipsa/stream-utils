import { ReadableStreamBuffer } from 'stream-buffers'

export default (buffer: Buffer) => {
  const stream = new ReadableStreamBuffer()
  stream.put(buffer)
  stream.stop()
  return stream
}
