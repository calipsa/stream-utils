import {
  Readable,
  PassThrough,
} from 'stream'

/**
 * @param numStreams number of output streams, defaults to 2
 */
export default (readable: Readable, numStreams = 2) => {
  const arr: PassThrough[] = []
  for (let i = 0; i < numStreams; ++i) {
    const newStream = readable.pipe(new PassThrough())
    arr.push(newStream)
  }
  return arr
}
