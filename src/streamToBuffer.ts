import { Readable } from 'stream'

import StreamWithBuffer from './StreamWithBuffer'
import pump from './pump'

export default async (inStream: Readable) => {
  const outStream = new StreamWithBuffer()
  await pump(inStream, outStream)
  return outStream.buffer
}
