import { inject } from '@adonisjs/core'
import Track from '#track/models/track'
import FavoriteTrack from '#favorite/track/models/favorite_track'

@inject()
export class FavoriteTrackService {
  async getUserTrackFavorites(userId: string) {
    return FavoriteTrack.query().where('user_id', userId)
  }

  async getTrackData(trackId: string) {
    return Track.find(trackId)
  }

  async isUserFavorite(trackId: string, userId: string) {
    const favorite = await FavoriteTrack.query()
      .where('track_id', trackId)
      .where('user_id', userId)
      .first()
    if (favorite) {
      return true
    }
    return false
  }
}
