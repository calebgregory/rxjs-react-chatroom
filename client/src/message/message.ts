import { logger } from '../logger'

const log = logger('messages')

export interface JoinedMessage {
  type: 'JOINED',
  user: string,
  // timestamp: string
}
export function makeJoinedMessage(user: string): JoinedMessage {
  return { user, type: 'JOINED' }
}

export interface LeftMessage {
  type: 'LEFT',
  user: string,
  // timestamp: string
}
export function makeLeftMessage(user: string): LeftMessage {
  return { user, type: 'LEFT' }
}

export interface CommMessage {
  type: 'COMM',
  user: string,
  data: any,
  // maybe we got a message incorrectly formatted as something other than JSON:
  msgFailedParse?: boolean,
}
export function makeCommMessage(user: string, json: string): CommMessage {
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
export function makeUnknownMessage(data: string): UnknownMessage {
  return { data, type: 'UNKNOWN' }
}

export type Message = JoinedMessage | LeftMessage | CommMessage | UnknownMessage