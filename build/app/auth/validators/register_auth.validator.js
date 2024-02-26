import User from '#auth/models/user';
import vine, { SimpleMessagesProvider } from '@vinejs/vine';
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
const fields = {
    username: 'Username',
    email: 'Email',
    password: 'Password',
};
vine.messagesProvider = new SimpleMessagesProvider({
    required: 'The {{ field }} field is required',
    string: 'The value of {{ field }} field must be a string',
    email: 'The value is not a valid email address',
}, fields);
export const registerAuthValidator = vine.compile(vine.object({
    username: vine.string().use(uniqueRule({ table: 'users', column: 'username' })),
    email: vine
        .string()
        .email()
        .use(uniqueRule({ table: 'users', column: 'email' })),
    password: vine.string().minLength(8).maxLength(32).confirmed(),
}));
//# sourceMappingURL=register_auth.validator.js.map