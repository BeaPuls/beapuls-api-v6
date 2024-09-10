import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fields = {
  name: 'name',
  album_name: 'album_name',
  artist_name: 'artist_name',
  provider_item_uri: 'provider_item_uri',
  provider_item_image: 'provider_item_image',
  provider_item_id: 'provider_item_id',
  provider_type_id: 'provider_type_id',
  up_vote: 'up_vote',
  down_vote: 'down_vote',
}

vine.messagesProvider = new SimpleMessagesProvider(
  {
    required: 'The {{ field }} field is required',
    string: 'The value of {{ field }} field must be a string',
    array: 'The value of {{ field }} field must be an array',
    date: 'The value of {{ field }} field must be a date on format [YYYY-MM-DD]',
  },
  fields
)

export const createOrUpdateTrackValidator = vine.compile(
  vine.object({
    name: vine.string(),
    album_name: vine.string().optional(),
    artist_name: vine.string(),
    provider_item_uri: vine.string(),
    provider_item_image: vine.string().optional(),
    provider_item_id: vine.string(),
    provider_type_id: vine.string().optional(),
    up_vote: vine.number().optional(),
    down_vote: vine.number().optional(),
  })
)
