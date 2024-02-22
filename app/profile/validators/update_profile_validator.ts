import User from '#auth/models/user'
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
  dateOfBirth: 'date_of_birth',
  description: 'description',
  // preferedGenderId: 'prefered_gender_id',
  genderId: 'gender_id',
}

/**
 * Implementation
 */
async function unique(value: unknown, options: Options, field: FieldContext) {
  /**
   * We do not want to deal with non-string
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return
  }

  const user = await User.findBy(options.column, value)

  if (user) {
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

export const updateProfileValidator = vine.compile(
  vine.object({
    username: vine.string().use(uniqueRule({ table: 'users', column: 'username' })),
    dateOfBirth: vine.date({ formats: ['YYYY-MM-DD'] }),
    description: vine.string(),
    genderId: vine.number(),
    // preferedGenderId: vine.number(),
  })
)
