import { logger } from '../logger'

const log = logger('messages')

export interface JoinedMessage {
  type: 'JOINED',
  user: string,
  // timestamp: string
}
function makeJoinedMessage(user: string): JoinedMessage {
  return { user, type: 'JOINED' }
}

export interface LeftMessage {
  type: 'LEFT',
  user: string,
  // timestamp: string
}
function makeLeftMessage(user: string): LeftMessage {
  return { user, type: 'LEFT' }
}

export interface CommMessage {
  type: 'COMM',
  user: string,
  data: any,
  // maybe we got a message incorrectly formatted as something other than JSON:
  msgFailedParse?: boolean,
}
function makeCommMessage(user: string, json: string): CommMessage {
  let data
  try {
    data = JSON.parse(json)
  } catch (error) {
    log.warn("makeJSONMessage - error parsing message JSON", { error })
    return { user, data: json, type: 'COMM', msgFailedParse: true }
  }
  return { user, data, type: 'COMM' }
}

export interface UnknownMessage {
  type: 'UNKNOWN',
  data: string
}
function makeUnknownMessage(data: string): UnknownMessage {
  return { data, type: 'UNKNOWN' }
}

export type Message = JoinedMessage | LeftMessage | CommMessage | UnknownMessage

const joinedFormat = /^(.+) joined (.+)$/
const leftFormat = /^(.+) left the room$/
const commFormat = /^(.+): (.+)$/

export function parseMessageData(data: string): Message {
  if (joinedFormat.test(data)) {
    const [ user ] = joinedFormat.exec(data)?.slice(1) || []
    return makeJoinedMessage(user)
  }

  if (leftFormat.test(data)) {
    const [ user ] = leftFormat.exec(data)?.slice(1) || []
    return makeLeftMessage(user)
  }

  if (commFormat.test(data)) {
    const [ user, json ] = commFormat.exec(data)?.slice(1) || []
    return makeCommMessage(user, json)
  }

  return makeUnknownMessage(data)
}