const fs = require('fs')
const path = require('path')

const { pump } = require('../../dist')

console.log(pump)

async function main() {
  const readStream = fs.createReadStream(path.resolve(`${__dirname}/data/file.txt`))
  const writeStream = fs.createWriteStream(path.resolve(`${__dirname}/out/file.txt`))
  console.log('pumping')
  await pump(readStream, writeStream)
  console.log('done')
}

main()
