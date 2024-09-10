import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import FavoriteAlbum from '#favorite/album/models/favorite_album'
import { ApiResponse } from '#classes/api_response'

@inject()
export default class FavoriteAlbumController {
  async toggle({ auth, params, response }: HttpContext) {
    const user = await auth.getUserOrFail()
    const { albumId } = params
    const favorite = await FavoriteAlbum.query()
      .where('user_id', user.id)
      .where('album_id', albumId)
      .first()

    if (favorite) {
      await favorite.delete()
      return ApiResponse.response({ response }, null, 'Album retiré des favoris', 200)
    } else {
      await FavoriteAlbum.create({ userId: user.id, albumId })
      return ApiResponse.response({ response }, null, 'Album ajouté aux favoris', 201)
    }
  }
}
