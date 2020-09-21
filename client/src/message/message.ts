import sha1 from 'sha1'
import { logger } from 'src/logger'

const log = logger('messages')

export interface JoinedMessage {
  type: 'JOINED',
  user: string,
  id: string,
  // timestamp: string
}
export function makeJoinedMessage(user: string): JoinedMessage {
  const id = sha1(`${user} joined`)
  return { user, type: 'JOINED', id }
}

export interface LeftMessage {
  type: 'LEFT',
  user: string,
  id: string,
  // timestamp: string
}
export function makeLeftMessage(user: string): LeftMessage {
  const id = sha1(`${user} left`)
  return { user, type: 'LEFT', id }
}

export interface CommMessage {
  type: 'COMM',
  user: string,
  data: CompleteMessage | ProgressMessage | ErroneousMessage,
  // maybe we got a message incorrectly formatted as something other than JSON:
  msgFailedParse?: boolean,
  id: string
}
export function makeCommMessage(user: string, json: string): CommMessage {
  const id = sha1(json)
  let data
  try {
    data = JSON.parse(json)
  } catch (error) {
    log.warn("makeJSONMessage - error parsing message JSON", { error })
    return { user, data: { type: 'ERRONEOUS', text: json }, type: 'COMM', msgFailedParse: true, id }
  }
  return { user, data, type: 'COMM', id }
}

export interface UnknownMessage {
  type: 'UNKNOWN',
  data: string,
  id: string
}
export function makeUnknownMessage(data: string): UnknownMessage {
  const id = sha1(data)
  return { data, type: 'UNKNOWN', id }
}

export type Message = JoinedMessage | LeftMessage | CommMessage | UnknownMessage

// outgoing message types


export interface CompleteMessage {
  type: 'COMPLETE',
  time: number,
  id: string
}

export interface ProgressMessage {
  type: 'PROGRESS',
  text: string,
  time: number,
  id: string
}

export interface ErroneousMessage {
  type: 'ERRONEOUS',
  text: string,
}