import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fields = {
  comment: 'comment',
  up_vote: 'up_vote',
  down_vote: 'down_vote',
}

vine.messagesProvider = new SimpleMessagesProvider(
  {
    required: 'The {{ field }} field is required',
    string: 'The value of {{ field }} field must be a string',
    number: 'The value of {{ field }} field must be a number',
  },
  fields
)

export const createOrUpdateTrackCommentValidator = vine.compile(
  vine.object({
    comment: vine.string(),
    up_vote: vine.number().optional(),
    down_vote: vine.number().optional(),
  })
)
