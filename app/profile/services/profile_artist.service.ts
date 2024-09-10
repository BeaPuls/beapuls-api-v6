import { inject } from '@adonisjs/core'
import ProfileArtist from '#profile/models/profile_artist'

@inject()
export class ProfileArtistService {
  async getProfileArtists(profileId: string) {
    return ProfileArtist.query().where('profile_id', profileId)
  }
}
