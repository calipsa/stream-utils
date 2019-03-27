import { Readable, PassThrough } from 'stream'

export default (readable: Readable) => {
  const s1 = readable.pipe(new PassThrough())
  const s2 = readable.pipe(new PassThrough())
  return [s1, s2]
}
