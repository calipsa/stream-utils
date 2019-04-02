const {
  bufferToStream,
  pump,
  splitStream,
  streamToBuffer,
} = require('../build')

const ENCODING = 'utf8'
const INPUT_TEXT = 'Random text to be used for the test'

const BUFFER = Buffer.from(INPUT_TEXT, ENCODING)

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
    const streams = splitStream(stream)
    const promises = streams.map(streamToBuffer)
    const convertedBuffers = await Promise.all(promises)
    const outputTexts = convertedBuffers.map(item => item.toString(ENCODING))
    expect(outputTexts.length).toBe(2)
    const [text1, text2] = outputTexts
    expect(text1).toBe(text2)
    expect(text1).toBe(INPUT_TEXT)
  })
})
