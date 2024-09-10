import { inject } from '@adonisjs/core'
import ProfileAlbum from '#profile/models/profile_album'

@inject()
export class ProfileAlbumService {
  async getProfileAlbums(profileId: string) {
    return ProfileAlbum.query().where('profile_id', profileId)
  }
}
