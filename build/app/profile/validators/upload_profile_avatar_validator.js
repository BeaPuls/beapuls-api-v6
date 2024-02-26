import vine, { SimpleMessagesProvider } from '@vinejs/vine';
const fields = {
    avatar: 'avatar',
};
vine.messagesProvider = new SimpleMessagesProvider({
    required: 'The {{ field }} field is required',
    string: 'The value of {{ field }} field must be a string',
    array: 'The value of {{ field }} field must be an array',
    date: 'The value of {{ field }} field must be a date on format [YYYY-MM-DD]',
}, fields);
export const uploadProfileAvatarValidator = vine.compile(vine.object({
    avatar: vine.file({
        size: '5mb',
        extnames: ['jpg', 'png', 'jpeg'],
    }),
}));
//# sourceMappingURL=upload_profile_avatar_validator.js.map