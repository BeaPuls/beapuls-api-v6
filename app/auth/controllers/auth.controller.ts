import { default as User } from '#user/models/user'
import { loginAuthValidator } from '#auth/validators/login_auth.validator'
import { registerAuthValidator } from '#auth/validators/register_auth.validator'
import { HttpContext } from '@adonisjs/core/http'
import AuthProviders from '#auth/models/auth_providers'

export default class AuthController {
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginAuthValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    response.status(200).send({
      status: true,
      data: {
        token: token,
        user: { ...user.serialize() },
      },
      message: 'User logged successfully !',
    })
  }

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerAuthValidator)

    const user = await User.create(payload)

    return response.created({
      status: true,
      data: {
        ...user.serialize(),
      },
      message: 'User registered successfully !',
    })
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    await AuthProviders.query().where('user_id', user.id).delete()
    return response.created({
      status: true,
      message: 'User successfully logout!',
    })
  }

  async success({ response }: HttpContext) {
    return response.status(200).send({
      status: true,
      message: "You're are now logged",
    })
  }
}
