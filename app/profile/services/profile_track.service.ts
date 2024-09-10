import { inject } from '@adonisjs/core'
import ProfileTrack from '#profile/models/profile_track'

@inject()
export class ProfileTrackService {
  async getProfileTracks(profileId: string) {
    return ProfileTrack.query().where('profile_id', profileId)
  }
}
