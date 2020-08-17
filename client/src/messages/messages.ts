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

export interface JSONMessage {
  type: 'MESSAGE',
  user: string,
  msg: any,
  // maybe we got a message incorrectly formatted as something other than JSON:
  msgFailedParse?: boolean,
}
function makeJSONMessage(user: string, json: string): JSONMessage {
  let msg
  try {
    msg = JSON.parse(json)
  } catch (error) {
    log.warn("makeJSONMessage - error parsing message JSON", { error })
    return { user, msg: json, type: 'MESSAGE', msgFailedParse: true }
  }
  return { user, msg, type: 'MESSAGE' }
}

export interface UnknownMessage {
  type: 'UNKNOWN',
  data: string
}
function makeUnknownMessage(data: string): UnknownMessage {
  return { data, type: 'UNKNOWN' }
}

const joinedFormat = /^(.+) joined (.+)$/
const leftFormat = /^(.+) left the room$/
const messageFormat = /^(.+): (.+)$/

export function parseMessageData(data: string): JoinedMessage | LeftMessage | JSONMessage | UnknownMessage {
  if (joinedFormat.test(data)) {
    const [ user ] = joinedFormat.exec(data)?.slice(1) || []
    return makeJoinedMessage(user)
  }

  if (leftFormat.test(data)) {
    const [ user ] = leftFormat.exec(data)?.slice(1) || []
    return makeLeftMessage(user)
  }

  if (messageFormat.test(data)) {
    const [ user, json ] = messageFormat.exec(data)?.slice(1) || []
    return makeJSONMessage(user, json)
  }

  return makeUnknownMessage(data)
}