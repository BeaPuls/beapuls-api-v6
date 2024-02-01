import User from '#auth/models/user'
import { createAuthValidator } from '#validators/create_auth_validator'
import { storeAuthValidator } from '#validators/store_auth_validator'
import auth from '@adonisjs/auth/services/main'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async get({ request, response }: HttpContext) {
    const data = request.body()
    const output = await createAuthValidator.validate(data)

    const user = await auth.use('jwt').attempt(output.email, output.password)

    response.status(200).send(user)
  }

  async store({ request, auth, response }: HttpContext) {
    const data = request.body()
    const output = await storeAuthValidator.validate(data)
    const user = await User.create({
      username: output.username,
      email: output.email,
      password: output.password,
    })

    return response.created({
      status: true,
      data: user.toJSON(),
      message: 'User registered successfully !',
    })
  }
}
