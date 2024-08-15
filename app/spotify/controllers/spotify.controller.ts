import SpotifyService from '#spotify/services/spotify.service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class SpotifyController {
  constructor(private spotifyService: SpotifyService) {}

  async search({ request, response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    const query = request.input('query')
    let types = request.input('types', []) as ('track' | 'artist' | 'album')[]
    if (typeof types === 'string') {
      types = [types]
    }
    const limit = request.input('limit', 5)

    if (!query) {
      return response.status(400).send({ error: 'Query parameter is required' })
    }

    if (!types || !Array.isArray(types) || types.length === 0) {
      return response
        .status(400)
        .send({ error: 'Types parameter is required and should be a non-empty array' })
    }

    try {
      const results = await this.spotifyService.search(user.id, query, types, limit)
      return response.ok({ results })
    } catch (error) {
      return response.status(error.status || 500).send({ error: error.message })
    }
  }
}
