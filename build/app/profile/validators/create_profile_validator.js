import User from '#auth/models/user';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
const fields = {
    username: 'username',
    dateOfBirth: 'date_of_birth',
    description: 'description',
    genderId: 'gender_id',
};
async function unique(value, options, field) {
    if (typeof value !== 'string') {
        return;
    }
    const user = await User.findBy(options.column, value);
    if (user) {
        field.report('The {{ field }} field is not unique', 'unique', field);
    }
}
const uniqueRule = vine.createRule(unique);
vine.messagesProvider = new SimpleMessagesProvider({
    required: 'The {{ field }} field is required',
    string: 'The value of {{ field }} field must be a string',
    array: 'The value of {{ field }} field must be an array',
    date: 'The value of {{ field }} field must be a date on format [YYYY-MM-DD]',
}, fields);
export const createProfileValidator = vine.compile(vine.object({
    username: vine.string().use(uniqueRule({ table: 'users', column: 'username' })),
    dateOfBirth: vine.date({ formats: ['YYYY-MM-DD'] }),
    description: vine.string(),
    genderId: vine.number(),
}));
//# sourceMappingURL=create_profile_validator.js.map