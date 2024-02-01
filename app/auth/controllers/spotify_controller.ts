import User from '#auth/models/user'
import { type HttpContext } from '@adonisjs/core/http'
import { Secret } from '@poppinss/utils'

export default class SpotifyController {
  create({ ally }: HttpContext) {
    return ally.use('spotify').redirect()
  }

  async store({ ally, response, auth }: HttpContext) {
    const spotify = ally.use('spotify')

    if (spotify.accessDenied()) {
      return 'Access was denied'
    }

    if (spotify.stateMisMatch()) {
      return 'Request expired.try again'
    }

    if (spotify.hasError()) {
      return spotify.getError()
    }

    const spotifyUser = await spotify.user()

    const user = await User.updateOrCreate(
      {
        spotifyId: spotifyUser.id,
      },
      {
        username: spotifyUser.name,
        email: spotifyUser.email,
        accessToken: new Secret(spotifyUser.token.token),
        refreshToken: new Secret(spotifyUser.token.refreshToken),
      }
    )

    await auth.use('api').login(user)

    //TODO
    return response.redirect('/')
  }

  async destroy({ auth, response }: HttpContext): Promise<void> {
    await auth.use('api').logout()

    return response.redirect('/')
  }
}
