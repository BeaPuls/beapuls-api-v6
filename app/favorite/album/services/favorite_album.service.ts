import { inject } from '@adonisjs/core'
import Album from '#album/models/album'
import FavoriteAlbum from '#favorite/album/models/favorite_album'

@inject()
export class FavoriteAlbumService {
  async getUserAlbumFavorites(userId: string) {
    return FavoriteAlbum.query().where('user_id', userId)
  }

  async getAlbumData(albumId: string) {
    return Album.find(albumId)
  }

  async isUserFavorite(albumId: string, userId: string) {
    const favorite = await FavoriteAlbum.query()
      .where('album_id', albumId)
      .where('user_id', userId)
      .first()
    if (favorite) {
      return true
    }
    return false
  }
}
