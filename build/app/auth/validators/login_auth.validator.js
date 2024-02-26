import vine, { SimpleMessagesProvider } from '@vinejs/vine';
const fields = {
    email: 'email',
    password: 'password',
};
vine.messagesProvider = new SimpleMessagesProvider({
    required: 'The {{ field }} field is required',
    string: 'The value of {{ field }} field must be a string',
    email: 'The value is not a valid email address',
}, fields);
export const loginAuthValidator = vine.compile(vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
}));
//# sourceMappingURL=login_auth.validator.js.map