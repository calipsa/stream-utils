const {
  bufferToStream,
  splitStream,
  streamToBuffer,
} = require('../dist')

const ENCODING = 'utf8'
const NUM_SPLIT_STREAMS = 10

const buffers = {
  random: Buffer.from('Random text to be used for the test', ENCODING),
  empty: Buffer.from('', ENCODING),
  unicode: Buffer.from('üñíçöďé ťęxţ', ENCODING),
  long: Buffer.from('abc'.repeat(100000), ENCODING),
}

const allItemsAreEqual = (arr) =>
  arr.every(item => item === arr[0])

describe('Conversions', () => {
  beforeEach(() => {
    jest.setTimeout(120000)
  })

  for (const [name, buffer] of Object.entries(buffers)) {
    console.log('text:', name)

    it(`Should convert correctly (${name})`, async () => {
      const stream = bufferToStream(buffer)
      const convertedBuffer = await streamToBuffer(stream)
      expect(convertedBuffer).toEqual(buffer)
    })
  
    it(`Should convert & split correctly (${name})`, async () => {
      const stream = bufferToStream(buffer)
      const streams = splitStream(stream, NUM_SPLIT_STREAMS)
      const promises = streams.map(streamToBuffer)
      const convertedBuffers = await Promise.all(promises)
      
      expect(convertedBuffers.length).toEqual(NUM_SPLIT_STREAMS)
      const firstConvertedBuffer = convertedBuffers[0]
      for (let i = 0; i < NUM_SPLIT_STREAMS; ++i) {
        expect(convertedBuffers[i]).toEqual(firstConvertedBuffer)
      }
      expect(firstConvertedBuffer).toEqual(buffer)
    })
  }
})
