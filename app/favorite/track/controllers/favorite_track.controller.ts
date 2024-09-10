import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import FavoriteTrack from '#favorite/track/models/favorite_track'
import { ApiResponse } from '#classes/api_response'

@inject()
export default class FavoriteTrackController {
  async toggle({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { trackId } = params

    const favorite = await FavoriteTrack.query()
      .where('user_id', user.id)
      .where('track_id', trackId)
      .first()

    if (favorite) {
      await favorite.delete()
      return ApiResponse.response({ response }, null, 'Track removed from favorites', 200)
    } else {
      await FavoriteTrack.create({ userId: user.id, trackId })
      return ApiResponse.response({ response }, null, 'Track added to favorites', 201)
    }
  }
}
