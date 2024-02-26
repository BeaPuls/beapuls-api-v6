import { test } from '@japa/runner';
test.group('Auth login', () => {
    test('basic auth register', async ({ client }) => {
        const response = await client.post('/auth/register').json({
            email: 'test@unit.com',
            password: 'testunit123',
            password_confirmation: 'testunit123',
            username: 'Unit',
        });
        console.log(response.status());
        console.log(response.body());
        console.log(response.headers());
    });
    test('basic auth login', async ({ client }) => {
        console.log(client);
        const response = await client.post('/auth/login').json({
            email: 'test@unit.com',
            password: 'testunit123',
        });
        console.log(response.status());
        console.log(response.body());
        console.log(response.headers());
    });
});
//# sourceMappingURL=basic.spec.js.map