import { inject } from '@adonisjs/core'
import Artist from '#artist/models/artist'
import FavoriteArtist from '#favorite/artist/models/favorite_artist'

@inject()
export class FavoriteArtistService {
  async getUserArtistFavorites(userId: string) {
    return FavoriteArtist.query().where('user_id', userId)
  }

  async getArtistData(artistId: string) {
    return Artist.find(artistId)
  }

  async isUserFavorite(artistId: string, userId: string) {
    const favorite = await FavoriteArtist.query()
      .where('artist_id', artistId)
      .where('user_id', userId)
      .first()
    if (favorite) {
      return true
    }
    return false
  }
}
