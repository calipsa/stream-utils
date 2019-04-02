const {
  bufferToStream,
  splitStream,
  streamToBuffer,
} = require('../build')

const ENCODING = 'utf8'
const INPUT_TEXT = 'Random text to be used for the test'
const NUM_SPLIT_STREAMS = 10

const BUFFER = Buffer.from(INPUT_TEXT, ENCODING)

const allItemsAreEqual = (arr) =>
  arr.every(item => item === arr[0])

describe('Conversions', () => {
  beforeEach(() => {
    jest.setTimeout(120000)
  })

  it('Should convert correctly', async () => {
    const stream = bufferToStream(BUFFER)
    const convertedBuffer = await streamToBuffer(stream)
    const outputText = convertedBuffer.toString(ENCODING)
    expect(outputText).toBe(INPUT_TEXT)
  })

  it('Should convert & split correctly', async () => {
    const stream = bufferToStream(BUFFER)
    const streams = splitStream(stream, NUM_SPLIT_STREAMS)
    const promises = streams.map(streamToBuffer)
    const convertedBuffers = await Promise.all(promises)
    const outputTexts = convertedBuffers.map(item => item.toString(ENCODING))
    
    expect(outputTexts.length).toBe(NUM_SPLIT_STREAMS)
    const firstOutputText = outputTexts[0]
    for (let i = 0; i < NUM_SPLIT_STREAMS; ++i) {
      expect(outputTexts[i]).toBe(firstOutputText)
    }
    expect(firstOutputText).toBe(INPUT_TEXT)
  })
})
