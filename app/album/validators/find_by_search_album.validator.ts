import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const fields = {
  name: 'name',
  artist_name: 'artist_name',
  provider_type_id: 'provider_type_id',
}

vine.messagesProvider = new SimpleMessagesProvider(
  {
    required: 'The {{ field }} field is required',
    string: 'The value of {{ field }} field must be a string',
  },
  fields
)

export const findBySearchAlbumValidator = vine.compile(
  vine.object({
    name: vine.string(),
    artistName: vine.string(),
    providerTypeId: vine.string(),
  })
)
