import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fields = {
  comment: 'comment',
  up_vote: 'up_vote',
  down_vote: 'down_vote',
}

vine.messagesProvider = new SimpleMessagesProvider(
  {
    required: 'Le champ {{ field }} est requis',
    string: 'La valeur du champ {{ field }} doit être une chaîne de caractères',
    number: 'La valeur du champ {{ field }} doit être un nombre',
  },
  fields
)

export const createOrUpdateAlbumCommentValidator = vine.compile(
  vine.object({
    comment: vine.string(),
    up_vote: vine.number().optional(),
    down_vote: vine.number().optional(),
  })
)
