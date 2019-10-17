const {
  bufferToStream,
  splitStream,
  streamToBuffer,
} = require('../dist')

const ENCODING = 'utf8'
const NUM_SPLIT_STREAMS = 10

const texts = {
  random: 'Random text to be used for the test',
  empty: '',
  unicode: 'üñíçöďé ťęxţ',
  long: 'abc'.repeat(100000),
}

const allItemsAreEqual = (arr) =>
  arr.every(item => item === arr[0])

describe('Conversions', () => {
  beforeEach(() => {
    jest.setTimeout(120000)
  })

  for (const [type, text] of Object.entries(texts)) {
    console.log('text:', type)

    it(`Should convert correctly (${type})`, async () => {
      const buffer = Buffer.from(text, ENCODING)
      const stream = bufferToStream(buffer)
      const convertedBuffer = await streamToBuffer(stream)
      const outputText = convertedBuffer.toString(ENCODING)
      expect(outputText).toBe(text)
    })
  
    it(`Should convert & split correctly (${type})`, async () => {
      const buffer = Buffer.from(text, ENCODING)
      const stream = bufferToStream(buffer)
      const streams = splitStream(stream, NUM_SPLIT_STREAMS)
      const promises = streams.map(streamToBuffer)
      const convertedBuffers = await Promise.all(promises)
      const outputTexts = convertedBuffers.map(item => item.toString(ENCODING))
      
      expect(outputTexts.length).toBe(NUM_SPLIT_STREAMS)
      const firstOutputText = outputTexts[0]
      for (let i = 0; i < NUM_SPLIT_STREAMS; ++i) {
        expect(outputTexts[i]).toBe(firstOutputText)
      }
      expect(firstOutputText).toBe(text)
    })
  }
})
