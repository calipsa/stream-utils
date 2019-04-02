import { Stream } from 'stream'
import { promisify } from 'util'
import * as pump from 'pump'

/**
 * Promisifed pump
 */
export default promisify(pump) as (...streams: Stream[]) => Promise<void>
