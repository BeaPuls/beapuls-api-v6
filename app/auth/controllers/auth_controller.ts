import User from '#auth/models/user'
import { createAuthValidator } from '#validators/create_auth_validator'
import { storeAuthValidator } from '#validators/store_auth_validator'
import { HttpContext } from '@adonisjs/core/http'

import { storeJwt } from '#auth/helpers/helper'

export default class AuthController {
  async create({ request, auth, response }: HttpContext) {
    const data = request.body()
    const output = await createAuthValidator.validate(data)

    const logged = await auth.use('jwt').attempt(output.email, output.password)

    const token = await storeJwt(logged.userId, logged.token)

    if (token) {
      logged.token = token
    }

    response.status(200).send({
      status: true,
      data: {
        ...logged,
      },
      message: 'User registered and logged successfully !',
    })
  }

  async store({ request, auth, response }: HttpContext) {
    const data = request.body()
    const output = await storeAuthValidator.validate(data)
    const user = await User.create({
      username: output.username,
      email: output.email,
      password: output.password,
    })

    const logged = await auth.use('jwt').attempt(output.email, output.password)

    return response.created({
      status: true,
      data: {
        user,
        token: logged.token,
      },
      message: 'User registered and logged successfully !',
    })
  }
}
