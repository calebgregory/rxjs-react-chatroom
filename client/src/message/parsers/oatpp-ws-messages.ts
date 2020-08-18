import { Message, makeJoinedMessage, makeLeftMessage, makeCommMessage, makeUnknownMessage } from '../message'

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