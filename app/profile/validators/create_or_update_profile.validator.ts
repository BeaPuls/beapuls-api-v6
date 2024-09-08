import Profile from '#profile/models/profile'
import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'

/**
 * Options accepted by the unique rule
 */
type Options = {
  table: string
  column: string
}

const fields = {
  username: 'username',
  date_of_birth: 'date_of_birth',
  description: 'description',
  gender_id: 'gender_id',
}

/**
 * Implementation
 */
async function unique(value: unknown, options: Options, field: FieldContext) {
  /**
   * We don't want to deal with non-string values.
   * The "string" rule will handle the validation.
   */
  if (typeof value !== 'string') {
    return
  }

  const profile = await Profile.findBy(options.column, value)

  if (profile) {
    field.report('The {{ field }} field is not unique', 'unique', field)
  }
}

const uniqueRule = vine.createRule(unique)

vine.messagesProvider = new SimpleMessagesProvider(
  {
    required: 'The {{ field }} field is required',
    string: 'The value of {{ field }} field must be a string',
    array: 'The value of {{ field }} field must be an array',
    date: 'The value of {{ field }} field must be a date on format [YYYY-MM-DD]',
  },
  fields
)

export const createOrUpdateProfileValidator = vine.compile(
  vine.object({
    // username: vine.string().use(uniqueRule({ table: 'users', column: 'username' })),
    username: vine.string(),
    date_of_birth: vine.date({ formats: ['YYYY-MM-DD'] }),
    description: vine.string().optional(),
    gender_id: vine.string(),
  })
)
