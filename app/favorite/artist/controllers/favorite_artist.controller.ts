import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import FavoriteArtist from '#favorite/artist/models/favorite_artist'
import { ApiResponse } from '#classes/api_response'

@inject()
export default class FavoriteArtistController {
  async toggle({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { artistId } = params

    const favorite = await FavoriteArtist.query()
      .where('user_id', user.id)
      .where('artist_id', artistId)
      .first()

    if (favorite) {
      await favorite.delete()
      return ApiResponse.response({ response }, null, 'Artiste retiré des favoris', 200)
    } else {
      await FavoriteArtist.create({ userId: user.id, artistId })
      return ApiResponse.response({ response }, null, 'Artiste ajouté aux favoris', 201)
    }
  }
}
